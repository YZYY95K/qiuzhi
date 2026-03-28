#!/usr/bin/env python3
"""
CLIP Zero-Shot Image Classification
Week 1 Assignment - ML Course

This script demonstrates CLIP's zero-shot classification capability
by classifying images into user-defined text categories.
"""

import argparse
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import numpy as np
from typing import List, Tuple
import urllib.request
import os

def download_sample_images():
    """Download sample images for classification"""
    images_dir = "sample_images"
    os.makedirs(images_dir, exist_ok=True)

    image_urls = {
        "cat.jpg": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
        "dog.jpg": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
        "car.jpg": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400"
    }

    downloaded = []
    for filename, url in image_urls.items():
        filepath = os.path.join(images_dir, filename)
        if not os.path.exists(filepath):
            try:
                urllib.request.urlretrieve(url, filepath)
                print(f"Downloaded: {filename}")
            except Exception as e:
                print(f"Failed to download {filename}: {e}")
        downloaded.append(filepath)

    return downloaded

class CLIPClassifier:
    """CLIP Zero-Shot Classifier"""

    def __init__(self, model_name: str = "openai/clip-vit-base-patch32"):
        print(f"Loading CLIP model: {model_name}")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {self.device}")

        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)
        print("Model loaded successfully!")

    def classify(
        self,
        image: Image.Image,
        candidate_labels: List[str],
        return_probs: bool = True
    ) -> Tuple[List[str], List[float]]:
        """
        Perform zero-shot classification on an image.

        Args:
            image: PIL Image
            candidate_labels: List of text labels to classify into
            return_probs: Whether to return probabilities

        Returns:
            Tuple of (sorted_labels, scores)
        """
        inputs = self.processor(
            text=candidate_labels,
            images=image,
            return_tensors="pt",
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)

        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)[0].cpu().numpy()

        sorted_indices = np.argsort(probs)[::-1]
        sorted_labels = [candidate_labels[i] for i in sorted_indices]
        sorted_probs = [float(probs[i]) for i in sorted_indices]

        return sorted_labels, sorted_probs

    def classify_batch(
        self,
        images: List[Image.Image],
        candidate_labels: List[str]
    ) -> List[Tuple[List[str], List[float]]]:
        """Classify multiple images"""
        results = []
        inputs = self.processor(
            text=candidate_labels,
            images=images,
            return_tensors="pt",
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)

        logits_per_image = outputs.logits_per_image
        probs_list = logits_per_image.softmax(dim=1).cpu().numpy()

        for probs in probs_list:
            sorted_indices = np.argsort(probs)[::-1]
            sorted_labels = [candidate_labels[i] for i in sorted_indices]
            sorted_probs = [float(probs[i]) for i in sorted_indices]
            results.append((sorted_labels, sorted_probs))

        return results


def print_results(image_name: str, true_label: str, labels: List[str], probs: List[float]):
    """Print classification results in a formatted way"""
    print("\n" + "=" * 60)
    print(f"Image: {image_name}")
    print(f"True Label: {true_label}")
    print("=" * 60)
    print(f"{'Rank':<6} {'Label':<20} {'Probability':<15} {'Status'}")
    print("-" * 60)

    for i, (label, prob) in enumerate(zip(labels, probs)):
        status = "✓ (Correct)" if i == 0 and label.lower() == true_label.lower() else ""
        if i == 0:
            status = f"✓ Predicted: {label}"
        print(f"{i+1:<6} {label:<20} {prob:.4f} ({prob*100:.2f}%) {status}")

    is_correct = labels[0].lower() == true_label.lower()
    print("-" * 60)
    print(f"Result: {'✓ CORRECT' if is_correct else '✗ INCORRECT'}")
    print(f"Confidence: {probs[0]*100:.2f}%")


def main():
    parser = argparse.ArgumentParser(
        description="CLIP Zero-Shot Image Classification"
    )
    parser.add_argument(
        "--image",
        type=str,
        default=None,
        help="Path to a single image file"
    )
    parser.add_argument(
        "--labels",
        type=str,
        nargs="+",
        default=None,
        help="Custom candidate labels"
    )
    args = parser.parse_args()

    classifier = CLIPClassifier()

    if args.image:
        image = Image.open(args.image).convert("RGB")
        true_label = input("Enter the true label for this image: ")

        if args.labels:
            candidate_labels = args.labels
        else:
            print("\nEnter candidate labels (one per line, empty line to finish):")
            candidate_labels = []
            while True:
                label = input().strip()
                if not label:
                    break
                candidate_labels.append(label)

        labels, probs = classifier.classify(image, candidate_labels)
        print_results(args.image, true_label, labels, probs)

    else:
        print("\n" + "=" * 60)
        print("CLIP Zero-Shot Classification Demo")
        print("Using sample images from the internet")
        print("=" * 60)

        sample_images = download_sample_images()

        test_cases = [
            {
                "image": "sample_images/cat.jpg",
                "true_label": "cat",
                "labels": ["a photo of a cat", "a photo of a dog", "a photo of a car", "a photo of a bird"]
            },
            {
                "image": "sample_images/dog.jpg",
                "true_label": "dog",
                "labels": ["a photo of a dog", "a photo of a cat", "a photo of a person", "a photo of a bird"]
            },
            {
                "image": "sample_images/car.jpg",
                "true_label": "car",
                "labels": ["a photo of a car", "a photo of a motorcycle", "a photo of a bicycle", "a photo of a person"]
            }
        ]

        for i, test_case in enumerate(test_cases):
            if os.path.exists(test_case["image"]):
                image = Image.open(test_case["image"]).convert("RGB")
                labels, probs = classifier.classify(
                    image,
                    test_case["labels"]
                )
                print_results(
                    test_case["image"],
                    test_case["true_label"],
                    labels,
                    probs
                )
            else:
                print(f"\nImage not found: {test_case['image']}")
                print("Please download sample images or provide your own images.")

    print("\n" + "=" * 60)
    print("Analysis & Discussion")
    print("=" * 60)
    print("""
    CLIP Strengths:
    - Strong zero-shot transfer capabilities
    - Understands semantic relationships between images and text
    - Can classify into arbitrary categories without fine-tuning

    CLIP Limitations & Potential Biases:
    1. Performance on Out-of-Distribution Data:
       - May struggle with images significantly different from training data
       - Rare or unusual objects/scenes may be misclassified

    2. Geographic and Cultural Bias:
       - Training data may be skewed toward Western contexts
       - Objects may be misclassified based on regional variations

    3. Fine-Grained Classification:
       - May struggle to distinguish similar categories
       - Example: Different dog breeds or car models

    4. Image Quality Sensitivity:
       - Performance degrades with poor quality, blurry, or occluded images

    5. Text Label Sensitivity:
       - Phrasing matters significantly ("a photo of a cat" vs "cat")
       - Ambiguous labels can lead to unexpected results

    Recommendations for Improvement:
    - Use descriptive, specific text labels
    - Consider multiple phrasings for the same concept
    - Be cautious when deploying in high-stakes applications
    - Test thoroughly across diverse demographic groups
    """)


if __name__ == "__main__":
    main()
