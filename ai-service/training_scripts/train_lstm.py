# ai-service/training_scripts/train_lstm.py (Corrected and Final Content)
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.model_selection import train_test_split
import joblib 
import os

# --- Configuration ---
SEQUENCE_LENGTH = 14
NUM_FEATURES = 5    
FEATURE_COLUMNS = ['Pollution_Index', 'River_Flow', 'Rainfall', 'Temperature', 'DO'] 

# --- Helper Functions (as defined previously) ---
def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=input_shape), 
        Dropout(0.2), 
        LSTM(50),
        Dropout(0.2),
        Dense(1) 
    ])
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:(i + seq_length), :])
        y.append(data[i + seq_length, 0])
    return np.array(X), np.array(y).reshape(-1, 1)

# --- Executable Training Block ---
if __name__ == '__main__':
    print("Starting LSTM Training...")

    # --- PHASE 1: Data Loading (Corrected Load Path) ---
    FILE_PATH = './data/data_lstm/pollution_data.csv'

    # CRITICAL: Use index_col=0 to load the Date column correctly
    df = pd.read_csv(FILE_PATH, index_col=0, parse_dates=True) 

    data = df[FEATURE_COLUMNS].values

    # 1. Scale Data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # 2. Create Sequences
    X_full, Y_full = create_sequences(scaled_data, SEQUENCE_LENGTH)

    print(f"REAL DATA LOADED: {len(df)} days total. Training samples: {X_full.shape[0]}")

    # 3. Split data
    X_train, X_val, Y_train, Y_val = train_test_split(
        X_full, Y_full, test_size=0.2, shuffle=False
    )

    # --- PHASE 2: Model Setup & Training ---
    model = build_lstm_model(input_shape=(SEQUENCE_LENGTH, NUM_FEATURES))

    print("Starting training with REAL time-series data (5 epochs)...")
    model.fit(
        X_train, Y_train,
        validation_data=(X_val, Y_val),
        epochs=5, 
        batch_size=4 
    )

    # --- PHASE 3: Saving ---
    save_path = '../saved_models/lstm/'
    os.makedirs(save_path, exist_ok=True)
    model.save('../saved_models/lstm/lstm_final_model.h5')
    joblib.dump(scaler, '../saved_models/lstm/lstm_scaler.pkl') 
    print("LSTM model training complete and saved to disk.")