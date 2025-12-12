const axios = require('axios');

/**
 * GitHub Service - Handles interactions with GitHub API
 * for monitoring workflow runs and fetching logs
 */

class GitHubService {
  constructor(token) {
    this.token = token;
    this.baseURL = 'https://api.github.com';
    this.headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }

  /**
   * Get workflow runs for a specific workflow
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} workflowId - Workflow file name or ID
   * @param {string} status - Filter by status (optional)
   * @param {string} conclusion - Filter by conclusion (optional)
   * @returns {Promise<Array>} Array of workflow runs
   */
  async getWorkflowRuns(owner, repo, workflowId, status = 'completed', conclusion = 'failure') {
    try {
      const url = `${this.baseURL}/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs`;
      const params = {
        per_page: 10,
        page: 1
      };

      if (status) params.status = status;
      if (conclusion) params.conclusion = conclusion;

      console.log(`Fetching workflow runs from: ${url}`);
      console.log('Parameters:', params);

      const response = await axios.get(url, {
        headers: this.headers,
        params: params
      });

      return response.data.workflow_runs || [];
    } catch (error) {
      console.error('Error fetching workflow runs:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Get the most recent failed workflow run
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} workflowId - Workflow file name or ID
   * @returns {Promise<Object|null>} Most recent failed run or null
   */
  async getLastFailedRun(owner, repo, workflowId) {
    try {
      const runs = await this.getWorkflowRuns(owner, repo, workflowId, 'completed', 'failure');
      
      if (runs.length === 0) {
        console.log('No failed workflow runs found');
        return null;
      }

      // Return the most recent failed run
      const lastFailedRun = runs[0];
      console.log(`Found failed run #${lastFailedRun.id} from ${lastFailedRun.created_at}`);
      return lastFailedRun;
    } catch (error) {
      console.error('Error getting last failed run:', error.message);
      throw error;
    }
  }

  /**
   * Download logs for a specific workflow run
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} runId - Workflow run ID
   * @returns {Promise<Buffer>} Log data as buffer (ZIP file)
   */
  async getWorkflowRunLogs(owner, repo, runId) {
    try {
      const url = `${this.baseURL}/repos/${owner}/${repo}/actions/runs/${runId}/logs`;
      console.log(`Downloading logs from: ${url}`);

      const response = await axios.get(url, {
        headers: this.headers,
        responseType: 'arraybuffer' // Get binary data
      });

      console.log(`Successfully downloaded logs (${response.data.length} bytes)`);
      return response.data;
    } catch (error) {
      console.error('Error downloading workflow logs:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }

  /**
   * Get jobs for a specific workflow run
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} runId - Workflow run ID
   * @returns {Promise<Array>} Array of jobs
   */
  async getWorkflowRunJobs(owner, repo, runId) {
    try {
      const url = `${this.baseURL}/repos/${owner}/${repo}/actions/runs/${runId}/jobs`;
      console.log(`Fetching jobs from: ${url}`);

      const response = await axios.get(url, {
        headers: this.headers
      });

      return response.data.jobs || [];
    } catch (error) {
      console.error('Error fetching workflow jobs:', error.message);
      throw error;
    }
  }

  /**
   * Extract failure information from workflow run
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {number} runId - Workflow run ID
   * @returns {Promise<Object>} Failure information including failed jobs and steps
   */
  async extractFailureInfo(owner, repo, runId) {
    try {
      const jobs = await this.getWorkflowRunJobs(owner, repo, runId);
      const failedJobs = jobs.filter(job => job.conclusion === 'failure');

      const failureInfo = {
        runId: runId,
        failedJobsCount: failedJobs.length,
        failedJobs: failedJobs.map(job => ({
          name: job.name,
          conclusion: job.conclusion,
          startedAt: job.started_at,
          completedAt: job.completed_at,
          failedSteps: job.steps
            .filter(step => step.conclusion === 'failure')
            .map(step => ({
              name: step.name,
              number: step.number,
              conclusion: step.conclusion,
              startedAt: step.started_at,
              completedAt: step.completed_at
            }))
        }))
      };

      console.log(`Extracted failure info: ${failedJobs.length} failed jobs`);
      return failureInfo;
    } catch (error) {
      console.error('Error extracting failure info:', error.message);
      throw error;
    }
  }

  /**
   * Parse log buffer to extract error messages
   * @param {Buffer} logBuffer - Raw log data (ZIP format)
   * @returns {string} Extracted error text
   */
  extractErrorsFromLogs(logBuffer) {
    try {
      // Convert buffer to string (assuming UTF-8 encoding)
      // Note: GitHub returns logs as ZIP file, but for simplicity
      // we'll extract text. In production, you'd want to unzip first.
      const logText = logBuffer.toString('utf-8');
      
      // Extract error patterns - look for common error indicators
      const errorPatterns = [
        /Error:.+/gi,
        /ERROR:.+/gi,
        /Failed:.+/gi,
        /FAILED:.+/gi,
        /\[error\].+/gi,
        /fatal:.+/gi
      ];

      let errors = [];
      for (const pattern of errorPatterns) {
        const matches = logText.match(pattern);
        if (matches) {
          errors = errors.concat(matches);
        }
      }

      // Return first 50 errors or all if less
      const errorText = errors.slice(0, 50).join('\n');
      
      if (errorText.length > 0) {
        console.log(`Extracted ${errors.length} error lines from logs`);
        return errorText;
      } else {
        console.log('No specific errors found, returning log excerpt');
        // Return last 2000 characters if no specific errors found
        return logText.slice(-2000);
      }
    } catch (error) {
      console.error('Error parsing logs:', error.message);
      return 'Unable to parse log content';
    }
  }
}

module.exports = GitHubService;