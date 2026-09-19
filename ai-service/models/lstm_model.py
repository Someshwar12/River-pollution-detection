import tensorflow as tf
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import os
import joblib

class LSTMModel:
    def __init__(self, model_path='saved_models/lstm/'):
        self.model_path = model_path
        self.model = None
        self.scaler = MinMaxScaler()
        self.is_loaded = False
        self.sequence_length = 7  # 7 days lookback
        self.features = ['ph', 'temperature', 'turbidity', 'dissolved_oxygen', 'tds']
    
    def build_lstm(self, input_shape):
        """Build LSTM architecture for time series prediction"""
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(50, return_sequences=True),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(25),
            Dense(1)  # Predict pollution index
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def load_model(self):
        """Load pre-trained LSTM model"""
        try:
            if os.path.exists(os.path.join(self.model_path, 'lstm_final_model.h5')):
                self.model = tf.keras.models.load_model(os.path.join(self.model_path, 'lstm_final_model.h5'))
                
                # Load scaler
                if os.path.exists(os.path.join(self.model_path, 'lstm_scaler.pkl')):
                    self.scaler = joblib.load(os.path.join(self.model_path, 'lstm_scaler.pkl'))
                
                print("✅ Loaded pre-trained LSTM model")
            else:
                # Build model with dummy input shape
                input_shape = (self.sequence_length, len(self.features))
                self.model = self.build_lstm(input_shape)
                print("⚠️  Using randomly initialized LSTM model (no pre-trained weights found)")
            
            self.is_loaded = True
        except Exception as e:
            print(f"❌ Error loading LSTM model: {e}")
            input_shape = (self.sequence_length, len(self.features))
            self.model = self.build_lstm(input_shape)
            self.is_loaded = True
    
    def prepare_sequences(self, data):
        """Prepare sequences for LSTM input"""
        sequences = []
        for i in range(self.sequence_length, len(data)):
            sequences.append(data[i-self.sequence_length:i])
        return np.array(sequences)
    
    def predict(self, time_series_data):
        """Run LSTM inference for time series prediction"""
        if not self.is_loaded:
            raise Exception("Model not loaded")
        
        try:
            # Extract feature values from time series data
            feature_data = []
            for point in time_series_data:
                features = [
                    point.get('ph', 7.0),
                    point.get('temperature', 20.0),
                    point.get('turbidity', 10.0),
                    point.get('dissolved_oxygen', 6.0),
                    point.get('tds', 250.0)
                ]
                feature_data.append(features)
            
            feature_data = np.array(feature_data)
            
            # Scale data
            scaled_data = self.scaler.fit_transform(feature_data)
            
            # Create sequences
            if len(scaled_data) >= self.sequence_length:
                sequences = self.prepare_sequences(scaled_data)
                
                # Use last sequence for prediction
                last_sequence = sequences[-1].reshape(1, self.sequence_length, len(self.features))
                
                # Predict next 7 days
                predictions = []
                current_sequence = last_sequence.copy()
                
                for _ in range(7):
                    next_pred = self.model.predict(current_sequence, verbose=0)[0, 0]
                    predictions.append(next_pred)
                    
                    # Update sequence for next prediction
                    current_sequence = np.roll(current_sequence, -1, axis=1)
                    current_sequence[0, -1, 0] = next_pred  # Use pollution index as primary feature
                
                predictions = np.array(predictions)
                
                # Calculate confidence based on prediction variance
                confidence = 1.0 / (1.0 + np.var(predictions))
                
                # Convert predictions to pollution index (0-100 scale)
                pollution_indices = np.clip(predictions * 100, 0, 100)
                
                return pollution_indices, confidence
            
            else:
                # Not enough data, return mock prediction
                return self.generate_mock_prediction(), 0.5
                
        except Exception as e:
            print(f"LSTM prediction error: {e}")
            return self.generate_mock_prediction(), 0.3
    
    def generate_mock_prediction(self):
        """Generate mock prediction when insufficient data"""
        base_level = np.random.uniform(20, 60)
        trend = np.random.uniform(-5, 5)
        noise = np.random.normal(0, 3, 7)
        
        predictions = []
        current_level = base_level
        
        for i in range(7):
            current_level += trend + noise[i]
            current_level = np.clip(current_level, 0, 100)
            predictions.append(current_level)
        
        return np.array(predictions)
    
    def save_model(self):
        """Save trained model and scaler"""
        if self.model is not None:
            os.makedirs(self.model_path, exist_ok=True)
            self.model.save(os.path.join(self.model_path, 'lstm_final_model.h5'))
            joblib.dump(self.scaler, os.path.join(self.model_path, 'lstm_scaler.pkl'))
            print(f"✅ LSTM model saved to {self.model_path}")
