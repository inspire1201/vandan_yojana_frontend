import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DistrictWrapper from "../../wrapper/DistrictWrapper";
import AssemblyWrapper from "../../wrapper/AssemblyWrapper";
import LokSabhaWrapper from "../../wrapper/LokSabhaWrapper";

type MapType = "district" | "assembly" | "loksabha";

const UnifiedMapPage = () => {
  const navigate = useNavigate();
  const [selectedMapType, setSelectedMapType] = useState<MapType>("district");

  const mapOptions = [
    { value: "district", label: "District", component: DistrictWrapper },
    { value: "assembly", label: "Assembly", component: AssemblyWrapper },
    { value: "loksabha", label: "LokSabha", component: LokSabhaWrapper },
  ];

  const currentMapOption = mapOptions.find(option => option.value === selectedMapType);
  const CurrentMapComponent = currentMapOption?.component || DistrictWrapper;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/reports")}
              className="px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Maps</h1>
          </div>
          
          {/* Map Type Selector */}
          <div className="relative">
            <select
              value={selectedMapType}
              onChange={(e) => setSelectedMapType(e.target.value as MapType)}
              className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer"
            >
              {mapOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="w-full">
        <CurrentMapComponent />
      </div>
    </div>
  );
};

export default UnifiedMapPage;