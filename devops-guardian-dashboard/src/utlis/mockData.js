import { config } from '../utils/config.js';

// API Configuration from config file
const KESTRA_API_BASE = config.kestra.baseUrl;
const CODERABBIT_API_BASE = config.coderabbit.baseUrl;
const KESTRA_API_KEY = config.kestra.apiKey;
const CODERABBIT_API_KEY = config.coderabbit.apiKey;
const ENABLE_REAL_DATA = config.features.enableRealData;

// Fetch pipelines from Kestra API or return mock data
export const fetchPipelines = async () => {
  // If real data is not enabled, return mock data immediately
  if (!ENABLE_REAL_DATA) {
    return mockPipelines;
  }

  try {
    const response = await fetch(`${KESTRA_API_BASE}/api/v1/executions`, {
      headers: {
        'Authorization': `Bearer ${KESTRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Kestra API error: ${response.status}`);
    }

    const executions = await response.json();

    // Group executions by namespace/flow for pipeline stats
    const pipelineStats = {};

    executions
      .filter(exec => exec.state && exec.state.current === 'FAILED') // Only failed executions
      .forEach(exec => {
        const key = `${exec.namespace}-${exec.flowId}`;
        if (!pipelineStats[key]) {
          pipelineStats[key] = {
            id: key,
            repository: key.replace('-', '/'),
            lastRunStatus: 'failure',
            lastRunAt: new Date(exec.createdDate),
            successRate: 0,
            failureCount: 0,
            avgTimeToResolution: 45, // This would need to be calculated from successful fixes
          };
        }
        pipelineStats[key].failureCount++;
      });

    // Get success runs for success rate calculation (simplified)
    const successExecutions = executions.filter(exec => exec.state && exec.state.current === 'SUCCESS');
    Object.values(pipelineStats).forEach(pipeline => {
      const key = `${pipeline.repository.split('/')[0]}-${pipeline.repository.split('/')[1]}`;
      const successCount = successExecutions.filter(exec =>
        `${exec.namespace}-${exec.flowId}` === key
      ).length;
      const totalRuns = pipeline.failureCount + successCount;
      pipeline.successRate = totalRuns > 0 ? Math.round((successCount / totalRuns) * 100) : 0;
    });

    return Object.values(pipelineStats);
  } catch (error) {
    console.error('Error fetching pipelines from Kestra:', error);
    // Fallback to mock data
    return mockPipelines;
  }
};

// Fetch recent failures with logs from Kestra API and fix suggestions from CodeRabbit
export const fetchRecentFailures = async () => {
  // If real data is not enabled, return mock data immediately
  if (!ENABLE_REAL_DATA) {
    return mockRecentFailures;
  }

  try {
    const response = await fetch(`${KESTRA_API_BASE}/api/v1/executions?state=FAILED&limit=10`, {
      headers: {
        'Authorization': `Bearer ${KESTRA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Kestra API error: ${response.status}`);
    }

    const executions = await response.json();

    const failures = await Promise.all(
      executions.map(async (exec) => {
        // Get execution logs
        let logUrl;
        try {
          const logResponse = await fetch(`${KESTRA_API_BASE}/api/v1/executions/${exec.id}/logs`, {
            headers: {
              'Authorization': `Bearer ${KESTRA_API_KEY}`,
            },
          });
          logUrl = logResponse.ok ? `${KESTRA_API_BASE}/api/v1/executions/${exec.id}/logs` : null;
        } catch (error) {
          console.warn('Could not fetch logs for execution:', exec.id);
          logUrl = null;
        }

        // Get CodeRabbit fix suggestions (this is mock - actual implementation would depend on CodeRabbit API)
        let prInfo = await getCodeRabbitFixInfo(exec.id, exec.namespace, exec.flowId);

        return {
          id: exec.id,
          repository: `${exec.namespace}/${exec.flowId}`,
          branch: exec.flowRevision || 'main', // Kestra might store branch info differently
          workflowName: exec.flowId,
          failureType: determineFailureType(exec.state?.histories || []),
          failedAt: new Date(exec.createdDate),
          status: exec.state?.current === 'FAILED' ? 'processing' : 'completed',
          prUrl: prInfo?.url || null,
          logUrl: logUrl,
          fixSuggestions: prInfo?.suggestions || [],
        };
      })
    );

    return failures;
  } catch (error) {
    console.error('Error fetching recent failures:', error);
    // Fallback to mock data
    return mockRecentFailures;
  }
};

// Helper function to get CodeRabbit fix information
const getCodeRabbitFixInfo = async (executionId, namespace, flowId) => {
  try {
    // This is a placeholder - actual CodeRabbit API integration would depend on their API
    const response = await fetch(`${CODERABBIT_API_BASE}/api/v1/fixes/${namespace}/${flowId}`, {
      headers: {
        'Authorization': `Bearer ${CODERABBIT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        url: data.pull_request_url,
        suggestions: data.fix_suggestions || [],
      };
    }
  } catch (error) {
    console.warn('Could not fetch CodeRabbit fix info:', error);
  }
  return null;
};

// Helper function to determine failure type from Kestra execution history
const determineFailureType = (histories) => {
  if (!histories || histories.length === 0) return 'unknown_error';

  // Look for common failure patterns in task executions or logs
  const lastHistory = histories[histories.length - 1];
  if (lastHistory.taskRun?.taskId?.includes('test')) return 'test_failure';
  if (lastHistory.taskRun?.taskId?.includes('build') || lastHistory.taskRun?.taskId?.includes('compile'))
    return 'build_error';
  if (lastHistory.taskRun?.taskId?.includes('deploy')) return 'deployment_error';

  return 'runtime_error';
};

// Fallback mock data (exported for backward compatibility)
export const mockPipelines = [
  {
    id: 1,
    repository: "acme/frontend",
    lastRunStatus: "failure",
    lastRunAt: new Date("2024-12-10T10:30:00"),
    successRate: 87,
    failureCount: 8,
    avgTimeToResolution: 45,
  },
  {
    id: 2,
    repository: "acme/backend",
    lastRunStatus: "success",
    lastRunAt: new Date("2024-12-10T09:15:00"),
    successRate: 95,
    failureCount: 3,
    avgTimeToResolution: 30,
  },
  {
    id: 3,
    repository: "acme/mobile-app",
    lastRunStatus: "failure",
    lastRunAt: new Date("2024-12-10T08:45:00"),
    successRate: 78,
    failureCount: 12,
    avgTimeToResolution: 60,
  },
];

export const mockRecentFailures = [
  {
    id: "f1",
    repository: "acme/frontend",
    branch: "main",
    workflowName: "CI/CD Pipeline",
    failureType: "build_error",
    failedAt: new Date("2024-12-10T10:30:00"),
    status: "processing",
    prUrl: null,
  },
  {
    id: "f2",
    repository: "acme/mobile-app",
    branch: "develop",
    workflowName: "Test Suite",
    failureType: "test_failure",
    failedAt: new Date("2024-12-10T08:45:00"),
    status: "completed",
    prUrl: "https://github.com/acme/mobile-app/pull/123",
  },
];
