import React from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../utils/DataContext";

const PipelineDetailsPage = () => {
  const { id } = useParams();
  const { pipelines } = useData();

  const pipeline = pipelines.find((p) => p.id == id);

  if (!pipeline) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pipeline Not Found
        </h2>
        <p className="text-gray-600">
          The requested pipeline could not be found.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 text-grey/500 rounded hover:text-gray-700 transition-colors"
        >
          <span>← Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {pipeline.repository} Pipeline Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Last Run Status
              </span>
              <div
                className={`w-3 h-3 rounded-full ${
                  pipeline.lastRunStatus === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
            </div>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {pipeline.lastRunStatus === "success" ? "Success" : "Failed"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-600">
              Last Run At
            </span>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {pipeline.lastRunAt.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-600">
              Success Rate
            </span>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {pipeline.successRate}%
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-600">
              Failures (30d)
            </span>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {pipeline.failureCount}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <span className="text-sm font-medium text-gray-600">
            Avg Time to Resolution
          </span>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {pipeline.avgTimeToResolution} minutes
          </p>
        </div>
      </div>
    </>
  );
};

export default PipelineDetailsPage;
