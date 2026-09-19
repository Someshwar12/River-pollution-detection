## 🧠 U-Net Model Implementation

import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, UpSampling2D, concatenate
import os

class UNetModel:
    def __init__(self, model_path='saved_models/unet/'):
        # --- CRITICAL FIX ---
        self.model_path = model_path # <--- ADDED/UNCOMMENTED THIS LINE
        # --------------------
        self.model = None
        self.is_loaded = False
        self.input_size = (256, 256, 3)
    
    def build_unet(self):
        """Build U-Net architecture for river pollution segmentation"""
        inputs = Input(self.input_size)
        
        # Encoder (Contracting Path)
        conv1 = Conv2D(64, 3, activation='relu', padding='same')(inputs)
        conv1 = Conv2D(64, 3, activation='relu', padding='same')(conv1)
        pool1 = MaxPooling2D(pool_size=(2, 2))(conv1)
        
        conv2 = Conv2D(128, 3, activation='relu', padding='same')(pool1)
        conv2 = Conv2D(128, 3, activation='relu', padding='same')(conv2)
        pool2 = MaxPooling2D(pool_size=(2, 2))(conv2)
        
        conv3 = Conv2D(256, 3, activation='relu', padding='same')(pool2)
        conv3 = Conv2D(256, 3, activation='relu', padding='same')(conv3)
        pool3 = MaxPooling2D(pool_size=(2, 2))(conv3)
        
        conv4 = Conv2D(512, 3, activation='relu', padding='same')(pool3)
        conv4 = Conv2D(512, 3, activation='relu', padding='same')(conv4)
        pool4 = MaxPooling2D(pool_size=(2, 2))(conv4)
        
        # Bottleneck
        conv5 = Conv2D(1024, 3, activation='relu', padding='same')(pool4)
        conv5 = Conv2D(1024, 3, activation='relu', padding='same')(conv5)
        
        # Decoder (Expanding Path)
        up6 = UpSampling2D(size=(2, 2))(conv5)
        merge6 = concatenate([conv4, up6], axis=3)
        conv6 = Conv2D(512, 3, activation='relu', padding='same')(merge6)
        conv6 = Conv2D(512, 3, activation='relu', padding='same')(conv6)
        
        up7 = UpSampling2D(size=(2, 2))(conv6)
        merge7 = concatenate([conv3, up7], axis=3)
        conv7 = Conv2D(256, 3, activation='relu', padding='same')(merge7)
        conv7 = Conv2D(256, 3, activation='relu', padding='same')(conv7)
        
        up8 = UpSampling2D(size=(2, 2))(conv7)
        merge8 = concatenate([conv2, up8], axis=3)
        conv8 = Conv2D(128, 3, activation='relu', padding='same')(merge8)
        conv8 = Conv2D(128, 3, activation='relu', padding='same')(conv8)
        
        up9 = UpSampling2D(size=(2, 2))(conv8)
        merge9 = concatenate([conv1, up9], axis=3)
        conv9 = Conv2D(64, 3, activation='relu', padding='same')(merge9)
        conv9 = Conv2D(64, 3, activation='relu', padding='same')(conv9)
        
        # Output layer - binary segmentation (pollution vs clean water)
        outputs = Conv2D(1, 1, activation='sigmoid')(conv9)
        
        model = Model(inputs=inputs, outputs=outputs)
        model.compile(optimizer='adam', 
                      loss='binary_crossentropy', 
                      metrics=['accuracy'])
        
        return model
    
    def load_model(self):
        try:
            best_model_path = os.path.join(self.model_path, 'unet_best.h5')
            final_model_path = os.path.join(self.model_path, 'unet_final_model.h5')
            
            # Prefer best model if it exists
            if os.path.exists(best_model_path):
                self.model = tf.keras.models.load_model(best_model_path)
                print("✅ Loaded best U-Net model (unet_best.h5)")
            elif os.path.exists(final_model_path):
                self.model = tf.keras.models.load_model(final_model_path)
                print("✅ Loaded final U-Net model (unet_final_model.h5)")
            else:
                self.model = self.build_unet()
                print("⚠️  No pre-trained U-Net model found, initialized new model")
            
            self.is_loaded = True
        except Exception as e:
            print(f"❌ Error loading U-Net model: {e}")
            self.model = self.build_unet()
            self.is_loaded = True

    
    def predict(self, image):
        """Run U-Net inference on preprocessed image"""
        if not self.is_loaded:
            raise Exception("Model not loaded")
        
        # Ensure image is in correct format
        if len(image.shape) == 3:
            image = np.expand_dims(image, axis=0)
        
        # Run inference
        prediction = self.model.predict(image)
        segmentation_mask = prediction[0, :, :, 0]
        
        # Calculate confidence as average prediction probability
        confidence = np.mean(np.maximum(segmentation_mask, 1 - segmentation_mask))
        
        return segmentation_mask, confidence
    
    def save_model(self, save_best=False):
        """Save trained model"""
        if self.model is not None:
            os.makedirs(self.model_path, exist_ok=True)
            if save_best:
                path = os.path.join(self.model_path, 'unet_best.h5')
                self.model.save(path)
                print(f"✅ Best model saved to {path}")
            else:
                path = os.path.join(self.model_path, 'unet_final_model.h5')
                self.model.save(path)
                print(f"✅ Final model saved to {path}")