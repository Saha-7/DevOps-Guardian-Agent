const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------
// GLOBAL MIDDLEWARES
// ----------------------------------------------------
app.use(express.json({ limit: "2mb" }));       // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ----------------------------------------------------
// BASIC ROUTES
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.json({ message: 'Agent System API is running' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// AGENT ANALYSIS ENDPOINT
// Receives CI/CD failure logs from run-fetch.js
// ----------------------------------------------------
app.post('/agent/analyze', async (req, res) => {
  console.log('=== Received CI/CD Failure Analysis Request ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request Body:', JSON.stringify(req.body, null, 2));

  const { runId, runUrl, failedJobs, errorLog, repository } = req.body;

  // ----------------------------------------------------
  // VALIDATION (Required by Reviewer)
  // ----------------------------------------------------
  const missingFields = [];
  if (!errorLog) missingFields.push('errorLog');
  if (!runId) missingFields.push('runId');
  if (!runUrl) missingFields.push('runUrl');
  if (!repository) missingFields.push('repository');

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      fields: missingFields
    });
  }
  // ----------------------------------------------------

  // Log failure details
  console.log('\n--- Failure Details ---');
  console.log('Repository:', repository);
  console.log('Run ID:', runId);
  console.log('Run URL:', runUrl);
  console.log('Failed Jobs:', failedJobs);
  console.log('Error Log Preview:', errorLog.substring(0, 500) + '...');
  console.log('======================\n');

  // ----------------------------------------------------
  // PLACEHOLDER RESPONSE
  // (Oumi Phase will replace this with AI diagnosis)
  // ----------------------------------------------------
  res.json({
    status: "received",
    message: "Failure data logged. AI analysis not yet implemented.",
    timestamp: new Date().toISOString(),
    metadata: { runId, runUrl, repository, failedJobs }
  });
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

module.exports = app;
