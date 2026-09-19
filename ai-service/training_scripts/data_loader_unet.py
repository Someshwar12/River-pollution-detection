# ai-service/training_scripts/data_loader_unet.py (FINAL EXECUTABLE VERSION)

import numpy as np
import os
import glob
from tensorflow.keras.utils import load_img, img_to_array 
from sklearn.model_selection import train_test_split

IMG_SIZE = 256 
N_BANDS = 3 

def load_unet_dataset():
    """Loads REAL image and mask data from local raw folders, splitting into train/val sets."""
    
    BASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
    IMAGE_DIR = os.path.join(BASE_PATH, 'images_unet', 'raw')
    MASK_DIR = os.path.join(BASE_PATH, 'masks_unet', 'raw')
    
    # We look for all image files (handles both JPG and PNG)
    image_files = sorted(glob.glob(os.path.join(IMAGE_DIR, '*.jpg')) + glob.glob(os.path.join(IMAGE_DIR, '*.png')))
    
    X_data, Y_data = [], []
    
    if not image_files:
        print("\n❌ CRITICAL: No images found. Cannot proceed with real training.")
        # Fallback to mock data to prevent system crash
        return generate_mock_data(N_SAMPLES=10) 

    # Process files based on their names
    for img_path in image_files:
        # Construct the expected mask filename
        base_name = os.path.splitext(os.path.basename(img_path))[0]
        # We assume the mask is named 'basename.png' (standard CVAT/PASCAL format)
        mask_path = os.path.join(MASK_DIR, base_name + '.png') 
        
        # Check if mask exists (CRITICAL for pairing)
        if not os.path.exists(mask_path):
            continue 
            
        # 1. Load Image (X) - RGB
        img = load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
        X = img_to_array(img) / 255.0 
        X_data.append(X)

        # 2. Load Mask (Y) - Grayscale
        mask = load_img(mask_path, target_size=(IMG_SIZE, IMG_SIZE), color_mode='grayscale')
        Y = img_to_array(mask) / 255.0 
        Y[Y > 0.5] = 1.0 # Ensure binary (1 for pollution)
        Y[Y <= 0.5] = 0.0 # (0 for clean)
        Y_data.append(Y)
        
    if not X_data:
        print("❌ CRITICAL: Found images, but zero corresponding masks. Falling back to Mock.")
        return generate_mock_data(N_SAMPLES=10)

    print(f"✅ REAL DATA FOUND: Loaded {len(X_data)} image-mask pairs from disk.")
    
    # Split data for training
    X_full = np.array(X_data)
    Y_full = np.array(Y_data)
    X_train, X_val, Y_train, Y_val = train_test_split(X_full, Y_full, test_size=0.2, random_state=42)

    return X_train, X_val, Y_train, Y_val

def generate_mock_data(N_SAMPLES):
    """Generates synthetic data when real files are not found (Fallback)."""
    IMG_SIZE = 256 
    N_BANDS = 3  
    X_data = np.random.rand(N_SAMPLES, IMG_SIZE, IMG_SIZE, N_BANDS).astype(np.float32)
    Y_data = np.random.randint(0, 2, size=(N_SAMPLES, IMG_SIZE, IMG_SIZE, 1)).astype(np.float32)
    return X_data, Y_data