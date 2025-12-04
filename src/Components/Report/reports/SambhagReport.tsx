// // // SambhagReportPage.jsx

// // import React, { useState, useEffect, useRef } from 'react';
// // import { buildReportHierarchy } from '../../../utils/useSambhagHierarchy';
// // import { useLocation } from 'react-router-dom';
// // import axiosInstance from '../../../service/axiosInstance';

// // type LevelType = 'sambhag' | 'jila' | 'vidhansabha' | 'mandal' | 'shakti' | 'booth';

// // interface VisibleChild {
// //   jilaName?: string;
// //   vidName?: string;
// //   manName?: string;
// //   mandalName?: string;
// //   sakId?: number;
// //   sakName?: string;
// //   sakhaName?: string;
// //   boothName?: string;
// //   totalVidhans?: number;
// //   totalMandals?: number;
// //   totalSakhas?: number;
// //   totalBooths?: number;
// //   originalIndex?: number;
// // }

// // interface SambhagData {
// //   sambhagId: string;
// //   sambhagName: string;
// //   totalJilas?: number;
// //   totalVidhans?: number;
// //   totalMandals?: number;
// //   totalSakhas?: number;
// //   totalBooths?: number;
// //   visibleChildren: VisibleChild[];
// // }

// // interface ChildData {
// //   jilaName?: string;
// //   vidName?: string;
// //   manName?: string;
// //   mandalName?: string;
// //   sakId?: number;
// //   sakName?: string;
// //   sakhaName?: string;
// //   boothName?: string;
// //   totalVidhans?: number;
// //   totalMandals?: number;
// //   totalSakhas?: number;
// //   totalBooths?: number;
// // }

// // interface JilaGroups {
// //   [key: string]: VisibleChild[];
// // }

// // // --- Mock Data (Replace with your actual data fetching) ---
// // const mockData = [
// //   // Two distinct Sambhags for page break demonstration
// //   { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 1, vidName: "भरतपुर सोनहत", manId: 1, manName: "कुंवारपुर", sakId: 1, sakName: "कंजिया", btId: 37, btName: "चांटी" },
// //   { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 1, vidName: "भरतपुर सोनहत", manId: 1, manName: "कुंवारपुर", sakId: 1, sakName: "कंजिया", btId: 38, btName: "नयाचांटी" },
// //   { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 2, vidName: "बैकुंठपुर", manId: 2, manName: "मनेन्द्रगढ़", sakId: 2, sakName: "कोरिया", btId: 39, btName: "कोरिया बूथ" },
// //   { id: 2, name: "बिलासपुर", childId: 3, childName: "बिलासपुर जिला", vidId: 4, vidName: "बिलासपुर शहर", manId: 5, manName: "बिलासपुर मंडल", sakId: 6, sakName: "शक्ति A", btId: 43, btName: "बूथ 50" },
// //   { id: 2, name: "बिलासपुर", childId: 3, childName: "बिलासपुर जिला", vidId: 4, vidName: "बिलासपुर शहर", manId: 5, manName: "बिलासपुर मंडल", sakId: 7, sakName: "शक्ति B", btId: 44, btName: "बूथ 51" },
// // ];

// // // Removed gradeColors as requested

// // const SambhagReportPage = () => {
// //   const location = useLocation();
// //   const navigatedData = (location.state || mockData);
// //   const data = navigatedData || mockData;

// //   const [reportData, setReportData] = useState<SambhagData[]>([]);
// //   const [upTo, setUpTo] = useState<LevelType>('sambhag');
// //   const [isExporting, setIsExporting] = useState(false);
// //   const reportRef = useRef<HTMLDivElement>(null);

// //   useEffect(() => {
// //     const summary: SambhagData[] = buildReportHierarchy(data, upTo);
// //     console.log('Report Data:', summary);
// //     console.log('Selected Level:', upTo);
// //     setReportData(summary);
// //   }, [upTo, data]);

// //   const exportPdf = async () => {
// //     if (isExporting) return;

// //     try {
// //       setIsExporting(true);
// //       const reportElement = reportRef.current;
// //       if (!reportElement) return;

// //       const htmlContent = `
// //         <!DOCTYPE html>
// //         <html>
// //         <head>
// //           <meta charset="UTF-8">
// //           <style>
// //             * { margin: 0; padding: 0; box-sizing: border-box; }
// //             body { font-family: Arial, sans-serif; padding: 20px; }
// //             table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
// //             th, td { border: 2px solid #000; padding: 15px 10px; text-align: left; font-size: 14px; line-height: 1.5; }
// //             th { font-weight: bold; text-align: center; font-size: 16px; }
// //             .text-center { text-align: center; }
// //             .font-bold { font-weight: bold; }
// //             .print-header { font-size: 22px; font-weight: bold; margin-bottom: 25px; text-align: center; }
// //             .sambhag-page { page-break-before: always; }
// //             .sambhag-page:first-child { page-break-before: auto; }
// //             .sambhag-header-print { 
// //               font-size: 18px; 
// //               font-weight: bold; 
// //               text-align: center; 
// //               margin-bottom: 15px; 
// //               padding: 10px; 
//               // background-color: #f3f4f6; 
// //               border: 2px solid #374151; 
// //             }
// //             table { border: 2px solid #000 !important; }
// //             tbody tr:last-child td { border-bottom: 2px solid #000 !important; }
// //             @page { size: A4 landscape; margin: 0.5in; }
// //           </style>
// //         </head>
// //         <body>
// //           <div class="print-header">📊 संभाग बूथ रिपोर्ट (Sambhag Booth Report)</div>
// //           ${(reportElement as HTMLElement).innerHTML.replace(/sambhag-header/g, 'sambhag-header-print')}
// //         </body>
// //         </html>
// //       `;

// //       const response = await axiosInstance.post('/generate-pdf', {
// //         html: htmlContent,
// //         filename: `Report_${upTo}_${new Date().toISOString().slice(0, 10)}.pdf`
// //       }, {
// //         responseType: 'blob'
// //       });

// //       const blob = new Blob([response.data], { type: 'application/pdf' });
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = `Report_${upTo}_${new Date().toISOString().slice(0, 10)}.pdf`;
// //       document.body.appendChild(a);
// //       a.click();
// //       window.URL.revokeObjectURL(url);
// //       document.body.removeChild(a);
// //     } catch (error) {
// //       console.error('Error generating PDF:', error);
// //     } finally {
// //       setIsExporting(false);
// //     }
// //   };

// //   // --- Table Headers based on 'upTo' level ---
// //   const getTableHeaders = () => {
// //     const baseHeaders = {
// //       sambhag: 'संभाग (Sambhag)',
// //       jila: 'जिला (Jila)',
// //       vidhansabha: 'विधानसभा (Vidhan Sabha)',
// //       mandal: 'मंडल (Mandal)',
// //       shakti: 'शक्ति (shakti)',
// //       booth: 'बूथ (Booth)',
// //     };

// //     // Dynamic Hierarchy Headers
// //     const hierarchyHeaders = [baseHeaders.sambhag];
// //     if (upTo === 'jila' || upTo === 'vidhansabha' || upTo === 'mandal' || upTo === 'shakti' || upTo === 'booth') {
// //       hierarchyHeaders.push(baseHeaders.jila);
// //     }
// //     if (upTo === 'vidhansabha' || upTo === 'mandal' || upTo === 'shakti' || upTo === 'booth') {
// //       hierarchyHeaders.push(baseHeaders.vidhansabha);
// //     }
// //     if (upTo === 'mandal' || upTo === 'shakti' || upTo === 'booth') {
// //       hierarchyHeaders.push(baseHeaders.mandal);
// //     }
// //     if (upTo === 'shakti' || upTo === 'booth') {
// //       hierarchyHeaders.push(baseHeaders.shakti); // Corrected baseHeaders key
// //     }
// //     if (upTo === 'booth') {
// //       hierarchyHeaders.push(baseHeaders.booth);
// //     }

// //     // Dynamic Count Headers (Lower Levels only)
// //     const countHeadersMap: Record<LevelType, string[]> = {
// //       sambhag: ['जिले (Jilas)', 'विधानसभा (Vidhan)', 'मंडल (Mandal)', 'शक्ति (shakti)', 'बूथ (Booth)'],
// //       jila: ['विधानसभा (Vidhan)', 'मंडल (Mandal)', 'शक्ति (shakti)', 'बूथ (Booth)'],
// //       vidhansabha: ['मंडल (Mandal)', 'शक्ति (shakti)', 'बूथ (Booth)'],
// //       mandal: ['शक्ति (shakti)', 'बूथ (Booth)'],
// //       shakti: ['बूथ (Booth)'],
// //       booth: [], // No further counts
// //     };

// //     return {
// //       hierarchy: hierarchyHeaders,
// //       counts: countHeadersMap[upTo] || [],
// //     };
// //   };

// //   const headers = getTableHeaders();

// //   // --- Dynamic Row Counts ---
// //   const getRowCounts = (item: VisibleChild | SambhagData, level: LevelType): number[] => {
// //     // Note: The mock data doesn't provide these total counts, so they're assumed to exist on the 'item' object after 'buildReportHierarchy' runs.
// //     switch (level) {
// //       case 'sambhag':
// //         return [(item as SambhagData).totalJilas || 0, item.totalVidhans || 0, item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
// //       case 'jila':
// //         return [item.totalVidhans || 0, item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
// //       case 'vidhansabha':
// //         return [item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
// //       case 'mandal':
// //         return [item.totalSakhas || 0, item.totalBooths || 0];
// //       case 'shakti':
// //         return [item.totalBooths || 0];
// //       default: // booth
// //         return [];
// //     }
// //   };

// //   // --- Get counts for total rows including current level counts ---
// //   const getTotalRowCounts = (sambhag: SambhagData, level: LevelType): number[] => {
// //     const counts: number[] = [];

// //     switch (level) {
// //       case 'sambhag':
// //         counts.push(sambhag.totalJilas || 0);
// //         counts.push(sambhag.totalVidhans || 0);
// //         counts.push(sambhag.totalMandals || 0);
// //         counts.push(sambhag.totalSakhas || 0);
// //         counts.push(sambhag.totalBooths || 0);
// //         break;
// //       case 'jila':
// //         counts.push(sambhag.totalVidhans || 0);
// //         counts.push(sambhag.totalMandals || 0);
// //         counts.push(sambhag.totalSakhas || 0);
// //         counts.push(sambhag.totalBooths || 0);
// //         break;
// //       case 'vidhansabha':
// //         counts.push(sambhag.totalMandals || 0);
// //         counts.push(sambhag.totalSakhas || 0);
// //         counts.push(sambhag.totalBooths || 0);
// //         break;
// //       case 'mandal':
// //         counts.push(sambhag.totalSakhas || 0);
// //         counts.push(sambhag.totalBooths || 0);
// //         break;
// //       case 'shakti':
// //         counts.push(sambhag.totalBooths || 0);
// //         break;
// //       default: // booth
// //         break;
// //     }
// //     // switch (level) {
// //     //   case 'sambhag':
// //     //     counts.push(sambhag.totalJilas || 0);
// //     //     counts.push(sambhag.totalVidhans || 0);
// //     //     counts.push(sambhag.totalMandals || 0);
// //     //     counts.push(sambhag.totalSakhas || 0);
// //     //     counts.push(sambhag.totalBooths || 0);
// //     //     break;
// //     //   case 'jila':
// //     //     counts.push(sambhag.totalVidhans || sambhag.visibleChildren.length);
// //     //     counts.push(sambhag.totalMandals || 0);
// //     //     counts.push(sambhag.totalSakhas || 0);
// //     //     counts.push(sambhag.totalBooths || 0);
// //     //     break;
// //     //   case 'vidhansabha':
// //     //     counts.push(sambhag.totalMandals || sambhag.visibleChildren.length);
// //     //     counts.push(sambhag.totalSakhas || 0);
// //     //     counts.push(sambhag.totalBooths || 0);
// //     //     break;
// //     //   case 'mandal':
// //     //     counts.push(sambhag.totalSakhas || sambhag.visibleChildren.length);
// //     //     counts.push(sambhag.totalBooths || 0);
// //     //     break;
// //     //   case 'shakti':
// //     //     counts.push(sambhag.totalBooths || sambhag.visibleChildren.length);
// //     //     break;
// //     //   default: // booth
// //     //     break;
// //     // }

// //     return counts;
// //   };

// //   // --- Helper function to get the displayed name(s) for a child row ---
// //   const getChildNames = (child: ChildData, level: LevelType): string[] => {
// //     let names: string[] = [];
// //     // Determine the names for the row based on the 'upTo' level
// //     if (level === 'jila') {
// //       names = [child.jilaName || ''];
// //     } else if (level === 'vidhansabha') {
// //       names = [child.jilaName || '', child.vidName || ''];
// //     } else if (level === 'mandal') {
// //       names = [child.jilaName || '', child.vidName || '', child.manName || ''];
// //     } else if (level === 'shakti') {
// //       names = [child.jilaName || '', child.vidName || '', child.mandalName || '', (child.sakId || '') + ' - ' + (child.sakName || '')];
// //     } else if (level === 'booth') {
// //       names = [child.jilaName || '', child.vidName || '', child.mandalName || '', child.sakhaName || '', child.boothName || ''];
// //     }
// //     return names;
// //   };


// //   return (
// //     // Applied simple styling for print
// //     <div className="p-8 -h-screen">
// //      <style>
// //   {`
// //     /* 1. Global Print Settings for A4 Landscape */
// //     @page {
// //       size: A4 landscape;
// //       margin: 0.5in;
// //     }

// //     body {
// //       /* Forces background colors/shading to be printed */
// //       -webkit-print-color-adjust: exact;
// //       print-color-adjust: exact;
// //       font-family: Arial, sans-serif;
// //     }

// //     /* 2. Table Structure and Borders */
// //     table {
// //       width: 100% !important;
// //       border-collapse: collapse !important;
// //       page-break-inside: auto !important;
// //       /* Main outer border - Apply this to the table element directly in JSX 
// //          or ensure it's defined here if not in JSX */
// //       border: 2px solid #000; 
// //       margin-bottom: 20px; /* Space between different Sambhag tables */
// //     }

// //     tbody {
// //       page-break-inside: auto !important;
// //     }

// //     tr {
// //       page-break-inside: avoid !important;
// //       page-break-after: auto;
// //     }

// //     /* Internal cell borders */
// //     th, td {
// //       border: 1px solid #000 !important; /* Use 1px for internal lines */
// //       padding: 12px 8px !important;
// //       font-size: 14px !important;
// //       line-height: 1.4 !important;
// //       text-align: left;
// //     }

// //     th {
// //       font-weight: bold !important;
// //       text-align: center;
// //     }

// //     /* 3. Hierarchy and Page Breaks */
// //     .sambhag-page {
// //       page-break-inside: auto !important;
// //       overflow: visible !important;
// //     }

// //     /* Force new page for every subsequent Sambhag table */
// //     .sambhag-page:not(:first-child) { 
// //       page-break-before: always !important; 
// //     }

// //     /* 🎯 FIX: Ensure the bottom border of the last row on each table is strong */
// //     .sambhag-page table {
// //       border: 2px solid #000 !important;
// //       border-bottom: 2px solid #000 !important;
// //     }

// //     .sambhag-page tbody tr:last-child td {
// //       border-bottom: 2px solid #000 !important;
// //     }

// //     /* Additional fix for table closure */
// //     .sambhag-page table tbody {
// //       border-bottom: 2px solid #000 !important;
// //     }

// //     /* Sambhag header styling for print */
// //     .sambhag-header {
// //       page-break-after: avoid !important;
// //       margin-bottom: 10px !important;
// //     }

// //     /* 4. Utility Classes (for print consistency) */
// //     .print-header {
// //       font-size: 22px !important;
// //       font-weight: bold;
// //       margin-bottom: 25px;
// //       text-align: center;
// //     }

// //     /* Hide UI elements during print */
// //     @media print {
// //       .no-print {
// //         display: none !important;
// //       }
// //     }
// //   `}
// // </style>

// //       <header className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4 no-print">
// //   <h1 className="text-3xl font-bold text-gray-800">📊 संभाग  रिपोर्ट (Sambhag  Report)</h1>
// //   <div className="flex space-x-4">
// //     {/* Level Selector */}
// //     <select
// //       value={upTo}
// //       onChange={(e) => setUpTo(e.target.value as LevelType)}
// //       className="p-2 border border-gray-400 rounded-md shadow-sm"
// //     >
// //       <option value="sambhag">संभाग तक (Up to Sambhag)</option>
// //       <option value="jila">जिला तक (Up to Jila)</option>
// //       <option value="vidhansabha">विधानसभा तक (Up to Vidhan Sabha)</option>
// //       <option value="mandal">मंडल तक (Up to Mandal)</option>
// //       <option value="shakti">शक्ति तक (Up to shakti)</option>
// //       <option value="booth">बूथ तक (Up to Booth)</option>
// //     </select>

// //     {/* PDF Export Button */}
// //     <button
// //       onClick={exportPdf}
// //       disabled={isExporting}
// //       className={`px-4 py-2 font-semibold rounded-md shadow-md transition duration-300 ${
// //         isExporting 
// //           ? ' text-gray-600 cursor-not-allowed' 
// //           : ' text-white hover:'
// //       }`}
// //     >
// //       {isExporting ? '⏳ Generating...' : '⬇️ Export to PDF'}
// //     </button>
// //   </div>
// // </header>


// //       <div ref={reportRef} className="shadow-lg rounded-lg overflow-hidden border border-gray-400">
// //         {upTo === 'sambhag' ? (
// //           <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
// //             {/* Table Header: Displayed at the top of the first page */}
// //             <thead className=" border-b border-gray-400">
// //               <tr>
// //                 {/* Hierarchy Headers (Based on 'upTo') */}
// //                 {headers.hierarchy.map((header, index) => (
// //                   <th
// //                     key={index}
// //                     scope="col"
// //                     className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300"
// //                   >
// //                     {header}
// //                   </th>
// //                 ))}

// //                 {/* Count Headers (Lower Levels) */}
// //                 {headers.counts.map((header, index) => (
// //                   <th
// //                     key={index}
// //                     scope="col"
// //                     className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300 last:border-r-0"
// //                   >
// //                     {header}
// //                   </th>
// //                 ))}
// //               </tr>
// //             </thead>

// //             <tbody className="divide-y divide-gray-300">
// //               {reportData.map((sambhag) => (
// //                 // The key element for the page break
// //                 <React.Fragment key={sambhag.sambhagId}>

// //                 {/* 1. Sambhag Row - Show as header for non-sambhag levels, as summary for sambhag level */}
// //                 {upTo === 'sambhag' ? (
// //                   <tr className="font-extrabold border-t-4 border-black hover: transition duration-150">
// //                     <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 border-r  border-b border-gray-200" colSpan={headers.hierarchy.length}>
// //                       {sambhag.sambhagId} - {sambhag.sambhagName}
// //                     </td>
// //                     {getRowCounts(sambhag, 'sambhag').slice(headers.hierarchy.length - 1).map((count, index) => (
// //                       <td
// //                         key={index}
// //                         className="px-6 py-4 whitespace-nowrap text-sm text-center font-extrabold text-gray-900  border-r  border-b border-gray-200 last:border-r-0"
// //                       >
// //                         {count}
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 ) : (
// //                   <tr className="sambhag-section  border-t-4 border-black">
// //                     <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900 border-r border-b border-gray-200" colSpan={headers.hierarchy.length + headers.counts.length}>
// //                       {sambhag.sambhagId} - {sambhag.sambhagName}
// //                     </td>
// //                   </tr>
// //                 )}

// //                 {/* 2. Visible Children Rows (Jila, Vidhansabha, Mandal, Sakha, or Booth) */}
// //                 {(() => {
// //                   // Group children by jila and vidhansabha for row spanning
// //                   const jilaGroups = sambhag.visibleChildren.reduce((groups: any, child, index) => {
// //                     const jilaName = child.jilaName || 'Unknown';
// //                     if (!groups[jilaName]) {
// //                       groups[jilaName] = { children: [], vidGroups: {} };
// //                     }
// //                     groups[jilaName].children.push({ ...child, originalIndex: index });

// //                     // Group by vidhansabha within jila
// //                     const vidName = child.vidName || 'Unknown';
// //                     if (!groups[jilaName].vidGroups[vidName]) {
// //                       groups[jilaName].vidGroups[vidName] = [];
// //                     }
// //                     groups[jilaName].vidGroups[vidName].push({ ...child, originalIndex: index });
// //                     return groups;
// //                   }, {});

// //                   let globalIndex = 0;
// //                   return Object.entries(jilaGroups).map(([jilaName, jilaData]: [string, any]) => {
// //                     let jilaRowIndex = 0;

// //                     return Object.entries(jilaData.vidGroups).map(([vidName, vidChildren]: [string, any]) => {
// //                       return vidChildren.map((child: VisibleChild, vidIndex: number) => {
// //                         const rowNames = getChildNames(child, upTo);
// //                         const rowCounts = getRowCounts(child, upTo);
// //                         const currentGlobalIndex = globalIndex++;
// //                         const currentJilaRowIndex = jilaRowIndex++;

// //                         return (
// //                           <tr key={currentGlobalIndex} className="hover: transition duration-150">
// //                             {/* Sambhag Cell (show only once with rowspan) */}
// //                             {currentGlobalIndex === 0 && (
// //                               <td 
// //                                 rowSpan={sambhag.visibleChildren.length}
// //                                 className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle"
// //                               >
// //                                 {sambhag.sambhagName}
// //                               </td>
// //                             )}

// //                             {/* Jila Cell (show only once per jila group with rowspan) */}
// //                             {(['vidhansabha', 'mandal', 'shakti', 'booth'] as LevelType[]).includes(upTo) && currentJilaRowIndex === 0 && (
// //                               <td 
// //                                 rowSpan={jilaData.children.length}
// //                                 className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle"
// //                               >
// //                                 {jilaName}
// //                               </td>
// //                             )}

// //                             {/* For jila level, show jila name normally */}
// //                             {upTo === 'jila' && (
// //                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                 {jilaName}
// //                               </td>
// //                             )}

// //                             {/* Vidhansabha Cell (show only once per vidhansabha group with rowspan) */}
// //                             {(['mandal', 'shakti', 'booth'] as LevelType[]).includes(upTo) && vidIndex === 0 && (
// //                               <td 
// //                                 rowSpan={vidChildren.length}
// //                                 className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle"
// //                               >
// //                                 {vidName}
// //                               </td>
// //                             )}

// //                             {/* For vidhansabha level, show vidhansabha name normally */}
// //                             {upTo === 'vidhansabha' && (
// //                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                 {vidName}
// //                               </td>
// //                             )}

// //                             {/* Remaining hierarchy cells */}
// //                             {upTo === 'mandal' && (
// //                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                 {child.manName || ''}
// //                               </td>
// //                             )}
// //                             {upTo === 'shakti' && (
// //                               <>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                   {child.mandalName || ''}
// //                                 </td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                   {(child.sakId || '') + ' - ' + (child.sakName || '')}
// //                                 </td>
// //                               </>
// //                             )}
// //                             {upTo === 'booth' && (
// //                               <>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                   {child.mandalName || ''}
// //                                 </td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                   {child.sakhaName || ''}
// //                                 </td>
// //                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                   {child.boothName || ''}
// //                                 </td>
// //                               </>
// //                             )}

// //                             {/* Count Cells */}
// //                             {rowCounts.map((count, countIndex) => (
// //                               <td
// //                                 key={countIndex}
// //                                 className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r border-b border-gray-200 last:border-r-0"
// //                               >
// //                                 {count}
// //                               </td>
// //                             ))}
// //                           </tr>
// //                         )
// //                       });
// //                     }).flat();
// //                   }).flat();
// //                 })()}

// //                 {/* 3. Sambhag Summary Row - Only for non-sambhag levels */}
// //                 {upTo !== 'sambhag' && (
// //                   <tr className="font-extrabold border-t border-gray-400 border-b ">
// //                     <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900" colSpan={1}>
// //                       Total
// //                     </td>
// //                     {/* Hierarchy columns with totals */}
// //                     {headers.hierarchy.slice(1).map((header, index) => {
// //                       let value = 0;
// //                       if (index === 0) { // Jila column
// //                         value = sambhag.totalJilas || new Set(sambhag.visibleChildren.map(child => child.jilaName)).size;
// //                       } else if (index === 1 && upTo !== 'jila') { // Vidhansabha column
// //                         value = sambhag.totalVidhans || (upTo === 'vidhansabha' ? sambhag.visibleChildren.length : 0);
// //                       } else if (index === 2 && ['mandal', 'shakti', 'booth'].includes(upTo)) { // Mandal column
// //                         value = sambhag.totalMandals || (upTo === 'mandal' ? sambhag.visibleChildren.length : 0);
// //                       } else if (index === 3 && ['shakti', 'booth'].includes(upTo)) { // Shakti column
// //                         value = sambhag.totalSakhas || (upTo === 'shakti' ? sambhag.visibleChildren.length : 0);
// //                       } else if (index === 4 && upTo === 'booth') { // Booth column
// //                         value = sambhag.visibleChildren.length;
// //                       }
// //                       return (
// //                         <td key={index} className="px-6 py-4 whitespace-nowrap text-base text-center font-bold text-gray-900 border-r border-b border-gray-200">
// //                           {value}
// //                         </td>
// //                       );
// //                     })}
// //                     {/* Count columns */}
// //                     {getTotalRowCounts(sambhag, upTo).map((count, index) => (
// //                       <td
// //                         key={index}
// //                         className="px-6 py-4 whitespace-nowrap text-base text-center font-extrabold text-gray-900 border-r  border-b border-gray-200 last:border-r-0"
// //                       >
// //                         {count}
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 )}
// //                 </React.Fragment>
// //               ))}
// //             </tbody>
// //           </table>
// //         ) : (
// //           <div>
// //             {reportData.map((sambhag, sambhagIndex) => (
// //               <div key={sambhag.sambhagId} className={`sambhag-page ${sambhagIndex > 0 ? "sambhag-section" : ""}`}>

// //                 {/* Sambhag Header for each page */}
// //                 <div className="sambhag-header mb-4 p-4  border-2 border-gray-400 rounded">
// //                   <h2 className="text-xl font-bold text-gray-900 text-center">
// //                     संभाग: {sambhag.sambhagId} - {sambhag.sambhagName}
// //                   </h2>
// //                 </div>

// //              <table className="min-w-full divide-y divide-gray-400 border-2 border-gray-600">
// //                   {/* Table Header for each page */}
// //                   <thead className=" border-b border-gray-600">
// //                     <tr>
// //                       {headers.hierarchy.map((header, index) => (
// //                         <th
// //                           key={index}
// //                           scope="col"
// //                           className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300"
// //                         >
// //                           {header}
// //                         </th>
// //                       ))}
// //                       {headers.counts.map((header, index) => (
// //                         <th
// //                           key={index}
// //                           scope="col"
// //                           className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300 last:border-r-0"
// //                         >
// //                           {header}
// //                         </th>
// //                       ))}
// //                     </tr>
// //                   </thead>

// //                   <tbody className="divide-y divide-gray-300">


// //                     {/* Visible Children Rows */}
// //                     {(() => {
// //                       // Group children by jila and vidhansabha for row spanning
// //                       const jilaGroups = sambhag.visibleChildren.reduce((groups: any, child, index) => {
// //                         const jilaName = child.jilaName || 'Unknown';
// //                         if (!groups[jilaName]) {
// //                           groups[jilaName] = { children: [], vidGroups: {} };
// //                         }
// //                         groups[jilaName].children.push({ ...child, originalIndex: index });

// //                         // Group by vidhansabha within jila
// //                         const vidName = child.vidName || 'Unknown';
// //                         if (!groups[jilaName].vidGroups[vidName]) {
// //                           groups[jilaName].vidGroups[vidName] = [];
// //                         }
// //                         groups[jilaName].vidGroups[vidName].push({ ...child, originalIndex: index });
// //                         return groups;
// //                       }, {});

// //                       let globalIndex = 0;
// //                       return Object.entries(jilaGroups).map(([jilaName, jilaData]: [string, any]) => {
// //                         let jilaRowIndex = 0;

// //                         return Object.entries(jilaData.vidGroups).map(([vidName, vidChildren]: [string, any]) => {
// //                           return vidChildren.map((child: VisibleChild, vidIndex: number) => {
// //                             const rowCounts = getRowCounts(child, upTo);
// //                             const currentGlobalIndex = globalIndex++;
// //                             const currentJilaRowIndex = jilaRowIndex++;

// //                             return (
// //                               <tr key={currentGlobalIndex} className="hover: transition duration-150">
// //                                 {/* Sambhag Cell (show only once with rowspan) */}
// //                                 {currentGlobalIndex === 0 && (
// //                                   <td 
// //                                     rowSpan={sambhag.visibleChildren.length}
// //                                     className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle"
// //                                   >
// //                                     {sambhag.sambhagId} - {sambhag.sambhagName}
// //                                   </td>
// //                                 )}

// //                                 {/* Jila Cell (show only once per jila group with rowspan) */}
// //                                 {(['vidhansabha', 'mandal', 'shakti', 'booth'] as LevelType[]).includes(upTo) && currentJilaRowIndex === 0 && (
// //                                   <td 
// //                                     rowSpan={jilaData.children.length}
// //                                     className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle"
// //                                   >
// //                                     {jilaName}
// //                                   </td>
// //                                 )}

// //                                 {/* For jila level, show jila name normally */}
// //                                 {upTo === 'jila' && (
// //                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                     {jilaName}
// //                                   </td>
// //                                 )}

// //                                 {/* Vidhansabha Cell (show only once per vidhansabha group with rowspan) */}
// //                                 {(['mandal', 'shakti', 'booth'] as LevelType[]).includes(upTo) && vidIndex === 0 && (
// //                                   <td 
// //                                     rowSpan={vidChildren.length}
// //                                     className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle"
// //                                   >
// //                                     {vidName}
// //                                   </td>
// //                                 )}

// //                                 {/* For vidhansabha level, show vidhansabha name normally */}
// //                                 {upTo === 'vidhansabha' && (
// //                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                     {vidName}
// //                                   </td>
// //                                 )}

// //                                 {/* Remaining hierarchy cells */}
// //                                 {upTo === 'mandal' && (
// //                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                     {child.manName || ''}
// //                                   </td>
// //                                 )}
// //                                 {upTo === 'shakti' && (
// //                                   <>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                       {child.mandalName || ''}
// //                                     </td>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                       {(child.sakId || '') + ' - ' + (child.sakName || '')}
// //                                     </td>
// //                                   </>
// //                                 )}
// //                                 {upTo === 'booth' && (
// //                                   <>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                       {child.mandalName || ''}
// //                                     </td>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                       {child.sakhaName || ''}
// //                                     </td>
// //                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
// //                                       {child.boothName || ''}
// //                                     </td>
// //                                   </>
// //                                 )}

// //                                 {/* Count Cells */}
// //                                 {rowCounts.map((count, countIndex) => (
// //                                   <td
// //                                     key={countIndex}
// //                                     className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r border-b border-gray-200 last:border-r-0"
// //                                   >
// //                                     {count}
// //                                   </td>
// //                                 ))}
// //                               </tr>
// //                             )
// //                           });
// //                         }).flat();
// //                       }).flat();
// //                     })()}

// //                     {/* Summary Row */}
// //                     <tr className="font-extrabold border-t border-gray-400 border-b ">
// //                       <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900" colSpan={1}>
// //                         Total
// //                       </td>
// //                       {/* Hierarchy columns with totals */}
// //                       {headers.hierarchy.slice(1).map((header, index) => {
// //                         let value = 0;
// //                         if (index === 0) { // Jila column
// //                           value = sambhag.totalJilas || new Set(sambhag.visibleChildren.map(child => child.jilaName)).size;
// //                         } else if (index === 1 && upTo !== 'jila') { // Vidhansabha column
// //                           value = sambhag.totalVidhans || (upTo === 'vidhansabha' ? sambhag.visibleChildren.length : 0);
// //                         } else if (index === 2 && ['mandal', 'shakti', 'booth'].includes(upTo)) { // Mandal column
// //                           value = sambhag.totalMandals || (upTo === 'mandal' ? sambhag.visibleChildren.length : 0);
// //                         } else if (index === 3 && ['shakti', 'booth'].includes(upTo)) { // Shakti column
// //                           value = sambhag.totalSakhas || (upTo === 'shakti' ? sambhag.visibleChildren.length : 0);
// //                         } else if (index === 4 && upTo === 'booth') { // Booth column
// //                           value = sambhag.visibleChildren.length;
// //                         }
// //                         return (
// //                           <td key={index} className="px-6 py-4 whitespace-nowrap text-base text-center font-bold text-gray-900 border-r border-b border-gray-200">
// //                             {value}
// //                           </td>
// //                         );
// //                       })}
// //                       {/* Count columns */}
// //                       {getTotalRowCounts(sambhag, upTo).map((count, index) => (
// //                         <td
// //                           key={index}
// //                           className="px-6 py-4 whitespace-nowrap text-base text-center font-extrabold text-gray-900 border-r  border-b border-gray-200 last:border-r-0"
// //                         >
// //                           {count}
// //                         </td>
// //                       ))}
// //                     </tr>
// //                   </tbody>
// //                 </table>

// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SambhagReportPage;









// // SambhagReportPage.jsx

// import  { useState, useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import axiosInstance from '../../../service/axiosInstance';
// // Assuming this utility is correctly implemented and available
// import { buildReportHierarchy } from '../../../utils/useSambhagHierarchy'; 

// // --- Type Definitions (Kept as is) ---
// type LevelType = 'sambhag' | 'jila' | 'vidhansabha' | 'mandal' | 'shakti' | 'booth';

// interface VisibleChild {
//   jilaName?: string;
//   vidName?: string;
//   manName?: string;
//   mandalName?: string;
//   sakId?: number;
//   sakName?: string;
//   sakhaName?: string;
//   boothName?: string;
//   totalVidhans?: number;
//   totalMandals?: number;
//   totalSakhas?: number;
//   totalBooths?: number;
//   originalIndex?: number;
// }

// interface SambhagData {
//   sambhagId: string;
//   sambhagName: string;
//   totalJilas?: number;
//   totalVidhans?: number;
//   totalMandals?: number;
//   totalSakhas?: number;
//   totalBooths?: number;
//   visibleChildren: VisibleChild[];
// }

// // interface ChildData {
// //   jilaName?: string;
// //   vidName?: string;
// //   manName?: string;
// //   mandalName?: string;
// //   sakId?: number;
// //   sakName?: string;
// //   sakhaName?: string;
// //   boothName?: string;
// //   totalVidhans?: number;
// //   totalMandals?: number;
// //   totalSakhas?: number;
// //   totalBooths?: number;
// // }

// // --- Mock Data (Kept as is for demonstration) ---
// const mockData = [
//   // Two distinct Sambhags for page break demonstration
//   { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 1, vidName: "भरतपुर सोनहत", manId: 1, manName: "कुंवारपुर", sakId: 1, sakName: "कंजिया", btId: 37, btName: "चांटी" },
//   { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 1, vidName: "भरतपुर सोनहत", manId: 1, manName: "कुंवारपुर", sakId: 1, sakName: "कंजिया", btId: 38, btName: "नयाचांटी" },
//   { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 2, vidName: "बैकुंठपुर", manId: 2, manName: "मनेन्द्रगढ़", sakId: 2, sakName: "कोरिया", btId: 39, btName: "कोरिया बूथ" },
//   { id: 2, name: "बिलासपुर", childId: 3, childName: "बिलासपुर जिला", vidId: 4, vidName: "बिलासपुर शहर", manId: 5, manName: "बिलासपुर मंडल", sakId: 6, sakName: "शक्ति A", btId: 43, btName: "बूथ 50" },
//   { id: 2, name: "बिलासपुर", childId: 3, childName: "बिलासपुर जिला", vidId: 4, vidName: "बिलासपुर शहर", manId: 5, manName: "बिलासपुर मंडल", sakId: 7, sakName: "शक्ति B", btId: 44, btName: "बूथ 51" },
// ];

// const SambhagReportPage = () => {


//   const location = useLocation();
//   // Ensure data defaults gracefully
//   const data = location.state || mockData; 

//   const [reportData, setReportData] = useState<SambhagData[]>([]);
//   const [upTo, setUpTo] = useState<LevelType>('sambhag');
//   const [isExporting, setIsExporting] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const reportRef = useRef<HTMLDivElement>(null);

//   // Check if pagination should be enabled
//   const isPaginationEnabled = ['mandal', 'shakti', 'booth'].includes(upTo);

//   // Get current Sambhag for pagination
//   const currentSambhag = isPaginationEnabled ? reportData[currentPage] : null;
//   const displayData = isPaginationEnabled ? (currentSambhag ? [currentSambhag] : []) : reportData;

//   // Optimised useEffect hook
//   useEffect(() => {
//     // Only rebuild hierarchy if data or upTo level changes
//     const summary: SambhagData[] = buildReportHierarchy(data, upTo);
//     setReportData(summary);
//     setCurrentPage(0); // Reset to first page when level changes
//   }, [upTo, data]);


//   const exportPdf = async () => {
//     if (isExporting) return;

//     try {
//       setIsExporting(true);
//       const reportElement = reportRef.current;
//       if (!reportElement) return;

//       // 1. Get the HTML content from the ref (which contains the current report structure)
//       // 2. Wrap it with the print-specific styles defined in the component's <style> tag
//       // 3. Add the common report header.
//       const htmlContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <style>
//             * { margin: 0; padding: 0; box-sizing: border-box; }
//             body { 
//               font-family: Arial, sans-serif; 
//               padding: 20px;
//               /* Ensure print color adjustment is on for all styles */
//               -webkit-print-color-adjust: exact !important; 
//               print-color-adjust: exact !important;
//             }

//             /* Page setup for PDF */
//             @page { 
//               size: A4 landscape; 
//               margin: 0.5in; /* Standard margins */
//             }

//             /* Main structure */
//             .print-header { 
//               font-size: 22px; 
//               font-weight: bold; 
//               margin-bottom: 25px; 
//               text-align: center; 
//             }

//             /* Container for each Sambhag to force page break */
//             .sambhag-page { 
//               page-break-before: always; 
//             }
//             .sambhag-page:first-child { 
//               page-break-before: auto; /* No break before the very first one */
//             }

//             /* Table Styling: Use strong borders consistently */
//             table { 
//               width: 100%; 
//               border-collapse: collapse; 
//               margin-bottom: 20px; 
//               border: 2px solid #000 !important; /* Outer table border */
//               page-break-inside: auto !important;
//             }

//             /* Header and Data Cell Styles */
//             th, td { 
//               border: 1px solid #000 !important; /* Internal borders */
//               padding: 10px 8px; 
//               text-align: left; 
//               font-size: 13px; 
//               line-height: 1.4; 
//               vertical-align: top;
//             }

//             th { 
//               font-weight: bold; 
//               text-align: center; 
//               font-size: 14px; 
//               // background-color: #e5e7eb; /* Light gray header background */
//             }

//             /* Ensure Sambhag header has proper styling in print */
//             .sambhag-header-print {
//               font-size: 18px; 
//               font-weight: bold; 
//               text-align: center; 
//               margin: 15px 0 15px 0; 
//               padding: 10px; 
//               // background-color: #f3f4f6; 
//               border: 2px solid #374151; 
//               page-break-after: avoid;
//             }

//             /* Row Styles */
//             .sambhag-section, .total-row {
//               // background-color: #fcefdc; /* Light orange for total rows */
//               font-weight: bold;
//             }
//             .sambhag-section td {
//                 /* Make Sambhag header rows distinct */
//                 // background-color: #d1d5db !important;
//                 border-top: 2px solid #000 !important;
//             }

//             /* Fix for the bottom border of the last row */
//             tbody tr:last-child td { 
//               border-bottom: 2px solid #000 !important;
//             }

//             /* Row breaking control */
//             tr {
//               page-break-inside: avoid !important;
//               page-break-after: auto;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-header">📊 संभाग ब रिपोर्ट (Sambhag Report) - Level: ${upTo.toUpperCase()}</div>
//           ${(reportElement as HTMLElement).innerHTML.replace(/sambhag-header/g, 'sambhag-header-print').replace(/total-row-class/g, 'total-row')}
//         </body>
//         </html>
//       `;

//       // API call to generate PDF
//       const response = await axiosInstance.post('/generate-pdf', {
//         html: htmlContent,
//         filename: `Report_${upTo}_${new Date().toISOString().slice(0, 10)}.pdf`
//       }, {
//         responseType: 'blob'
//       });

//       // Download logic
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `Report_${upTo}_${new Date().toISOString().slice(0, 10)}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   // --- Table Headers based on 'upTo' level ---
//   const getTableHeaders = () => {
//     const baseHeaders = {
//       sambhag: 'संभाग (Sambhag)',
//       jila: 'जिला (Jila)',
//       vidhansabha: 'विधानसभा (Vidhan Sabha)',
//       mandal: 'मंडल (Mandal)',
//       shakti: 'शक्ति (Shakti)', // Corrected spelling
//       booth: 'बूथ (Booth)',
//     };

//     // Dynamic Hierarchy Headers
//     const hierarchyHeaders = [baseHeaders.sambhag];
//     if (['jila', 'vidhansabha', 'mandal', 'shakti', 'booth'].includes(upTo)) {
//       hierarchyHeaders.push(baseHeaders.jila);
//     }
//     if (['vidhansabha', 'mandal', 'shakti', 'booth'].includes(upTo)) {
//       hierarchyHeaders.push(baseHeaders.vidhansabha);
//     }
//     if (['mandal', 'shakti', 'booth'].includes(upTo)) {
//       hierarchyHeaders.push(baseHeaders.mandal);
//     }
//     if (['shakti', 'booth'].includes(upTo)) {
//       hierarchyHeaders.push(baseHeaders.shakti);
//     }
//     if (upTo === 'booth') {
//       hierarchyHeaders.push(baseHeaders.booth);
//     }

//     // Dynamic Count Headers (Lower Levels only)
//     const countHeadersMap: Record<LevelType, string[]> = {
//       sambhag: ['जिले (Jilas)', 'विधानसभा (Vidhan)', 'मंडल (Mandal)', 'शक्ति (Shakti)', 'बूथ (Booth)'],
//       jila: ['विधानसभा (Vidhan)', 'मंडल (Mandal)', 'शक्ति (Shakti)', 'बूथ (Booth)'],
//       vidhansabha: ['मंडल (Mandal)', 'शक्ति (Shakti)', 'बूथ (Booth)'],
//       mandal: ['शक्ति (Shakti)', 'बूथ (Booth)'],
//       shakti: ['बूथ (Booth)'],
//       booth: [], // No further counts
//     };

//     return {
//       hierarchy: hierarchyHeaders,
//       counts: countHeadersMap[upTo] || [],
//     };
//   };

//   const headers = getTableHeaders();

//   // --- Dynamic Row Counts (Kept as is) ---
//   const getRowCounts = (item: VisibleChild | SambhagData, level: LevelType): number[] => {
//     switch (level) {
//       case 'sambhag':
//         return [(item as SambhagData).totalJilas || 0, item.totalVidhans || 0, item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
//       case 'jila':
//         return [item.totalVidhans || 0, item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
//       case 'vidhansabha':
//         return [item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
//       case 'mandal':
//         return [item.totalSakhas || 0, item.totalBooths || 0];
//       case 'shakti':
//         return [item.totalBooths || 0];
//       default: // booth
//         return [];
//     }
//   };

//   // --- Get counts for total rows including current level counts (Optimized logic) ---
//   const getTotalRowCounts = (sambhag: SambhagData, level: LevelType): number[] => {
//     const counts: number[] = [];

//     // The total counts should align with the headers.counts array.
//     // This logic ensures that.
//     if (level === 'sambhag') {
//         counts.push(sambhag.totalJilas || 0);
//         counts.push(sambhag.totalVidhans || 0);
//         counts.push(sambhag.totalMandals || 0);
//         counts.push(sambhag.totalSakhas || 0);
//         counts.push(sambhag.totalBooths || 0);
//     } else if (level === 'jila') {
//         counts.push(sambhag.totalVidhans || 0);
//         counts.push(sambhag.totalMandals || 0);
//         counts.push(sambhag.totalSakhas || 0);
//         counts.push(sambhag.totalBooths || 0);
//     } else if (level === 'vidhansabha') {
//         counts.push(sambhag.totalMandals || 0);
//         counts.push(sambhag.totalSakhas || 0);
//         counts.push(sambhag.totalBooths || 0);
//     } else if (level === 'mandal') {
//         counts.push(sambhag.totalSakhas || 0);
//         counts.push(sambhag.totalBooths || 0);
//     } else if (level === 'shakti') {
//         counts.push(sambhag.totalBooths || 0);
//     }

//     return counts;
//   };

//   // Renders the main data rows, grouped by Jila and Vidhansabha to apply rowspans
//   const renderDataRows = (sambhag: SambhagData) => {
//     // 1. Group children by Jila and then by Vidhansabha
//     const jilaGroups = sambhag.visibleChildren.reduce((groups: any, child, index) => {
//       const jilaName = child.jilaName || 'Unknown Jila';
//       const vidName = child.vidName || 'Unknown Vidhansabha';

//       if (!groups[jilaName]) {
//         groups[jilaName] = { children: [], vidGroups: {} };
//       }
//       groups[jilaName].children.push({ ...child, originalIndex: index });

//       if (!groups[jilaName].vidGroups[vidName]) {
//         groups[jilaName].vidGroups[vidName] = [];
//       }
//       groups[jilaName].vidGroups[vidName].push({ ...child, originalIndex: index });
//       return groups;
//     }, {});

//     let globalIndex = 0; // Tracks row index across the entire Sambhag

//     return Object.entries(jilaGroups).map(([jilaName, jilaData]: [string, any]) => {
//       let jilaRowIndex = 0; // Tracks row index within the Jila group

//       return Object.entries(jilaData.vidGroups).map(([vidName, vidChildren]: [string, any]) => {

//         return vidChildren.map((child: VisibleChild, vidIndex: number) => {
//           const rowCounts = getRowCounts(child, upTo);
//           const currentGlobalIndex = globalIndex++;
//           const currentJilaRowIndex = jilaRowIndex++;

//           return (
//             <tr key={currentGlobalIndex} className="hover: transition duration-150">
//               {/* Sambhag Cell: Show in every row for mandal/shakti/booth levels, use rowspan for other levels */}
//               {['mandal', 'shakti', 'booth'].includes(upTo) ? (
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium  border-r border-b border-gray-200">
//                   {sambhag.sambhagName}
//                 </td>
//               ) : (
//                 currentGlobalIndex === 0 && (
//                   <td 
//                     rowSpan={sambhag.visibleChildren.length}
//                     className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle  border-r border-b border-gray-200"
//                   >
//                     {sambhag.sambhagName}
//                   </td>
//                 )
//               )}

//               {/* Jila Cell: Show in every row for mandal/shakti/booth levels, use rowspan for other levels */}
//               {headers.hierarchy.includes('जिला (Jila)') && (
//                 ['mandal', 'shakti', 'booth'].includes(upTo) ? (
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium border-r border-b border-gray-200">
//                     {jilaName}
//                   </td>
//                 ) : (
//                   currentJilaRowIndex === 0 && (
//                     <td 
//                       rowSpan={jilaData.children.length}
//                       className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle border-r border-b border-gray-200"
//                     >
//                       {jilaName}
//                     </td>
//                   )
//                 )
//               )}

//               {/* Vidhansabha Cell: Show in every row for mandal/shakti/booth levels, use rowspan for vidhansabha level */}
//               {headers.hierarchy.includes('विधानसभा (Vidhan Sabha)') && (
//                 ['mandal', 'shakti', 'booth'].includes(upTo) ? (
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium border-r border-b border-gray-200">
//                     {vidName}
//                   </td>
//                 ) : (
//                   vidIndex === 0 && (
//                     <td 
//                       rowSpan={vidChildren.length}
//                       className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle border-r border-b border-gray-200"
//                     >
//                       {vidName}
//                     </td>
//                   )
//                 )
//               )}

//               {/* Mandal Cell (Non-spanning, only for mandal, shakti, booth level) */}
//               {headers.hierarchy.includes('मंडल (Mandal)') && (
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
//                   {child.manName || child.mandalName || ''}
//                 </td>
//               )}

//               {/* Shakti Cell (Non-spanning, only for shakti, booth level) */}
//               {headers.hierarchy.includes('शक्ति (Shakti)') && (
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b border-gray-200">
//                   {(() => {
//                     const sakId = (child as any).sakId || '';
//                     const sakName = (child as any).sakName || child.sakhaName || '';

//                     if (sakId && sakName) {
//                       return sakId + ' - ' + sakName;
//                     } else if (sakName) {
//                       return sakName;
//                     } else if (sakId) {
//                       return sakId;
//                     }
//                     return '';
//                   })()}
//                 </td>
//               )}

//               {/* Booth Cell (Non-spanning, only for booth level) */}
//               {upTo === 'booth' && (
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
//                   {child.boothName || ''}
//                 </td>
//               )}

//               {/* Count Cells */}
//               {rowCounts.map((count, countIndex) => (
//                 <td
//                   key={countIndex}
//                   className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r border-b border-gray-200 last:border-r-0"
//                 >
//                   {count}
//                 </td>
//               ))}
//             </tr>
//           );
//         }).flat();
//       }).flat();
//     }).flat();
//   };


//   // Renders the summary row for the current Sambhag
//   const renderSummaryRow = (sambhag: SambhagData) => (
//     <tr className="total-row-class  border-t-2 border-black">
//       <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900 text-center" colSpan={1}>
//         **Total**
//       </td>
//       {/* Hierarchy columns with totals (excluding Sambhag itself) */}
//       {headers.hierarchy.slice(1).map((_, index) => {
//         let value = 0;
//         // Determine the count for the hierarchy column based on its level
//         if (headers.hierarchy[index + 1].includes('जिला')) { // Jila column
//             value = sambhag.totalJilas || new Set(sambhag.visibleChildren.map(child => child.jilaName)).size;
//         } else if (headers.hierarchy[index + 1].includes('विधानसभा')) { // Vidhansabha column
//             value = sambhag.totalVidhans || new Set(sambhag.visibleChildren.map(child => child.vidName)).size;
//         } else if (headers.hierarchy[index + 1].includes('मंडल')) { // Mandal column
//             value = sambhag.totalMandals || new Set(sambhag.visibleChildren.map(child => child.manName || child.mandalName)).size;
//         } else if (headers.hierarchy[index + 1].includes('शक्ति')) { // Shakti column
//             value = sambhag.totalSakhas || new Set(sambhag.visibleChildren.map(child => child.sakName || child.sakhaName)).size;
//         } else if (headers.hierarchy[index + 1].includes('बूथ')) { // Booth column
//             value = sambhag.totalBooths || sambhag.visibleChildren.length;
//         }

//         return (
//           <td key={index} className="px-6 py-4 whitespace-nowrap text-base text-center font-bold text-gray-900 border-r border-b border-gray-200">
//             {value}
//           </td>
//         );
//       })}
//       {/* Count columns */}
//       {getTotalRowCounts(sambhag, upTo).map((count, index) => (
//         <td
//           key={index}
//           className="px-6 py-4 whitespace-nowrap text-base text-center font-extrabold text-gray-900 border-r border-b border-gray-200 last:border-r-0"
//         >
//           {count}
//         </td>
//       ))}
//     </tr>
//   );


//   // Renders the main table structure
//   const renderReportTable = (sambhag: SambhagData) => (
//     <table className="min-w-full divide-y divide-gray-400">
//       {/* Table Header */}
//       <thead className="border-b border-gray-400 sticky top-0"> {/* Sticky header for better UX on long tables */}
//         <tr>
//           {/* Hierarchy Headers */}
//           {headers.hierarchy.map((header, index) => (
//             <th
//               key={index}
//               scope="col"
//               className="px-6 py-3 text-left text-xs md:text-sm font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300"
//             >
//               {header}
//             </th>
//           ))}

//           {/* Count Headers */}
//           {headers.counts.map((header, index) => (
//             <th
//               key={index}
//               scope="col"
//               className="px-6 py-3 text-center text-xs md:text-sm font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300 last:border-r-0"
//             >
//               {header}
//             </th>
//           ))}
//         </tr>
//       </thead>

//       <tbody className="divide-y divide-gray-300">
//         {renderDataRows(sambhag)}
//         {renderSummaryRow(sambhag)}
//       </tbody>
//     </table>
//   );


//   // --- Main Component Return ---
//   return (
//     <div className="p-4 md:p-8 min-h-screen">

//       {/* This is the most critical part: The print styles. 
//         The PDF generation logic takes the HTML content and injects its own 
//         <style> block, but keeping this one for local print (Ctrl+P) is good practice. 
//         I've moved the robust styles directly into the `exportPdf` function to ensure 
//         they are exactly what the PDF service consumes, but keeping a cleaner style block here.
//       */}
//       <style>
//         {`
//           /* Hide UI elements during print */
//           @media print {
//             .no-print {
//               display: none !important;
//             }
//             .sambhag-page:not(:first-child) { 
//               page-break-before: always !important; 
//             }
//             .sambhag-page table {
//               border: 2px solid #000 !important;
//             }
//             .sambhag-page tbody tr:last-child td {
//               border-bottom: 2px solid #000 !important;
//             }
//             tr {
//               page-break-inside: avoid !important;
//               page-break-after: auto;
//             }
//           }
//         `}
//       </style>

//       {/* Report Header and Controls (No Print) */}
//       <header className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-gray-300 pb-4 no-print">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
//           📊 **संभाग रिपोर्ट** (Sambhag Report)
//         </h1>
//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4">
//           {/* Level Selector */}
//           <select
//             value={upTo}
//             onChange={(e) => setUpTo(e.target.value as LevelType)}
//             className="p-2 border border-gray-400 rounded-md shadow-sm text-sm md:text-base cursor-pointer"
//           >
//             <option value="sambhag">संभाग तक (Up to Sambhag)</option>
//             <option value="jila">जिला तक (Up to Jila)</option>
//             <option value="vidhansabha">विधानसभा तक (Up to Vidhan Sabha)</option>
//             <option value="mandal">मंडल तक (Up to Mandal)</option>
//             <option value="shakti">शक्ति तक (Up to Shakti)</option>
//             <option value="booth">बूथ तक (Up to Booth)</option>
//           </select>

//           {/* Pagination Controls - Only show for mandal, shakti, booth levels */}
//           {isPaginationEnabled && reportData.length > 1 && (
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
//                 disabled={currentPage === 0}
//                 className="px-3 py-2 text-sm hover:text-blue-600 disabled:text-gray-400 rounded-md border"
//               >
//                 ← Previous
//               </button>
//               <span className="text-sm font-medium px-2">
//                 {currentPage + 1} of {reportData.length}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(Math.min(reportData.length - 1, currentPage + 1))}
//                 disabled={currentPage === reportData.length - 1}
//                 className="px-3 py-2 text-sm hover:text-blue-600 disabled:text-gray-400 rounded-md border"
//               >
//                 Next →
//               </button>
//             </div>
//           )}

//           {/* PDF Export Button */}
//           <button
//             onClick={exportPdf}
//             disabled={isExporting}
//             className={`px-4 py-2 font-semibold rounded-md shadow-md transition duration-300 text-sm md:text-base ${
//               isExporting 
//                 ? 'text-gray-600 cursor-not-allowed' 
//                 : 'text-blue-600 hover:text-blue-700 border border-blue-600'
//             }`}
//           >
//             {isExporting ? '⏳ Generating...' : `⬇️ Export ${isPaginationEnabled && currentSambhag ? currentSambhag.sambhagName : 'All'} PDF`}
//           </button>
//         </div>
//       </header>


//       {/* Main Report Container (For Print/PDF and Display) */}
//       <div ref={reportRef} className="shadow-xl rounded-lg overflow-x-auto border-gray-200">

//         {/* Scenario 1: upTo is 'sambhag' (Single table with all sambhags as rows) */}
//         {upTo === 'sambhag' ? (
//           <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
//              <thead className="border-b border-gray-400">
//               <tr>
//                 {/* Hierarchy Headers */}
//                 {headers.hierarchy.map((header, index) => (
//                   <th key={index} scope="col" className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300">
//                     {header}
//                   </th>
//                 ))}
//                 {/* Count Headers */}
//                 {headers.counts.map((header, index) => (
//                   <th key={index} scope="col" className="px-6 py-3 text-center text-sm font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300 last:border-r-0">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-300">
//               {displayData.map((sambhag) => (
//                 <tr key={sambhag.sambhagId} className="font-extrabold border-t-4 border-black transition duration-150 total-row-class">
//                   <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 border-r border-b border-gray-200" colSpan={headers.hierarchy.length}>
//                     **{sambhag.sambhagId} - {sambhag.sambhagName}**
//                   </td>
//                   {/* Counts are displayed for the current row's level */}
//                   {getRowCounts(sambhag, 'sambhag').map((count, index) => (
//                     <td
//                       key={index}
//                       className="px-6 py-4 whitespace-nowrap text-sm text-center font-extrabold text-gray-900  border-r border-b border-gray-200 last:border-r-0"
//                     >
//                       {count}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           /* Scenario 2: upTo is Jila, Vidhansabha, Mandal, Shakti, or Booth (Separate table/page for each sambhag) */
//           <div>
//             {displayData.map((sambhag, sambhagIndex) => (
//               <div 
//                 key={sambhag.sambhagId} 
//                 className={`sambhag-page p-4 ${sambhagIndex > 0 ? "mt-8" : ""}`}
//               >
//                 {/* Sambhag Header for each segment */}
//                 <div className="sambhag-header mb-4 p-4  border-2 border-gray-400 rounded">
//                   <h2 className="text-xl font-bold text-gray-900 text-center">
//                     **संभाग:** {sambhag.sambhagId} - {sambhag.sambhagName}
//                     {isPaginationEnabled && (
//                       <span className="text-sm font-normal ml-2">({currentPage + 1} of {reportData.length})</span>
//                     )}
//                   </h2>
//                 </div>

//                 {/* Render the full table structure for this Sambhag */}
//                 {renderReportTable(sambhag)}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SambhagReportPage;














import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';
// Assuming this utility is correctly implemented and available
import { buildReportHierarchy } from '../../../utils/useSambhagHierarchy';

// --- Type Definitions (Kept as is) ---
type LevelType = 'sambhag' | 'jila' | 'vidhansabha' | 'mandal' | 'shakti' | 'booth';

interface VisibleChild {
  jilaName?: string;
  vidName?: string;
  manName?: string;
  mandalName?: string;
  sakId?: number;
  sakName?: string;
  sakhaName?: string;
  boothName?: string;
  totalVidhans?: number;
  totalMandals?: number;
  totalSakhas?: number;
  totalBooths?: number;
  originalIndex?: number;
}

interface SambhagData {
  sambhagId: string;
  sambhagName: string;
  totalJilas?: number;
  totalVidhans?: number;
  totalMandals?: number;
  totalSakhas?: number;
  totalBooths?: number;
  visibleChildren: VisibleChild[];
}

// --- Mock Data (Kept as is for demonstration) ---
const mockData = [
  // Two distinct Sambhags for page break demonstration
  { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 1, vidName: "भरतपुर सोनहत", manId: 1, manName: "कुंवारपुर", sakId: 1, sakName: "कंजिया", btId: 37, btName: "चांटी" },
  { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 1, vidName: "भरतपुर सोनहत", manId: 1, manName: "कुंवारपुर", sakId: 1, sakName: "कंजिया", btId: 38, btName: "नयाचांटी" },
  { id: 1, name: "सरगुजा", childId: 1, childName: "मनेद्रगढ़", vidId: 2, vidName: "बैकुंठपुर", manId: 2, manName: "मनेन्द्रगढ़", sakId: 2, sakName: "कोरिया", btId: 39, btName: "कोरिया बूथ" },
  { id: 2, name: "बिलासपुर", childId: 3, childName: "बिलासपुर जिला", vidId: 4, vidName: "बिलासपुर शहर", manId: 5, manName: "बिलासपुर मंडल", sakId: 6, sakName: "शक्ति A", btId: 43, btName: "बूथ 50" },
  { id: 2, name: "बिलासपुर", childId: 3, childName: "बिलासपुर जिला", vidId: 4, vidName: "बिलासपुर शहर", manId: 5, manName: "बिलासपुर मंडल", sakId: 7, sakName: "शक्ति B", btId: 44, btName: "बूथ 51" },
];

// Helper to check if the current report level requires the new, grouped structure
const isLeafLevel = (level: LevelType) => ['mandal', 'shakti', 'booth'].includes(level);

const SambhagReportPage = () => {

  const location = useLocation();
  // Ensure data defaults gracefully
  const data = location.state || mockData;

  const [reportData, setReportData] = useState<SambhagData[]>([]);
  const [upTo, setUpTo] = useState<LevelType>('sambhag');
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  // Check if pagination should be enabled
  const isPaginationEnabled = isLeafLevel(upTo);

  // Get current Sambhag for pagination
  const currentSambhag = isPaginationEnabled ? reportData[currentPage] : null;
  const displayData = isPaginationEnabled ? (currentSambhag ? [currentSambhag] : []) : reportData;

  // Optimised useEffect hook
  useEffect(() => {
    // Only rebuild hierarchy if data or upTo level changes
    const summary: SambhagData[] = buildReportHierarchy(data, upTo);
    setReportData(summary);
    setCurrentPage(0); // Reset to first page when level changes
  }, [upTo, data]);



  const exportPdf = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      const reportElement = reportRef.current;
      if (!reportElement) return;

      // 1. Get the HTML content from the ref (which contains the current report structure)
      // 2. Wrap it with the print-specific styles defined below
      // 3. Add the common report header and footer with BJP logo.
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              padding-top: 120px;
              padding-bottom: 80px;
              padding-left: 20px;
              padding-right: 20px;
              /* Ensure print color adjustment is on for all styles */
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important;
            }

            /* Main structure */
            .print-header { 
              font-size: 22px; 
              font-weight: bold; 
              margin-bottom: 25px; 
              text-align: center; 
              page-break-after: avoid;
            }

            /* Container for each Sambhag to force page break */
            .sambhag-page { 
              page-break-before: always; 
              padding-top:150px;
            }
            .sambhag-page:first-child { 
              page-break-before: auto; /* No break before the very first one */
            }

            /* Jila Header for Mandal and Shakti Level */
            .jila-header {
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              margin: 25px 0 10px 0;
              padding: 15px;
              border: 2px solid #000;
              page-break-after: avoid;
              page-break-before: avoid;
              background-color: #fff3cd;
              clear: both;
            }

            /* Vidhansabha Header for Shakti and Booth Level */
            .vidhansabha-header {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0 10px 0;
              padding: 12px;
              border: 2px solid #000;
              page-break-after: avoid;
              page-break-before: avoid;
              background-color: #d4edda;
              clear: both;
            }

            /* Mandal Header for Booth Level */
            .mandal-header {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              margin: 15px 0 10px 0;
              padding: 10px;
              border: 2px solid #000;
              page-break-after: avoid;
              page-break-before: avoid;
              background-color: #e2e3ff;
              clear: both;
            }

            /* Group Header for Leaf Levels - larger and more readable */
            .vidhan-header {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0 15px 0;
              padding: 12px;
              border: 2px solid #000;
              page-break-after: avoid;
              page-break-before: avoid;
              background-color: #e8f4fd;
              clear: both;
            }

            /* Force page break after each Vidhansabha/Mandal/Shakti group */
            .table-container:not(:first-child) {
              page-break-before: always;
            }

            /* Table container to prevent overlapping */
            .table-container {
              page-break-inside: avoid;
              margin-bottom: 25px;
              clear: both;
            }

            .table-wrapper {
              overflow: visible;
              page-break-inside: avoid;
            }

            /* Table Styling: Use strong borders consistently */
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 15px; 
              border: 2px solid #000 !important;
              page-break-inside: auto;
              clear: both;
            }

            /* Header and Data Cell Styles - Increased for better readability */
            th, td { 
              border: 1px solid #000 !important;
              padding: 10px 8px; 
              text-align: center !important; 
              font-size: 14px; 
              line-height: 1.4; 
              vertical-align: middle;
              word-wrap: break-word;
              overflow-wrap: break-word;
              min-height: 40px;
            }

            th { 
              font-weight: bold; 
              text-align: center !important; 
              font-size: 16px;
              padding: 12px 10px;
              // background-color: #f5f5f5;
            }

            /* Ensure Sambhag header has proper styling in print */
            .sambhag-header-print {
              font-size: 18px; 
              font-weight: bold; 
              text-align: center; 
              margin: 15px 0 15px 0; 
              padding: 10px; 
              border: 2px solid #374151; 
              page-break-after: avoid;
            }

            /* Row Styles */
            .sambhag-section, .total-row {
              font-weight: bold;
            }

            /* Fix for the bottom border of the last row */
            tbody tr:last-child td { 
              border-bottom: 1px solid #000 !important;
            }

            /* Row breaking control */
            tr {
              page-break-inside: avoid !important;
              page-break-after: auto;
            }

            /* Prevent orphaned headers */
            thead {
              page-break-after: avoid;
            }

            /* Ensure proper spacing between sections */
            .mt-6 {
              margin-top: 20px !important;
              page-break-before: avoid;
            }

            /* Total row styling */
            .total-row {
              // background-color: #e5e7eb !important;
              font-weight: bold;
              border-top: 2px solid #000 !important;
            }
          </style>
        </head>
        <body>
          <div class="print-header">📊 संभाग  रिपोर्ट (Sambhag Report) - Level: ${upTo.toUpperCase()}</div>
          <!-- The content from the component -->
          ${(reportElement as HTMLElement).innerHTML
          .replace(/sambhag-header/g, 'sambhag-header-print')
          .replace(/total-row-class/g, 'total-row')
          .replace(/vidhan-header-display/g, 'vidhan-header')
          .replace(/jila-header-display/g, 'jila-header')
          .replace(/vidhansabha-header-display/g, 'vidhansabha-header')
          .replace(/mandal-header-display/g, 'mandal-header')
          .replace(/\*\*/g, '') // Remove Markdown bold for cleaner print
        }
        </body>
        </html>
      `;

      // API call to generate PDF
      const response = await axiosInstance.post('/generate-pdf', {
        html: htmlContent,
        filename: `Report_${upTo}_${new Date().toISOString().slice(0, 10)}.pdf`
      }, {
        responseType: 'blob'
      });

      // Download logic
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${upTo}_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };




  // --- Table Headers based on 'upTo' level ---




  const getTableHeaders = () => {
    const baseHeaders = {
      sambhag: 'संभाग (Sambhag)',
      jila: 'जिला (Jila)',
      vidhansabha: 'विधानसभा (Vidhan Sabha)',
      mandal: 'मंडल (Mandal)',
      shakti: 'शक्ति (Shakti)',
      booth: 'बूथ (Booth)',
    };

    let hierarchyHeaders: string[] = [];

    // 1. Hierarchy Headers
    if (isLeafLevel(upTo)) {
      // For leaf levels, only include the relevant hierarchy columns
      if (upTo === 'mandal') {
        hierarchyHeaders.push(baseHeaders.mandal);
      }
      if (upTo === 'shakti') {
        hierarchyHeaders.push(baseHeaders.shakti);
      }
      if (upTo === 'booth') {
        hierarchyHeaders.push(baseHeaders.booth);
      }
    } else {
      // For Sambhag, Jila, Vidhansabha (where rowspans are used)
      hierarchyHeaders.push(baseHeaders.sambhag);
      if (['jila', 'vidhansabha'].includes(upTo)) {
        hierarchyHeaders.push(baseHeaders.jila);
      }
      if (['vidhansabha'].includes(upTo)) {
        hierarchyHeaders.push(baseHeaders.vidhansabha);
      }
    }

    // 2. Dynamic Count Headers
    const countHeadersMap: Record<LevelType, string[]> = {
      sambhag: ['जिले (Jilas)', 'विधानसभा (Vidhan)', 'मंडल (Mandal)', 'शक्ति (Shakti)', 'बूथ (Booth)'],
      jila: ['विधानसभा (Vidhan)', 'मंडल (Mandal)', 'शक्ति (Shakti)', 'बूथ (Booth)'],
      vidhansabha: ['मंडल (Mandal)', 'शक्ति (Shakti)', 'बूथ (Booth)'],
      mandal: ['शक्ति (Shakti)', 'बूथ (Booth)'],
      shakti: ['बूथ (Booth)'],
      booth: [], // No further counts
    };

    return {
      hierarchy: hierarchyHeaders,
      counts: countHeadersMap[upTo] || [],
    };
  };

  const headers = getTableHeaders();

  // --- Dynamic Row Counts (Kept as is) ---
  const getRowCounts = (item: VisibleChild | SambhagData, level: LevelType): number[] => {
    // Note: The totalVidhans, totalMandals, etc., on a VisibleChild represent the counts *within* that child's segment.
    switch (level) {
      case 'sambhag':
        return [(item as SambhagData).totalJilas || 0, item.totalVidhans || 0, item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
      case 'jila':
        return [item.totalVidhans || 0, item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
      case 'vidhansabha':
        return [item.totalMandals || 0, item.totalSakhas || 0, item.totalBooths || 0];
      case 'mandal':
        return [item.totalSakhas || 0, item.totalBooths || 0];
      case 'shakti':
        return [item.totalBooths || 0];
      default: // booth
        return [];
    }
  };

  // --- New: Renders rows for a single Vidhansabha group (Leaf Levels) ---
  const renderLeafLevelRows = (children: VisibleChild[], level: LevelType) => {
    return children.map((child, index) => {
      const rowCounts = getRowCounts(child, level);

      return (
        <tr key={index} className="hover:bg-gray-50 transition duration-150">

          {/* Serial Number */}
          <td className="px-6 py-3 text-base font-medium text-gray-700 text-center border-r border-b border-gray-200">
            {index + 1}
          </td>

          {/* Mandal Cell (Only for mandal level) */}
          {level === 'mandal' && (
            <td className="px-6 py-3 text-base font-medium text-gray-700 text-center border-r border-b border-gray-200">
              {child.manName || child.mandalName || ''}
            </td>
          )}

          {/* Shakti Cell (Only for shakti level) */}
          {level === 'shakti' && (
            <td className="px-6 py-3 text-base font-medium text-gray-700 text-center border-r border-b border-gray-200">
              {child.sakName || child.sakhaName || ''}
            </td>
          )}

          {/* Booth Cell (Only for booth level) */}
          {level === 'booth' && (
            <td className="px-6 py-3 text-base font-medium text-gray-700 text-center border-r border-b border-gray-200">
              {child.boothName || ''}
            </td>
          )}

          {/* Count Cells */}
          {rowCounts.map((count, countIndex) => (
            <td
              key={countIndex}
              className="px-6 py-3 text-base text-center text-gray-700 border-r border-b border-gray-200 last:border-r-0"
            >
              {count}
            </td>
          ))}
        </tr>
      );
    });
  };

  // --- New: Renders a single table for grouped levels (Leaf Levels) ---
  const renderLeafLevelTable = (sambhag: SambhagData) => {
    // 1. Group children based on level
    const groups: Record<string, { jilaName: string, vidName: string, mandalName?: string, shaktiName?: string, children: VisibleChild[] }> = {};

    sambhag.visibleChildren.forEach(child => {
      const jilaName = child.jilaName || 'Unknown Jila';
      const vidName = child.vidName || 'Unknown Vidhansabha';

      let key: string;
      let mandalName: string | undefined;
      let shaktiName: string | undefined;

      if (upTo === 'shakti') {
        // Group by Mandal for shakti level
        mandalName = child.manName || child.mandalName || 'Unknown Mandal';
        key = `${jilaName}|${vidName}|${mandalName}`;
      } else if (upTo === 'booth') {
        // Group by Shakti for booth level
        mandalName = child.manName || child.mandalName || 'Unknown Mandal';
        shaktiName = child.sakName || child.sakhaName || 'Unknown Shakti';
        key = `${jilaName}|${vidName}|${mandalName}|${shaktiName}`;
      } else {
        // Group by Vidhansabha for mandal level
        key = `${jilaName}|${vidName}`;
      }

      if (!groups[key]) {
        groups[key] = { jilaName, vidName, mandalName, shaktiName, children: [] };
      }
      groups[key].children.push(child);
    });

    const hierarchyHeaders = headers.hierarchy;
    const countHeaders = headers.counts;

    // Track current Jila, Vidhansabha, and Mandal to show them only when they change
    let currentJila = '';
    let currentVidhansabha = '';
    let currentMandal = '';

    return Object.entries(groups).map(([key, group], index) => {

      // Calculate totals for this specific Vidhansabha group
      const groupTotals = group.children.reduce((acc, child) => {
        if (upTo === 'mandal') {
          acc.totalSakhas = (acc.totalSakhas || 0) + (child.totalSakhas || 0);
          acc.totalBooths = (acc.totalBooths || 0) + (child.totalBooths || 0);
        } else if (upTo === 'shakti') {
          acc.totalBooths = (acc.totalBooths || 0) + (child.totalBooths || 0);
        }
        // For 'booth', the total is just the row count, which we handle separately
        return acc;
      }, {});

      const getGroupTotalCounts = () => {
        if (upTo === 'mandal') return [groupTotals.totalSakhas || 0, groupTotals.totalBooths || 0];
        if (upTo === 'shakti') return [groupTotals.totalBooths || 0];
        if (upTo === 'booth') return []; // Booth level does not need a summary count column
        return [];
      };

      const renderGroupSummaryRow = () => {
        const totalCounts = getGroupTotalCounts();

        // Colspan calculation: Number of hierarchy headers for this level
        const hierarchyCols = hierarchyHeaders.length;

        return (
          <tr className="total-row-class border-t-2 border-black">
            {/* The total label spans the hierarchy columns */}
            <td
              className="px-6 py-3 text-lg font-bold text-gray-900 text-center"
              colSpan={hierarchyCols + 1}
            >
              **Total**
            </td>
            {/* Count columns */}
            {totalCounts.map((count, countIndex) => (
              <td
                key={countIndex}
                className="px-6 py-3 text-lg text-center font-extrabold text-gray-900 border-r border-b border-gray-200 last:border-r-0"
              >
                {count}
              </td>
            ))}
          </tr>
        );
      };

      // Check if we need to show Jila header (only when Jila changes)
      const showJilaHeader = (upTo === 'mandal' || upTo === 'shakti' || upTo === 'booth') && currentJila !== group.jilaName;
      if (showJilaHeader) {
        currentJila = group.jilaName;
      }

      // Check if we need to show Vidhansabha header (only when Vidhansabha changes for shakti and booth level)
      const showVidhansabhaHeader = (upTo === 'shakti' || upTo === 'booth') && currentVidhansabha !== group.vidName;
      if (showVidhansabhaHeader) {
        currentVidhansabha = group.vidName;
      }

      // Check if we need to show Mandal header (only when Mandal changes for booth level)
      const showMandalHeader = upTo === 'booth' && currentMandal !== group.mandalName;
      if (showMandalHeader) {
        currentMandal = group.mandalName || '';
      }

      return (
        <div key={key} className={`table-container mt-6 ${index > 0 ? "pt-6 border-t-2 border-dashed border-gray-300 vidhansabha-break" : ""}`}>
          {/* Show Jila header only when it changes for mandal and shakti level */}
          {showJilaHeader && (
            <div className="jila-header-display mb-2 p-2 bg-yellow-50/50 border border-yellow-200 rounded shadow-sm">
              <h2 className="text-xl font-bold text-yellow-800 text-center">
                **जिला (Jila):** {group.jilaName}
              </h2>
            </div>
          )}

          {/* Show Vidhansabha header only when it changes for shakti and booth level */}
          {showVidhansabhaHeader && (
            <div className="vidhansabha-header-display mb-2 p-2 bg-green-50/50 border border-green-200 rounded shadow-sm">
              <h2 className="text-lg font-bold text-green-800 text-center">
                **विधानसभा (Vidhan Sabha):** {group.vidName}
              </h2>
            </div>
          )}

          {/* Show Mandal header only when it changes for booth level */}
          {showMandalHeader && (
            <div className="mandal-header-display mb-2 p-2 bg-purple-50/50 border border-purple-200 rounded shadow-sm">
              <h2 className="text-lg font-bold text-purple-800 text-center">
                **मंडल (Mandal):** {group.mandalName}
              </h2>
            </div>
          )}

          {/* Header based on level */}
          <div className="vidhan-header-display mb-4 p-3 bg-blue-50/50 border border-blue-200 rounded shadow-md">
            <h3 className="text-lg font-semibold text-blue-800 text-center">
              {upTo === 'mandal' && (
                <>**विधानसभा (Vidhan Sabha):** {group.vidName}</>
              )}
              {upTo === 'shakti' && (
                <>**मंडल (Mandal):** {group.mandalName}</>
              )}
              {upTo === 'booth' && (
                <>**शक्ति (Shakti):** {group.shaktiName}</>
              )}
            </h3>
          </div>

          <div className="table-wrapper">
            <table className="min-w-full divide-y divide-gray-400 border border-gray-400">
              <thead className="border-b border-gray-400 sticky top-0 bg-gray-100">
                <tr>
                  {/* Serial Number Header */}
                  <th scope="col" className="px-6 py-4 text-center text-sm md:text-base font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300">
                    S.N.
                  </th>
                  {/* Hierarchy Headers (Only Mandal, Shakti, Booth) */}
                  {hierarchyHeaders.map((header, hIndex) => (
                    <th key={hIndex} scope="col" className="px-6 py-4 text-center text-sm md:text-base font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300">
                      {header}
                    </th>
                  ))}
                  {/* Count Headers */}
                  {countHeaders.map((header, cIndex) => (
                    <th key={cIndex} scope="col" className="px-6 py-4 text-center text-sm md:text-base font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300 last:border-r-0">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {renderLeafLevelRows(group.children, upTo)}
                {/* Summary row only makes sense if there are count columns (i.e., not 'booth' level) */}
                {countHeaders.length > 0 && renderGroupSummaryRow()}
              </tbody>
            </table>
          </div>
        </div>
      );
    });
  };


  // --- Old Logic for Sambhag, Jila, Vidhansabha (Where RowSpans are used) ---

  // Renders the main data rows, grouped by Jila and Vidhansabha to apply rowspans
  const renderDataRowsWithRowSpans = (sambhag: SambhagData) => {
    // 1. Group children by Jila and then by Vidhansabha
    const jilaGroups = sambhag.visibleChildren.reduce((groups: any, child, index) => {
      const jilaName = child.jilaName || 'Unknown Jila';
      const vidName = child.vidName || 'Unknown Vidhansabha';

      if (!groups[jilaName]) {
        groups[jilaName] = { children: [], vidGroups: {} };
      }
      groups[jilaName].children.push({ ...child, originalIndex: index });

      if (!groups[jilaName].vidGroups[vidName]) {
        groups[jilaName].vidGroups[vidName] = [];
      }
      groups[jilaName].vidGroups[vidName].push({ ...child, originalIndex: index });
      return groups;
    }, {});

    let globalIndex = 0; // Tracks row index across the entire Sambhag

    return Object.entries(jilaGroups).map(([jilaName, jilaData]: [string, any]) => {
      let jilaRowIndex = 0; // Tracks row index within the Jila group

      return Object.entries(jilaData.vidGroups).map(([vidName, vidChildren]: [string, any]) => {

        return vidChildren.map((child: VisibleChild, vidIndex: number) => {
          const rowCounts = getRowCounts(child, upTo);
          const currentGlobalIndex = globalIndex++;
          const currentJilaRowIndex = jilaRowIndex++;

          return (
            <tr key={currentGlobalIndex} className="hover:bg-gray-50 transition duration-150">
              {/* Sambhag Cell: Rowspan for Sambhag/Jila/Vidhansabha levels */}
              {currentGlobalIndex === 0 && (
                <td
                  rowSpan={sambhag.visibleChildren.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle border-r border-b border-gray-200"
                >
                  {sambhag.sambhagName}
                </td>
              )}

              {/* Jila Cell: Rowspan for Jila/Vidhansabha levels */}
              {headers.hierarchy.includes('जिला (Jila)') && currentJilaRowIndex === 0 && (
                <td
                  rowSpan={jilaData.children.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle border-r border-b border-gray-200"
                >
                  {jilaName}
                </td>
              )}

              {/* Vidhansabha Cell: Rowspan for Vidhansabha level */}
              {headers.hierarchy.includes('विधानसभा (Vidhan Sabha)') && vidIndex === 0 && (
                <td
                  rowSpan={vidChildren.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle border-r border-b border-gray-200"
                >
                  {vidName}
                </td>
              )}

              {/* Count Cells */}
              {rowCounts.map((count, countIndex) => (
                <td
                  key={countIndex}
                  className="px-8 py-4 whitespace-nowrap text-base text-center text-gray-700 border-r border-b border-gray-200 last:border-r-0"
                >
                  {count}
                </td>
              ))}
            </tr>
          );
        }).flat();
      }).flat();
    }).flat();
  };

  // Renders the summary row for the current Sambhag (for non-leaf levels)
  const renderFullSummaryRow = (sambhag: SambhagData) => {
    // Determine the number of hierarchy columns that need to be spanned by the 'Total' label
    const hierarchyCols = headers.hierarchy.length;

    // Get the total counts for the count columns
    const totalCounts = getRowCounts(sambhag, upTo);

    return (
      <tr className="total-row-class border-t-2 border-black bg-gray-100">
        <td
          className="px-8 py-4 whitespace-nowrap text-lg font-bold text-gray-900 text-center"
          colSpan={hierarchyCols}
        >
          **Total**
        </td>
        {/* Count columns */}
        {totalCounts.map((count, index) => (
          <td
            key={index}
            className="px-8 py-4 whitespace-nowrap text-lg text-center font-extrabold text-gray-900 border-r border-b border-gray-200 last:border-r-0"
          >
            {count}
          </td>
        ))}
      </tr>
    );
  };

  // Renders the main table structure for non-leaf levels
  const renderFullReportTable = (sambhag: SambhagData) => (
    <table className="min-w-full divide-y divide-gray-400">
      {/* Table Header */}
      <thead className="border-b border-gray-400 sticky top-0 bg-gray-100">
        <tr>
          {/* Hierarchy Headers */}
          {headers.hierarchy.map((header, index) => (
            <th
              key={index}
              scope="col"
              className="px-8 py-4 text-center text-sm md:text-base font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300"
            >
              {header}
            </th>
          ))}

          {/* Count Headers */}
          {headers.counts.map((header, index) => (
            <th
              key={index}
              scope="col"
              className="px-8 py-4 text-center text-sm md:text-base font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300 last:border-r-0"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-300">
        {renderDataRowsWithRowSpans(sambhag)}
        {renderFullSummaryRow(sambhag)}
      </tbody>
    </table>
  );


  // --- Main Component Return ---
  return (
    <div className="p-4 md:p-8 min-h-screen">

      {/* Local Print Styles */}
      <style>
        {`
          /* Hide UI elements during print */
          @media print {
            .no-print {
              display: none !important;
            }
            .sambhag-page:not(:first-child) { 
              page-break-before: always !important; 
            }
            .sambhag-page table {
              border: 2px solid #000 !important;
            }
            .sambhag-page tbody tr:last-child td {
              border-bottom: 2px solid #000 !important;
            }
            .jila-header-display {
              page-break-after: avoid !important;
              margin-top: 25px !important;
              margin-bottom: 10px !important;
            }
            .vidhansabha-header-display {
              page-break-after: avoid !important;
              margin-top: 20px !important;
              margin-bottom: 10px !important;
            }
            .mandal-header-display {
              page-break-after: avoid !important;
              margin-top: 15px !important;
              margin-bottom: 10px !important;
            }
            .vidhan-header-display {
              page-break-after: avoid !important;
              margin-top: 20px !important;
            }
            tr {
              page-break-inside: avoid !important;
              page-break-after: auto;
            }
          }
        `}
      </style>

      {/* Report Header and Controls (No Print) */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-gray-300 pb-4 no-print">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          📊 **संभाग रिपोर्ट** (Sambhag Report)
        </h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4">
          {/* Level Selector */}
          <select
            value={upTo}
            onChange={(e) => setUpTo(e.target.value as LevelType)}
            className="p-2 border border-gray-400 rounded-md shadow-sm text-sm md:text-base cursor-pointer"
          >
            <option value="sambhag">संभाग तक (Up to Sambhag)</option>
            <option value="jila">जिला तक (Up to Jila)</option>
            <option value="vidhansabha">विधानसभा तक (Up to Vidhan Sabha)</option>
            <option value="mandal">मंडल तक (Up to Mandal)</option>
            <option value="shakti">शक्ति तक (Up to Shakti)</option>
            <option value="booth">बूथ तक (Up to Booth)</option>
          </select>

          {/* Pagination Controls - Only show for leaf levels */}
          {isPaginationEnabled && reportData.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-2 text-sm hover:text-blue-600 disabled:text-gray-400 rounded-md border"
              >
                ← Previous
              </button>
              <span className="text-sm font-medium px-2">
                {currentPage + 1} of {reportData.length}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(reportData.length - 1, currentPage + 1))}
                disabled={currentPage === reportData.length - 1}
                className="px-3 py-2 text-sm hover:text-blue-600 disabled:text-gray-400 rounded-md border"
              >
                Next →
              </button>
            </div>
          )}

          {/* PDF Export Button */}
          <button
            // onClick={exportPdf}
            onClick={exportPdf}
            disabled={isExporting}
            className={`px-4 py-2 font-semibold rounded-md shadow-md transition duration-300 text-sm md:text-base ${isExporting
              ? 'text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {isExporting ? '⏳ Generating...' : `⬇️ Export ${isPaginationEnabled && currentSambhag ? currentSambhag.sambhagName : 'All'} PDF`}
          </button>
        </div>
      </header>


      {/* Main Report Container (For Print/PDF and Display) */}
      <div ref={reportRef} className="shadow-xl rounded-lg overflow-x-auto border-gray-200">

        {/* SCENARIO 1: upTo is 'sambhag' (Single table with all sambhags as rows) */}
        {upTo === 'sambhag' ? (
          <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
            <thead className="border-b border-gray-400 bg-gray-100">
              <tr>
                {/* Hierarchy Headers */}
                {headers.hierarchy.map((header, index) => (
                  <th key={index} scope="col" className="px-8 py-4 text-center text-base font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300">
                    {header}
                  </th>
                ))}
                {/* Count Headers */}
                {headers.counts.map((header, index) => (
                  <th key={index} scope="col" className="px-8 py-4 text-center text-base font-bold uppercase tracking-wider text-gray-900 border-r border-gray-300 last:border-r-0">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {displayData.map((sambhag) => (
                <tr key={sambhag.sambhagId} className="font-extrabold border-t-4 border-black transition duration-150 total-row-class">
                  <td className="px-8 py-4 whitespace-nowrap text-xl text-gray-900 border-r border-b border-gray-200" colSpan={headers.hierarchy.length}>
                    **{sambhag.sambhagId} - {sambhag.sambhagName}**
                  </td>
                  {/* Counts are displayed for the current row's level */}
                  {getRowCounts(sambhag, 'sambhag').map((count, index) => (
                    <td
                      key={index}
                      className="px-8 py-4 whitespace-nowrap text-base text-center font-extrabold text-gray-900 border-r border-b border-gray-200 last:border-r-0"
                    >
                      {count}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* SCENARIO 2: upTo is Jila, Vidhansabha, Mandal, Shakti, or Booth */
          <div>
            {displayData.map((sambhag, sambhagIndex) => (
              <div
                key={sambhag.sambhagId}
                className={`sambhag-page p-4 ${sambhagIndex > 0 ? "mt-8" : ""}`}
              >
                {/* Sambhag Header for each segment */}
                <div className="sambhag-header mb-4 p-4 border-2 border-gray-400 rounded shadow-md">
                  <h2 className="text-xl font-bold text-gray-900 text-center">
                    **संभाग:** {sambhag.sambhagId} - {sambhag.sambhagName}
                    {isPaginationEnabled && (
                      <span className="text-sm font-normal ml-2">({currentPage + 1} of {reportData.length})</span>
                    )}
                  </h2>
                </div>

                {isLeafLevel(upTo) ? (
                  // NEW: Render multiple tables, grouped by Vidhansabha (Leaf Levels)
                  renderLeafLevelTable(sambhag)
                ) : (
                  // OLD: Render single table with rowSpans (Jila, Vidhansabha)
                  renderFullReportTable(sambhag)
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SambhagReportPage;