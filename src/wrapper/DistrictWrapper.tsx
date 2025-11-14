
import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../service/axiosInstance";
import { districts } from "../constants/district";
import toast from "react-hot-toast";

const DistrictWrapper = () => {
  // const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [dynamicHeight, setDynamicHeight] = useState("350px");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [districtValues, setDistrictValues] = useState<{ [key: string]: string }>({});
  const [editingDistrict, setEditingDistrict] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hideTableAfterSubmit, setHideTableAfterSubmit] = useState(false);
  const chartId = "fGzC6";
  const version = 1;

  // const widthClasses = "w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[60%]";

  const loading = isLoading || isMapLoading || isSubmitting;

  const refreshMap = useCallback(() => {
    setIframeKey(Date.now());
  }, []);

  const getDistrictMapData = useCallback(async () => {
    setIsLoading(true);
    setIsMapLoading(true);
    try {
      await axiosInstance.get("/districts/get-district-map-data");
      refreshMap();
    } catch (error) {
      console.error("Error fetching district map data:", error);
      setIsMapLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [refreshMap]);

  const generateAllDistricts = useCallback(() => {
    if (loading) return;
    const newValues: { [key: string]: string } = {};
    districts.forEach((district) => {
      const randomValue = Math.floor(Math.random() * 90 + 10);
      newValues[district.value] = randomValue.toString().padStart(2, "0");
    });
    setDistrictValues(newValues);
    setEditingDistrict(null);
    setHideTableAfterSubmit(false);
  }, [loading]);

  const clearAllDistricts = useCallback(() => {
    if (loading) return;
    setDistrictValues({});
    setEditingDistrict(null);
  }, [loading]);

  const handleValueChange = useCallback((districtValue: string, newValue: string) => {
    if (/^\d{0,2}$/.test(newValue)) {
      setDistrictValues((prev) => ({ ...prev, [districtValue]: newValue }));
    }
  }, []);

  const handleValueClick = useCallback((districtValue: string) => {
    setEditingDistrict(districtValue);
  }, []);

  const handleSaveValue = useCallback((districtValue: string) => {
    const value = districtValues[districtValue];
    if (value && /^\d{2}$/.test(value)) {
      setEditingDistrict(null);
    }
  }, [districtValues]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>, districtValue: string) => {
    if (e.key === 'Enter') {
      handleSaveValue(districtValue);
    } else if (e.key === 'Escape') {
      setEditingDistrict(null);
    }
  }, [handleSaveValue]);

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    const allValid = districts.every(d => {
      const val = districtValues[d.value];
      return val && /^\d{2}$/.test(val) && parseInt(val, 10) >= 10 && parseInt(val, 10) <= 99;
    });
    if (!allValid) {
    toast.error('All values must be two-digit numbers between 10 and 99.');
      return;
    }
    
    setHideTableAfterSubmit(true);
    setIsSubmitting(true);
    setIsMapLoading(true);
    
    try {
      const data = districts.map((district) => ({
        district: district.district,
        value: districtValues[district.value],
      }));
      console.log('Submitting data:', data);
      await axiosInstance.post('/districts/update-district-map', { data });
      toast.success('District values submitted successfully!');
      setEditingDistrict(null);
      setDistrictValues({});
      refreshMap();
    } catch (error) {
      console.error('Error submitting district values:', error);
      toast.error('Failed to submit district values');
    } finally {
      setIsSubmitting(false);
    }
  }, [districtValues, loading, refreshMap]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data["datawrapper-height"]) {
        const iframes = document.querySelectorAll("iframe");
        for (const key in event.data["datawrapper-height"]) {
          for (let i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow === event.source) {
              const newHeight = event.data["datawrapper-height"][key] + "px";
              iframes[i].style.height = newHeight;
              setDynamicHeight(newHeight);
              setIsMapLoading(false);
              setHideTableAfterSubmit(false);
            }
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 px-4 sm:px-6 lg:px-8 py-6">
      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center z-50">
          <ClipLoader color="#f97316" size={48} />
          <p className="mt-3 text-base text-gray-700 font-medium">
            {isSubmitting ? "Submitting and updating map..." : isLoading ? "Updating map data..." : "Loading map..."}
          </p>
        </div>
      )}
      
      {/* Header Section */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">District Map Data</h2>
            <p className="text-sm text-gray-600">Generate, edit, and submit district values for map visualization</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">

          <button
            onClick={getDistrictMapData}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <ClipLoader color="#ffffff" size={16} />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Map
              </>
            )}
          </button>
          
          <button
            onClick={generateAllDistricts}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Generate Sample Data
          </button>
          
          <button
            onClick={clearAllDistricts}
            disabled={loading || Object.keys(districtValues).length === 0}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ${
              loading || Object.keys(districtValues).length === 0 ? "bg-gray-400 cursor-not-allowed text-white" : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All Data
          </button>
        </div>
        
        {/* Submit Button */}
        {Object.keys(districtValues).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || loading}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold shadow-lg transition-all ${
                isSubmitting || loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <ClipLoader color="#ffffff" size={16} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit District Values
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Data Table Section */}
      {Object.keys(districtValues).length > 0 && !hideTableAfterSubmit && (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-blue-800">District Data Values</h3>
            <p className="text-sm text-blue-600">Click on any value to edit it</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">#</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">District Name</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {districts.map((district, idx) => (
                  <tr key={district.value} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-600">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {district.district}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editingDistrict === district.value ? (
                        <input
                          type="text"
                          value={districtValues[district.value] || ""}
                          onChange={(e) => handleValueChange(district.value, e.target.value)}
                          onBlur={() => handleSaveValue(district.value)}
                          onKeyDown={(e) => handleKeyPress(e, district.value)}
                          className="w-16 text-center border border-orange-300 rounded-lg py-1 px-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
                          maxLength={2}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-16 h-8 font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer rounded-lg transition-colors"
                          onClick={() => handleValueClick(district.value)}
                          title="Click to edit"
                        >
                          {districtValues[district.value] || "--"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Map */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-blue-800">District Map Visualization</h3>
          <p className="text-sm text-blue-600">Interactive map showing district data</p>
        </div>
        <div className="p-4">
          <iframe
            key={iframeKey}
            title={`District Map - ${chartId}`}
            src={`https://datawrapper.dwcdn.net/${chartId}/${version}/?lang=en`}
            scrolling="no"
            frameBorder="0"
            loading="lazy"
            className="w-full rounded-lg transition-all duration-500 ease-out"
            style={{
              height: dynamicHeight,
              minHeight: "400px",
            }}
            onLoad={() => setTimeout(() => setIsMapLoading(false), 1000)}
          />
        </div>
      </div>
    </div>
  );
};

export default DistrictWrapper;