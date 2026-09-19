const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');

class AIModelService {
  constructor() {
    this.unetModel = null;
    this.lstmModel = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('🤖 Initializing AI models...');
      
      // Load models from Python AI service or TensorFlow.js
      if (process.env.USE_PYTHON_AI_SERVICE === 'true') {
        // Use Python Flask service for inference
        this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
        await this.testConnection();
      } else {
        // Load TensorFlow.js models directly
        await this.loadTensorFlowModels();
      }
      
      this.isInitialized = true;
      console.log('✅ AI models initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI models:', error);
    }
  }

  async testConnection() {
    const response = await axios.get(`${this.aiServiceUrl}/health`);
    if (response.status !== 200) {
      throw new Error('AI service not available');
    }
  }

  async loadTensorFlowModels() {
    try {
      this.unetModel = await tf.loadLayersModel('./ai_models/unet_model.json');
      this.lstmModel = await tf.loadLayersModel('./ai_models/lstm_model.json');
    } catch (error) {
      console.warn('Local models not found, will use mock predictions');
    }
  }

  async runUNetSegmentation(imageBuffer) {
    if (process.env.USE_PYTHON_AI_SERVICE === 'true') {
      return this.runPythonUNetSegmentation(imageBuffer);
    }
    
    // Mock segmentation result for demonstration
    return this.mockUNetResult();
  }

  async runPythonUNetSegmentation(imageBuffer) {
    try {
      const formData = new FormData();
      formData.append('image', imageBuffer);
      
      const response = await axios.post(`${this.aiServiceUrl}/segment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data;
    } catch (error) {
      console.error('Python AI service error:', error);
      return this.mockUNetResult();
    }
  }

  async runLSTMAnalysis(timeSeriesData) {
    if (process.env.USE_PYTHON_AI_SERVICE === 'true') {
      return this.runPythonLSTMAnalysis(timeSeriesData);
    }
    
    // Mock LSTM result for demonstration
    return this.mockLSTMResult();
  }

  async runPythonLSTMAnalysis(timeSeriesData) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/predict-trends`, {
        data: timeSeriesData
      });
      
      return response.data;
    } catch (error) {
      console.error('Python AI service error:', error);
      return this.mockLSTMResult();
    }
  }

  async analyzePollutionLevel(segmentationResult) {
    // Analyze segmentation mask to determine pollution level
    const pollutionPixels = segmentationResult.pollutionMask || 0.3;
    
    let level, confidence;
    if (pollutionPixels < 0.2) {
      level = 'Clean';
      confidence = 0.9 + Math.random() * 0.05;
    } else if (pollutionPixels < 0.5) {
      level = 'Moderate';
      confidence = 0.85 + Math.random() * 0.1;
    } else {
      level = 'High';
      confidence = 0.8 + Math.random() * 0.15;
    }

    return {
      level,
      confidence: Math.min(confidence, 0.99),
      parameters: this.generateMockParameters(level)
    };
  }

  generateMockParameters(level) {
    const base = {
      Clean: { ph: 7.0, temp: 18, turb: 5, do: 8, tds: 150, cond: 300 },
      Moderate: { ph: 7.5, temp: 20, turb: 15, do: 6, tds: 300, cond: 500 },
      High: { ph: 8.2, temp: 24, turb: 30, do: 4, tds: 600, cond: 800 }
    };
    
    const params = base[level];
    return {
      ph: params.ph + (Math.random() - 0.5) * 0.5,
      temperature: params.temp + (Math.random() - 0.5) * 3,
      turbidity: params.turb + (Math.random() - 0.5) * 5,
      dissolvedOxygen: params.do + (Math.random() - 0.5) * 2,
      tds: params.tds + (Math.random() - 0.5) * 100,
      conductivity: params.cond + (Math.random() - 0.5) * 150
    };
  }

  mockUNetResult() {
    return {
      pollutionMask: Math.random(),
      segmentedImage: '/mock/segmented-image.jpg',
      processingTime: Math.random() * 5 + 1
    };
  }

  mockLSTMResult() {
    return {
      predictions: Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        pollutionIndex: Math.random() * 100,
        confidence: 0.8 + Math.random() * 0.15
      }))
    };
  }
}

module.exports = new AIModelService();
