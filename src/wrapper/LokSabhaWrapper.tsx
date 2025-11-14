import { useEffect, useState, useCallback } from "react";

import { ClipLoader } from "react-spinners";
import axiosInstance from "../service/axiosInstance";
import { lokSabha } from "../constants/loksabha";
import toast from "react-hot-toast";

const LokSabhaWrapper = () => {
//   const navigate = useNavigate();
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [dynamicHeight, setDynamicHeight] = useState("350px");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [lokSabhaValues, setLokSabhaValues] = useState<{ [key: string]: string }>({});
  const [editingLokSabha, setEditingLokSabha] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hideTableAfterSubmit, setHideTableAfterSubmit] = useState(false);
  const chartId = "UARBO";
  const version = 1;

  const loading = isLoading || isMapLoading || isSubmitting;

  const refreshMap = useCallback(() => {
    setIframeKey(Date.now());
  }, []);

  const getLokSabhaMapData = useCallback(async () => {
    setIsLoading(true);
    setIsMapLoading(true);
    try {
      await axiosInstance.get("/districts/get-loksabha-map-data"); 
      refreshMap();
    } catch (error) {
      console.error("Error fetching Lok Sabha map data:", error);
      setIsMapLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [refreshMap]);

  const generateAllLokSabha = useCallback(() => {
    if (loading) return;
    const newValues: { [key: string]: string } = {};
    lokSabha.forEach((constituency) => {
      const randomValue = Math.floor(Math.random() * 90 + 10);
      newValues[constituency.value] = randomValue.toString().padStart(2, "0");
    });
    setLokSabhaValues(newValues);
    setEditingLokSabha(null);
    setHideTableAfterSubmit(false);
  }, [loading]);

  const clearAllLokSabha = useCallback(() => {
    if (loading) return;
    setLokSabhaValues({});
    setEditingLokSabha(null);
  }, [loading]);

  const handleValueChange = useCallback((constituencyValue: string, newValue: string) => {
    if (/^\d{0,2}$/.test(newValue)) {
      setLokSabhaValues((prev) => ({ ...prev, [constituencyValue]: newValue }));
    }  
  }, []);

  const handleValueClick = useCallback((constituencyValue: string) => {
    setEditingLokSabha(constituencyValue);
  }, []);

  const handleSaveValue = useCallback((constituencyValue: string) => {
    const value = lokSabhaValues[constituencyValue];
    if (value && /^\d{2}$/.test(value)) {
      setEditingLokSabha(null);
    }
  }, [lokSabhaValues]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>, constituencyValue: string) => {
    if (e.key === 'Enter') {
      handleSaveValue(constituencyValue);
    } else if (e.key === 'Escape') {
      setEditingLokSabha(null);
    }
  }, [handleSaveValue]);

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    const allValid = lokSabha.every(d => {
      const val = lokSabhaValues[d.value];
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
      const data = lokSabha.map((constituency) => ({
        constituency_name: constituency.LokSabha_name,
        value: lokSabhaValues[constituency.value],
      }));
      console.log('Submitting data:', data);
      await axiosInstance.post('/districts/update-loksabha-map', { data }); 
      toast.success('Lok Sabha values submitted successfully!');
      setEditingLokSabha(null);
      setLokSabhaValues({});
      refreshMap();
    } catch (error) {
      console.error('Error submitting Lok Sabha values:', error);
      toast.error('Failed to submit Lok Sabha values');
    } finally {
      setIsSubmitting(false);
    }
  }, [lokSabhaValues, loading, refreshMap]);

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
          <div className="bg-purple-500 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">LokSabha Map Data</h2>
            <p className="text-sm text-gray-600">Generate, edit, and submit constituency values for map visualization</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={getLokSabhaMapData}
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
            onClick={generateAllLokSabha}
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
            onClick={clearAllLokSabha}
            disabled={loading || Object.keys(lokSabhaValues).length === 0}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ${
              loading || Object.keys(lokSabhaValues).length === 0 ? "bg-gray-400 cursor-not-allowed text-white" : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All Data
          </button>
        </div>
        
        {/* Submit Button */}
        {Object.keys(lokSabhaValues).length > 0 && (
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
                  Submit LokSabha Values
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Table Section */}
      {Object.keys(lokSabhaValues).length > 0 && !hideTableAfterSubmit && (
        <div className="w-full max-w-6xl bg-white rounded-lg border border-gray-200 mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">#</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Constituency</th>
                  <th className="py-2 px-3 text-center font-medium text-gray-700">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lokSabha.map((constituency, idx) => (
                  <tr key={constituency.value} className="hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-600">{idx + 1}</td>
                    <td className="py-2 px-3 text-gray-900">{constituency.LokSabha_name}</td>
                    <td className="py-2 px-3 text-center">
                      {editingLokSabha === constituency.value ? (
                        <input
                          type="text"
                          value={lokSabhaValues[constituency.value] || ""}
                          onChange={(e) => handleValueChange(constituency.value, e.target.value)}
                          onBlur={() => handleSaveValue(constituency.value)}
                          onKeyDown={(e) => handleKeyPress(e, constituency.value)}
                          className="w-12 text-center border border-orange-300 rounded py-1 focus:ring-1 focus:ring-orange-500 outline-none"
                          maxLength={2}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="text-orange-600 cursor-pointer hover:bg-orange-50 px-2 py-1 rounded"
                          onClick={() => handleValueClick(constituency.value)}
                        >
                          {lokSabhaValues[constituency.value] || "--"}
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
          title={`LokSabha Map - ${chartId}`}
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

export default LokSabhaWrapper;