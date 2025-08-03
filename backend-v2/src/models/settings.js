const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Instagram settings
  instagramAccessToken: {
    type: String,
    default: null
  },
  instagramPageId: {
    type: String,
    default: null
  },
  
  // YouTube settings
  youtubeClientId: {
    type: String,
    default: null
  },
  youtubeClientSecret: {
    type: String,
    default: null
  },
  
  // S3 settings
  s3AccessKey: {
    type: String,
    default: null
  },
  s3SecretKey: {
    type: String,
    default: null
  },
  s3Bucket: {
    type: String,
    default: null
  },
  
  // OpenAI settings
  openaiApiKey: {
    type: String,
    default: null
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Single document pattern - only one settings record
  _id: {
    type: String,
    default: 'app_settings'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);