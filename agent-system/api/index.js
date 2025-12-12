const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Agent System API is running' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Agent analyze endpoint - receives CI/CD failure logs
app.post('/agent/analyze', async (req, res) => {
  console.log('=== Received CI/CD Failure Analysis Request ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  
  const { runId, runUrl, failedJobs, errorLog, repository } = req.body;
  
  if (!errorLog) {
    return res.status(400).json({ 
      error: 'Missing required field: errorLog' 
    });
  }
  
  // Log the failure information
  console.log('\n--- Failure Details ---');
  console.log('Repository:', repository);
  console.log('Run ID:', runId);
  console.log('Run URL:', runUrl);
  console.log('Failed Jobs:', failedJobs);
  console.log('Error Log Preview:', errorLog.substring(0, 500) + '...');
  console.log('======================\n');
  
  // Simple placeholder response - AI analysis not yet implemented
  res.json({
    status: "received",
    message: "Failure data logged. AI analysis not yet implemented.",
    timestamp: new Date().toISOString(),
    metadata: { runId, runUrl, repository, failedJobs }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

module.exports = app;