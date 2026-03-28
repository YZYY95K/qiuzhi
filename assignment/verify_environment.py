#!/usr/bin/env python3
"""
Environment Verification Script
Week 1 Assignment - ML Course
"""

import sys

def check_pytorch():
    print("=" * 50)
    print("PyTorch Environment Verification")
    print("=" * 50)

    try:
        import torch
        print(f"✓ PyTorch Version: {torch.__version__}")
        print(f"✓ CUDA Available: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"✓ CUDA Version: {torch.version.cuda}")
            print(f"✓ CUDA Device Count: {torch.cuda.device_count()}")
            print(f"✓ Current CUDA Device: {torch.cuda.get_device_name(0)}")
        else:
            print("⚠ CUDA is not available. PyTorch is running on CPU.")
        return True
    except ImportError:
        print("✗ PyTorch is not installed")
        return False

def check_transformers():
    print("\n" + "=" * 50)
    print("Checking Hugging Face Libraries")
    print("=" * 50)

    libraries = {
        "transformers": "4.x",
        "datasets": "2.x",
        "diffusers": "0.x",
        "accelerate": "0.x",
        "torchvision": "0.x"
    }

    all_ok = True
    for lib, expected_ver in libraries.items():
        try:
            module = __import__(lib)
            version = getattr(module, '__version__', 'unknown')
            print(f"✓ {lib}: {version}")
        except ImportError:
            print(f"✗ {lib}: NOT INSTALLED")
            all_ok = False

    return all_ok

def check_gpu():
    print("\n" + "=" * 50)
    print("GPU Information")
    print("=" * 50)

    try:
        import torch
        if torch.cuda.is_available():
            for i in range(torch.cuda.device_count()):
                print(f"\nGPU {i}:")
                print(f"  Name: {torch.cuda.get_device_name(i)}")
                props = torch.cuda.get_device_properties(i)
                print(f"  Total Memory: {props.total_memory / 1024**3:.2f} GB")
                print(f"  Compute Capability: {props.major}.{props.minor}")
        else:
            print("No GPU detected or CUDA not available")
    except Exception as e:
        print(f"Error checking GPU: {e}")

def main():
    print("\n" + "=" * 50)
    print("Week 1 Assignment - Environment Verification")
    print("=" * 50 + "\n")

    pytorch_ok = check_pytorch()
    transformers_ok = check_transformers()
    check_gpu()

    print("\n" + "=" * 50)
    print("Verification Summary")
    print("=" * 50)

    if pytorch_ok and transformers_ok:
        print("✓ All required libraries are installed correctly!")
        print("\nNext steps:")
        print("1. Run: python clip_zero_shot_classification.py")
        print("2. Try CLIP zero-shot classification with your images")
        return 0
    else:
        print("⚠ Some libraries are missing. Please install them first.")
        print("\nRun the following commands to install missing libraries:")
        print("pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118")
        print("pip install transformers datasets diffusers accelerate")
        return 1

if __name__ == "__main__":
    sys.exit(main())
