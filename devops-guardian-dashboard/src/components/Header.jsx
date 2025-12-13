import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              DevOps Guardian Agent
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
