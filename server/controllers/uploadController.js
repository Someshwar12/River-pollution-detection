const Sample = require('../models/Sample');
const AIModelService = require('../services/aiModelService');
const ImageProcessingService = require('../services/imageProcessingService');
const DataAnalysisService = require('../services/dataAnalysisService');
const { generateUniqueId } = require('../utils/helpers');

exports.uploadImage = async (req, res) => {
  try {
    const { location, coordinates } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Create sample record
    const sample = new Sample({
      id: generateUniqueId(),
      userId: req.user?.id,
      type: 'image',
      location: {
        name: location,
        coordinates: JSON.parse(coordinates)
      },
      filename: file.filename,
      fileSize: file.size,
      processingStatus: 'processing'
    });

    await sample.save();

    // Process image asynchronously
    processImageSample(sample.id, file.path);

    res.status(201).json({
      success: true,
      sampleId: sample.id,
      message: 'Image uploaded successfully. Processing started.'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

exports.uploadData = async (req, res) => {
  try {
    const { location, coordinates } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No data file provided' });
    }

    const sample = new Sample({
      id: generateUniqueId(),
      userId: req.user?.id,
      type: 'data',
      location: {
        name: location,
        coordinates: JSON.parse(coordinates)
      },
      filename: file.filename,
      fileSize: file.size,
      processingStatus: 'processing'
    });

    await sample.save();

    // Process data asynchronously
    processDataSample(sample.id, file.path);

    res.status(201).json({
      success: true,
      sampleId: sample.id,
      message: 'Data uploaded successfully. Processing started.'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload data' });
  }
};

async function processImageSample(sampleId, imagePath) {
  try {
    // Preprocess image
    const processedImage = await ImageProcessingService.preprocessImage(imagePath);
    
    // Run U-Net segmentation
    const segmentationResult = await AIModelService.runUNetSegmentation(processedImage);
    
    // Analyze pollution level
    const pollutionAnalysis = await AIModelService.analyzePollutionLevel(segmentationResult);
    
    // Update sample with results
    await Sample.findOneAndUpdate(
      { id: sampleId },
      {
        processingStatus: 'completed',
        results: {
          pollutionLevel: pollutionAnalysis.level,
          confidence: pollutionAnalysis.confidence,
          parameters: pollutionAnalysis.parameters
        }
      }
    );
  } catch (error) {
    console.error('Image processing error:', error);
    await Sample.findOneAndUpdate(
      { id: sampleId },
      { processingStatus: 'failed' }
    );
  }
}

async function processDataSample(sampleId, dataPath) {
  try {
    // Parse CSV data
    const sensorData = await DataAnalysisService.parseCSVData(dataPath);
    
    // Run LSTM analysis for trends
    const trendAnalysis = await AIModelService.runLSTMAnalysis(sensorData);
    
    // Classify pollution level
    const pollutionLevel = DataAnalysisService.classifyPollutionLevel(sensorData);
    
    // Update sample with results
    await Sample.findOneAndUpdate(
      { id: sampleId },
      {
        processingStatus: 'completed',
        results: {
          pollutionLevel: pollutionLevel.level,
          confidence: pollutionLevel.confidence,
          parameters: sensorData.latest,
          trends: trendAnalysis
        }
      }
    );
  } catch (error) {
    console.error('Data processing error:', error);
    await Sample.findOneAndUpdate(
      { id: sampleId },
      { processingStatus: 'failed' }
    );
  }
}
```
