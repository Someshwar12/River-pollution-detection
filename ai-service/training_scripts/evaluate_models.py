# ============================================================
# 🧠 evaluate_models.py — Unified evaluation for U-Net & LSTM
# ============================================================

import os
import numpy as np
import tensorflow as tf
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, jaccard_score
import matplotlib.pyplot as plt

# Add parent directory to path (to import from models/)
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Local imports
from models.unet_model import UNetModel
from models.lstm_model import LSTMModel
from training_scripts.data_loader_unet import load_unet_dataset
from training_scripts.data_loader_lstm import load_lstm_dataset

# ------------------ U-NET EVALUATION ------------------
def evaluate_unet():
    print("\n🧩 Evaluating U-Net Model...")

    # Load dataset
    X_train, X_val, Y_train, Y_val = load_unet_dataset()

    # Path to trained model
    unet_model_path = os.path.join('saved_models', 'unet', 'unet_best.h5')
    if not os.path.exists(unet_model_path):
        print("⚠️ U-Net model not found, skipping...")
        return None

    # Load model
    model = tf.keras.models.load_model(unet_model_path)
    print(f"✅ Loaded pre-trained U-Net model from {unet_model_path}")

    # Evaluate
    loss, acc, iou = model.evaluate(X_val, Y_val, verbose=1)
    print(f"📊 U-Net Evaluation — Loss: {loss:.4f} | Accuracy: {acc:.4f} | IoU: {iou:.4f}")

    # Predict few samples for visualization
    preds = model.predict(X_val[:3])
    for i in range(3):
        fig, axs = plt.subplots(1, 3, figsize=(10, 4))
        axs[0].imshow(X_val[i])
        axs[0].set_title("Input Image")
        axs[1].imshow(Y_val[i].squeeze(), cmap='gray')
        axs[1].set_title("Ground Truth")
        axs[2].imshow(preds[i].squeeze(), cmap='gray')
        axs[2].set_title("Predicted Mask")
        plt.tight_layout()
        plt.show()

    return {"loss": loss, "accuracy": acc, "iou": iou}

# ------------------ LSTM EVALUATION ------------------
def evaluate_lstm():
    print("\n📈 Evaluating LSTM Model...")

    # Set default dataset path
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'data_lstm')

    # Load dataset (ensure your loader supports default path fallback)
    try:
        X, y = load_lstm_dataset(data_dir)

    except TypeError:
        # For backward compatibility if no param is defined
        X, y = load_lstm_dataset()

    # Path to trained model
    lstm_model_path = os.path.join('saved_models', 'lstm', 'lstm_final_model.h5')
    if not os.path.exists(lstm_model_path):
        print("⚠️ LSTM model not found, skipping...")
        return None

    # Load model
    model = tf.keras.models.load_model(lstm_model_path)
    print(f"✅ Loaded pre-trained LSTM model from {lstm_model_path}")

    # Evaluate predictions
    y_pred = model.predict(X)

    mse = mean_squared_error(y, y_pred)
    r2 = r2_score(y, y_pred)

    print(f"📉 LSTM Evaluation — MSE: {mse:.4f} | R²: {r2:.4f}")

    # Visualize predictions vs actual
    plt.figure(figsize=(8, 4))
    plt.plot(y[:100], label="Actual", color='blue')
    plt.plot(y_pred[:100], label="Predicted", color='orange')
    plt.legend()
    plt.title("LSTM Prediction vs Actual")
    plt.show()

    return {"mse": mse, "r2": r2}

# ------------------ MAIN DRIVER ------------------
if __name__ == "__main__":
    print("🚀 Starting Model Evaluations...")

    unet_results = evaluate_unet()
    lstm_results = evaluate_lstm()

    print("\n=================== FINAL REPORT ===================")
    if unet_results:
        print(f"🧠 U-Net  => Accuracy: {unet_results['accuracy']:.4f} | IoU: {unet_results['iou']:.4f}")
    else:
        print("⚠️ U-Net evaluation skipped (no model or data).")

    if lstm_results:
        print(f"📈 LSTM  => MSE: {lstm_results['mse']:.4f} | R²: {lstm_results['r2']:.4f}")
    else:
        print("⚠️ LSTM evaluation skipped (no model or data).")

    print("====================================================\n")
