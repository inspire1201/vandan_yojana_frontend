import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 

  CheckCircle2, 
  Layers,
  MapPin,
  Users,
  Vote,
  ChevronDown,
  ChevronRight,
  Filter
} from "lucide-react";
import axiosInstance from "../../service/axiosInstance";

// --- Types ---

interface ItemMetadata {
  id: string | number;
  name: string;
  childType: string;
  childId: string | number;
  childName: string;
  vidhanSabha: string;
  vidId: number;
  manId: number;
  manName: string;
  sakId: number;
  sakName: string;
  btId: number;
  btName: string;
  [key: string]: any;
}

interface Node {
  id: string;
  name: string;
  type: string;
  children?: Node[];
  metadata: Partial<ItemMetadata>;
  booths: ItemMetadata[];
}

interface ApiData {
  smdata: any[];
  cludata: any[];
  vddata: any[];
}

type SectionType = "cluster" | "sambhag";
type SortDirection = "asc" | "desc" | null;

interface SortConfig {
  key: keyof ItemMetadata | null;
  direction: SortDirection;
}



// --- Components ---

const Spinner: React.FC = () => (
  <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
);

// Optimized TreeNode
const TreeNode: React.FC<{
  node: Node;
  level: number;
  expandedNodes: Set<string>;
  selectedItemsMap: Map<string, ItemMetadata>;
  handleToggle: (nodeId: string) => void;
  handleCheck: (node: Node) => void;
  getItemKey: (item: ItemMetadata) => string;
  loading: boolean;
}> = React.memo(({ node, level, expandedNodes, selectedItemsMap, handleToggle, handleCheck, getItemKey, loading }) => {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const allBooths = node.booths || [];
  
  const selectedCount = useMemo(() => {
    let count = 0;
    for (const b of allBooths) {
      if (selectedItemsMap.has(getItemKey(b))) count++;
    }
    return count;
  }, [allBooths, selectedItemsMap, getItemKey]);

  const isFullyChecked = allBooths.length > 0 && selectedCount === allBooths.length;
  const isPartiallyChecked = selectedCount > 0 && selectedCount < allBooths.length;

  const handleNodeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && !loading) {
      handleToggle(node.id);
    }
  }, [hasChildren, loading, handleToggle, node.id]);

  const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) {
      handleCheck(node);
    }
  }, [loading, handleCheck, node]);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div 
        className={`flex items-center p-2 transition-colors duration-150 cursor-pointer ${level === 0 ? 'bg-orange-50/40' : 'hover:bg-gray-50'} ${isFullyChecked ? 'bg-blue-50/50' : ''}`}
        style={{ paddingLeft: `${8 + level * 24}px` }}
        onClick={handleNodeClick}
      >
        <div className="relative flex items-center justify-center w-5 h-5 mr-3" onClick={handleCheckboxClick}>
          <input
            type="checkbox"
            checked={isFullyChecked}
            ref={(el) => { if (el) el.indeterminate = isPartiallyChecked; }}
            readOnly
            disabled={loading}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
          />
        </div>

        <div className={`mr-2 text-gray-400 w-4 h-4 flex items-center justify-center ${hasChildren ? '' : 'invisible'}`}>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isFullyChecked ? 'text-blue-700' : 'text-gray-700'}`}>
              {node.name}
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider border px-1 rounded">
              {node.type}
            </span>
          </div>
        </div>

        {allBooths.length > 0 && (
           <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${
             selectedCount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
           }`}>
             {selectedCount}/{allBooths.length}
           </span>
         )}
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              selectedItemsMap={selectedItemsMap}
              handleToggle={handleToggle}
              handleCheck={handleCheck}
              getItemKey={getItemKey}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// --- Main Component ---

const HierarchyDropdownTable: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  // Data States
  const [activeSection, setActiveSection] = useState<SectionType>("cluster");
  const [apiData, setApiData] = useState<ApiData>({ smdata: [], cludata: [], vddata: [] });
  const [tree, setTree] = useState<Node[]>([]);
  
  // Selection States
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, ItemMetadata>>(new Map());
  
  // UI States
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submissionLoading, setSubmissionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Table States
  const [searchInput, setSearchInput] = useState<string>(""); // Immediate input
  const [debouncedSearch, setDebouncedSearch] = useState<string>(""); // Delayed search
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);

  // --- Debounce Effect for Search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1); // Reset page on search
    }, 300); // 300ms delay
    return () => clearTimeout(timer);
  }, [searchInput]);

  // --- Helpers ---
  const getItemKey = useCallback((item: ItemMetadata): string =>
    `${item.id}-${item.childId}-${item.vidId}-${item.manId}-${item.sakId}-${item.btId}`, []);

  const groupBy = useCallback((array: any[], key: string) => 
    array.reduce((acc, item) => {
      const gk = item[key];
      if (!acc[gk]) acc[gk] = [];
      acc[gk].push(item);
      return acc;
    }, {} as Record<string, any[]>), []);

  // --- Tree Builder ---
  const buildTree = useCallback((data: any[], section: SectionType, vddata: any[]): Node[] => {
    try {
      if (!data?.length || !vddata?.length) return [];
      const isCluster = section === "cluster";
      const pidKey = isCluster ? 'CLUS_ID' : 'SAM_ID';
      const pnmKey = isCluster ? 'CLUS_NM' : 'SAM_NM';
      const cidKey = isCluster ? 'LOK_ID' : 'JILA_ID';
      const cnmKey = isCluster ? 'LOK_NM' : 'JILA_NM';
      const childType = isCluster ? "lok" : "jila";

      const vddataByVid = groupBy(vddata, 'VID_ID');
      const primaryGroups = groupBy(data, pidKey);
      const rootNodes: Node[] = [];

      Object.values(primaryGroups).forEach((pg: any) => {
        const pi = pg[0];
        const primaryNode: Node = {
          id: `${section}-${pi[pidKey]}`, name: pi[pnmKey], type: section, children: [],
          metadata: { id: pi[pidKey], name: pi[pnmKey], childType }, booths: [],
        };

        const childGroups = groupBy(pg, cidKey);
        Object.values(childGroups).forEach((cg: any) => {
          const ci = cg[0];
          const childNode: Node = {
            id: `${section}-child-${ci[cidKey]}`, name: ci[cnmKey], type: childType, children: [],
            metadata: { ...primaryNode.metadata, childId: ci[cidKey], childName: ci[cnmKey] }, booths: [],
          };

          const vidGroups = groupBy(cg, 'VID_ID');
          Object.values(vidGroups).forEach((vg: any) => {
            const vi = vg[0];
            const vidNode: Node = {
              id: `vid-${vi.VID_ID}`, name: vi.VID_NM, type: "vid", children: [],
              metadata: { ...childNode.metadata, vidhanSabha: vi.VID_NM, vidId: vi.VID_ID }, booths: [],
            };

            const vddataForVid = vddataByVid[vi.VID_ID] || [];
            const mandalGroups = groupBy(vddataForVid, 'MAN_ID');

            Object.values(mandalGroups).forEach((mg: any) => {
              const mi = mg[0];
              const mandalNode: Node = {
                id: `mandal-${mi.MAN_ID}`, name: mi.MAN_NM, type: "mandal", children: [],
                metadata: { ...vidNode.metadata, manId: mi.MAN_ID, manName: mi.MAN_NM }, booths: [],
              };

              const sakhaGroups = groupBy(mg, 'SAK_ID');
              Object.values(sakhaGroups).forEach((sg: any) => {
                const si = sg[0];
                const sakhaNode: Node = {
                  id: `sakha-${si.SAK_ID}`, name: si.SAK_NM, type: "shakti", children: [],
                  metadata: { ...mandalNode.metadata, sakId: si.SAK_ID, sakName: si.SAK_NM }, booths: [],
                };

                sakhaNode.children = sg.map((b:any) => {
                  const bm: ItemMetadata = { ...sakhaNode.metadata as ItemMetadata, btId: b.BT_ID, btName: b.BT_NM };
                  return { id: `booth-${b.BT_ID}`, name: b.BT_NM, type: "booth", metadata: bm, booths: [bm] };
                });
                sakhaNode.booths = sakhaNode.children?.map(c => c.metadata as ItemMetadata) || [];
                mandalNode.children!.push(sakhaNode);
              });

              mandalNode.booths = mandalNode.children!.flatMap(c => c.booths);
              vidNode.children!.push(mandalNode);
            });

            vidNode.booths = vidNode.children!.flatMap(c => c.booths);
            childNode.children!.push(vidNode);
          });

          childNode.booths = childNode.children!.flatMap(c => c.booths);
          primaryNode.children!.push(childNode);
        });

        primaryNode.booths = primaryNode.children!.flatMap(c => c.booths);
        rootNodes.push(primaryNode);
      });
      return rootNodes;
    } catch (err) { console.error('Tree Error', err); return []; }
  }, [groupBy]);

  // --- Effects ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        
        const [sm, clu, vd] = await Promise.all([
          // DataService.getSmData(), DataService.getCluData(), DataService.getVdData()
          axiosInstance.get("/admin/smdata",{ headers: { Authorization: `Bearer ${token}` } }),
          axiosInstance.get("/admin/cludata",{ headers: { Authorization: `Bearer ${token}` } }),
          axiosInstance.get("/admin/vddata",{ headers: { Authorization: `Bearer ${token}` } })
        ]);
        const liveData: ApiData = { smdata: sm.data.data || [], cludata: clu.data.data || [], vddata: vd.data.data || [] };
        setApiData(liveData);
      } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!apiData.cludata.length && !apiData.smdata.length) return;
    const data = activeSection === "cluster" ? apiData.cludata : apiData.smdata;
    setTree(buildTree(data, activeSection, apiData.vddata));
    setExpandedNodes(new Set()); setSelectedItemsMap(new Map()); setIsSubmitted(false);
  }, [activeSection, apiData, buildTree]);

  // --- Handlers ---
  const handleToggle = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const ns = new Set(prev);
      ns.has(nodeId) ? ns.delete(nodeId) : ns.add(nodeId);
      return ns;
    });
  }, []);

  const handleCheck = useCallback((node: Node) => {
    setSelectedItemsMap(prev => {
      const nm = new Map(prev);
      const allBooths = node.booths || [];
      if (allBooths.length === 0) return prev;
      const selectedCount = allBooths.filter(b => prev.has(getItemKey(b))).length;
      const isFullyChecked = selectedCount === allBooths.length;
      allBooths.forEach(b => {
        const key = getItemKey(b);
        if (isFullyChecked) nm.delete(key); else nm.set(key, b);
      });
      return nm;
    });
    setIsSubmitted(false);
  }, [getItemKey]);

  const handleSelectAll = useCallback(() => {
    const nm = new Map<string, ItemMetadata>();
    const traverse = (nodes: Node[]) => {
      nodes.forEach(n => {
        n.booths.forEach(b => nm.set(getItemKey(b), b));
        if (n.children) traverse(n.children);
      });
    };
    traverse(tree);
    setSelectedItemsMap(nm);
    setIsSubmitted(false);
  }, [tree, getItemKey]);

  const handleSubmitSelection = useCallback(() => {
    if (selectedItemsMap.size === 0) { alert("Please select booths."); return; }
    setSubmissionLoading(true);
    setTimeout(() => {
      setIsSubmitted(true); setSubmissionLoading(false); setCurrentPage(1);
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [selectedItemsMap]);

  const handleSort = (key: keyof ItemMetadata) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // --- Computed Data ---
  const allSelectedItems = useMemo(() => Array.from(selectedItemsMap.values()), [selectedItemsMap]);
  // console.log("all selectedItems",allSelectedItems);

  // --- SUMMARY STATS (FIXED FOR ID COLLISION) ---
  const summaryStats = useMemo(() => {
    if (!isSubmitted) return null;
    const stats = {
      cluster: new Set<string>(), lokSabha: new Set<string>(), vidhanSabha: new Set<string>(),
      mandal: new Set<string>(), sakha: new Set<string>(), booth: new Set<string>()
    };
    allSelectedItems.forEach(item => {
      stats.cluster.add(String(item.id));
      stats.lokSabha.add(`${item.id}_${item.childId}`);
      stats.vidhanSabha.add(`${item.childId}_${item.vidId}`);
      
      // Fix: Mandal ID depends on Vidhan Sabha
      stats.mandal.add(`${item.vidId}_${item.manId}`);
      
      // Fix: Sakha ID depends on Mandal AND Vidhan Sabha
      stats.sakha.add(`${item.vidId}_${item.manId}_${item.sakId}`);
      
      stats.booth.add(getItemKey(item)); 
    });
    return {
      cluster: stats.cluster.size, lokSabha: stats.lokSabha.size, vidhanSabha: stats.vidhanSabha.size,
      mandal: stats.mandal.size, sakha: stats.sakha.size, booth: stats.booth.size
    };
  }, [allSelectedItems, isSubmitted, getItemKey]);

  // --- ULTRA-FAST SORT & FILTER (Native Operators) ---
  const processedTableData = useMemo(() => {
    if (!isSubmitted) return [];
    let data = [...allSelectedItems];

    // 1. Filter (Debounced & Fast)
    if (debouncedSearch) {
      const lowerQ = debouncedSearch.toLowerCase();
      data = data.filter(item => 
        (item.name && String(item.name).toLowerCase().includes(lowerQ)) ||
        (item.childName && String(item.childName).toLowerCase().includes(lowerQ)) ||
        (item.vidhanSabha && String(item.vidhanSabha).toLowerCase().includes(lowerQ)) ||
        (item.btName && String(item.btName).toLowerCase().includes(lowerQ))
      );
    }

    // 2. Sort (Native JS Operators - The Fastest Method)
    if (sortConfig.key && sortConfig.direction) {
      const { key, direction } = sortConfig;
      const modifier = direction === 'asc' ? 1 : -1;

      data.sort((a, b) => {
        const aVal = a[key!];
        const bVal = b[key!];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        // Numeric Sort (Fastest)
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * modifier;
        }

        // String Sort (Standard Operators - Very Fast)
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return -1 * modifier;
        if (aStr > bStr) return 1 * modifier;
        return 0;
      });
    }

    return data;
  }, [allSelectedItems, isSubmitted, debouncedSearch, sortConfig]);

  const totalPages = Math.ceil(processedTableData.length / rowsPerPage);
  const paginatedData = processedTableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // --- Render Helpers ---

  const SortIcon = ({ column }: { column: keyof ItemMetadata }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 text-gray-400 ml-1" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-orange-600 ml-1" />
      : <ArrowDown className="w-3 h-3 text-orange-600 ml-1" />;
  };

  const TableHeader = ({ label, column }: { label: string, column: keyof ItemMetadata }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none sticky top-0 bg-gray-50"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon column={column} />
      </div>
    </th>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-orange-50"><Spinner /><span className="ml-2">Loading...</span></div>;
  if (error) return <div className="text-red-500 text-center p-10">Error: {error} <button onClick={() => window.location.reload()}>Retry</button></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* STEP 1: SELECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-orange-500" />
              Step 1: Select Hierarchy
            </h1>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between items-center">
               <div className="flex rounded-lg bg-gray-100 p-1 w-full md:w-auto">
                 {(['cluster', 'sambhag'] as SectionType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => { setActiveSection(type); setIsSubmitted(false); }}
                      className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${activeSection === type ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
                    >
                      {type === 'cluster' ? 'Cluster Base' : 'Sambhag Base'}
                    </button>
                  ))}
               </div>
               <div className="flex gap-2 w-full md:w-auto ">
                 <button onClick={() => { setSelectedItemsMap(new Map()); setIsSubmitted(false); }} className="flex-1 md:flex-none px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50">Reset</button>
                 <button onClick={handleSelectAll} className="flex-1 md:flex-none px-4 py-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100">Select All</button>
               </div>
            </div>
            <div className="border rounded-xl  overflow-y-auto custom-scrollbar bg-gray-50/30 p-2">
               {tree.length > 0 ? tree.map(node => <TreeNode key={node.id} node={node} level={0} expandedNodes={expandedNodes} selectedItemsMap={selectedItemsMap} handleToggle={handleToggle} handleCheck={handleCheck} getItemKey={getItemKey} loading={submissionLoading} />) : <div className="p-8 text-center text-gray-400">No data</div>}
            </div>
            <div className="mt-4 flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg border border-blue-100 text-blue-800">
              <span className="text-sm font-medium">{selectedItemsMap.size} Booths selected</span>
              <div className="flex gap-7">

              
              <button onClick={()=>navigate("/show-count")}  className="bg-[green] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
                Show Count
              </button>
              {activeSection === 'cluster' ? (
                <button onClick={()=>{
                   navigate('/cluster-report',{
                    state:allSelectedItems
                   })
                }} disabled={selectedItemsMap.size === 0} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                   Cluster Report
                </button>
              ) : (
                <button onClick={()=>{
                   navigate('/sambhag-report',{
                    state:allSelectedItems
                   })
                }} disabled={selectedItemsMap.size === 0} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                   Sambhag Report
                </button>
              )}
            
              <button onClick={handleSubmitSelection} disabled={selectedItemsMap.size === 0 || submissionLoading} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                {submissionLoading ? <Spinner /> : <CheckCircle2 className="w-4 h-4" />} Submit & View
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: RESULTS */}
        {isSubmitted && summaryStats && (
          <div id="results-section" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               <SummaryCard label={activeSection === 'cluster' ? "Cluster" : "Sambhag"} count={summaryStats.cluster} icon={<MapPin />} color="bg-blue-50 text-blue-700" />
               <SummaryCard label={activeSection === 'cluster' ? "Lok Sabha" : "Jila"} count={summaryStats.lokSabha} icon={<MapPin />} color="bg-indigo-50 text-indigo-700" />
               <SummaryCard label="Vidhan Sabha" count={summaryStats.vidhanSabha} icon={<Layers />} color="bg-purple-50 text-purple-700" />
               <SummaryCard label="Mandal" count={summaryStats.mandal} icon={<Users />} color="bg-pink-50 text-pink-700" />
               <SummaryCard label="shakti" count={summaryStats.sakha} icon={<Users />} color="bg-rose-50 text-rose-700" />
               <SummaryCard label="Booth" count={summaryStats.booth} icon={<Vote />} color="bg-orange-50 text-orange-700" isMain />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
               <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search results..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-0 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-500 whitespace-nowrap">Rows:</span>
                      <select 
                        value={rowsPerPage} 
                        onChange={handleRowsPerPageChange}
                        className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 p-0 cursor-pointer"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full min-w-[800px]">
                   <thead>
                     <tr className="bg-gray-50 border-b border-gray-200">
                       <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 w-16">SN</th>
                       <TableHeader label={activeSection === 'cluster' ? "Cluster/Sambhag" : "Sambhag"} column="name" />
                       <TableHeader label={activeSection === 'cluster' ? "Lok Sabha" : "Jila"} column="childName" />
                       <TableHeader label="Vidhan Sabha" column="vidhanSabha" />
                       <TableHeader label="Mandal" column="manName" />
                       <TableHeader label="shakti" column="sakName" />
                       <TableHeader label="Booth" column="btName" />
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {paginatedData.length > 0 ? (
                       paginatedData.map((item, index) => (
                         <tr key={getItemKey(item)} className="hover:bg-orange-50/40 transition-colors">
                           <td className="px-4 py-3 text-xs text-gray-400 font-mono">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                           <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                           <td className="px-4 py-3 text-sm text-gray-600">{item.childName}</td>
                           <td className="px-4 py-3 text-sm text-gray-600">{item.vidhanSabha}</td>
                           <td className="px-4 py-3 text-sm text-gray-600">{item.manName}</td>
                           <td className="px-4 py-3 text-sm text-gray-600">{item.sakName}</td>
                           <td className="px-4 py-3 text-sm font-medium text-orange-700">{item.btName}</td>
                         </tr>
                       ))
                     ) : (
                       <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No items found</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>

               {/* Pagination */}
               {processedTableData.length > 0 && (
                 <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                   <div className="text-xs text-gray-500">Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></div>
                   <div className="flex gap-2">
                     <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
                     <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                   </div>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, count, icon, color, isMain = false }: { label: string, count: number, icon: React.ReactNode, color: string, isMain?: boolean }) => (
  <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${isMain ? 'bg-white border-orange-200 shadow-sm' : 'bg-white border-gray-100'}`}>
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color} bg-opacity-15`}>{React.cloneElement(icon as any, { className: "w-4 h-4" })}</div>
    </div>
    <div className={`text-2xl font-bold ${isMain ? 'text-orange-600' : 'text-gray-800'}`}>{count}</div>
    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
  </div>
);

export default HierarchyDropdownTable;


