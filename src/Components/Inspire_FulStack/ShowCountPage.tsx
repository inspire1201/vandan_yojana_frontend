import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Filter, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Calculator, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3,
  LayoutGrid,
  List,
  Users,
  ArrowLeft
} from "lucide-react";
import axiosInstance from "../../service/axiosInstance";


// --- 1. TYPE DEFINITIONS ---

interface Option {
  value: string;
  label: string;
}

interface CountItem {
  id: number | string;
  name: string;
  count: number;
  level: string;
  column: string;
  [key: string]: any;
}

interface CountApiResponse {
  totalLevelCount: number;
  totalColumnCount: number;
  countData: CountItem[];
  detailedData: any[];
}

interface DetailItem {
  id?: number | string;
  name: string;
  [key: string]: any;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

// --- 2. MAIN COMPONENT ---

const ShowCountPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  // --- State ---
  const [activeSection, setActiveSection] = useState<"cluster" | "sambhag">("cluster");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Inputs
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  // Data
  const [countData, setCountData] = useState<CountItem[]>([]);
  const [detailedData, setDetailedData] = useState<any[]>([]);
  
  // Metadata
  const [totalLevelCount, setTotalLevelCount] = useState<number>(0);
  const [totalColumnCount, setTotalColumnCount] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Table Interaction (Main)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Popup State
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>("");
  const [popupContent, setPopupContent] = useState<DetailItem[]>([]);
  const [popupSortConfig, setPopupSortConfig] = useState<SortConfig>({ key: null, direction: null });

  // --- 3. HELPERS & CONFIG ---

  const getLevelOptions = useMemo<Option[]>(() => {
    if (activeSection === "sambhag") {
      return [
        { value: "sambhag", label: "Sambhag" },
        { value: "jila", label: "Jila" },
        { value: "vid", label: "Vidhan Sabha" },
        { value: "mandal", label: "Mandal" },
        { value: "sakha", label: "Sakha" },
      ];
    } else {
      return [
        { value: "cluster", label: "Cluster" },
        { value: "lok", label: "Lok Sabha" },
        { value: "vid", label: "Vidhan Sabha" },
        { value: "mandal", label: "Mandal" },
        { value: "sakha", label: "Sakha" },
      ];
    }
  }, [activeSection]);

  const getColumnOptions = useMemo<Option[]>(() => {
    if (!selectedLevel) return [];
    const levels = getLevelOptions;
    const allLevels: Option[] = [...levels, { value: "booth", label: "Booth" }];
    const selectedLevelIndex = allLevels.findIndex((level) => level.value === selectedLevel);
    if (selectedLevelIndex === -1) return [];
    return allLevels.slice(selectedLevelIndex + 1);
  }, [selectedLevel, getLevelOptions]);

  const getLevelLabel = useCallback((value: string): string => {
    const allLevels: Option[] = [...getLevelOptions, { value: "booth", label: "Booth" }];
    const level = allLevels.find((l) => l.value === value);
    return level ? level.label : value;
  }, [getLevelOptions]);

  const getEndpointUrl = useCallback((level: string, column: string): string | null => {
    if (level === 'cluster' && column === 'vid') return 'vidhan-cluster';
    if (level === 'cluster' && column === 'lok') return 'loc-cluster';
    if (level === 'lok' && column === 'vid') return 'vidhan-loc';
    if (level === 'sambhag' && column === 'jila') return 'jila-sambhag';
    if (level === 'sambhag' && column === 'vid') return 'vidhan-sambhag';
    if (level === 'jila' && column === 'vid') return 'vidhan-jila';

    const columnMap: { [key: string]: string } = { 'mandal': 'mandal', 'sakha': 'sakti', 'booth': 'booth' };
    const levelMap: { [key: string]: string } = { 'cluster': 'cluster', 'lok': 'loc', 'vid': 'vidhan', 'sambhag': 'sambhag', 'jila': 'jila', 'mandal': 'mandale', 'sakha': 'sakha' };

    const columnPart = columnMap[column];
    const levelPart = levelMap[level];

    return (columnPart && levelPart) ? `${columnPart}-${levelPart}` : null;
  }, []);

  // --- 4. DATA FETCHING ---

  const generateCountData = async (level: string, column: string) => {
    const endpoint = getEndpointUrl(level, column);
    if (!endpoint) {
      alert("Invalid Level/Column Combination");
      return;
    }

    setIsLoading(true);
    setIsSubmitted(false);
    
    try {
      const response = await axiosInstance.get<CountApiResponse>(`/admin/all-${endpoint}`,{ headers: { Authorization: `Bearer ${token}` }});
      const responseData = response.data;
      
      setCountData(responseData.countData || []);
      setDetailedData(responseData.detailedData || []);
      setTotalLevelCount(responseData.totalLevelCount || 0);
      setTotalColumnCount(responseData.totalColumnCount || 0);
      setIsSubmitted(true);
      setCurrentPage(1);
      setSearchQuery("");
      setSortConfig({ key: null, direction: null });
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setCountData([]);
      setDetailedData([]);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (selectedLevel && selectedColumn) {
      generateCountData(selectedLevel, selectedColumn);
    }
  };

  // --- 5. DETAILS LOGIC (RESTORED FROM PREVIOUS WORKING CODE) ---

  const handleShowDetails = (item: CountItem) => {
    console.log('handleShowDetails called with item:', item);
    
    setShowPopup(true);
    setPopupTitle(`${item.name} - ${getLevelLabel(item.column)} Details`);
    
    // Find the detailed data for this item
    let itemDetails;
    
    if ((item.level === 'mandal' && (item.column === 'sakha' || item.column === 'booth')) || 
        (item.level === 'sakha' && item.column === 'booth')) {
        // Special case for composite IDs: mandal-sakha/booth or sakha-booth
        console.log('Looking for item with composite ID:', item.id);
        itemDetails = detailedData.find(detail => {
            let compositeId;
            if (item.level === 'mandal') {
                compositeId = `${detail.VID_ID}_${detail.MAN_ID}`;
            } else if (item.level === 'sakha') {
                compositeId = `${detail.VID_ID}_${detail.SAK_ID}`;
            }
            return compositeId === item.id;
        });
    } else {
        // Regular matching for other cases
        console.log('Looking for regular match with item.id:', item.id);
        itemDetails = detailedData.find(detail => {
            const detailId = detail.CLUS_ID || detail.SAM_ID || detail.VID_ID || detail.LOK_ID || detail.JILA_ID || detail.MAN_ID || detail.clusterId || detail.sambhagId || detail.jilaId || detail.lokId;
            // Use loose equality (==) to handle string/number mismatch
            return detailId == item.id;
        });
    }
    
    console.log('Found itemDetails:', itemDetails);
    
    if (itemDetails) {
        // Extract the child items based on column type
        let childItems = [];
        if (item.column === 'mandal') {
            childItems = itemDetails.mandals || [];
        } else if (item.column === 'sakha') {
            childItems = itemDetails.sakhas || itemDetails.shakhas || [];
        } else if (item.column === 'booth') {
            childItems = itemDetails.booths || [];
        } else if (item.column === 'vid') {
            childItems = itemDetails.vidhans || [];
        } else if (item.column === 'lok') {
            childItems = itemDetails.loks || [];
        } else if (item.column === 'jila') {
            childItems = itemDetails.jilas || [];
        }
        
        // Transform to DetailItem format
        const transformedItems: DetailItem[] = childItems.map((child: any, index: number) => ({
            id: child.MAN_ID || child.SAK_ID || child.BT_ID || child.VID_ID || child.LOK_ID || child.JILA_ID || index,
            // IMPORTANT: Added fallbacks for naming to prevent "Unknown"
            name: child.MAN_NM || child.SAK_NM || child.BT_NM || child.VID_NM || child.LOK_NM || child.JILA_NM || child.name || 'Unknown'
        }));
        
        setPopupContent(transformedItems);
    } else {
        setPopupContent([]);
    }
    // Reset popup sorting
    setPopupSortConfig({ key: null, direction: null });
  };

  // --- 6. SORTING & FILTERING ---

  const handleSort = (key: string, isPopup = false) => {
    const currentConfig = isPopup ? popupSortConfig : sortConfig;
    const setConfig = isPopup ? setPopupSortConfig : setSortConfig;

    let direction: SortDirection = 'asc';
    if (currentConfig.key === key && currentConfig.direction === 'asc') {
      direction = 'desc';
    }
    setConfig({ key, direction });
  };

  const processData = (data: any[], config: SortConfig, query: string = "") => {
    let processed = [...data];

    // Filter
    if (query) {
      const lowerQ = query.toLowerCase();
      processed = processed.filter(item => 
        String(item.name).toLowerCase().includes(lowerQ)
      );
    }

    // Sort
    if (config.key && config.direction) {
      processed.sort((a, b) => {
        const aVal = a[config.key!];
        const bVal = b[config.key!];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return config.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        if (aStr < bStr) return config.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return config.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return processed;
  };

  const processedCountData = useMemo(() => processData(countData, sortConfig, searchQuery), [countData, sortConfig, searchQuery]);
  const processedPopupData = useMemo(() => processData(popupContent, popupSortConfig), [popupContent, popupSortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedCountData.length / itemsPerPage);
  const paginatedData = processedCountData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- 7. RENDER HELPERS ---

  const SortIcon = ({ config, colKey }: { config: SortConfig, colKey: string }) => {
    if (config.key !== colKey) return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />;
    return config.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1 text-orange-600" /> 
      : <ArrowDown className="w-3 h-3 ml-1 text-orange-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-orange-500" />
                  Count Analysis
                </h1>
                <p className="text-sm text-gray-500 mt-1">Generate reports based on hierarchy levels.</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Tabs */}
            <div className="flex rounded-lg bg-gray-100 p-1 w-full md:w-fit mb-6">
                {(['cluster', 'sambhag'] as const).map((type) => (
                <button
                    key={type}
                    onClick={() => { 
                        setActiveSection(type); 
                        setSelectedLevel(""); 
                        setSelectedColumn(""); 
                        setIsSubmitted(false); 
                    }}
                    className={`px-6 py-2 text-sm font-medium rounded-md transition-all capitalize flex items-center gap-2 ${
                    activeSection === type 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {type === 'cluster' ? <LayoutGrid className="w-4 h-4"/> : <List className="w-4 h-4"/>}
                    {type} Base
                </button>
                ))}
            </div>

            {/* Inputs */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Select Level</label>
                    <select 
                        value={selectedLevel} 
                        onChange={(e) => { setSelectedLevel(e.target.value); setSelectedColumn(""); setIsSubmitted(false); }}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    >
                        <option value="">-- Choose Level --</option>
                        {getLevelOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Select Count Column</label>
                    <select 
                        value={selectedColumn} 
                        onChange={(e) => { setSelectedColumn(e.target.value); setIsSubmitted(false); }}
                        disabled={!selectedLevel}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all disabled:opacity-50"
                    >
                        <option value="">-- Choose Column --</option>
                        {getColumnOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={!selectedLevel || !selectedColumn || isLoading}
                    className="h-[42px] bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <span className="animate-spin">⌛</span> : <Calculator className="w-4 h-4" />}
                    Submit
                </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {isSubmitted && !isLoading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total {getLevelLabel(selectedLevel)}</p>
                            <p className="text-3xl font-bold text-blue-700 mt-1">{totalLevelCount}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <LayoutGrid className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total {getLevelLabel(selectedColumn)}</p>
                            <p className="text-3xl font-bold text-green-700 mt-1">{totalColumnCount}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Table Controls */}
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder={`Search ${getLevelLabel(selectedLevel)}...`}
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                <span className="text-xs text-gray-500 font-medium">Rows:</span>
                                <select 
                                    value={itemsPerPage} 
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 p-0 cursor-pointer"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">SN</th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            {getLevelLabel(selectedLevel)} Name
                                            <SortIcon config={sortConfig} colKey="name" />
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-32"
                                        onClick={() => handleSort('count')}
                                    >
                                        <div className="flex items-center justify-center">
                                            {getLevelLabel(selectedColumn)} Count
                                            <SortIcon config={sortConfig} colKey="count" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-orange-50/30 transition-colors group">
                                            <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 group-hover:text-orange-700">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-center text-gray-700 bg-gray-50/50 rounded-md">
                                                {item.count}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleShowDetails(item)}
                                                    disabled={item.count === 0}
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                                        item.count === 0
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm'
                                                    }`}
                                                >
                                                    <Eye className="w-3 h-3" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 bg-gray-50/30">
                                            <Filter className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p>No data found.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {paginatedData.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                                Page <span className="font-bold">{currentPage}</span> of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- POPUP MODAL --- */}
        {showPopup && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                    {/* Modal Header */}
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <List className="w-5 h-5 text-orange-500" />
                            {popupTitle}
                        </h3>
                        <button 
                            onClick={() => setShowPopup(false)}
                            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Modal Content (Scrollable Table) */}
                    <div className="overflow-y-auto p-0 flex-1 custom-scrollbar">
                        {popupContent.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 sticky top-0 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase w-16">#</th>
                                        <th 
                                            className="px-6 py-3 text-xs font-bold text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('name', true)}
                                        >
                                            <div className="flex items-center">
                                                Name <SortIcon config={popupSortConfig} colKey="name" />
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {processedPopupData.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-xs text-gray-400 font-mono">{index + 1}</td>
                                            <td className="px-6 py-3 text-sm text-gray-700">{item.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-10 text-center text-gray-400">
                                <p>No details available</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="p-3 border-t border-gray-100 bg-gray-50 text-right">
                        <span className="text-xs text-gray-500 mr-4">{popupContent.length} items found</span>
                        <button 
                            onClick={() => setShowPopup(false)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ShowCountPage;