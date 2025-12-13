import { useData } from "../utils/DataContext";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  GitPullRequest,
} from "lucide-react";

const RecentActivity = () => {
  const { recentFailures, loading, error } = useData();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Failures</h2>
        </div>
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Failures</h2>
        </div>
        <div className="p-6">
          <p className="text-red-500">Error loading failure data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Failures</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {recentFailures.length === 0 ? (
            <p className="text-gray-500">No recent failures found.</p>
          ) : (
            recentFailures.map((failure) => (
              <div
                key={failure.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-gray-50 rounded space-y-2 md:space-y-0"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle
                    className={`w-5 h-5 flex-shrink-0 ${
                      failure.status === "processing"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {failure.repository} - {failure.branch}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {failure.workflowName} • {failure.failureType}
                    </p>
                    {failure.logUrl && (
                      <p className="text-xs text-blue-600 mt-1">
                        <a href={failure.logUrl} target="_blank" rel="noopener noreferrer">
                          View Error Logs
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 md:justify-end">
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
                      title="CodeRabbit Fix PR"
                    >
                      <GitPullRequest className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
