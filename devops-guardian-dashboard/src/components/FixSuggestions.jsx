const FixSuggestions = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cline Generated Fix Suggestions
      </h3>
      <div className="space-y-4">
        <div className="border border-blue-200 rounded-lg p-3 md:p-4 bg-blue-50">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-2 md:space-y-0 mb-3">
            <div>
              <p className="font-medium text-gray-900">
                Automated Code Fix - Missing Dependency
              </p>
              <p className="text-sm text-gray-600 mt-1">
                AI-generated patch for package.json
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full w-fit">
              Confidence: 95%
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Patch Diff:</h4>
            <div className="font-mono text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
              <div className="text-blue-300"># package.json</div>
              <div className="text-gray-300">{`{`}</div>
              <div className="text-gray-300">  "name": "project",</div>
              <div className="text-gray-300">  "dependencies": {'{'}</div>
              <div className="text-green-400">+   "react-icons": "^4.11.0",</div>
              <div className="text-gray-300">    ...existing deps</div>
              <div className="text-gray-300">  {'}'}</div>
              <div className="text-gray-300">{`}`}</div>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-3">
            <strong>Cline Reasoning:</strong> Analysis showed missing 'react-icons' module causing build failure.
            The fix adds the required dependency with compatible version.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FixSuggestions;
