import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../service/axiosInstance';
import { useTranslation } from 'react-i18next';
import Chart from 'chart.js/auto';
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js/auto';

// --- INTERFACES ---
interface BoothSummary {
  totalBooths: number;
  verifiedBooths: number; // isBla2 = 2
  unverifiedBooths: number; // isBla2 = 1
  dummyBooths: number; // isBla2 = 0
  TotalBLa: number; // bla2_name IS NOT NULL
}

interface Assembly {
  id: number;
  assembly_id: number;
  assembly_name: string;
  _count: {
    booths: number;
  };
  boothSummary: BoothSummary;
}

interface AssemblyListProps {
  onAssemblySelect: (assemblyId: number, assemblyName: string) => void;
}

interface PieTooltipContext extends TooltipItem<'pie'> {
    label: string;
    parsed: number;
    dataset: {
        data: number[];
    };
}


// ----------------------------------------------------------------------
// --- 1. AssemblyChart Sub-Component (FIX FOR DYNAMIC CHART ISSUE) ---
// ----------------------------------------------------------------------

interface AssemblyChartProps {
  assembly: Assembly;
  height: string; 
}

const AssemblyChart = ({ assembly, height }: AssemblyChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<'pie', number[], string> | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Individual Chart Data Calculation
    const dataPoints: number[] = [
      assembly.boothSummary.verifiedBooths,
      assembly.boothSummary.unverifiedBooths + assembly.boothSummary.dummyBooths,
      assembly.boothSummary.totalBooths - assembly.boothSummary.TotalBLa,
    ];

    const data: ChartData<'pie', number[], string> = {
      labels: ['Verified', 'Unverified (inc. Dummy)', 'Not Created'],
      datasets: [{
        data: dataPoints,
        backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
        borderColor: ['#059669', '#D97706', '#4B5563'],
        borderWidth: 2
      }]
    };

    const options: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { 
            padding: window.innerWidth < 640 ? 10 : 20, 
            usePointStyle: true,
            font: {
              size: window.innerWidth < 640 ? 10 : 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: PieTooltipContext) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        },
        title: {
          display: true,
          text: `${assembly.assembly_name} Distribution`,
          font: { 
            size: window.innerWidth < 640 ? 12 : 16, 
            weight: 'bold' 
          }
        }
      },
    };

    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options,
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [assembly.id]);

  return (
    <div className="relative" style={{ height: height }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};


// ----------------------------------------------------------------------
// --- 2. AssemblyList Main Component (UPDATED) ---
// ----------------------------------------------------------------------


function AssemblyList({ onAssemblySelect }: AssemblyListProps) {
  const { t } = useTranslation();
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [filteredAssemblies, setFilteredAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'max' | 'min' | 'none'>('none');
  const [selectedAssemblyChart, setSelectedAssemblyChart] = useState<number | null>(null);


  // Chart Ref Typing: Only for the overall chart now
  const overallChartRef = useRef<HTMLCanvasElement | null>(null);
  // Chart Instance Typing: Only for the overall chart now
  const overallChartInstance = useRef<Chart<'pie', number[], string> | null>(null);

  useEffect(() => {
    fetchAssemblies();
  }, []);

  const fetchAssemblies = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/districts/get-all-assembly');
      if (response.data && response.data.data) {
        setAssemblies(response.data.data);
        setFilteredAssemblies(response.data.data);
      }
    } catch (err) {
      setError(t('booth.failedAssemblies'));
      console.error('Error fetching assemblies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Chart Rendering Logic: Simplified to only handle the overall chart
  const renderChart = (
    ref: React.RefObject<HTMLCanvasElement | null>,
    instanceRef: React.MutableRefObject<Chart<'pie', number[], string> | null>,
    assemblyData: Assembly[] 
  ) => {
    if (!ref.current) return;

    // Destroy existing chart instance if it exists
    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }

    // Overall Chart Data Calculation
    const dataPoints: number[] = [
      assemblyData.reduce((sum, assembly) => sum + assembly.boothSummary.verifiedBooths, 0),
      assemblyData.reduce((sum, assembly) => sum + assembly.boothSummary.unverifiedBooths + assembly.boothSummary.dummyBooths, 0),
      assemblyData.reduce((sum, assembly) => sum + (assembly.boothSummary.totalBooths - assembly.boothSummary.TotalBLa), 0),
    ];
    const title: string = 'Total Assembly Data';

    const data: ChartData<'pie', number[], string> = {
      labels: ['Verified', 'Unverified (inc. Dummy)', 'Not Created'],
      datasets: [{
        data: dataPoints,
        backgroundColor: ['#10B981', '#F59E0B', '#6B7280'],
        borderColor: ['#059669', '#D97706', '#4B5563'],
        borderWidth: 2
      }]
    };

    // Tooltip callback with proper type definition (PieTooltipContext)
    const options: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { 
            padding: window.innerWidth < 640 ? 10 : 20, 
            usePointStyle: true,
            font: {
              size: window.innerWidth < 640 ? 10 : 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: PieTooltipContext) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        },
        title: {
          display: true,
          text: title,
          font: { 
            size: window.innerWidth < 640 ? 12 : 16, 
            weight: 'bold' 
          }
        }
      },
    };

    const ctx = ref.current.getContext('2d');
    if (ctx) {
      instanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options,
      });
    }
  };

  // --- Overall Chart Effect ---
  useEffect(() => {
    if (filteredAssemblies.length > 0) {
      renderChart(overallChartRef, overallChartInstance, filteredAssemblies);
    }
    // Cleanup function for overall chart
    return () => {
        if (overallChartInstance.current) {
            overallChartInstance.current.destroy();
            overallChartInstance.current = null;
        }
    };
  }, [filteredAssemblies]);

  // Global Cleanup (on component unmount)
  useEffect(() => {
    return () => {
      if (overallChartInstance.current) overallChartInstance.current.destroy();
    };
  }, []);

  const handleSort = (order: 'max' | 'min') => {
    const sorted = [...assemblies].sort((a, b) => {
      if (order === 'max') {
        return b.boothSummary.TotalBLa - a.boothSummary.TotalBLa;
      } else {
        return a.boothSummary.TotalBLa - b.boothSummary.TotalBLa;
      }
    });
    setFilteredAssemblies(sorted);
    setSortOrder(order);
  };

  const resetSort = () => {
    setFilteredAssemblies(assemblies);
    setSortOrder('none');
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="mt-4 text-gray-600 text-sm sm:text-base">{t('booth.loadingAssemblies')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      
      {/* Enhanced Filter Section (No change needed) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <h4 className="text-sm font-semibold text-gray-800">Sort & Filter</h4>
          </div>
          {sortOrder !== 'none' && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {sortOrder === 'max' ? 'Highest First' : 'Lowest First'}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSort('max')}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortOrder === 'max'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            Highest BLa
          </button>
          
          <button
            onClick={() => handleSort('min')}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortOrder === 'min'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md transform scale-105'
                : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-sm'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            Lowest BLa
          </button>
          
          {sortOrder !== 'none' && (
            <button
              onClick={resetSort}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Stats Header (No change needed) */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('booth.allAssemblies')}</h3>
              <p className="text-sm text-gray-600">{filteredAssemblies.length} {t('booth.assemblies')} available</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{filteredAssemblies.length}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>

      {/* Pie Chart Section - Overall Chart height increased to 350px for desktop (sm:max-w-md, height: 350px) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Total Assembly Data
        </h4>
        <div className="w-full max-w-xs sm:max-w-md mx-auto">
          <div className="relative" style={{ height: window.innerWidth < 640 ? '280px' : '350px' }}> {/* Increased height */}
            {/* Overall Chart Canvas */}
            <canvas ref={overallChartRef}></canvas>
          </div>
          {/* Summary Values */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
            <div className="bg-green-50 p-2 rounded">
              <div className="text-green-700 font-medium">Verified</div>
              <div className="text-green-800 font-bold">
                {filteredAssemblies.reduce((sum, assembly) => sum + assembly.boothSummary.verifiedBooths, 0)}
              </div>
            </div>
            <div className="bg-yellow-50 p-2 rounded">
              <div className="text-yellow-700 font-medium">Unverified</div>
              <div className="text-yellow-800 font-bold">
                {filteredAssemblies.reduce((sum, assembly) => sum + assembly.boothSummary.unverifiedBooths + assembly.boothSummary.dummyBooths, 0)}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-gray-700 font-medium">Not Created</div>
              <div className="text-gray-800 font-bold">
                {filteredAssemblies.reduce((sum, assembly) => sum + (assembly.boothSummary.totalBooths - assembly.boothSummary.TotalBLa), 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
  

      {/* Assembly Grid for Mobile - FIXED Chart Rendering */}
      <div className="block sm:hidden">
        <div className="grid gap-4">
          {filteredAssemblies.map((assembly) => (
            <React.Fragment key={assembly.id}>
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{assembly.assembly_name}</h4>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                    {assembly.boothSummary.totalBooths} {t('booth.booths')}
                  </span>
                </div>
                
                {/* Mobile Summary Details (No change needed) */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4 border-t pt-3">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="text-green-700 font-medium text-xs mb-1">Verified</div>
                    <div className="text-green-800 font-bold text-sm">{assembly.boothSummary.verifiedBooths}</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="text-blue-700 font-medium text-xs mb-1">Total BLa</div>
                    <div className="text-blue-800 font-bold text-sm">{assembly.boothSummary.TotalBLa}</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <div className="text-yellow-700 font-medium text-xs mb-1">Unverified (inc. Dummy)</div>
                    <div className="text-yellow-800 font-bold text-sm">{assembly.boothSummary.unverifiedBooths + assembly.boothSummary.dummyBooths}</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <div className="text-purple-700 font-medium text-xs mb-1">BLa %</div>
                    <div className="text-purple-800 font-bold text-sm">
                      {assembly.boothSummary.totalBooths > 0 
                        ? ((assembly.boothSummary.TotalBLa / assembly.boothSummary.totalBooths) * 100).toFixed(1)
                        : '0.0'
                      }%
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="text-gray-700 font-medium text-xs mb-1">Not Created</div>
                    <div className="text-gray-800 font-bold text-sm">{assembly.boothSummary.totalBooths - assembly.boothSummary.TotalBLa}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onAssemblySelect(assembly.assembly_id, assembly.assembly_name)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Booths
                  </button>
                  <button
                    onClick={() => setSelectedAssemblyChart(selectedAssemblyChart === assembly.id ? null : assembly.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg ${
                      selectedAssemblyChart === assembly.id
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {selectedAssemblyChart === assembly.id ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      )}
                    </svg>
                    {selectedAssemblyChart === assembly.id ? 'Hide' : 'Chart'}
                  </button>
                </div>
              </div>
              
              {/* Individual Assembly Chart - Use the dedicated component */}
              {selectedAssemblyChart === assembly.id && (
                <div className="mt-1 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="w-full max-w-xs mx-auto">
                    <AssemblyChart assembly={assembly} height="300px" /> {/* FIX: Replaced canvas/ref with component */}
                    
                    {/* Individual Assembly Summary Values (No change needed) */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                      <div className="bg-green-50 p-2 rounded">
                        <div className="text-green-700 font-medium">Verified</div>
                        <div className="text-green-800 font-bold">{assembly.boothSummary.verifiedBooths}</div>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded">
                        <div className="text-yellow-700 font-medium">Unverified</div>
                        <div className="text-yellow-800 font-bold">
                          {assembly.boothSummary.unverifiedBooths + assembly.boothSummary.dummyBooths}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-700 font-medium">Not Created</div>
                        <div className="text-gray-800 font-bold">
                          {assembly.boothSummary.totalBooths - assembly.boothSummary.TotalBLa}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Desktop Table - FIXED Chart Rendering */}
      <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200 mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('booth.assemblyName')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('booth.boothCount')}
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider bg-green-50">
                  Verified
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-yellow-700 uppercase tracking-wider bg-yellow-50">
                  Unverified (inc. Dummy)
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-blue-700 uppercase tracking-wider bg-blue-50">
                  Total BLa
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-purple-700 uppercase tracking-wider bg-purple-50">
                  BLa %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('booth.action')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssemblies.map((assembly) => (
                <React.Fragment key={assembly.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{assembly.assembly_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {assembly.boothSummary.totalBooths}
                      </span>
                    </td>
                    
                    {/* NEW SUMMARY COLUMNS (No change needed) */}
                    <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-green-600 bg-green-50/50">
                      {assembly.boothSummary.verifiedBooths}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-yellow-600 bg-yellow-50/50">
                      {assembly.boothSummary.unverifiedBooths + assembly.boothSummary.dummyBooths}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-600 bg-blue-50/50">
                      {assembly.boothSummary.TotalBLa}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-purple-600 bg-purple-50/50">
                      {assembly.boothSummary.totalBooths > 0 
                        ? ((assembly.boothSummary.TotalBLa / assembly.boothSummary.totalBooths) * 100).toFixed(1)
                        : '0.0'
                      }%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onAssemblySelect(assembly.assembly_id, assembly.assembly_name)}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => setSelectedAssemblyChart(selectedAssemblyChart === assembly.id ? null : assembly.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg ${
                            selectedAssemblyChart === assembly.id
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {selectedAssemblyChart === assembly.id ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            )}
                          </svg>
                          {selectedAssemblyChart === assembly.id ? 'Hide' : 'Chart'}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {selectedAssemblyChart === assembly.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-blue-50">
                        <div className="border border-blue-200 rounded-lg p-4">
                          <div className="w-full max-w-xs mx-auto">
                            <AssemblyChart assembly={assembly} height="350px" /> {/* FIX: Replaced canvas/ref with component */}
                            
                            {/* Desktop Individual Assembly Summary Values (No change needed) */}
                            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                              <div className="bg-green-50 p-2 rounded">
                                <div className="text-green-700 font-medium">Verified</div>
                                <div className="text-green-800 font-bold">{assembly.boothSummary.verifiedBooths}</div>
                              </div>
                              <div className="bg-yellow-50 p-2 rounded">
                                <div className="text-yellow-700 font-medium">Unverified</div>
                                <div className="text-yellow-800 font-bold">
                                  {assembly.boothSummary.unverifiedBooths + assembly.boothSummary.dummyBooths}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-gray-700 font-medium">Not Created</div>
                                <div className="text-gray-800 font-bold">
                                  {assembly.boothSummary.totalBooths - assembly.boothSummary.TotalBLa}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssemblyList;