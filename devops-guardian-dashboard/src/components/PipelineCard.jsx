import { useNavigate } from "react-router-dom";

export default function PipelineCard({ pipeline }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/pipeline/${pipeline.id}`);
  };

  return (
    <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div
            className={`w-3 h-3 rounded-full ${
              pipeline.lastRunStatus === "success"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <div>
            <h3 className="font-medium text-gray-900">{pipeline.repository}</h3>
            <p className="text-sm text-gray-500">
              Last run: {pipeline.lastRunAt.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="font-semibold text-gray-900">
              {pipeline.successRate}%
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-600">Failures (30d)</p>
            <p className="font-semibold text-gray-900">
              {pipeline.failureCount}
            </p>
          </div>
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap w-fit"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
