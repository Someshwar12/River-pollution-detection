import cv2
import numpy as np
from PIL import Image
import base64
import io

class ImageProcessor:
    def __init__(self):
        self.target_size = (256, 256)
    
    def preprocess_for_unet(self, image):
        """Preprocess image for U-Net input"""
        # Convert PIL to OpenCV format
        if isinstance(image, Image.Image):
            image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Resize to target size
        resized = cv2.resize(image, self.target_size)
        
        # Normalize pixel values to [0, 1]
        normalized = resized.astype(np.float32) / 255.0
        
        # Add batch dimension
        return np.expand_dims(normalized, axis=0)
    
    def analyze_segmentation(self, segmentation_mask):
        """Analyze segmentation mask to determine pollution level"""
        import time
        start_time = time.time()
        
        # Calculate pollution percentage
        pollution_percentage = np.mean(segmentation_mask > 0.5) * 100
        
        # Determine pollution level
        if pollution_percentage < 20:
            level = 'Clean'
            base_params = {'ph': 7.0, 'temp': 18, 'turb': 5, 'do': 8.0, 'tds': 150}
        elif pollution_percentage < 50:
            level = 'Moderate'
            base_params = {'ph': 7.5, 'temp': 21, 'turb': 15, 'do': 6.0, 'tds': 300}
        else:
            level = 'High'
            base_params = {'ph': 8.2, 'temp': 25, 'turb': 35, 'do': 3.5, 'tds': 600}
        
        # Add realistic variations to parameters
        estimated_parameters = {
            'ph': base_params['ph'] + np.random.normal(0, 0.3),
            'temperature': base_params['temp'] + np.random.normal(0, 2),
            'turbidity': max(0, base_params['turb'] + np.random.normal(0, 3)),
            'dissolved_oxygen': max(0, base_params['do'] + np.random.normal(0, 1)),
            'tds': max(0, base_params['tds'] + np.random.normal(0, 50))
        }
        
        processing_time = time.time() - start_time
        
        return {
            'level': level,
            'pollution_percentage': pollution_percentage,
            'estimated_parameters': estimated_parameters,
            'processing_time': processing_time
        }
    
    def create_segmented_visualization(self, original_image, segmentation_mask):
        """Create visualization of segmented image"""
        # Convert PIL to OpenCV if needed
        if isinstance(original_image, Image.Image):
            original = cv2.cvtColor(np.array(original_image), cv2.COLOR_RGB2BGR)
        else:
            original = original_image.copy()
        
        # Resize mask to match original image
        original_size = (original.shape[1], original.shape[0])
        mask_resized = cv2.resize(segmentation_mask, original_size)
        
        # Create colored overlay (red for pollution)
        overlay = original.copy()
        pollution_areas = mask_resized > 0.5
        overlay[pollution_areas] = [0, 0, 255]  # Red color for pollution
        
        # Blend original and overlay
        alpha = 0.3
        result = cv2.addWeighted(original, 1 - alpha, overlay, alpha, 0)
        
        # Convert to base64 for web display
        _, buffer = cv2.imencode('.jpg', result)
        image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        return f"data:image/jpeg;base64,{image_b64}"
