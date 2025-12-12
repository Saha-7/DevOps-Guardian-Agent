const axios = require('axios');

// Test data simulating a CI/CD failure
const testFailureData = {
  runId: '12345678',
  runUrl: 'https://github.com/example/repo/actions/runs/12345678',
  repository: 'example/test-repo',
  failedJobs: ['build', 'test'],
  errorLog: `
Error: Command failed: npm test
    at ChildProcess.exithandler (node:child_process:419:12)
    at ChildProcess.emit (node:events:513:28)
    at maybeClose (node:internal/child_process:1091:16)
    
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! test-app@1.0.0 test: jest --coverage
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the test-app@1.0.0 test script.

Test Suites: 2 failed, 3 passed, 5 total
Tests:       4 failed, 12 passed, 16 total
Snapshots:   0 total
Time:        5.432s

FAIL src/components/UserProfile.test.js
  ● UserProfile component › should render user name
    
    expect(received).toBe(expected) // Object.is equality
    
    Expected: "John Doe"
    Received: undefined
    
      15 |     const { getByText } = render(<UserProfile user={mockUser} />);
      16 |     const nameElement = getByText(mockUser.name);
    > 17 |     expect(nameElement).toBe("John Doe");
         |                        ^
      18 |   });

Connection timeout: Unable to connect to database server at db.example.com:5432
`
};

async function testAnalyzeEndpoint() {
  console.log('🧪 Testing /agent/analyze endpoint...\n');
  
  try {
    const response = await axios.post('http://localhost:3000/agent/analyze', testFailureData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout for AI analysis
    });
    
    console.log('✅ Request successful!\n');
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:\n', JSON.stringify(response.data, null, 2));
    
    // Check if AI analysis was performed
    if (response.data.aiPowered) {
      console.log('\n🤖 AI-Powered Analysis: YES');
      console.log('🔧 Model Used:', response.data.model);
    } else {
      console.log('\n⚠️  AI-Powered Analysis: NO (Fallback mode used)');
      console.log('💡 Tip: Start Ollama service for AI-powered analysis');
    }
    
    // Display analysis summary
    if (response.data.analysis) {
      console.log('\n📋 Analysis Summary:');
      console.log('-------------------');
      if (response.data.analysis.rootCause) {
        console.log('Root Cause:', response.data.analysis.rootCause);
      }
      if (response.data.analysis.severity) {
        console.log('Severity:', response.data.analysis.severity);
      }
      if (response.data.analysis.recommendedFixes && response.data.analysis.recommendedFixes.length > 0) {
        console.log('\nRecommended Fixes:');
        response.data.analysis.recommendedFixes.forEach((fix, idx) => {
          console.log(`  ${idx + 1}. ${fix}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Request failed!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Run: npm start');
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the test
console.log('🚀 Starting test for DevOps Guardian Agent\n');
console.log('Target: http://localhost:3000/agent/analyze');
console.log('Make sure the server is running (npm start)\n');

testAnalyzeEndpoint();