import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  GitPullRequest,
  Settings,
  History,
  Code,
} from "lucide-react";

// Mock Data
const mockPipelines = [
  {
    id: 1,
    repository: "DevOps-Guardian-Agent/backend",
    lastRunStatus: "failure",
    lastRunAt: new Date("2025-12-14T10:22:42"),
    successRate: 95,
    failureCount: 3,
    avgTimeToResolution: 30,
  },
  {
    id: 2,
    repository: "DevOps-Guardian-Agent/frontend",
    lastRunStatus: "success",
    lastRunAt: new Date("2025-12-14T09:10:06"),
    successRate: 87,
    failureCount: 8,
    avgTimeToResolution: 45,
  },
  {
    id: 3,
    repository: "DevOps-Guardian-Agent/demo-app",
    lastRunStatus: "failure",
    lastRunAt: new Date("2025-12-13T08:45:27"),
    successRate: 72,
    failureCount: 12,
    avgTimeToResolution: 60,
  },
];

const mockRecentFailures = [
  {
    id: "f1",
    repository: "DevOps-Guardian-Agent/backend",
    branch: "main",
    workflowName: "CI/CD Pipeline",
    failureType: "build_error",
    failedAt: new Date("2025-12-14T10:22:06"),
    status: "processing",
    prUrl: null,
  },
  {
    id: "f2",
    repository: "DevOps-Guardian-Agent/frontend",
    branch: "main",
    workflowName: "CI/CD Pipeline",
    failureType: "build_error",
    failedAt: new Date("2025-12-14T10:30:06"),
    status: "processing",
    prUrl: null,
  },
  {
    id: "f3",
    repository: "DevOps-Guardian-Agent/demo-app",
    branch: "develop",
    workflowName: "Test Suite",
    failureType: "test_failure",
    failedAt: new Date("2025-12-13T08:45:27"),
    status: "completed",
    prUrl: "https://github.com/DevOps-Guardian-Agent/demo-app/",
  },
];

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedFailure, setSelectedFailure] = useState(null);

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Repositories</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(
                  mockPipelines.reduce((acc, p) => acc + p.successRate, 0) /
                    mockPipelines.length
                )}
                %
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Failures</p>
              <p className="text-2xl font-bold text-red-600">
                {
                  mockRecentFailures.filter((f) => f.status === "processing")
                    .length
                }
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  mockPipelines.reduce(
                    (acc, p) => acc + p.avgTimeToResolution,
                    0
                  ) / mockPipelines.length
                )}{" "}
                min
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Pipeline Status Cards */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Pipeline Status
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {mockPipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      pipeline.lastRunStatus === "success"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {pipeline.repository}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Last run: {pipeline.lastRunAt.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="font-semibold text-gray-900">
                      {pipeline.successRate}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Failures (30d)</p>
                    <p className="font-semibold text-gray-900">
                      {pipeline.failureCount}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("failures");
                      setSelectedFailure(
                        mockRecentFailures.find(
                          (f) => f.repository === pipeline.repository
                        )
                      );
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Failures
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {mockRecentFailures.map((failure) => (
              <div
                key={failure.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle
                    className={`w-5 h-5 ${
                      failure.status === "processing"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {failure.repository} - {failure.branch}
                    </p>
                    <p className="text-sm text-gray-500">
                      {failure.workflowName} • {failure.failureType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      failure.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {failure.status}
                  </span>
                  {failure.prUrl && (
                    <a
                      href={failure.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <GitPullRequest className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Failure Details View
  const FailureDetailsView = () => {
    const failure = selectedFailure || mockRecentFailures[0];

    return (
      <div className="space-y-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
        >
          <span>← Back to Dashboard</span>
        </button>

        {/* Failure Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Failure Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Repository</p>
              <p className="font-medium text-gray-900">{failure.repository}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Branch</p>
              <p className="font-medium text-gray-900">{failure.branch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Workflow</p>
              <p className="font-medium text-gray-900">
                {failure.workflowName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Failure Type</p>
              <p className="font-medium text-red-600">
                {failure.failureType.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed At</p>
              <p className="font-medium text-gray-900">
                {failure.failedAt.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  failure.status === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {failure.status}
              </span>
            </div>
          </div>
        </div>

        {/* Log Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Log Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Root Cause
              </p>
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-sm text-red-800">
                  Build failed due to missing dependency 'react-icons'. Package
                  not found in node_modules.
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Error Messages
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded p-4 font-mono text-xs">
                <p className="text-red-600">
                  Error: Cannot find module 'react-icons/fa'
                </p>
                <p className="text-gray-600">
                  at Function.Module._resolveFilename
                  (internal/modules/cjs/loader.js:880:15)
                </p>
                <p className="text-gray-600">
                  at Function.Module._load
                  (internal/modules/cjs/loader.js:725:27)
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Affected Files
              </p>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    src/components/Dashboard.jsx
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    src/components/Sidebar.jsx
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* // Fix Suggestions
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generated Fix Suggestions
          </h3>
          <div className="space-y-4">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">
                    Install Missing Dependency
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Add react-icons to package.json
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">
                  Confidence: 95%
                </span>
              </div>
              <div className="bg-white border border-gray-200 rounded p-3 font-mono text-xs">
                <p className="text-green-600">+ "react-icons": "^4.11.0"</p>
              </div>
              <p className="text-sm text-gray-700 mt-3">
                This fix adds the missing react-icons package to your
                dependencies. Run npm install after applying.
              </p>
            </div>
          </div>
        </div> */}

        {/* Healing Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Healing Timeline
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Failure Detected</p>
                <p className="text-sm text-gray-500">
                  Webhook received from GitHub Actions
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {failure.failedAt.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Log Analysis Complete
                </p>
                <p className="text-sm text-gray-500">
                  Root cause identified: Missing dependency
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(
                    failure.failedAt.getTime() + 30000
                  ).toLocaleString()}
                </p>
              </div>
            </div>
            {/* <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 animate-pulse" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Generating Fix with Cline
                </p>
                <p className="text-sm text-gray-500">
                  AI analyzing code and creating fix...
                </p>
                <p className="text-xs text-gray-400 mt-1">In progress</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                DevOps Guardian
              </h1>
            </div>
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              {/* <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                  activeTab === "history"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <History className="w-5 h-5" />
                <span>History</span>
              </button>
              <button
                onClick={() => setActiveTab("config")}
                className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                  activeTab === "config"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Config</span>
              </button> */}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "failures" && <FailureDetailsView />}
        {/* {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Healing History
            </h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )}
        {activeTab === "config" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Configuration
            </h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )} */}
      </main>
    </div>
  );
};

export default App;
