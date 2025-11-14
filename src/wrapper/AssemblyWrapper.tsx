
import { useEffect, useState, useCallback } from "react";

import { ClipLoader } from "react-spinners";
import axiosInstance from "../service/axiosInstance";
import { assembly } from "../constants/vidhansabha";
import toast from "react-hot-toast";

const AssemblyWrapper = () => {
  
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [dynamicHeight, setDynamicHeight] = useState("350px");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [assemblyValues, setAssemblyValues] = useState<{ [key: string]: string }>({});
  const [editingAssembly, setEditingAssembly] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hideTableAfterSubmit, setHideTableAfterSubmit] = useState(false);
  const chartId = "lXDRQ";
  const version = 1;

  // const widthClasses = "w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[60%]";

  const loading = isLoading || isMapLoading || isSubmitting;

  const refreshMap = useCallback(() => {
    setIframeKey(Date.now());
  }, []);

  const getAssemblyMapData = useCallback(async () => {
    setIsLoading(true);
    setIsMapLoading(true);
    try {
      await axiosInstance.get("/districts/get-assembly-map-data");
      refreshMap();
    } catch (error) {
      console.error("Error fetching district map data:", error);
      setIsMapLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [refreshMap]);

  const generateAllAssembly = useCallback(() => {
    if (loading) return;
    const newValues: { [key: string]: string } = {};
    assembly.forEach((assemblyItem) => {
      const randomValue = Math.floor(Math.random() * 90 + 10);
      newValues[assemblyItem.value] = randomValue.toString().padStart(2, "0");
    });
    setAssemblyValues(newValues);
    setEditingAssembly(null);
    setHideTableAfterSubmit(false);
  }, [loading]);

  const clearAllAssembly = useCallback(() => {
    if (loading) return;
    setAssemblyValues({});
    setEditingAssembly(null);
  }, [loading]);

  const handleValueChange = useCallback((assemblyValue: string, newValue: string) => {
    if (/^\d{0,2}$/.test(newValue)) {
      setAssemblyValues((prev) => ({ ...prev, [assemblyValue]: newValue }));
    }
  }, []);

  const handleValueClick = useCallback((assemblyValue: string) => {
    setEditingAssembly(assemblyValue);
  }, []);

  const handleSaveValue = useCallback((assemblyValue: string) => {
    const value = assemblyValues[assemblyValue];
    if (value && /^\d{2}$/.test(value)) {
      setEditingAssembly(null);
    }
  }, [assemblyValues]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>, assemblyValue: string) => {
    if (e.key === 'Enter') {
      handleSaveValue(assemblyValue);
    } else if (e.key === 'Escape') {
      setEditingAssembly(null);
    }
  }, [handleSaveValue]);

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    const allValid = assembly.every(a => {
      const val = assemblyValues[a.value];
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
      const data = assembly.map((assemblyItem) => ({
        assembly: assemblyItem.Assembly_name,
        value: assemblyValues[assemblyItem.value],
      }));
      console.log('Submitting data:', data);
      // await axiosInstance.post('/assembly/update-assembly-map', { data });
      await axiosInstance.post('/districts/update-assembly-map', { data });
      toast.success('Assembly values submitted successfully!');
      setEditingAssembly(null);
      setAssemblyValues({});
      refreshMap();
    } catch (error) {
      console.error('Error submitting assembly values:', error);
      toast.error('Failed to submit assembly values');
    } finally {
      setIsSubmitting(false);
    }
  }, [assemblyValues, loading, refreshMap]);

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
    <div className="relative w-full flex flex-col items-center min-h-screen bg-gray-50 px-4 py-4">
      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center z-50">
          <ClipLoader color="#f97316" size={48} />
          <p className="mt-3 text-sm text-gray-700">
            {isSubmitting ? "Submitting..." : isLoading ? "Updating..." : "Loading..."}
          </p>
        </div>
      )}
      
      {/* Header Section */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-500 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Assembly Map Data</h2>
            <p className="text-sm text-gray-600">Generate, edit, and submit assembly values for map visualization</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={getAssemblyMapData}
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
            onClick={generateAllAssembly}
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
            onClick={clearAllAssembly}
            disabled={loading || Object.keys(assemblyValues).length === 0}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ${
              loading || Object.keys(assemblyValues).length === 0 ? "bg-gray-400 cursor-not-allowed text-white" : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All Data
          </button>
        </div>
        
        {/* Submit Button */}
        {Object.keys(assemblyValues).length > 0 && (
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
                  Submit Assembly Values
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Table Section */}
      {Object.keys(assemblyValues).length > 0 && !hideTableAfterSubmit && (
        <div className="w-full max-w-6xl bg-white rounded-lg border border-gray-200 mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">#</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Assembly</th>
                  <th className="py-2 px-3 text-center font-medium text-gray-700">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assembly.map((assemblyItem, idx) => (
                  <tr key={assemblyItem.value} className="hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-600">{idx + 1}</td>
                    <td className="py-2 px-3 text-gray-900">{assemblyItem.Assembly_name}</td>
                    <td className="py-2 px-3 text-center">
                      {editingAssembly === assemblyItem.value ? (
                        <input
                          type="text"
                          value={assemblyValues[assemblyItem.value] || ""}
                          onChange={(e) => handleValueChange(assemblyItem.value, e.target.value)}
                          onBlur={() => handleSaveValue(assemblyItem.value)}
                          onKeyDown={(e) => handleKeyPress(e, assemblyItem.value)}
                          className="w-12 text-center border border-orange-300 rounded py-1 focus:ring-1 focus:ring-orange-500 outline-none"
                          maxLength={2}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="text-orange-600 cursor-pointer hover:bg-orange-50 px-2 py-1 rounded"
                          onClick={() => handleValueClick(assemblyItem.value)}
                        >
                          {assemblyValues[assemblyItem.value] || "--"}
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

      {/* Map */}
      <div className="w-full max-w-6xl bg-white rounded-lg border border-gray-200 p-4">
        <iframe
          key={iframeKey}
          title={`Assembly Map - ${chartId}`}
          src={`https://datawrapper.dwcdn.net/${chartId}/${version}/?lang=en`}
          scrolling="no"
          frameBorder="0"
          loading="lazy"
          className="w-full rounded"
          style={{
            height: dynamicHeight,
            minHeight: "400px",
          }}
          onLoad={() => setTimeout(() => setIsMapLoading(false), 1000)}
        />
      </div>
    </div>
  );
};

export default AssemblyWrapper;