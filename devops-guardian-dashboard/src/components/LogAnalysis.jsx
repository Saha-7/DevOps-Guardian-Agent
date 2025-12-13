import { Code } from "lucide-react";

const LogAnalysis = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">CI/CD Error Analysis</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Root Cause</p>
          <div className="bg-red-50 border border-red-200 rounded p-3 md:p-4">
            <p className="text-sm text-red-800">
              Build failed due to missing dependency 'react-icons'. Package not
              found in node_modules.
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Error Messages
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded p-3 md:p-4 font-mono text-xs overflow-x-auto">
            <p className="text-red-600">
              Error: Cannot find module 'react-icons/fa'
            </p>
            <p className="text-gray-600">
              at Function.Module._resolveFilename
              (internal/modules/cjs/loader.js:880:15)
            </p>
            <p className="text-gray-600">
              at Function.Module._load (internal/modules/cjs/loader.js:725:27)
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Affected Files
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 text-sm">
              <Code className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">
                src/components/Dashboard.jsx
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Code className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">src/components/Sidebar.jsx</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogAnalysis;
