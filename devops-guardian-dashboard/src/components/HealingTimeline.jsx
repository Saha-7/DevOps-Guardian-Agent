const HealingTimeline = ({ failure }) => {
  const steps = [
    {
      status: 'completed',
      title: 'Failure Detected',
      description: 'Webhook received from GitHub Actions',
      timestamp: failure.failedAt,
      type: 'detection'
    },
    {
      status: 'completed',
      title: 'Oumi Agent Reasoning',
      description: 'AI analyzing failure patterns and determining root cause',
      timestamp: new Date(failure.failedAt.getTime() + 30000),
      type: 'reasoning'
    },
    {
      status: 'completed',
      title: 'Log Analysis Complete',
      description: 'Root cause identified: Missing dependency',
      timestamp: new Date(failure.failedAt.getTime() + 60000),
      type: 'analysis'
    },
    {
      status: 'completed',
      title: 'Cline Patch Generated',
      description: 'Fix created and ready for application',
      timestamp: new Date(failure.failedAt.getTime() + 90000),
      type: 'patch'
    },
    {
      status: failure.status === 'completed' ? 'completed' : 'in_progress',
      title: 'Pull Request Created',
      description: failure.prUrl ? 'Automated PR submitted for review' : 'Creating pull request',
      timestamp: failure.prUrl ? new Date(failure.failedAt.getTime() + 120000) : null,
      type: 'pr'
    },
    {
      status: failure.status === 'completed' ? 'completed' : 'pending',
      title: 'CodeRabbit Review',
      description: 'Automated code review in progress',
      timestamp: failure.prUrl ? new Date(failure.failedAt.getTime() + 180000) : null,
      type: 'review'
    },
    {
      status: failure.status === 'completed' ? 'completed' : 'pending',
      title: 'Final CI/CD Re-run',
      description: 'Rerunning pipeline to verify fix',
      timestamp: failure.status === 'completed' ? new Date(failure.failedAt.getTime() + 240000) : null,
      type: 'rerun'
    },
    {
      status: failure.status === 'completed' ? 'completed' : 'pending',
      title: 'Pipeline Restored',
      description: 'CI/CD pipeline successfully fixed and operational',
      timestamp: failure.status === 'completed' ? new Date(failure.failedAt.getTime() + 300000) : null,
      type: 'success'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        DevOps Healing Process Timeline
      </h3>
      <div className="space-y-4 md:space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`w-2 h-2 rounded-full mt-2 ${
                step.status === 'completed' ? 'bg-green-500' :
                step.status === 'in_progress' ? 'bg-yellow-500 animate-pulse' :
                'bg-gray-400'
              }`}
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{step.title}</p>
              <p className="text-sm text-gray-500">{step.description}</p>
              {step.timestamp && (
                <p className="text-xs text-gray-400 mt-1">
                  {step.timestamp.toLocaleString()}
                </p>
              )}
              {step.type === 'patch' && step.status === 'completed' && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
                  <div className="text-green-600">+ "react-icons": "^4.11.0"</div>
                  <div className="text-gray-600">in package.json</div>
                </div>
              )}
              {step.type === 'pr' && failure.prUrl && (
                <a
                  href={failure.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm mt-1 inline-block"
                >
                  View PR →
                </a>
              )}
              {step.type === 'review' && failure.status === 'completed' && (
                <div className="mt-1 text-xs text-green-600">
                  ✅ CodeRabbit review passed
                </div>
              )}
              {step.type === 'rerun' && failure.status === 'completed' && (
                <div className="mt-1 text-xs text-green-600">
                  ✅ CI/CD rerun successful - Build fixed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealingTimeline;
