# ai-service/training_scripts/data_loader_lstm.py
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# Define the sequence length for time-series prediction
SEQUENCE_LENGTH = 14 # 14 days of historical data
N_FEATURES = 5       # Features: pH, DO, Turbidity, Temp, Conductivity

def load_lstm_dataset(data_dir):
    """
    Mocks loading time-series data and creating sequences.
    This function creates synthetic data that mimics a water quality dataset.
    """
    print("MOCK: Data loading executed, returning synthetic sequences for LSTM training...")

    # 1. Create Synthetic Time Series Data (e.g., 365 days of data)
    # We will use 5 mock features (N_FEATURES)
    N_DAYS = 180 

    # Create a simple trend for one feature (e.g., pollution increasing)
    base_trend = np.linspace(0.1, 0.9, N_DAYS)
    noise = np.random.normal(0, 0.05, N_DAYS)

    # Create 5 time series features
    feature_data = np.zeros((N_DAYS, N_FEATURES))
    feature_data[:, 0] = base_trend + noise # Feature 1 (e.g. pH)
    feature_data[:, 1] = 1.0 - base_trend * 0.5 + noise # Feature 2 (e.g. DO, inverse trend)
    feature_data[:, 2:] = np.random.rand(N_DAYS, N_FEATURES - 2) * 0.8 # Other random features

    # Ensure values are within a sensible range (0 to 1)
    feature_data = np.clip(feature_data, 0.01, 0.99)

    # 2. Sequence Creation (Look-back window)
    X_sequences = []
    Y_targets = []

    for i in range(N_DAYS - SEQUENCE_LENGTH):
        # X is the last SEQUENCE_LENGTH days (14 days)
        X_sequences.append(feature_data[i:i + SEQUENCE_LENGTH, :])
        # Y is the value of the next day (Day 15 prediction for Feature 1)
        Y_targets.append(feature_data[i + SEQUENCE_LENGTH, 0]) 

    X_data = np.array(X_sequences)
    # Reshape Y_data to be a column vector
    Y_data = np.array(Y_targets).reshape(-1, 1) 

    return X_data, Y_data

# NOTE: The pandas/MinMaxScaler imports are placeholders for future real-data logic.