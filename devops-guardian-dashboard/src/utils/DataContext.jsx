import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPipelines, fetchRecentFailures, mockPipelines, mockRecentFailures } from '../utlis/mockData';
import { config } from './config';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [pipelines, setPipelines] = useState([]);
  const [recentFailures, setRecentFailures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pipelinesData, failuresData] = await Promise.all([
        fetchPipelines(),
        fetchRecentFailures()
      ]);

      setPipelines(pipelinesData);
      setRecentFailures(failuresData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const value = {
    pipelines,
    recentFailures,
    loading,
    error,
    refetchData: loadData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
