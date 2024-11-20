// src/context/DataContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProcessedData, CountryData, GlobalTimeData, EconomicData } from '../types/data';
import { processRawCSVData, processGlobalData, processEconomicData } from '../utils/dataProcessor';

interface DataContextType {
  data: ProcessedData | null;
  filteredData: CountryData[];
  updateFilteredData: (data: CountryData[]) => void;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [filteredData, setFilteredData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/src/data/all_countries.csv').then((r) => r.text()),
      fetch('/src/data/global_human_day.csv').then((r) => r.text()),
      fetch('/src/data/global_economic_activity.csv').then((r) => r.text()),
    ])
      .then(([countriesCSV, globalCSV, economicCSV]) => {
        setData({
          countries: processRawCSVData(countriesCSV),
          global: processGlobalData(globalCSV),
          economic: processEconomicData(economicCSV),
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data) {
      setFilteredData(data.countries);
    }
  }, [data]);

  const updateFilteredData = (data: CountryData[]) => {
    setFilteredData(data);
  };

  return (
    <DataContext.Provider value={{ data, filteredData, updateFilteredData, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}