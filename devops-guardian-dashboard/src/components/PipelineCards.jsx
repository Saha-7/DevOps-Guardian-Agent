import { useData } from "../utils/DataContext";
import PipelineCard from "./PipelineCard";

const PipelineCards = ({ setSelectedFailure }) => {
  const { pipelines, recentFailures, loading, error } = useData();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pipeline Status</h2>
        </div>
        <div className="p-4 md:p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pipeline Status</h2>
        </div>
        <div className="p-4 md:p-6">
          <p className="text-red-500">Error loading pipeline data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 md:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Pipeline Status</h2>
      </div>
      <div className="p-4 md:p-6 space-y-4">
        {pipelines.length === 0 ? (
          <p className="text-gray-500">No pipelines found.</p>
        ) : (
          pipelines.map((pipeline) => (
            <PipelineCard key={pipeline.id} pipeline={pipeline} />
          ))
        )}
      </div>
    </div>
  );
};

export default PipelineCards;
