const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['image', 'data'], required: true },
  location: {
    name: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  uploadedAt: { type: Date, default: Date.now },
  filename: String,
  fileSize: Number,
  processingStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  results: {
    pollutionLevel: { type: String, enum: ['Clean', 'Moderate', 'High'] },
    confidence: { type: Number, min: 0, max: 1 },
    parameters: {
      ph: Number,
      temperature: Number,
      turbidity: Number,
      dissolvedOxygen: Number,
      tds: Number,
      conductivity: Number
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Sample', sampleSchema);
```
