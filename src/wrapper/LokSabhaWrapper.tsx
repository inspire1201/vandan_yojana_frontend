import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axiosInstance from "../service/axiosInstance";
import { lokSabha } from "../constants/loksabha";
import toast from "react-hot-toast";

const LokSabhaWrapper = () => {
  const navigate = useNavigate();
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

  const widthClasses = "w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[60%]";

  const loading = isLoading || isMapLoading || isSubmitting;

  const refreshMap = useCallback(() => {
    setIframeKey(Date.now());
  }, []);

  const getLokSabhaMapData = useCallback(async () => {
    setIsLoading(true);
    setIsMapLoading(true);
    try {
      // NOTE: Changed endpoint from /lokSabha/get-assembly-map-data to /lokSabha/get-map-data
//       await axiosInstance.get("/lokSabha/get-map-data"); 
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
      // Generate random value between 10 and 99
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
    // Check if all values are valid (10-99 and two digits)
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
        // NOTE: Changed 'district' to 'constituency' or equivalent server-side field 
        // For the server, sending the LokSabha_name field is likely correct
        constituency_name: constituency.LokSabha_name,
        value: lokSabhaValues[constituency.value],
      }));
      console.log('Submitting data:', data);
      // NOTE: Changed endpoint from update-district-map to update-loksabha-map
//       await axiosInstance.post('/lokSabha/update-loksabha-map', { data }); 
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
    <div className="relative w-full flex flex-col items-center min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] px-4 sm:px-6 lg:px-8 py-8">
      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center z-50">
          <ClipLoader color="#3b82f6" size={48} />
          <p className="mt-3 text-base text-gray-700 font-medium">
            {isSubmitting ? "Submitting and updating map..." : isLoading ? "Updating map data..." : "Loading map..."}
          </p>
        </div>
      )}
      {/* 🧭 Top Controls */}
      <div className={`${widthClasses} flex flex-col gap-5 mb-6`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
          {/* Back Button */}
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm shadow-md w-full sm:w-auto"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Refresh */}
            <button
              onClick={getLokSabhaMapData}
              disabled={loading}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-md transition-all duration-200 w-full sm:w-auto ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <ClipLoader color="#ffffff" size={12} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
            {/* Generate Random */}
            <button
              onClick={generateAllLokSabha}
              disabled={loading}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-md transition-all duration-200 w-full sm:w-auto ${
                loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Generate Lok Sabha
            </button>
            {/* Clear */}
            <button
              onClick={clearAllLokSabha}
              disabled={loading || Object.keys(lokSabhaValues).length === 0}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-md transition-all duration-200 w-full sm:w-auto ${
                loading || Object.keys(lokSabhaValues).length === 0 ? "bg-gray-400 cursor-not-allowed text-white" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
        </div>
        {/* Submit Button */}
        {Object.keys(lokSabhaValues).length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || loading}
              className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold shadow-lg transition-all ${
                isSubmitting || loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <ClipLoader color="#ffffff" size={12} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Submitting...</span>
                  <span className="sm:hidden">Submit...</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="hidden sm:inline">Submit Lok Sabha Values</span>
                  <span className="sm:hidden">Submit</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 📊 Table Section */}
      {Object.keys(lokSabhaValues).length > 0 && !hideTableAfterSubmit && (
        <div className={`${widthClasses} overflow-hidden rounded-xl shadow-xl bg-white`}>
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs border-b">
              <tr>
                <th className="py-3 px-4 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">Constituency Name</th>
                <th className="py-3 px-4 font-semibold text-center">Value</th>
              </tr>
            </thead>
            <tbody>
              {lokSabha.map((constituency, idx) => (
                <tr key={constituency.value} className="border-b last:border-none hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-4 text-gray-600">{idx + 1}</td>
                  <td className="py-2.5 px-4 font-medium text-gray-800">
                    {constituency.LokSabha_name}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {editingLokSabha === constituency.value ? (
                      <input
                        type="text"
                        value={lokSabhaValues[constituency.value] || ""}
                        onChange={(e) => handleValueChange(constituency.value, e.target.value)}
                        onBlur={() => handleSaveValue(constituency.value)}
                        onKeyDown={(e) => handleKeyPress(e, constituency.value)}
                        className="w-14 text-center border border-gray-300 rounded-md py-1 focus:ring-2 focus:ring-blue-400 outline-none"
                        maxLength={2}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                        onClick={() => handleValueClick(constituency.value)}
                        title="Click to edit"
                      >
                        {lokSabhaValues[constituency.value] || ""}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🗺️ Map */}
      <div className={`${widthClasses} relative overflow-hidden rounded-xl shadow-xl mt-8`}>
        <iframe
          key={iframeKey}
          title={`Datawrapper-${chartId}`}
          src={`https://datawrapper.dwcdn.net/${chartId}/${version}/?lang=en`}
          scrolling="no"
          frameBorder="0"
          loading="lazy"
          className="w-full transition-all duration-500 ease-out"
          style={{
            height: dynamicHeight,
            minHeight: "350px",
          }}
          onLoad={() => setTimeout(() => setIsMapLoading(false), 1000)}
        />
      </div>
    </div>
  );
};

export default LokSabhaWrapper;