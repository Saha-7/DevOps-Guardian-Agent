import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import PipelineDetailsPage from "./pages/PipelineDetailsPage.jsx";
import Header from "./components/Header.jsx";
import { DataProvider } from "./utils/DataContext.jsx";

const App = () => {
  return (
    <Router>
      <DataProvider>
        <div className="min-h-screen bg-gray-100">
          <Header />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/pipeline/:id" element={<PipelineDetailsPage />} />
            </Routes>
          </main>
        </div>
      </DataProvider>
    </Router>
  );
};

export default App;
