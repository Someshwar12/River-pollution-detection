# ai-service/app.py (PRODUCTION-READY VERSION)

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import cv2
from PIL import Image, ImageDraw
import os
import io
import uuid
import logging
from datetime import datetime

# --- Import Models and Utilities ---
import sys
import os
# CRITICAL: Add the AI-Service directory to the Python search path.
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))) 
from models.unet_model import UNetModel 
from models.lstm_model import LSTMModel 
from utils.image_processing import ImageProcessor # Utility for preprocessing/postprocessing

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Static File Setup ---
STATIC_DIR = "static"
SEGMENTATION_DIR = os.path.join(STATIC_DIR, "segmentations")
os.makedirs(SEGMENTATION_DIR, exist_ok=True)

# --- Model Initialization ---
unet_instance = UNetModel()
lstm_instance = LSTMModel()
image_processor = ImageProcessor() 

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(STATIC_DIR, filename)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models': {
            'unet_loaded': unet_instance.is_loaded,
            'lstm_loaded': lstm_instance.is_loaded
        }
    })

@app.route('/predict', methods=['POST'])
def predict_pollution():
    """Main prediction endpoint that generates segmentation overlay"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        # Read image
        image_bytes = image_file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Generate unique filename
        prediction_id = str(uuid.uuid4())[:8]
        overlay_filename = f"overlay_{prediction_id}.png"
        
        # 1. Preprocess image using the utility class
        processed_image = image_processor.preprocess_for_unet(image)
        
        # 2. Run U-Net Inference on the TRAINED MODEL
        # We need to ensure the model is loaded before this runs
        if not unet_instance.is_loaded:
             return jsonify({'error': 'U-Net model not initialized'}), 503
             
        segmentation_mask, confidence = unet_instance.predict(processed_image)
        
        # 3. Analyze pollution level and parameters (using the utility's logic)
        pollution_analysis = image_processor.analyze_segmentation(segmentation_mask)
        
        # 4. Create solid overlay visualization (using the utility's logic)
        overlay_image = image_processor.create_segmented_visualization(image, segmentation_mask)
        
        # 5. Save overlay image
        overlay_path = os.path.join(SEGMENTATION_DIR, overlay_filename)
        overlay_image.save(overlay_path)
        
        # Generate URL
        base_url = request.url_root.rstrip('/')
        # Adjust URL to use the Node.js backend port (5000) or just the Flask port (5001) for local
        overlay_url = f"{base_url}/static/segmentations/{overlay_filename}"
        
        return jsonify({
            'success': True,
            'prediction_id': prediction_id,
            'pollution_level': pollution_analysis['level'],
            'confidence': float(confidence),
            'overlay_url': overlay_url,
            'segmentation_url': overlay_url, 
            'parameters': pollution_analysis['estimated_parameters'],
            'processing_time': pollution_analysis['processing_time']
        })
        
    except Exception as e:
        logger.error(f'Prediction failed: {str(e)}')
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/infer/image', methods=['POST'])
def infer_image():
    return predict_pollution()

if __name__ == '__main__':
    logger.info("🤖 Starting AI Service...")
    
    # --- CRITICAL: Load Models on Startup ---
    logger.info("Loading U-Net model...")
    unet_instance.load_model()
    
    logger.info("Loading LSTM model...")
    lstm_instance.load_model()
    # ----------------------------------------
    
    logger.info("✅ AI Service ready!")
    app.run(host='0.0.0.0', port=5001, debug=False, use_reloader=False)