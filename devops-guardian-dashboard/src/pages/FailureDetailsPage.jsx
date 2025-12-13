import { mockRecentFailures } from "../utlis/mockData.js";
import FailureSummary from "../components/FailureSummary.jsx";
import FixSuggestions from "../components/FixSuggestions.jsx";
import HealingTimeline from "../components/HealingTimeline.jsx";
import LogAnalysis from "../components/LogAnalysis.jsx";

const FailureDetails = ({ setActiveTab, selectedFailure }) => {
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
      <FailureSummary failure={failure} />

      {/* Log Analysis */}
      <LogAnalysis />

      {/* Fix Suggestions */}
      <FixSuggestions />

      {/* Healing Timeline */}
      <HealingTimeline failure={failure} />
    </div>
  );
};

export default FailureDetails;
