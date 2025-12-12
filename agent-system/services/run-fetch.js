#!/usr/bin/env node

/**
 * Run Fetch Script - Monitors GitHub Actions for failures
 * This script is designed to be called by Kestra workflow
 * It checks for failed workflow runs and sends them to the agent for analysis
 */

require('dotenv').config();
const axios = require('axios');
const GitHubService = require('./github-service');

// Load environment variables
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_WORKFLOW_ID = process.env.GITHUB_WORKFLOW_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const AGENT_URL = process.env.AGENT_URL;

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const missing = [];
  
  if (!GITHUB_OWNER) missing.push('GITHUB_OWNER');
  if (!GITHUB_REPO) missing.push('GITHUB_REPO');
  if (!GITHUB_WORKFLOW_ID) missing.push('GITHUB_WORKFLOW_ID');
  if (!GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
  if (!AGENT_URL) missing.push('AGENT_URL');
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease set them in .env file');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
}

/**
 * Send failure data to agent for analysis
 */
async function sendToAgent(failureData) {
  try {
    const agentEndpoint = `${AGENT_URL}/agent/analyze`;
    console.log(`\n📤 Sending data to agent: ${agentEndpoint}`);
    
    const response = await axios.post(agentEndpoint, failureData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ Agent response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending to agent:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Main function - Check for failed runs and process them
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🔍 GitHub Actions CI Monitor - Run Fetch');
  console.log('='.repeat(60));
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Repository: ${GITHUB_OWNER}/${GITHUB_REPO}`);
  console.log(`Workflow ID: ${GITHUB_WORKFLOW_ID}`);
  console.log('='.repeat(60));
  
  try {
    // Validate environment
    validateEnvironment();
    
    // Initialize GitHub service
    const githubService = new GitHubService(GITHUB_TOKEN);
    console.log('\n✅ GitHub service initialized');
    
    // Get the last failed run
    console.log('\n🔎 Checking for failed workflow runs...');
    const failedRun = await githubService.getLastFailedRun(
      GITHUB_OWNER,
      GITHUB_REPO,
      GITHUB_WORKFLOW_ID
    );
    
    if (!failedRun) {
      console.log('✨ No failed workflow runs found. All good!');
      console.log('='.repeat(60));
      process.exit(0);
    }
    
    console.log('\n⚠️  Failed run detected:');
    console.log(`   Run ID: ${failedRun.id}`);
    console.log(`   Run Number: ${failedRun.run_number}`);
    console.log(`   Status: ${failedRun.status}`);
    console.log(`   Conclusion: ${failedRun.conclusion}`);
    console.log(`   Created: ${failedRun.created_at}`);
    console.log(`   URL: ${failedRun.html_url}`);
    
    // Extract failure information
    console.log('\n📊 Extracting failure details...');
    const failureInfo = await githubService.extractFailureInfo(
      GITHUB_OWNER,
      GITHUB_REPO,
      failedRun.id
    );
    
    console.log(`   Failed jobs: ${failureInfo.failedJobsCount}`);
    failureInfo.failedJobs.forEach((job, index) => {
      console.log(`   Job ${index + 1}: ${job.name}`);
      console.log(`      Failed steps: ${job.failedSteps.length}`);
      job.failedSteps.forEach((step, stepIndex) => {
        console.log(`         ${stepIndex + 1}. ${step.name}`);
      });
    });
    
    // Download logs
    console.log('\n📥 Downloading workflow logs...');
    const logBuffer = await githubService.getWorkflowRunLogs(
      GITHUB_OWNER,
      GITHUB_REPO,
      failedRun.id
    );
    
    // Extract error content from logs
    console.log('🔍 Extracting error content from logs...');
    const errorLog = githubService.extractErrorsFromLogs(logBuffer);
    console.log(`   Extracted ${errorLog.length} characters of error content`);
    
    // Prepare data for agent
    const agentPayload = {
      runId: failedRun.id,
      runNumber: failedRun.run_number,
      runUrl: failedRun.html_url,
      repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
      workflowName: failedRun.name,
      conclusion: failedRun.conclusion,
      createdAt: failedRun.created_at,
      failedJobs: failureInfo.failedJobs.map(job => ({
        name: job.name,
        failedSteps: job.failedSteps.map(step => step.name)
      })),
      errorLog: errorLog
    };
    
    // Send to agent for analysis
    const agentResponse = await sendToAgent(agentPayload);
    
    console.log('\n✅ Successfully processed failed workflow run');
    console.log('='.repeat(60));
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error in main execution:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('='.repeat(60));
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, sendToAgent, validateEnvironment };