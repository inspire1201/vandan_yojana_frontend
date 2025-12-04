import  { useState, useEffect, useMemo, type JSX } from "react";
import { FaWhatsapp, FaSms, FaPhoneAlt, FaCalendarAlt } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns"; 
import axiosInstance from "../../service/axiosInstance";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- Type Definitions ---

interface RawCampaignItem {
  sn?: number;
  type?: string;
  execution_date?: string;
  ExecutionDate?: string;
  campaign_size?: string;
  CampaignSize?: string;
  upload_date?: string;
  createdAt?: string;
}

interface ProcessedCampaignItem {
  execution_date: Date;
  campaign_size: number;
  upload_date: Date;
}

interface CampaignData {
  whatsapp: ProcessedCampaignItem[];
  sms: ProcessedCampaignItem[];
  calls: ProcessedCampaignItem[];
}

interface Stat {
  icon: JSX.Element;
  value: string;
  count: number;
  label: string;
  bgColor: string;
  iconColor: string;
}

// Map for period selection
const TIME_PERIODS = {
  DAY: "daily",
  WEEK: "weekly",
  MONTH: "monthly",
  YEAR: "yearly",
} as const;

type TimePeriod = (typeof TIME_PERIODS)[keyof typeof TIME_PERIODS] | null;

// --- Helper Functions ---

/** Converts a comma-separated string number into an integer. */
const formatNumber = (numStr: string | number | undefined): number => {
  if (numStr === undefined || numStr === null) return 0;
  return parseInt(numStr.toString().replace(/,/g, ""), 10) || 0;
};

/** Parses date strings (DD/MM/YYYY) into Date objects. */
const parseDate = (dateStr: string | undefined): Date => {
  if (!dateStr) return new Date(0); // Return epoch start for safety
  
  // Check if date matches DD/MM/YYYY format
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isNaN(date.getTime()) ? new Date(0) : date;
  } 
  
  // Fallback for ISO strings or other formats if DB format changes
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date(0) : date;
};

/** Processes raw API/mock data item into a standardized format. */
const processItem = (item: RawCampaignItem): ProcessedCampaignItem => {
  const executionDateStr = item.execution_date || item.ExecutionDate;
  const campaignSizeStr = item.campaign_size || item.CampaignSize;
  const uploadDateStr = item.upload_date || item.createdAt || executionDateStr;

  return {
    execution_date: parseDate(executionDateStr),
    campaign_size: formatNumber(campaignSizeStr),
    upload_date: parseDate(uploadDateStr),
  };
};

/** Calculates the start date of the week (Sunday assumed) for a given date. */
const getWeekStartDate = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0 for Sunday, 6 for Saturday
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

/** Formats a date range for tooltip display. */
const getWeekRangeString = (date: Date): string => {
  const start = getWeekStartDate(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const startFormat = `${start.getDate()} ${start.toLocaleString("default", {
    month: "short",
  })} ${start.getFullYear()}`;
  const endFormat = `${end.getDate()} ${end.toLocaleString("default", {
    month: "short",
  })} ${end.getFullYear()}`;

  return `${startFormat} - ${endFormat}`;
};

/** Gets a simple label for the week (e.g., Week 48, 2025). */
const getWeekLabel = (date: Date): string => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `W${weekNumber} (${d.getFullYear()})`;
};

// --- Component ---
function ChampaignHome() {
  const [campaignData, setCampaignData] = useState<CampaignData>({
    whatsapp: [],
    sms: [],
    calls: [],
  });
  const [statsData, setStatsData] = useState<Stat[]>([]);
  // Fix: Explicitly type chartData or let TS infer correctly
  const [loading, setLoading] = useState(true);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>(
    TIME_PERIODS.MONTH
  );
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: null,
    end: null,
  });

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // REPLACE THIS URL WITH YOUR ACTUAL API ENDPOINT
        const response = await axiosInstance.get("/champaings/dashboard-stats") 
        
        if (!response.data) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.data;

        if (result.success && result.data) {
             const processedData: CampaignData = {
                whatsapp: result.data.whatsapp.map(processItem),
                sms: result.data.sms.map(processItem),
                calls: result.data.calls.map(processItem),
            };
            setCampaignData(processedData);
        }

      } catch (error) {
        console.error("Error fetching campaign data:", error);
        // Optional: Set empty state or error state here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array: fetch once on mount. 
  // We fetch ALL data once, then filter in memory using getChannelDataByDate.

  // --- Stats Calculation Effect ---
  useEffect(() => {
    const updateStats = (data: CampaignData) => {
      const whatsappSize = data.whatsapp.reduce(
        (sum, item) => sum + item.campaign_size,
        0
      );
      const smsSize = data.sms.reduce(
        (sum, item) => sum + item.campaign_size,
        0
      );
      const callsSize = data.calls.reduce(
        (sum, item) => sum + item.campaign_size,
        0
      );

      const stats: Stat[] = [
        {
          icon: <FaWhatsapp />,
          value: whatsappSize.toLocaleString(),
          count: data.whatsapp.length,
          label: "WhatsApp Campaigns",
          bgColor: "bg-purple-600",
          iconColor: "#fff",
        },
        {
          icon: <FaSms />,
          value: smsSize.toLocaleString(),
          count: data.sms.length,
          label: "SMS Campaigns",
          bgColor: "bg-teal-500",
          iconColor: "#fff",
        },
        {
          icon: <FaPhoneAlt />,
          value: callsSize.toLocaleString(),
          count: data.calls.length,
          label: "OBD Campaigns",
          bgColor: "bg-blue-500",
          iconColor: "#fff",
        },
      ];

      setStatsData(stats);
    };

    if (!loading) {
      updateStats(campaignData);
    }
  }, [campaignData, loading]);

  // --- Chart Data Processing ---
  const getChannelDataByDate = (
    items: ProcessedCampaignItem[],
    period: TimePeriod
  ): Record<string, number> => {
    const groupedByPeriod: Record<string, number> = {};

    // 1. Filter by Custom Date Range if active
    const filteredItems = items.filter((item) => {
      if (showCustomRange && dateRange.start && dateRange.end) {
        // Parse the input dates (YYYY-MM-DD from HTML input)
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999); // Include the full end day
        return item.execution_date >= start && item.execution_date <= end;
      }
      return true;
    });

    // 2. Group by Time Period
    filteredItems.forEach((item) => {
      let periodKey: string = "";
      const date = item.execution_date;

      if (date.getTime() === 0) return; // Skip invalid dates

      if (period === TIME_PERIODS.YEAR) {
        periodKey = date.getFullYear().toString();
      } else if (period === TIME_PERIODS.MONTH) {
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      } else if (period === TIME_PERIODS.WEEK) {
        const weekStart = getWeekStartDate(date);
        periodKey = weekStart.toISOString().split("T")[0];
      } else if (period === TIME_PERIODS.DAY) {
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      } else {
        // Fallback for when no specific period is selected (Custom range only)
        // Group by day for custom range visualization usually looks best
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      }

      groupedByPeriod[periodKey] =
        (groupedByPeriod[periodKey] || 0) + item.campaign_size;
    });

    return groupedByPeriod;
  };

  const processChartData = useMemo(() => {
    if (loading) return { labels: [], datasets: [], rawPeriods: [] };

    // Determine what logic to use
    const activePeriod = selectedTimePeriod || TIME_PERIODS.DAY; // Default to Day for custom view

    const whatsappData = getChannelDataByDate(
      campaignData.whatsapp,
      activePeriod
    );
    const smsData = getChannelDataByDate(campaignData.sms, activePeriod);
    const callsData = getChannelDataByDate(
      campaignData.calls,
      activePeriod
    );

    const allPeriods = Array.from(
      new Set([
        ...Object.keys(whatsappData),
        ...Object.keys(smsData),
        ...Object.keys(callsData),
      ])
    );

    // Sort periods chronologically
    const sortedPeriods = allPeriods.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const labels = sortedPeriods.map((period) => {
      const date = new Date(period);
      if (activePeriod === TIME_PERIODS.YEAR) return period;
      if (activePeriod === TIME_PERIODS.MONTH)
        return date.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });
      if (activePeriod === TIME_PERIODS.WEEK) return getWeekLabel(date);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    });

    const chartDataResult: ChartData<"bar"> & { rawPeriods: string[] } = {
      labels: labels,
      datasets: [
        {
          label: "WhatsApp",
          data: sortedPeriods.map((period) => whatsappData[period] || 0),
          backgroundColor: "rgba(126, 34, 206, 0.8)", // Tailwind purple-600
          borderRadius: 4,
        },
        {
          label: "SMS",
          data: sortedPeriods.map((period) => smsData[period] || 0),
          backgroundColor: "rgba(20, 184, 166, 0.8)", // Tailwind teal-500
          borderRadius: 4,
        },
        {
          label: "OBD (Calls)",
          data: sortedPeriods.map((period) => callsData[period] || 0),
          backgroundColor: "rgba(59, 130, 246, 0.8)", // Tailwind blue-500
          borderRadius: 4,
        },
      ],
      rawPeriods: sortedPeriods,
    };

    return chartDataResult;
  }, [campaignData, selectedTimePeriod, loading, showCustomRange, dateRange]);

  // --- Event Handlers ---
  const handleTimePeriodChange = (period: TimePeriod) => {
    setSelectedTimePeriod(period);
    setShowCustomRange(false);
    setDateRange({ start: null, end: null });
  };

  const toggleCustomRange = () => {
    const newState = !showCustomRange;
    setShowCustomRange(newState);
    if (newState) {
      setSelectedTimePeriod(null); // Deselect fixed period when custom is active
    } else {
      setDateRange({ start: null, end: null });
      setSelectedTimePeriod(TIME_PERIODS.MONTH); // Revert to default
    }
  };

  const handleDateRangeChange = (type: "start" | "end", value: string) => {
    setDateRange((prev) => ({ ...prev, [type]: value }));
  };

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItems: any) => {
              const index = tooltipItems[0].dataIndex;
              
              const rawPeriod = processChartData.rawPeriods?.[index];
              if (!rawPeriod) return "";

              if (selectedTimePeriod === TIME_PERIODS.YEAR)
                return `Year: ${rawPeriod}`;
              if (selectedTimePeriod === TIME_PERIODS.MONTH)
                return new Date(rawPeriod).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                });
              if (selectedTimePeriod === TIME_PERIODS.WEEK)
                return getWeekRangeString(new Date(rawPeriod));
              return new Date(rawPeriod).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              });
            },
            footer: (tooltipItems: any) => {
              const total = tooltipItems.reduce(
                (sum: number, item: any) => sum + item.parsed.y,
                0
              );
              return `Total: ${total.toLocaleString()}`;
            },
            label: (context: any) =>
              `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`,
          },
        },
        legend: {
          position: "top" as const,
          labels: {
            boxWidth: 12,
            font: {
              weight: "bold" as const,
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            maxTicksLimit: 12,
            color: "#6B7280",
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            callback: (value: any) => {
              if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
              if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
              return value;
            },
            color: "#6B7280",
          },
        },
      },
    }),
    [processChartData, selectedTimePeriod]
  );

  // --- Render JSX ---
  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* --- 1. Stats Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className={`relative ${stat.bgColor} text-white shadow-xl rounded-xl p-6 flex items-center justify-between transition duration-300 hover:scale-[1.02]`}
              >
                <div className="flex-1">
                  <p className="text-xl font-medium opacity-80 mb-1">
                    {stat.label}
                  </p>
                  <div className="text-4xl font-extrabold mb-1 tracking-wide">
                    {stat.value}
                  </div>
                  <p className="text-sm opacity-90">
                    Total Campaigns: {stat.count}
                  </p>
                </div>
                <div className="text-6xl opacity-30 absolute right-4 top-1/2 transform -translate-y-1/2">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* --- 2. Chart Controls Card --- */}
          <div className="bg-white shadow-lg rounded-xl mb-6 p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Campaign Volume Analytics
              </h2>

              {/* Controls */}
              <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                {/* Fixed Period Buttons */}
                <div className="flex space-x-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
                  {Object.values(TIME_PERIODS).map((period) => (
                    <button
                      key={period}
                      onClick={() => handleTimePeriodChange(period)}
                      disabled={showCustomRange}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition duration-150 ${
                        selectedTimePeriod === period && !showCustomRange
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Custom Date Toggle */}
                <button
                  onClick={toggleCustomRange}
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition duration-150 ${
                    showCustomRange
                      ? "bg-pink-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <FaCalendarAlt className="w-4 h-4 mr-2" /> Custom Date
                </button>
              </div>
            </div>

            {/* Custom Date Range Input Row */}
            {showCustomRange && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Select Range:
                </label>
                <input
                  type="date"
                  value={dateRange.start || ""}
                  onChange={(e) =>
                    handleDateRangeChange("start", e.target.value)
                  }
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Start Date"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end || ""}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="End Date"
                />
              </div>
            )}
          </div>

          {/* --- 3. Bar Chart --- */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <svg
                  className="animate-spin h-8 w-8 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-3 text-gray-600">
                  Loading campaign analytics...
                </span>
              </div>
            ) : processChartData.datasets.length > 0 &&
              processChartData.labels?.length ? (
              <div className="h-[500px]">
                <Bar data={processChartData} options={chartOptions} />
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 text-lg">
                No campaign data available for the selected period or range.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChampaignHome;