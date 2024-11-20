// src/App.tsx
import { DataValidator } from "./components/DataValidator";
import { GlobalTimeDistribution } from "./components/GlobalTimeDistribution";
import { DailyTimeCircle } from "./components/DailyTimeCircle";
import { FilterPanel } from "./components/FilterPanel";

function App() {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">How We Spend Our Time</h1>
      <div className="mb-8">
        <DataValidator />
      </div>
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        <div className="lg:w-1/4">
          <FilterPanel />
        </div>
        <div className="lg:w-3/4">
          <div className="w-full h-[600px] mb-8">
            <GlobalTimeDistribution />
          </div>
          <div className="w-full h-[600px]">
            <DailyTimeCircle />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
