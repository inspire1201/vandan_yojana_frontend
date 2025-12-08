import React, { useEffect, useState, useRef, useMemo } from 'react';
import {  FaChartPie, FaFilePdf, FaSearch, FaPhoneVolume, FaCheckCircle } from 'react-icons/fa';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axiosInstance from '../../service/axiosInstance';

// --- Type Definitions ---
interface Campaign {
  sn: number;
  user_id: string;
  type: string;
  campaign_id: string;
  campaign_name: string;
  content_type: string;
  campaign_size: string;
  sent_count: string;
  delivered_count: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | string;
  execution_date: string;
  execution_time: string;
  channels: string;
  campaign_report?: string;
}

interface AnalyticsData {
  name: string;
  value: number;
  [key: string]: any; // Index signature for recharts compatibility
}

interface CampaignStats {
  totalSent: number;
  totalDelivered: number;
}

// --- Constants ---
const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444']; // Indigo, Green, Amber, Red
const ITEMS_PER_PAGE = 10;

// --- Helper Functions ---
const formatDateTime = (dateString: string | undefined, timeString: string | undefined): { date: string; time: string } => {
  if (!dateString || !timeString) return { date: 'N/A', time: 'N/A' };

  try {
    const [day, month, year] = dateString.split('/');
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));

    if (isNaN(date.getTime())) return { date: dateString, time: timeString };

    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    };
  } catch (e: any) {
    return { date: dateString, time: timeString };
  }
};

const parseCount = (countString: string | undefined): number => {
  if (!countString) return 0;
  return parseInt(countString.replace(/,/g, '')) || 0;
};


// --- Component ---
function CallingCampaigns() {
  const [data, setData] = useState<Campaign[]>([]);
  // State for the top cards
  const [stats, setStats] = useState<CampaignStats>({ totalSent: 0, totalDelivered: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const chartRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {

    const fetchData = async () => {
      try {
        // Calling your API endpoint with type="Calling"
        const response = await axiosInstance.get("/champaings", {
          params: { type: 'Calling' }
        });

        // 1. Extract List Data
        const sourceData = response.data && response.data.allChampaigns ? response.data.allChampaigns : [];

        // 2. Extract Stats Data (Matches your JSON response)
        const totalSent = response.data.totalSent || 0;
        const totalDelivered = response.data.totalDelivered || 0;
        setStats({ totalSent, totalDelivered });

        // 3. Process List Data (Date Formatting)
        const processedData = sourceData.map((item: any) => {
          const { date, time } = formatDateTime(item.execution_date, item.execution_time);
          return { ...item, execution_date: date, execution_time: time } as Campaign;
        });

        setData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Fallback to sample
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Memoized Data ---
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.campaign_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // --- Analytics Logic ---
  const handleShowAnalytics = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowAnalytics(true);
  };

  const handleCloseAnalytics = () => {
    setShowAnalytics(false);
    setSelectedCampaign(null);
  };

  const getAnalyticsData = (campaign: Campaign): AnalyticsData[] => {
    if (!campaign) return [];
    const sent = parseCount(campaign.sent_count);
    const delivered = parseCount(campaign.delivered_count);
    const failed = Math.max(0, sent - delivered);
    return [
      { name: 'Delivered', value: delivered },
      { name: 'Failed', value: failed },
      { name: 'Remaining Sent', value: sent - delivered },
    ].filter(item => item.value > 0);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-semibold text-xs">
        {`${name.replace(' Remaining Sent', '')}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  
  
  /* Updated handleExportAnalytics to include readable text details */
  const handleExportAnalytics = async () => {
    if (!selectedCampaign || !chartRef.current) return;
    try {
      setExportLoading(true);
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text(`Analytics Report`, 105, 20, { align: 'center' });

      // Campaign Details Section
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);

      const startY = 40;
      const lineHeight = 10;

      pdf.text(`Campaign Name: ${selectedCampaign.campaign_name}`, 20, startY);
      pdf.text(`Campaign ID: ${selectedCampaign.campaign_id}`, 20, startY + lineHeight);
      pdf.text(`Current Status: ${selectedCampaign.status}`, 20, startY + lineHeight * 2);
      pdf.text(`Execution Date: ${selectedCampaign.execution_date}`, 20, startY + lineHeight * 3);

      // Stats
      pdf.text(`Total Sent: ${selectedCampaign.sent_count}`, 120, startY + lineHeight);
      pdf.text(`Total Delivered: ${selectedCampaign.delivered_count}`, 120, startY + lineHeight * 2);

      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      // Add Chart below details
      pdf.text(`Visual Analysis:`, 20, startY + lineHeight * 5);
      pdf.addImage(imgData, 'PNG', 15, startY + lineHeight * 6, 180, 100);

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated Just Now`, 105, 280, { align: 'center' });

      pdf.save(`Analytics_${selectedCampaign.campaign_name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) { console.error(error); }
    finally { setExportLoading(false); }
  };

  const renderPagination = () => {
    const pages = [];
    // Basic logic to prevent too many pages showing
    let startPage = 1, endPage = totalPages;
    if (totalPages > 5) {
      if (currentPage <= 3) endPage = 5;
      else if (currentPage >= totalPages - 2) startPage = totalPages - 4;
      else { startPage = currentPage - 2; endPage = currentPage + 2; }
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex gap-1">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100">Prev</button>
        {pages.map(p => (
          <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 border rounded ${p === currentPage ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'hover:bg-gray-100'}`}>{p}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
      </div>
    )
  };


  // --- Main Render ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            📞 Calling Campaigns
          </h2>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* --- Stats Summary Cards (Matching WhatsApp Style) --- */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Sent Card (Indigo Theme) */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500 flex items-center justify-between transition hover:shadow-lg">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Calls Sent</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.totalSent.toLocaleString()}
                </h3>
              </div>
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                <FaPhoneVolume className="w-8 h-8" />
              </div>
            </div>

            {/* Total Delivered Card (Green/Teal Theme) */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500 flex items-center justify-between transition hover:shadow-lg">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Delivered</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.totalDelivered.toLocaleString()}
                </h3>
              </div>
              <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
                <FaCheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>
        )}

        {/* --- Main Table Card --- */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className="p-0">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className="mt-4 text-gray-500">Loading campaign data...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['SN', 'Campaign ID', 'Name', 'Type', 'Sent', 'Status', 'Size', 'Channels', 'Date', 'Time', 'Delivered', 'Download Report'].map(header => (
                          <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => {
                          const serialNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                          const statusColor = row.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
                          return (
                            <tr key={row.campaign_id + index} className="hover:bg-gray-50 transition duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{serialNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.campaign_id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{row.campaign_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.type}</td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{row.sent_count}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColor}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.campaign_size}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.channels}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.execution_date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.execution_time}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{row.delivered_count}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex space-x-2">
                                  <a
                                    href={`https://ranneeti.in/nikay_25/obd/reports//${row.campaign_name}.zip`}

                                    download
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                                  >
                                    Download report
                                  </a>
                                  <button
                                    onClick={() => handleShowAnalytics(row)}
                                    className="p-2 text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition shadow-sm"
                                    title="View Analytics"
                                  >
                                    <FaChartPie className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={13} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              <p className="text-lg font-medium">No campaigns found</p>
                              <p className="text-sm">Try adjusting your search terms.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* --- Pagination Footer --- */}
                <footer className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Showing <span className="font-semibold text-gray-900">{paginatedData.length}</span> of <span className="font-semibold text-gray-900">{filteredData.length}</span> entries
                  </div>
                  {totalPages > 1 && renderPagination()}
                </footer>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Analytics Modal (Using Indigo Theme) --- */}
      {showAnalytics && selectedCampaign && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">
                Analytics: {selectedCampaign.campaign_name}
              </h3>
              <button onClick={handleCloseAnalytics} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Chart */}
                <div ref={chartRef} className="w-full lg:w-3/5 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getAnalyticsData(selectedCampaign)}
                        cx="50%" cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getAnalyticsData(selectedCampaign).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Details */}
                <div className="w-full lg:w-2/5 space-y-4">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-4 text-lg">Campaign Summary</h4>
                    <div className="space-y-3 text-sm">
                      <DetailRow label="ID" value={selectedCampaign.campaign_id} />
                      <DetailRow label="Type" value={selectedCampaign.type} />
                      <DetailRow label="Status" value={<span className="text-emerald-600 font-bold">{selectedCampaign.status}</span>} />
                      <div className="my-2 border-t border-gray-200"></div>
                      <DetailRow label="Sent" value={selectedCampaign.sent_count} />
                      <DetailRow label="Delivered" value={selectedCampaign.delivered_count} />
                      <DetailRow label="Size" value={selectedCampaign.campaign_size} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={handleExportAnalytics}
                disabled={exportLoading}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow-sm flex items-center"
              >
                {exportLoading ? 'Exporting...' : <><FaFilePdf className="mr-2" /> Export PDF</>}
              </button>
              <button onClick={handleCloseAnalytics} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DetailRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);

export default CallingCampaigns;