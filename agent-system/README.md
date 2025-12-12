# DevOps Guardian Agent - Milestone B Complete ✅

## Overview
The DevOps Guardian Agent now includes AI-powered CI/CD failure analysis using Ollama. The system intelligently analyzes error logs and provides actionable insights for fixing pipeline failures.

## Features Implemented (Milestone B)

### ✅ AI-Powered Log Analysis
- Integration with Ollama for intelligent error log analysis
- Structured analysis including:
  - Root cause identification
  - Severity assessment
  - Affected components
  - Recommended fixes
  - Prevention measures

### ✅ Graceful Fallback
- Automatic fallback to keyword-based analysis when Ollama is unavailable
- Ensures the system always provides useful insights

### ✅ Enhanced `/agent/analyze` Endpoint
- Receives CI/CD failure data from Kestra workflows
- Performs AI analysis on error logs
- Returns structured, actionable analysis results

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.template` to `.env` and configure:

```bash
cp .env.template .env
```

Edit `.env`:
```
# Ollama Configuration (Optional - uses fallback if not available)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

### 3. (Optional) Install and Start Ollama
For AI-powered analysis, install Ollama:

```bash
# Install Ollama (Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama2

# Or use a coding-focused model
ollama pull codellama
```

Then start Ollama:
```bash
ollama serve
```

### 4. Start the Agent System
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Usage

### POST `/agent/analyze`

Analyzes CI/CD failure logs and provides intelligent insights.

**Request Body:**
```json
{
  "runId": "12345678",
  "runUrl": "https://github.com/example/repo/actions/runs/12345678",
  "repository": "example/test-repo",
  "failedJobs": ["build", "test"],
  "errorLog": "Error: Command failed: npm test..."
}
```

**Response (AI-Powered):**
```json
{
  "status": "analyzed",
  "message": "AI analysis completed successfully",
  "timestamp": "2025-12-12T18:52:30.596Z",
  "runId": "12345678",
  "analysis": {
    "rootCause": "Test failures in UserProfile component and database connection timeout",
    "severity": "High - Multiple test failures and infrastructure issues",
    "affectedComponents": [
      "UserProfile component",
      "Database connection",
      "Test suite"
    ],
    "recommendedFixes": [
      "1. Fix UserProfile component to properly handle user.name property",
      "2. Verify database server connectivity at db.example.com:5432",
      "3. Check database credentials and network configuration",
      "4. Update test assertions to match actual component behavior"
    ],
    "preventionMeasures": [
      "Implement pre-commit hooks to run tests locally",
      "Add database health checks before running tests",
      "Set up connection pooling with proper timeout handling",
      "Add integration tests for database connectivity"
    ]
  },
  "metadata": {
    "runId": "12345678",
    "runUrl": "https://github.com/example/repo/actions/runs/12345678",
    "repository": "example/test-repo",
    "failedJobs": ["build", "test"]
  },
  "model": "llama2",
  "aiPowered": true
}
```

**Response (Fallback Mode):**
```json
{
  "status": "analyzed_with_fallback",
  "message": "Analysis completed with fallback mode (Ollama unavailable)",
  "timestamp": "2025-12-12T18:52:30.596Z",
  "runId": "12345678",
  "analysis": {
    "rootCause": "Possible network or connection issue detected.",
    "severity": "High",
    "affectedComponents": ["Unable to determine without AI analysis"],
    "recommendedFixes": [
      "Review the error log manually",
      "Check service dependencies and configurations",
      "Ensure Ollama service is running for AI-powered analysis"
    ],
    "preventionMeasures": [
      "Enable Ollama service for better analysis",
      "Implement comprehensive logging",
      "Set up monitoring and alerts"
    ],
    "note": "This is a basic fallback analysis. For detailed AI-powered insights, ensure Ollama is running."
  },
  "model": "fallback",
  "aiPowered": false
}
```

## Testing

### Manual Testing
A test script is provided to verify the implementation:

```bash
# Make sure the server is running
npm start

# In another terminal, run the test
node test-analyze.js
```

### Example Test Output
```
🚀 Starting test for DevOps Guardian Agent

Target: http://localhost:3000/agent/analyze
Make sure the server is running (npm start)

🧪 Testing /agent/analyze endpoint...

✅ Request successful!

📊 Response Status: 200
⚠️  AI-Powered Analysis: NO (Fallback mode used)
💡 Tip: Start Ollama service for AI-powered analysis

📋 Analysis Summary:
-------------------
Root Cause: Possible network or connection issue detected.
Severity: High

Recommended Fixes:
  1. Review the error log manually
  2. Check service dependencies and configurations
  3. Ensure Ollama service is running for AI-powered analysis
```

## Architecture

### Components

1. **API Server** (`api/index.js`)
   - Express server with `/agent/analyze` endpoint
   - Handles incoming CI/CD failure data
   - Coordinates with Ollama service

2. **Ollama Service** (`services/ollama-service.js`)
   - Manages communication with Ollama AI
   - Constructs specialized prompts for log analysis
   - Parses and structures AI responses
   - Provides fallback analysis when Ollama is unavailable

3. **Agent Core** (`agent-core/agent.js`)
   - Base agent class (ready for future expansion)

### Data Flow

```
CI/CD Pipeline (Kestra) 
    ↓
POST /agent/analyze
    ↓
Ollama Service
    ↓ (if available)
Ollama AI Model → Structured Analysis
    ↓ (if unavailable)
Fallback Analysis → Basic Insights
    ↓
Response with Actionable Recommendations
```

## Integration with Kestra

The agent integrates seamlessly with Kestra workflows:

```yaml
- id: notify_agent
  type: io.kestra.plugin.core.http.Request
  uri: "{{ vars.agent_url }}/agent/analyze"
  method: POST
  contentType: application/json
  body: |
    {
      "runId": "{{ workflow.id }}",
      "runUrl": "{{ vars.github_run_url }}",
      "repository": "{{ vars.github_owner }}/{{ vars.github_repo }}",
      "failedJobs": ["build", "test"],
      "errorLog": "{{ outputs.fetch_logs.body }}"
    }
```

## Supported Models

The system supports any Ollama model. Recommended models:
- **llama2** (default) - Good general-purpose analysis
- **codellama** - Specialized for code analysis
- **mistral** - Fast and efficient
- **mixtral** - Advanced reasoning capabilities

Change the model in `.env`:
```
OLLAMA_MODEL=codellama
```

## Troubleshooting

### Ollama Connection Failed
```
Error: fetch failed
```
**Solution:** Ensure Ollama is installed and running:
```bash
ollama serve
```

### Model Not Found
```
Error: model 'llama2' not found
```
**Solution:** Pull the model first:
```bash
ollama pull llama2
```

### Fallback Mode Always Active
- Verify Ollama is running: `ollama list`
- Check `OLLAMA_BASE_URL` in `.env`
- Test connection: Check server logs for "Ollama connection successful"

## Next Steps (Future Milestones)

- [ ] Add support for multiple AI providers (OpenAI, Claude)
- [ ] Implement analysis history and trend detection
- [ ] Add automatic issue creation in GitHub
- [ ] Implement learning from past failures
- [ ] Add Slack/email notifications with analysis

## License

ISC