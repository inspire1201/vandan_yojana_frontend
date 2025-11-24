




// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   ChevronDown, ChevronRight, Filter, Loader2, MapPin, Layers, Users, Vote, Search, ChevronUp
// } from "lucide-react";
// // ⚠️ ASSUMED IMPORT PATH: Adjust this path to where your hierarchyService file is located
// import { hierarchyService } from "../../service/hierarchy.service"; 


// // --- Interfaces & Types ---

// interface ItemMetadata {
//   id: string | number;
//   name: string;
//   type: string; // cluster, lok, vid, mandal, sakha, booth

//   // Hierarchy Tracking IDs
//   clusterId?: number;
//   sambhagId?: number;
//   lokId?: number;
//   jilaId?: number;
//   vidId?: number;
//   manId?: number;
//   sakId?: number;
//   btId?: number;

//   // Display Names for Table
//   clusterName?: string;
//   sambhagName?: string;
//   lokName?: string;
//   jilaName?: string;
//   vidName?: string;
//   manName?: string;
//   sakName?: string;
//   btName?: string;
// }

// interface Node {
//   id: string;
//   name: string;
//   type: string;
//   children?: Node[]; 
//   isLeaf?: boolean;  
//   metadata: ItemMetadata;
// }

// type SectionType = "cluster" | "sambhag";
// type SortDirection = "asc" | "desc" | null;

// interface SortConfig {
//   key: keyof ItemMetadata | null;
//   direction: SortDirection;
// }

// interface SummaryStats {
//     cluster: number;
//     sambhag: number;
//     lokSabha: number;
//     jila: number;
//     vidhanSabha: number;
//     mandal: number;
//     sakha: number;
//     booth: number;
// }


// // --- Helper Components ---

// const Spinner: React.FC = () => (
//   <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
// );

// const SummaryCard = ({ label, count, icon, color, isMain = false }: { label: string, count: number, icon: React.ReactNode, color: string, isMain?: boolean }) => (
//   <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${isMain ? 'bg-white border-orange-200 shadow-sm' : 'bg-white border-gray-100'}`}>
//     <div className="flex items-center justify-between mb-2">
//       <div className={`p-2 rounded-lg ${color} bg-opacity-15`}>{React.cloneElement(icon as any, { className: "w-4 h-4" })}</div>
//     </div>
//     <div className={`text-2xl font-bold ${isMain ? 'text-orange-600' : 'text-gray-800'}`}>{count}</div>
//     <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
//   </div>
// );

// const TableHeader: React.FC<{ label: string; column: keyof ItemMetadata; currentSort: SortConfig; onSort: (key: keyof ItemMetadata) => void }> = ({ label, column, currentSort, onSort }) => {
//   const isSorted = currentSort.key === column;
//   return (
//     <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 cursor-pointer" onClick={() => onSort(column)}>
//       <div className="flex items-center gap-1 whitespace-nowrap">
//         {label}
//         {isSorted && (
//           currentSort.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
//         )}
//       </div>
//     </th>
//   );
// };


// // --- Recursive Tree Node Component ---
// const TreeNode: React.FC<{
//   node: Node;
//   level: number;
//   expandedNodes: Set<string>;
//   loadingNodes: Set<string>;
//   selectedItemsMap: Map<string, ItemMetadata>;
//   onExpand: (node: Node) => void;
//   onCheck: (node: Node) => void;
// }> = React.memo(({ node, level, expandedNodes, loadingNodes, selectedItemsMap, onExpand, onCheck }) => {

//     const isExpanded = expandedNodes.has(node.id);
//     const isLoading = loadingNodes.has(node.id);
//     // Node is checked if its ID exists in the selection map
//     const isChecked = selectedItemsMap.has(node.id);

//     const handleNodeClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         if (!node.isLeaf) {
//             onExpand(node);
//         }
//     };

//     const handleCheckboxClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         onCheck(node);
//     };

//     return (
//         <div className="border-b border-gray-100 last:border-0">
//             <div
//                 className={`flex items-center p-2 transition-colors duration-150 cursor-pointer ${level === 0 ? 'bg-orange-50/40' : 'hover:bg-gray-50'} ${isChecked ? 'bg-blue-50/50' : ''}`}
//                 style={{ paddingLeft: `${8 + level * 24}px` }}
//                 onClick={handleNodeClick}
//             >
//                 {/* Checkbox */}
//                 <div className="relative flex items-center justify-center w-5 h-5 mr-3" onClick={handleCheckboxClick}>
//                     <input
//                         type="checkbox"
//                         checked={isChecked}
//                         readOnly
//                         className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
//                     />
//                 </div>

//                 {/* Expand Icon / Loader */}
//                 <div className={`mr-2 text-gray-400 w-4 h-4 flex items-center justify-center ${node.isLeaf ? 'invisible' : ''}`}>
//                     {isLoading ? (
//                         <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
//                     ) : isExpanded ? (
//                         <ChevronDown className="w-4 h-4" />
//                     ) : (
//                         <ChevronRight className="w-4 h-4" />
//                     )}
//                 </div>

//                 {/* Label */}
//                 <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                         <span className={`text-sm font-medium ${isChecked ? 'text-blue-700' : 'text-gray-700'}`}>
//                             {node.name}
//                         </span>
//                         <span className="text-[10px] text-gray-400 uppercase tracking-wider border px-1 rounded">
//                             {node.type}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Render Children */}
//             {isExpanded && node.children && (
//                 <div>
//                     {node.children.map(child => (
//                         <TreeNode
//                             key={child.id}
//                             node={child}
//                             level={level + 1}
//                             expandedNodes={expandedNodes}
//                             loadingNodes={loadingNodes}
//                             selectedItemsMap={selectedItemsMap}
//                             onExpand={onExpand}
//                             onCheck={onCheck}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// });


// // --- Main Component ---
// const NewHierarchyDropdownTable: React.FC = () => {

//   // --- States ---
//   const [activeSection, setActiveSection] = useState<SectionType>("cluster");
//   const [treeData, setTreeData] = useState<Node[]>([]);
//   const [loading, setLoading] = useState<boolean>(false); 
//   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
//   const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set()); 

//   // Selection & Table Data
//   const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, ItemMetadata>>(new Map());
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
//   const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);

//   // Table Sort/Filter
//   const [searchInput, setSearchInput] = useState<string>("");
//   const [debouncedSearch, setDebouncedSearch] = useState<string>("");
//   const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'btName', direction: 'asc' }); 
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(50);

//   // --- Initial Load / Section Switch ---
//   useEffect(() => {
//     loadRoots();
//   }, [activeSection]);

//   // Debounce Search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchInput);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   // Reset page on search/sort
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [debouncedSearch, sortConfig]);

//   // Handle Rows Per Page Change
//   const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setRowsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };
  
//   // --- Data Fetching ---

//   const loadRoots = async () => {
//     setLoading(true);
//     setTreeData([]); 
//     setExpandedNodes(new Set());
//     setSelectedItemsMap(new Map());
//     setIsSubmitted(false);
//     setSummaryStats(null);

//     try {
//       let res;
//       if (activeSection === "cluster") {
//         res = await hierarchyService.getClusters();
//         // Assuming API returns an object { data: { data: [...] } } or similar
//         const nodes: Node[] = res.data.data.map((item: any) => ({
//           id: `cluster-${item.CLUS_ID}`,
//           name: item.CLUS_NM,
//           type: "cluster",
//           metadata: {
//             id: item.CLUS_ID, name: item.CLUS_NM, type: "cluster",
//             clusterId: item.CLUS_ID, clusterName: item.CLUS_NM,
//             lokName: "N/A", jilaName: "N/A", vidName: "N/A", manName: "N/A", sakName: "N/A", btName: "N/A", 
//           }
//         }));
//         setTreeData(nodes);
//       } else {
//         res = await hierarchyService.getSambhags();
//         const nodes: Node[] = res.data.data.map((item: any) => ({
//           id: `sambhag-${item.SAM_ID}`,
//           name: item.SAM_NM,
//           type: "sambhag",
//           metadata: {
//             id: item.SAM_ID, name: item.SAM_NM, type: "sambhag",
//             sambhagId: item.SAM_ID, sambhagName: item.SAM_NM,
//             lokName: "N/A", jilaName: "N/A", vidName: "N/A", manName: "N/A", sakName: "N/A", btName: "N/A", 
//           }
//         }));
//         setTreeData(nodes);
//       }
//     } catch (error) {
//       console.error("Failed to load roots", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Recursively updates the tree data by inserting new children into the correct parent node.
//    */
//   const updateTreeData = (nodes: Node[], parentId: string, newChildren: Node[]): Node[] => {
//      return nodes.map(node => {
//         if (node.id === parentId) {
//             return { ...node, children: newChildren };
//         }
//         if (node.children) {
//             return { ...node, children: updateTreeData(node.children, parentId, newChildren) };
//         }
//         return node;
//     });
//   };

//   /**
//    * Handles node expansion and lazy loading data from the API.
//    */
//   const handleExpand = async (node: Node) => {
//     // 1. Toggle closed if already expanded
//     if (expandedNodes.has(node.id)) {
//       setExpandedNodes(prev => { const next = new Set(prev); next.delete(node.id); return next; });
//       return;
//     }

//     // 2. Just expand if children are already loaded
//     if (node.children && node.children.length > 0) {
//       setExpandedNodes(prev => new Set(prev).add(node.id));
//       return;
//     }

//     // 3. Fetch Data
//     setLoadingNodes(prev => new Set(prev).add(node.id));

//     try {
//       let res;
//       let children: Node[] = [];
//       const md = node.metadata;
      
//       const newMetadataBase = { 
//         ...md, 
//         // Ensure all names are passed down, but reset IDs for the *next* level
//         lokName: md.lokName || "N/A", jilaName: md.jilaName || "N/A",
//         vidName: md.vidName || "N/A", manName: md.manName || "N/A", 
//         sakName: md.sakName || "N/A", btName: md.btName || "N/A",
//       };

//       switch (node.type) {
//         case "cluster":
//           res = await hierarchyService.getLokSabhas(md.clusterId!);
//           children = res.data.data.map((i: any) => ({
//             id: `lok-${i.LOK_ID}`, name: i.LOK_NM, type: "lok",
//             metadata: { ...newMetadataBase, lokId: i.LOK_ID, lokName: i.LOK_NM, type: "lok" }
//           }));
//           break;

//         case "sambhag":
//           res = await hierarchyService.getJilas(md.sambhagId!);
//           children = res.data.data.map((i: any) => ({
//             id: `jila-${i.JILA_ID}`, name: i.JILA_NM, type: "jila",
//             metadata: { ...newMetadataBase, jilaId: i.JILA_ID, jilaName: i.JILA_NM, type: "jila" }
//           }));
//           break;

//         case "lok":
//           res = await hierarchyService.getVidhanByLok(md.lokId!);
//           children = res.data.data.map((i: any) => ({
//             id: `vid-${i.VID_ID}`, name: i.VID_NM, type: "vid",
//             metadata: { ...newMetadataBase, vidId: i.VID_ID, vidName: i.VID_NM, type: "vid" }
//           }));
//           break;
          
//         case "jila":
//           res = await hierarchyService.getVidhanByJila(md.jilaId!);
//           children = res.data.data.map((i: any) => ({
//             id: `vid-${i.VID_ID}`, name: i.VID_NM, type: "vid",
//             metadata: { ...newMetadataBase, vidId: i.VID_ID, vidName: i.VID_NM, type: "vid" }
//           }));
//           break;

//         case "vid":
//           res = await hierarchyService.getMandals(md.vidId!);
//           children = res.data.data.map((i: any) => ({
//             id: `mandal-${i.MAN_ID}`, name: i.MAN_NM, type: "mandal",
//             metadata: { ...newMetadataBase, manId: i.MAN_ID, manName: i.MAN_NM, type: "mandal" }
//           }));
//           break;

//         case "mandal":
//           // Requires both VID_ID and MAN_ID
//           res = await hierarchyService.getSakhas(md.vidId!, md.manId!);
//           children = res.data.data.map((i: any) => ({
//             id: `sakha-${i.SAK_ID}`, name: i.SAK_NM, type: "sakha",
//             metadata: { ...newMetadataBase, sakId: i.SAK_ID, sakName: i.SAK_NM, type: "sakha" }
//           }));
//           break;

//         case "sakha":
//           // Requires both VID_ID and SAK_ID
//           res = await hierarchyService.getBooths(md.vidId!, md.sakId!);
//           children = res.data.data.map((i: any) => ({
//             id: `booth-${i.BT_ID}`, name: i.BT_NM, type: "booth", isLeaf: true,
//             metadata: { 
//                 ...newMetadataBase, 
//                 btId: i.BT_ID, btName: i.BT_NM, type: "booth",
//                 // Final Metadata: ensure all hierarchy names are fully populated on the booth leaf node
//                 clusterName: md.clusterName, sambhagName: md.sambhagName,
//                 lokName: md.lokName, jilaName: md.jilaName,
//                 vidName: md.vidName, manName: md.manName, sakName: i.SAK_NM,
//             }
//           }));
//           break;
//       }

//       setTreeData(prev => updateTreeData(prev, node.id, children));
//       setExpandedNodes(prev => new Set(prev).add(node.id));

//     } catch (err) {
//       console.error(`Error expanding ${node.type} node:`, err);
//     } finally {
//       setLoadingNodes(prev => { const next = new Set(prev); next.delete(node.id); return next; });
//     }
//   };

//   /**
//    * Recursively toggles the selection status of a node and its loaded children.
//    */
//   const toggleSelection = (node: Node, isSelecting: boolean, newMap: Map<string, ItemMetadata>) => {
//     const key = node.id;
//     if (isSelecting) {
//         // Always track the current node's metadata
//         newMap.set(key, node.metadata);
//     } else {
//         newMap.delete(key);
//     }
    
//     // Propagate down to loaded children
//     if (node.children) {
//       node.children.forEach(child => toggleSelection(child, isSelecting, newMap));
//     }
//   };

//   const handleCheck = useCallback((node: Node) => {
//     setSelectedItemsMap(prev => {
//       const next = new Map(prev);
//       const isCurrentlySelected = next.has(node.id);
//       toggleSelection(node, !isCurrentlySelected, next);
//       return next;
//     });
//     // Reset submission state whenever selection changes
//     setIsSubmitted(false);
//   }, []);

//   /**
//    * Processes selections, calls the summary API, and displays results.
//    */
//   const handleSubmit = useCallback(async () => {
//     const selectedBooths = Array.from(selectedItemsMap.values()).filter(i => i.type === 'booth');
//     const selectedBoothIds = selectedBooths.map(i => i.btId!).filter((id): id is number => id !== undefined);

//     if (selectedBoothIds.length === 0) {
//         setSummaryStats(null);
//         setIsSubmitted(true);
//         alert("Please select at least one booth.");
//         return;
//     }

//     try {
//         // 1. Prepare payload for the backend summary API
//         const payload = { 
//             type: activeSection, 
//             ids: selectedBoothIds 
//         };
        
//         // 2. Fetch Summary Stats
//         const summaryRes = await hierarchyService.getHierarchySummary(payload);
//         // Assuming API returns an object { data: { data: SummaryStats } }
//         setSummaryStats(summaryRes.data.data); 
        
//         // 3. Set Submission Flag (Triggers table/card display)
//         setIsSubmitted(true);
        
//         // 4. Scroll to results
//         setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        
//     } catch (error) {
//         console.error("Error fetching summary stats:", error);
//         setSummaryStats(null);
//     }
//   }, [selectedItemsMap, activeSection]);

//   // --- Table Data Processing ---
//   const processedTableData = useMemo(() => {
//     if (!isSubmitted) return [];

//     // Only include Booths (leaf nodes) in the result table
//     const allItems = Array.from(selectedItemsMap.values()).filter(meta => meta.type === 'booth') as ItemMetadata[];

//     let data = [...allItems];

//     // Filter by Search Input
//     if (debouncedSearch) {
//       const q = debouncedSearch.toLowerCase();
//       data = data.filter(i =>
//         (i.btName && i.btName.toLowerCase().includes(q)) ||
//         (i.vidName && i.vidName.toLowerCase().includes(q)) ||
//         (i.manName && i.manName.toLowerCase().includes(q)) ||
//         (i.sakName && i.sakName.toLowerCase().includes(q)) ||
//         (i.lokName && i.lokName.toLowerCase().includes(q)) ||
//         (i.jilaName && i.jilaName.toLowerCase().includes(q))
//       );
//     }

//     // Sort Data
//     if (sortConfig.key && sortConfig.direction) {
//       const { key, direction } = sortConfig;
//       const modifier = direction === 'asc' ? 1 : -1;
//       data.sort((a, b) => {
//         // Safe check for null/undefined values
//         const aVal = String(a[key as keyof ItemMetadata] || "").toLowerCase();
//         const bVal = String(b[key as keyof ItemMetadata] || "").toLowerCase();
//         return aVal > bVal ? 1 * modifier : aVal < bVal ? -1 * modifier : 0;
//       });
//     }

//     return data;
//   }, [selectedItemsMap, isSubmitted, debouncedSearch, sortConfig]);

//   const totalPages = Math.ceil(processedTableData.length / rowsPerPage);
//   const paginatedData = processedTableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

//   const handleSort = (key: keyof ItemMetadata) => {
//     setSortConfig(c => ({ key, direction: c.key === key && c.direction === 'asc' ? 'desc' : 'asc' }));
//   };
  
//   // Helper for unique key generation
//   const getItemKey = (item: ItemMetadata) => `${item.btId}_${item.vidId}_${item.manId}_${item.sakId}`;


//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

//         {/* --- STEP 1: HIERARCHY SELECTION TREE --- */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
//             <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               <Filter className="w-5 h-5 text-orange-500" />
//               Select Hierarchy (Lazy Load)
//             </h1>
//           </div>

//           <div className="p-6">
//             {/* Toggle Buttons */}
//             <div className="flex gap-4 mb-4">
//               {(['cluster', 'sambhag'] as SectionType[]).map(type => (
//                 <button
//                   key={type}
//                   onClick={() => setActiveSection(type)}
//                   className={`px-6 py-2 text-sm font-medium rounded-md border ${activeSection === type ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white text-gray-600'}`}
//                 >
//                   {type === 'cluster' ? 'Cluster Base' : 'Sambhag Base'}
//                 </button>
//               ))}
//             </div>

//             {/* Tree Container */}
//             <div className="border rounded-xl overflow-y-auto h-[400px] custom-scrollbar bg-gray-50/30 p-2">
//               {loading ? (
//                 <div className="flex items-center justify-center h-full"><Spinner /></div>
//               ) : (
//                 treeData.map(node => (
//                   <TreeNode
//                     key={node.id}
//                     node={node}
//                     level={0}
//                     expandedNodes={expandedNodes}
//                     loadingNodes={loadingNodes}
//                     selectedItemsMap={selectedItemsMap}
//                     onExpand={handleExpand}
//                     onCheck={handleCheck}
//                   />
//                 ))
//               )}
//             </div>

//             {/* Action Bar */}
//             <div className="mt-4 flex justify-between items-center bg-blue-50/70 p-4 rounded-lg">
//               <span className="text-blue-800 font-medium">
//                 {Array.from(selectedItemsMap.values()).filter(i => i.type === 'booth').length} Booths Selected
//               </span>
//               <button
//                 onClick={handleSubmit}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//                 disabled={Array.from(selectedItemsMap.values()).filter(i => i.type === 'booth').length === 0}
//               >
//                 Submit & View Results
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* --- STEP 2: RESULTS (Summary Cards + Table) --- */}
//         {isSubmitted && summaryStats && (
//           <div id="results-section" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <h2 className="text-xl font-bold text-gray-900">Summary of Selection</h2>
            
//             {/* Summary Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                <SummaryCard 
//                   label={activeSection === 'cluster' ? "Cluster" : "Sambhag"} 
//                   count={activeSection === 'cluster' ? summaryStats.cluster : summaryStats.sambhag} 
//                   icon={<MapPin />} 
//                   color="bg-blue-50 text-blue-700" 
//                />
//                <SummaryCard 
//                   label={activeSection === 'cluster' ? "Lok Sabha" : "Jila"} 
//                   count={activeSection === 'cluster' ? summaryStats.lokSabha : summaryStats.jila} 
//                   icon={<MapPin />} 
//                   color="bg-indigo-50 text-indigo-700" 
//                />
//                <SummaryCard label="Vidhan Sabha" count={summaryStats.vidhanSabha} icon={<Layers />} color="bg-purple-50 text-purple-700" />
//                <SummaryCard label="Mandal" count={summaryStats.mandal} icon={<Users />} color="bg-pink-50 text-pink-700" />
//                <SummaryCard label="Sakha" count={summaryStats.sakha} icon={<Users />} color="bg-rose-50 text-rose-700" />
//                <SummaryCard label="Booth" count={summaryStats.booth} icon={<Vote />} color="bg-orange-50 text-orange-700" isMain />
//             </div>

//             {/* Results Table */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//                 <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
//                   <div className="relative w-full sm:w-96">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Search results..."
//                       value={searchInput}
//                       onChange={(e) => setSearchInput(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-0 rounded-lg text-sm"
//                     />
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
//                       <span className="text-xs text-gray-500 whitespace-nowrap">Rows:</span>
//                       <select 
//                         value={rowsPerPage} 
//                         onChange={handleRowsPerPageChange}
//                         className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 p-0 cursor-pointer"
//                       >
//                         <option value={10}>10</option>
//                         <option value={20}>20</option>
//                         <option value={50}>50</option>
//                         <option value={100}>100</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                    <table className="w-full min-w-[800px]">
//                       <thead>
//                          <tr className="bg-gray-50 border-b border-gray-200">
//                             <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 w-16">SN</th>
//                             <TableHeader label={activeSection === 'cluster' ? "Cluster" : "Sambhag"} column={activeSection === 'cluster' ? 'clusterName' : 'sambhagName'} currentSort={sortConfig} onSort={handleSort} />
//                             <TableHeader label={activeSection === 'cluster' ? "Lok Sabha" : "Jila"} column={activeSection === 'cluster' ? 'lokName' : 'jilaName'} currentSort={sortConfig} onSort={handleSort} />
//                             <TableHeader label="Vidhan Sabha" column="vidName" currentSort={sortConfig} onSort={handleSort} />
//                             <TableHeader label="Mandal" column="manName" currentSort={sortConfig} onSort={handleSort} />
//                             <TableHeader label="Sakha" column="sakName" currentSort={sortConfig} onSort={handleSort} />
//                             <TableHeader label="Booth" column="btName" currentSort={sortConfig} onSort={handleSort} />
//                          </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-100">
//                          {paginatedData.length > 0 ? (
//                             paginatedData.map((item, index) => (
//                                <tr key={getItemKey(item)} className="hover:bg-orange-50/40 transition-colors">
//                                   <td className="px-4 py-3 text-xs text-gray-400 font-mono">{(currentPage - 1) * rowsPerPage + index + 1}</td>
//                                   {/* Ensure correct display name based on active section */}
//                                   <td className="px-4 py-3 text-sm text-gray-900">{item.clusterName || item.sambhagName}</td>
//                                   <td className="px-4 py-3 text-sm text-gray-600">{item.lokName || item.jilaName}</td>
//                                   <td className="px-4 py-3 text-sm text-gray-600">{item.vidName}</td>
//                                   <td className="px-4 py-3 text-sm text-gray-600">{item.manName}</td>
//                                   <td className="px-4 py-3 text-sm text-gray-600">{item.sakName}</td>
//                                   <td className="px-4 py-3 text-sm font-medium text-orange-700">{item.btName}</td>
//                                </tr>
//                             ))
//                          ) : (
//                             <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No Booths selected or found matching filter</td></tr>
//                          )}
//                       </tbody>
//                    </table>
//                 </div>

//                 {/* Pagination */}
//                 {processedTableData.length > 0 && (
//                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
//                       <div className="text-xs text-gray-500">
//                         Showing {Math.min(processedTableData.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(processedTableData.length, currentPage * rowsPerPage)} of <span className="font-medium">{processedTableData.length}</span> results. Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
//                       </div>
//                       <div className="flex gap-2">
//                          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
//                          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
//                       </div>
//                    </div>
//                 )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NewHierarchyDropdownTable;





import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronDown, ChevronRight, Filter, Loader2, MapPin, Layers, Users, Vote, Search, ChevronUp
} from "lucide-react";
// ⚠️ ASSUMED IMPORT PATH: Adjust this path to where your hierarchyService file is located
import { hierarchyService } from "../../service/hierarchy.service";


// --- Interfaces & Types ---

interface ItemMetadata {
    id: string | number;
    name: string;
    type: string; // cluster, lok, vid, mandal, sakha, booth

    // Hierarchy Tracking IDs
    clusterId?: number;
    sambhagId?: number;
    lokId?: number;
    jilaId?: number;
    vidId?: number;
    manId?: number;
    sakId?: number;
    btId?: number;

    // Display Names for Table (Fully populated on leaf nodes)
    clusterName?: string;
    sambhagName?: string;
    lokName?: string;
    jilaName?: string;
    vidName?: string;
    manName?: string;
    sakName?: string;
    btName?: string;
}

interface Node {
    id: string;
    name: string;
    type: string;
    children?: Node[];
    isLeaf?: boolean;
    metadata: ItemMetadata;
}

// Type structure matching the response of getHierarchyDataMultiple
interface HierarchyResponseItem {
    clusterId?: number;
    lokId: number;
    lokName: string;
    vidhanSabhas: {
        vidId: number;
        vidName: string;
        mandales_sakha_booths: {
            MAN_ID: number;
            MAN_NM: string | null;
            sakhas: {
                SAK_ID: number;
                SAK_NM: string | null;
                booths: {
                    BT_ID: number;
                    BT_NM: string | null;
                }[];
            }[];
        }[];
    }[];
}

type SectionType = "cluster" | "sambhag";
type SortDirection = "asc" | "desc" | null;

interface SortConfig {
    key: keyof ItemMetadata | null;
    direction: SortDirection;
}

interface SummaryStats {
    cluster: number;
    lokSabha: number;
    vidhanSabha: number;
    mandal: number;
    sakha: number;
    booth: number;
    // Note: The backend controller does not return Sambhag/Jila counts explicitly in the summary object, 
    // but we can deduce them if needed, or rely on the returned structure.
    sambhag?: number; 
    jila?: number;
}


// --- Helper Components ---

const Spinner: React.FC = () => (
    <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
);

const SummaryCard = ({ label, count, icon, color, isMain = false }: { label: string, count: number, icon: React.ReactNode, color: string, isMain?: boolean }) => (
    <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${isMain ? 'bg-white border-orange-200 shadow-sm' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${color} bg-opacity-15`}>{React.cloneElement(icon as any, { className: "w-4 h-4" })}</div>
        </div>
        <div className={`text-2xl font-bold ${isMain ? 'text-orange-600' : 'text-gray-800'}`}>{count}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
);

const TableHeader: React.FC<{ label: string; column: keyof ItemMetadata; currentSort: SortConfig; onSort: (key: keyof ItemMetadata) => void }> = ({ label, column, currentSort, onSort }) => {
    const isSorted = currentSort.key === column;
    return (
        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 cursor-pointer" onClick={() => onSort(column)}>
            <div className="flex items-center gap-1 whitespace-nowrap">
                {label}
                {isSorted && (
                    currentSort.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                )}
            </div>
        </th>
    );
};


// --- Recursive Tree Node Component ---
const TreeNode: React.FC<{
    node: Node;
    level: number;
    expandedNodes: Set<string>;
    loadingNodes: Set<string>;
    selectedItemsMap: Map<string, ItemMetadata>;
    onExpand: (node: Node) => void;
    onCheck: (node: Node) => void;
}> = React.memo(({ node, level, expandedNodes, loadingNodes, selectedItemsMap, onExpand, onCheck }) => {

    const isExpanded = expandedNodes.has(node.id);
    const isLoading = loadingNodes.has(node.id);
    const isChecked = selectedItemsMap.has(node.id);

    const handleNodeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!node.isLeaf) {
            onExpand(node);
        }
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCheck(node);
    };

    return (
        <div className="border-b border-gray-100 last:border-0">
            <div
                className={`flex items-center p-2 transition-colors duration-150 cursor-pointer ${level === 0 ? 'bg-orange-50/40' : 'hover:bg-gray-50'} ${isChecked ? 'bg-blue-50/50' : ''}`}
                style={{ paddingLeft: `${8 + level * 24}px` }}
                onClick={handleNodeClick}
            >
                {/* Checkbox */}
                <div className="relative flex items-center justify-center w-5 h-5 mr-3" onClick={handleCheckboxClick}>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                    />
                </div>

                {/* Expand Icon / Loader */}
                <div className={`mr-2 text-gray-400 w-4 h-4 flex items-center justify-center ${node.isLeaf ? 'invisible' : ''}`}>
                    {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                    ) : isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </div>

                {/* Label */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isChecked ? 'text-blue-700' : 'text-gray-700'}`}>
                            {node.name}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider border px-1 rounded">
                            {node.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* Render Children */}
            {isExpanded && node.children && (
                <div>
                    {node.children.map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            expandedNodes={expandedNodes}
                            loadingNodes={loadingNodes}
                            selectedItemsMap={selectedItemsMap}
                            onExpand={onExpand}
                            onCheck={onCheck}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});


// --- Main Component ---
const NewHierarchyDropdownTable: React.FC = () => {
    const navigate = useNavigate();

    // --- States ---
    const [activeSection, setActiveSection] = useState<SectionType>("cluster");
    const [treeData, setTreeData] = useState<Node[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

    // Selection & Table Data
    const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, ItemMetadata>>(new Map()); // Stores all selected nodes
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
    const [flatBoothData, setFlatBoothData] = useState<ItemMetadata[]>([]); // Flat array for the final table

    // Table Sort/Filter
    const [searchInput, setSearchInput] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'btName', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(50);

    // --- Initial Load / Section Switch ---
    useEffect(() => {
        loadRoots();
    }, [activeSection]);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Reset page on search/sort
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, sortConfig]);

    // Handle Rows Per Page Change
    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // --- Data Fetching & Tree Management ---

    const loadRoots = async () => {
        setLoading(true);
        setTreeData([]);
        setExpandedNodes(new Set());
        setSelectedItemsMap(new Map());
        setIsSubmitted(false);
        setSummaryStats(null);
        setFlatBoothData([]);


        try {
            let res;
            if (activeSection === "cluster") {
                res = await hierarchyService.getClusters();
                const nodes: Node[] = res.data.data.map((item: any) => ({
                    id: `cluster-${item.CLUS_ID}`,
                    name: item.CLUS_NM,
                    type: "cluster",
                    metadata: {
                        id: item.CLUS_ID, name: item.CLUS_NM, type: "cluster",
                        clusterId: item.CLUS_ID, clusterName: item.CLUS_NM,
                    }
                }));
                setTreeData(nodes);
            } else {
                res = await hierarchyService.getSambhags();
                const nodes: Node[] = res.data.data.map((item: any) => ({
                    id: `sambhag-${item.SAM_ID}`,
                    name: item.SAM_NM,
                    type: "sambhag",
                    metadata: {
                        id: item.SAM_ID, name: item.SAM_NM, type: "sambhag",
                        sambhagId: item.SAM_ID, sambhagName: item.SAM_NM,
                    }
                }));
                setTreeData(nodes);
            }
        } catch (error) {
            console.error("Failed to load roots", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Recursively updates the tree data by inserting new children into the correct parent node.
     */
    const updateTreeData = (nodes: Node[], parentId: string, newChildren: Node[]): Node[] => {
        return nodes.map(node => {
            if (node.id === parentId) {
                // Ensure new children inherit the full metadata chain from the parent
                const childrenWithInheritedMetadata = newChildren.map(child => ({
                    ...child,
                    metadata: {
                        ...node.metadata, // Inherit everything from parent
                        ...child.metadata, // Override with specific child data
                    }
                }));
                return { ...node, children: childrenWithInheritedMetadata };
            }
            if (node.children) {
                return { ...node, children: updateTreeData(node.children, parentId, newChildren) };
            }
            return node;
        });
    };

    /**
     * Handles node expansion and lazy loading data from the API. (Retained)
     */
    const handleExpand = async (node: Node) => {
        if (expandedNodes.has(node.id)) {
            setExpandedNodes(prev => { const next = new Set(prev); next.delete(node.id); return next; });
            return;
        }

        if (node.children && node.children.length > 0) {
            setExpandedNodes(prev => new Set(prev).add(node.id));
            return;
        }

        setLoadingNodes(prev => new Set(prev).add(node.id));

        try {
            let res;
            let children: Node[] = [];
            const md = node.metadata;
            const isLeaf = (type: string) => type === 'sakha'; // Sakha is the parent of the final leaf (Booth), so Sakha children are leaves.

            const createNode = (item: any, idKey: string, nameKey: string, type: string, extraMetadata: any = {}) => ({
                id: `${type}-${item[idKey]}`,
                name: item[nameKey],
                type: type,
                isLeaf: isLeaf(type),
                metadata: {
                    id: item[idKey],
                    name: item[nameKey],
                    type: type,
                    // Specific IDs/Names for the current level
                    [idKey.toLowerCase().replace('_id', 'Id')]: item[idKey],
                    [nameKey.toLowerCase().replace('_nm', 'Name')]: item[nameKey],
                    ...extraMetadata,
                }
            });

            switch (node.type) {
                case "cluster":
                    res = await hierarchyService.getLokSabhas(md.clusterId!);
                    children = res.data.data.map((i: any) => createNode(i, "LOK_ID", "LOK_NM", "lok"));
                    break;
                case "sambhag":
                    res = await hierarchyService.getJilas(md.sambhagId!);
                    children = res.data.data.map((i: any) => createNode(i, "JILA_ID", "JILA_NM", "jila"));
                    break;
                case "lok":
                    res = await hierarchyService.getVidhanByLok(md.lokId!);
                    children = res.data.data.map((i: any) => createNode(i, "VID_ID", "VID_NM", "vid"));
                    break;
                case "jila":
                    res = await hierarchyService.getVidhanByJila(md.jilaId!);
                    children = res.data.data.map((i: any) => createNode(i, "VID_ID", "VID_NM", "vid"));
                    break;
                case "vid":
                    res = await hierarchyService.getMandals(md.vidId!);
                    children = res.data.data.map((i: any) => createNode(i, "MAN_ID", "MAN_NM", "mandal"));
                    break;
                case "mandal":
                    res = await hierarchyService.getSakhas(md.vidId!, md.manId!);
                    children = res.data.data.map((i: any) => createNode(i, "SAK_ID", "SAK_NM", "sakha"));
                    break;
                // Booths are not loaded here, as they are part of the final submission fetch
            }

            setTreeData(prev => updateTreeData(prev, node.id, children));
            setExpandedNodes(prev => new Set(prev).add(node.id));

        } catch (err) {
            console.error(`Error expanding ${node.type} node:`, err);
        } finally {
            setLoadingNodes(prev => { const next = new Set(prev); next.delete(node.id); return next; });
        }
    };

    /**
     * Recursively toggles the selection status of a node and its loaded children.
     * Keeps track of selected node metadata in the map.
     */
    const toggleSelection = (node: Node, isSelecting: boolean, newMap: Map<string, ItemMetadata>) => {
        const key = node.id;
        if (isSelecting) {
            // Always track the current node's metadata for submission (it contains the path IDs)
            newMap.set(key, node.metadata);
        } else {
            newMap.delete(key);
        }

        // Propagate down to loaded children
        if (node.children) {
            node.children.forEach(child => toggleSelection(child, isSelecting, newMap));
        }
    };

    const handleCheck = useCallback((node: Node) => {
        setSelectedItemsMap(prev => {
            const next = new Map(prev);
            const isCurrentlySelected = next.has(node.id);
            toggleSelection(node, !isCurrentlySelected, next);
            return next;
        });
        // Reset submission state whenever selection changes
        setIsSubmitted(false);
        setFlatBoothData([]);
        setSummaryStats(null);
    }, []);
    
    // --- Submission Logic ---

    /**
     * Flattens the nested HierarchyResponseItem data into an array of Booth ItemMetadata objects.
     */
    const flattenResponse = (data: HierarchyResponseItem[]): ItemMetadata[] => {
        const flatList: ItemMetadata[] = [];
        
        // Find the root names from the current treeData to populate the first column correctly
        const getRootName = (id: number | undefined, type: SectionType) => {
            if (id === undefined) return 'N/A';
            return type === 'cluster' 
                ? treeData.find(r => r.metadata.clusterId === id)?.metadata.clusterName || 'N/A'
                : treeData.find(r => r.metadata.sambhagId === id)?.metadata.sambhagName || 'N/A';
        };

        for (const lokItem of data) {
            const clusterName = getRootName(lokItem.clusterId, 'cluster');

            for (const vidItem of lokItem.vidhanSabhas) {
                for (const manItem of vidItem.mandales_sakha_booths) {
                    for (const sakItem of manItem.sakhas) {
                        for (const boothItem of sakItem.booths) {
                            // The final, complete metadata object for the table row
                            flatList.push({
                                id: `booth-${boothItem.BT_ID}`,
                                name: boothItem.BT_NM || '',
                                type: 'booth',

                                // Hierarchical IDs
                                clusterId: lokItem.clusterId,
                                lokId: lokItem.lokId,
                                vidId: vidItem.vidId,
                                manId: manItem.MAN_ID,
                                sakId: sakItem.SAK_ID,
                                btId: boothItem.BT_ID,

                                // Names for Display
                                clusterName: clusterName,
                                sambhagName: 'N/A', // Not supported by the CLUDATA model
                                lokName: lokItem.lokName,
                                jilaName: 'N/A', // Not supported by the CLUDATA model
                                vidName: vidItem.vidName,
                                manName: manItem.MAN_NM || 'N/A',
                                sakName: sakItem.SAK_NM || 'N/A',
                                btName: boothItem.BT_NM || 'N/A',
                            });
                        }
                    }
                }
            }
        }
        return flatList;
    };


    /**
     * Processes selections, calls the new backend API, and displays results.
     */
    const handleSubmit = useCallback(async () => {
        const selectedItems = Array.from(selectedItemsMap.values());
        if (selectedItems.length === 0) {
            alert(`Please select at least one node.`);
            return;
        }

        // 1. Compile unique IDs for the API payload based on the deepest selected level.
        const payload: any = {};
        const getUniqueIds = (key: keyof ItemMetadata) => Array.from(new Set(selectedItems.map(i => i[key]).filter((id): id is number => id !== undefined)));

        if (activeSection === 'cluster') {
             // For Cluster base, we collect the IDs in the following priority:
            payload.btId = getUniqueIds('btId');
            payload.sakhaId = payload.btId.length > 0 ? undefined : getUniqueIds('sakId');
            payload.manId = payload.sakhaId?.length > 0 ? undefined : getUniqueIds('manId');
            payload.vidId = payload.manId?.length > 0 ? undefined : getUniqueIds('vidId');
            payload.lokId = payload.vidId?.length > 0 ? undefined : getUniqueIds('lokId');
            payload.clusterId = payload.lokId?.length > 0 ? undefined : getUniqueIds('clusterId');
        } else {
             // For Sambhag base (assuming a similar hierarchy: Sambhag > Jila > Vidhan > Mandal > Sakha > Booth)
            payload.btId = getUniqueIds('btId');
            payload.sakhaId = payload.btId.length > 0 ? undefined : getUniqueIds('sakId');
            payload.manId = payload.sakhaId?.length > 0 ? undefined : getUniqueIds('manId');
            payload.vidId = payload.manId?.length > 0 ? undefined : getUniqueIds('vidId');
            payload.jilaId = payload.vidId?.length > 0 ? undefined : getUniqueIds('jilaId');
            payload.sambhagId = payload.jilaId?.length > 0 ? undefined : getUniqueIds('sambhagId');
        }
        
        // Remove empty arrays from the payload
        Object.keys(payload).forEach(key => {
            if (Array.isArray(payload[key]) && payload[key].length === 0) {
                delete payload[key];
            }
        });

        // Use the highest level selected if nothing below it was explicitly chosen
        const finalPayload: any = {};
        let highestLevelId: string | undefined = undefined;

        // Iterate backwards through the hierarchy levels to find the highest selected one.
        const levels = ['btId', 'sakhaId', 'manId', 'vidId', 'lokId', 'jilaId', 'clusterId', 'sambhagId'];
        for (const level of levels) {
            if (payload[level] && payload[level].length > 0) {
                finalPayload[level] = payload[level];
                highestLevelId = level;
                break; // Use only the highest specified level
            }
        }

        if (!highestLevelId) {
             alert(`No valid hierarchy level was selected for submission.`);
             return;
        }

        setLoading(true);
        setFlatBoothData([]);
        setSummaryStats(null);
        setIsSubmitted(false);


        try {
            // 2. Call the new powerful multi-hierarchy API
            // Note: We use hierarchyService.getHierarchyDataMultiple which is assumed to handle the query parameters
            const res = await hierarchyService.getHierarchyDataMultiple(finalPayload);
   console.log("res is in handlesumbit ",res.data);
            // 3. Ingest Summary Stats directly from the response
            setSummaryStats(res.data.summary);

            // 4. Flatten the nested data into a simple array of booth objects
            const flattenedData = flattenResponse(res.data.data);
            setFlatBoothData(flattenedData);

            // 5. Set Submission Flag (Triggers table/card display)
            setIsSubmitted(true);

            // 6. Scroll to results
            setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);

        } catch (error) {
            console.error("Error fetching hierarchy data:", error);
            setSummaryStats(null);
        } finally {
            setLoading(false);
        }
    }, [selectedItemsMap, activeSection, treeData]);


    // --- Table Data Processing ---
    const processedTableData = useMemo(() => {
        if (!isSubmitted) return [];

        let data = [...flatBoothData];

        // Filter by Search Input
        if (debouncedSearch) {
            const q = debouncedSearch.toLowerCase();
            data = data.filter(i =>
                (i.btName && i.btName.toLowerCase().includes(q)) ||
                (i.vidName && i.vidName.toLowerCase().includes(q)) ||
                (i.manName && i.manName.toLowerCase().includes(q)) ||
                (i.sakName && i.sakName.toLowerCase().includes(q)) ||
                (i.lokName && i.lokName.toLowerCase().includes(q)) ||
                (i.jilaName && i.jilaName.toLowerCase().includes(q)) ||
                (i.clusterName && i.clusterName.toLowerCase().includes(q)) ||
                (i.sambhagName && i.sambhagName.toLowerCase().includes(q))
            );
        }

        // Sort Data
        if (sortConfig.key && sortConfig.direction) {
            const { key, direction } = sortConfig;
            const modifier = direction === 'asc' ? 1 : -1;
            data.sort((a, b) => {
                // Safe check for null/undefined values
                const aVal = String(a[key as keyof ItemMetadata] || "").toLowerCase();
                const bVal = String(b[key as keyof ItemMetadata] || "").toLowerCase();
                return aVal > bVal ? 1 * modifier : aVal < bVal ? -1 * modifier : 0;
            });
        }

        return data;
    }, [flatBoothData, isSubmitted, debouncedSearch, sortConfig]);

    const totalPages = Math.ceil(processedTableData.length / rowsPerPage);
    const paginatedData = processedTableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleSort = (key: keyof ItemMetadata) => {
        setSortConfig(c => ({ key, direction: c.key === key && c.direction === 'asc' ? 'desc' : 'asc' }));
    };

    // Helper for unique key generation
    const getItemKey = (item: ItemMetadata) => `${item.btId}_${item.vidId}_${item.manId}_${item.sakId}`;

    const totalSelectedNodes = useMemo(() => selectedItemsMap.size, [selectedItemsMap]);
    const totalSelectedBooths = useMemo(() => 
        Array.from(selectedItemsMap.values()).filter(i => i.type === 'booth').length
    , [selectedItemsMap]);


    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* --- STEP 1: HIERARCHY SELECTION TREE --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-orange-500" />
                            Select Hierarchy (Lazy Load & Multi-Select)
                        </h1>
                    </div>

                    <div className="p-6">
                        {/* Toggle Buttons and Reset */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-4">
                                {(['cluster', 'sambhag'] as SectionType[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveSection(type)}
                                        className={`px-6 py-2 text-sm font-medium rounded-md border ${activeSection === type ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white text-gray-600'}`}
                                    >
                                        {type === 'cluster' ? 'Cluster Base' : 'Sambhag Base'}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedItemsMap(new Map());
                                    setExpandedNodes(new Set());
                                    setIsSubmitted(false);
                                    setFlatBoothData([]);
                                    setSummaryStats(null);
                                    setSearchInput("");
                                    setCurrentPage(1);
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Tree Container */}
                        <div className="border rounded-xl overflow-y-auto custom-scrollbar bg-gray-50/30 p-2">
                            {loading && treeData.length === 0 ? (
                                <div className="flex items-center justify-center h-full"><Spinner /></div>
                            ) : (
                                treeData.map(node => (
                                    <TreeNode
                                        key={node.id}
                                        node={node}
                                        level={0}
                                        expandedNodes={expandedNodes}
                                        loadingNodes={loadingNodes}
                                        selectedItemsMap={selectedItemsMap}
                                        onExpand={handleExpand}
                                        onCheck={handleCheck}
                                    />
                                ))
                            )}
                        </div>

                        {/* Action Bar */}
                        <div className="mt-4 flex justify-between items-center bg-blue-50/70 p-4 rounded-lg">
                            <span className="text-blue-800 font-medium">
                                {totalSelectedNodes} Nodes Selected ({totalSelectedBooths} Booths)
                            </span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/show-count')}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Show Count
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    disabled={totalSelectedNodes === 0 || loading}
                                >
                                    {loading ? <Spinner /> : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- STEP 2: RESULTS (Summary Cards + Table) --- */}
                {isSubmitted && summaryStats && (
                    <div id="results-section" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-gray-900">Summary of Selected Hierarchy</h2>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <SummaryCard
                                label={activeSection === 'cluster' ? "Cluster" : "Sambhag"}
                                count={summaryStats.cluster || summaryStats.sambhag || 0}
                                icon={<MapPin />}
                                color="bg-blue-50 text-blue-700"
                            />
                            <SummaryCard
                                label={activeSection === 'cluster' ? "Lok Sabha" : "Jila"}
                                count={summaryStats.lokSabha || summaryStats.jila || 0}
                                icon={<MapPin />}
                                color="bg-indigo-50 text-indigo-700"
                            />
                            <SummaryCard label="Vidhan Sabha" count={summaryStats.vidhanSabha} icon={<Layers />} color="bg-purple-50 text-purple-700" />
                            <SummaryCard label="Mandal" count={summaryStats.mandal} icon={<Users />} color="bg-pink-50 text-pink-700" />
                            <SummaryCard label="Sakha" count={summaryStats.sakha} icon={<Users />} color="bg-rose-50 text-rose-700" />
                            <SummaryCard label="Booth" count={summaryStats.booth} icon={<Vote />} color="bg-orange-50 text-orange-700" isMain />
                        </div>

                        {/* Results Table */}
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
                                <table className="w-full min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 w-16">SN</th>
                                            <TableHeader label={activeSection === 'cluster' ? "Cluster" : "Sambhag"} column={activeSection === 'cluster' ? 'clusterName' : 'sambhagName'} currentSort={sortConfig} onSort={handleSort} />
                                            <TableHeader label={activeSection === 'cluster' ? "Lok Sabha" : "Jila"} column={activeSection === 'cluster' ? 'lokName' : 'jilaName'} currentSort={sortConfig} onSort={handleSort} />
                                            <TableHeader label="Vidhan Sabha" column="vidName" currentSort={sortConfig} onSort={handleSort} />
                                            <TableHeader label="Mandal" column="manName" currentSort={sortConfig} onSort={handleSort} />
                                            <TableHeader label="Sakha" column="sakName" currentSort={sortConfig} onSort={handleSort} />
                                            <TableHeader label="Booth" column="btName" currentSort={sortConfig} onSort={handleSort} />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((item, index) => (
                                                <tr key={getItemKey(item)} className="hover:bg-orange-50/40 transition-colors">
                                                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{item.clusterName || item.sambhagName}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{item.lokName || item.jilaName}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{item.vidName}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{item.manName}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{item.sakName}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-orange-700">{item.btName}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No results found matching filter.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {processedTableData.length > 0 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                                    <div className="text-xs text-gray-500">
                                        Showing {Math.min(processedTableData.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(processedTableData.length, currentPage * rowsPerPage)} of <span className="font-medium">{processedTableData.length}</span> results. Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                                    </div>
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

export default NewHierarchyDropdownTable;