const FailureSummary = ({ failure }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Failure Details</h2>
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
          <p className="font-medium text-gray-900">{failure.workflowName}</p>
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
  );
};

export default FailureSummary;
