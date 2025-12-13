import { useState } from "react";
import Stats from "./Stats";
import RecentActivity from "./RecentActivity";
import PipelineCards from "./PipelineCards";
import { useData } from "../utils/DataContext";
import LogAnalysis from "./LogAnalysis";
import FixSuggestions from "./FixSuggestions";
import HealingTimeline from "./HealingTimeline";
import FailureSummary from "./FailureSummary";

const Dashboard = () => {
  const { recentFailures, pipelines, loading, error } = useData();
  const [selectedFailure, setSelectedFailure] = useState(null);
  const latestFailure = recentFailures.length > 0 ? recentFailures[0] : null;
  const currentFailure = selectedFailure || latestFailure;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Stats />

      {/* Pipeline Status Cards */}
      <PipelineCards
        setSelectedFailure={setSelectedFailure}
      />

      {/* Recent Activity */}
      <RecentActivity />

      {/* Show detailed failure analysis */}
      {currentFailure && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedFailure ? `${selectedFailure.repository} Pipeline Details` : 'Latest Failure Analysis'}
            </h2>
            {selectedFailure && (
              <button
                onClick={() => setSelectedFailure(null)}
                className="mt-2 sm:mt-0 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                View Latest
              </button>
            )}
          </div>

          {/* CI/CD Errors - Log Analysis */}
          <LogAnalysis />

          {/* Fix Suggestions */}
          <FixSuggestions />

          {/* Full Healing Process Timeline */}
          <FailureSummary failure={currentFailure} />
          <HealingTimeline failure={currentFailure} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
