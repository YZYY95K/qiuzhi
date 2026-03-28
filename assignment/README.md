# Week 1 Assignment: Environment Setup, CLIP Zero-Shot Classification and Ethics Reading

## 📌 Assignment Objectives

1. Complete course development environment setup, master basic usage of PyTorch 2.x + CUDA and Hugging Face ecosystem
2. Use CLIP model for zero-shot image classification, initially experience multimodal large model capabilities
3. Understand course ethics guidelines, establish basic awareness of data bias, deepfakes, privacy protection and other issues

---

## 📁 Assignment Contents

### 1. Environment Setup and Verification (30%)

#### Task Description
Configure Python virtual environment, install specified versions of PyTorch, CUDA toolkit and Hugging Face related libraries (transformers, datasets, diffusers, accelerate, etc.)

#### Specific Requirements
- Use conda or venv to create independent environment, Python version ≥ 3.10
- Select appropriate PyTorch 2.x installation command based on local CUDA version
- After installation, run verification script to output PyTorch version and CUDA availability status

#### Setup Commands

```bash
# Create conda environment (recommended)
conda create -n ml_course python=3.10
conda activate ml_course

# Install PyTorch with CUDA support (adjust according to your CUDA version)
# For CUDA 11.8
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# For CUDA 12.1
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install Hugging Face libraries
pip install transformers datasets diffusers accelerate

# Verify installation
python verify_environment.py
```

#### Submission
- Environment installation command record
- Verification script run screenshot (including output information)

---

### 2. CLIP Zero-Shot Image Classification Practice (40%)

#### Task Description
Use Hugging Face transformers library to load CLIP model, perform zero-shot classification on at least 3 different images, and compare with real labels for analysis.

#### Specific Requirements
- Select at least 3 images (from network or local), define at least 3 candidate text labels for each image (at least 1 correct category, the rest are incorrect or unrelated categories)
- Use CLIP to compute similarity scores between images and text labels, output probability distribution
- Analyze model performance on different images: Is it correctly identified? Which incorrect categories have higher scores? Why?

#### Submission
- Complete runnable Jupyter Notebook or Python script
- Input display, candidate labels, output probability and brief analysis for each image
- Discussion: In what cases is CLIP prone to errors? Are there potential biases or limitations?

---

### 3. Ethics Reading and Reflection Report (30%)

#### Task Description
Read course ethics guidelines and related materials, write a reflection report.

#### Required Reading Materials
- Course ethics guidelines and academic integrity standards
- Gender Shades project website: http://gendershades.org/
- Review article: "Unmasking digital deceptions: An integrative review of deepfake detection"

#### Submission
- Written reflection report (1500-2000 words)

---

## 🚀 Quick Start

```bash
# Run environment verification
python verify_environment.py

# Run CLIP classification demo
python clip_zero_shot_classification.py

# Run with custom images
python clip_zero_shot_classification.py --image path/to/your/image.jpg
```

---

## 📊 Expected Output

### Environment Verification
```
PyTorch Version: 2.x.x
CUDA Available: True
CUDA Version: xx.x
 transformers Version: x.x.x
```

### CLIP Classification
```
Image: example.jpg
Probabilities:
  - cat: 0.95
  - dog: 0.03
  - car: 0.02
Prediction: cat ✓
```
