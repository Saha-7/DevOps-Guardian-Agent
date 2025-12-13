import { useData } from "../utils/DataContext";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  GitPullRequest,
} from "lucide-react";

const Stats = () => {
  const { pipelines, recentFailures, loading, error } = useData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">Error loading stats: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Repositories</p>
            <p className="text-2xl font-bold text-gray-900">
              {pipelines.length}
            </p>
          </div>
          <Activity className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {pipelines.length > 0
                ? Math.round(
                    pipelines.reduce((acc, p) => acc + p.successRate, 0) /
                      pipelines.length
                  )
                : 0}
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
                recentFailures.filter((f) => f.status === "processing")
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
              {pipelines.length > 0
                ? Math.round(
                    pipelines.reduce(
                      (acc, p) => acc + p.avgTimeToResolution,
                      0
                    ) / pipelines.length
                  )
                : 0}{" "}
              min
            </p>
          </div>
          <Clock className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default Stats;
