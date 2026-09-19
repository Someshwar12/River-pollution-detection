# ai-service/training_scripts/train_unet.py
# ✅ FINAL EXECUTABLE VERSION (FULLY FIXED)

import sys
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# --- Ensure correct path imports ---
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- Import model and data loader ---
from models.unet_model import UNetModel
from training_scripts.data_loader_unet import load_unet_dataset

# ========================== CONFIG ==========================
IMG_SIZE = 256
N_BANDS = 3
SAVE_DIR = os.path.join('..', 'saved_models', 'unet')
EPOCHS = 5
BATCH_SIZE = 4
# =============================================================

if __name__ == '__main__':
    print("🚀 Starting U-Net Training with REAL DATA PROTOCOL...")

    # --- Phase 1: Load dataset ---
    X_train, X_val, Y_train, Y_val = load_unet_dataset()

    if X_train.size == 0 or Y_train.size == 0:
        print("❌ CRITICAL: Dataset is empty — check your data_loader_unet or data folders.")
        sys.exit(1)

    print(f"✅ Data Loaded Successfully:\n"
          f" - Training samples: {X_train.shape[0]}\n"
          f" - Validation samples: {X_val.shape[0]}\n"
          f" - Image shape: {X_train.shape[1:]}")

    # --- Phase 2: Initialize Model ---
    unet_instance = UNetModel(model_path=SAVE_DIR)
    model = unet_instance.build_unet()

    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.MeanIoU(num_classes=2)]
    )

    # --- Phase 3: Train Model ---
    os.makedirs(SAVE_DIR, exist_ok=True)
    callbacks = [
        EarlyStopping(patience=5, monitor='val_loss', verbose=1),
        ModelCheckpoint(
            os.path.join(SAVE_DIR, 'unet_best.h5'),
            save_best_only=True,
            monitor='val_loss',
            verbose=1
        )
    ]

    print("🧠 Training U-Net on real data (or mock fallback if no data found)...")

    model.fit(
        X_train, Y_train,
        validation_data=(X_val, Y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        callbacks=callbacks,
        verbose=1
    )

    # --- Phase 4: Save Model ---
    model.save(os.path.join(SAVE_DIR, 'unet_final_model.h5'))
    print(f"\n✅ U-Net model training complete and saved at: {SAVE_DIR}/unet_final_model.h5")
