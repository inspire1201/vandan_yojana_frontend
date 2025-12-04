// ClusterReportPage.jsx

import  { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../service/axiosInstance';
import { buildClusterReport } from '../../../utils/useClusterHierarchy';

type LevelType = 'cluster' | 'lok' | 'vidhansabha' | 'mandal' | 'sakha' | 'booth';

interface ClusterData {
    clusterId: string;
    clusterName: string;
    totalLoks?: number;
    totalVidhans?: number;
    totalMandals?: number;
    totalSakhas?: number;
    totalBooths?: number;
    visibleChildren: any[];
}

interface ChildData {
    lokName?: string;
    vidName?: string;
    manName?: string;
    mandalName?: string;
    sakName?: string;
    sakhaName?: string;
    boothName?: string;
    totalVidhans?: number;
    totalMandals?: number;
    totalSakhas?: number;
    totalBooths?: number;
}

const ClusterReportPage = () => {
    const location = useLocation();
    const data: any = location.state || [];

    const [reportData, setReportData] = useState<ClusterData[]>([]);
    const [upTo, setUpTo] = useState<LevelType>('cluster');
    const [isExporting, setIsExporting] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // This function builds the hierarchical report data based on the 'upTo' level
        const summary:any = buildClusterReport(data, upTo);
        setReportData(summary);
    }, [upTo, data]);

    // --- PDF Export Logic ---
    const exportPdf = async () => {
        if (isExporting) return;

        try {
            setIsExporting(true);
            const reportElement = reportRef.current;
            if (!reportElement) return;

            // Generate HTML content for the server
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        /* Standard Table Styles (Black borders, white background) */
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { border: 2px solid #000; padding: 15px 10px; text-align: left; font-size: 14px; line-height: 1.5; }
                        th { font-weight: bold; text-align: center; font-size: 16px; background-color: transparent; color: #000000; }
                        
                        /* Custom Styles for Hierarchy Highlighting */
                        .cluster-header { background-color: transparent; font-weight: bold; }
                        .summary-row { background-color: transparent; font-weight: bold; }
                        
                        .text-center { text-align: center; }
                        .font-bold { font-weight: bold; }
                        .print-header { font-size: 22px; font-weight: bold; margin-bottom: 25px; text-align: center; }
                        
                        /* Page break for each Cluster, except the first one */
                        .cluster-page { page-break-before: always; }
                        .cluster-page:first-child { page-break-before: auto; }
                        @page { size: A4 landscape; margin: 0.5in; }
                    </style>
                </head>
                <body>
                    <div class="print-header">📊 क्लस्टर बूथ रिपोर्ट (Cluster Booth Report)</div>
                    ${(reportElement as HTMLElement).innerHTML}
                </body>
                </html>
            `;

            // Post HTML to the server's PDF generation endpoint
            const response = await axiosInstance.post('/generate-pdf', {
                html: htmlContent,
                filename: `ClusterReport_${upTo}_${new Date().toISOString().slice(0, 10)}.pdf`
            }, {
                responseType: 'blob' // Important for receiving binary data (PDF)
            });

            // Handle the file download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ClusterReport_${upTo}_${new Date().toISOString().slice(0, 10)}.pdf`;
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


    // --- Table Headers based on 'upTo' level (Modified for Cluster Hierarchy) ---
    const getTableHeaders = () => {
        const baseHeaders = {
            cluster: 'क्लस्टर (Cluster)',
            lok: 'लोकसभा (Lok Sabha)',
            vidhansabha: 'विधानसभा (Vidhan Sabha)',
            mandal: 'मंडल (Mandal)',
            sakha: 'शाखा (Sakha)',
            booth: 'बूथ (Booth)',
        };

        // Dynamic Hierarchy Headers
        const hierarchyHeaders = [baseHeaders.cluster];
        if (upTo !== 'cluster') { // Lok Sabha is the first level after cluster
            hierarchyHeaders.push(baseHeaders.lok);
        }
        if (upTo === 'vidhansabha' || upTo === 'mandal' || upTo === 'sakha' || upTo === 'booth') {
            hierarchyHeaders.push(baseHeaders.vidhansabha);
        }
        if (upTo === 'mandal' || upTo === 'sakha' || upTo === 'booth') {
            hierarchyHeaders.push(baseHeaders.mandal);
        }
        if (upTo === 'sakha' || upTo === 'booth') {
            hierarchyHeaders.push(baseHeaders.sakha);
        }
        if (upTo === 'booth') {
            hierarchyHeaders.push(baseHeaders.booth);
        }
        
        // Dynamic Count Headers (Lower Levels only)
        const countHeadersMap: Record<LevelType, string[]> = {
            cluster: ['लोकसभा (Loks)', 'विधानसभा (Vidhan)', 'मंडल (Mandal)', 'शाखा (Sakha)', 'बूथ (Booth)'],
            lok: ['विधानसभा (Vidhan)', 'मंडल (Mandal)', 'शाखा (Sakha)', 'बूथ (Booth)'],
            vidhansabha: ['मंडल (Mandal)', 'शाखा (Sakha)', 'बूथ (Booth)'],
            mandal: ['शाखा (Sakha)', 'बूथ (Booth)'],
            sakha: ['बूथ (Booth)'],
            booth: [], // No further counts
        };

        return {
            hierarchy: hierarchyHeaders,
            counts: countHeadersMap[upTo] || [],
        };
    };

    const headers = getTableHeaders();


    // --- Dynamic Row Counts (Level of the current row being displayed) ---
    const getRowCounts = (item: any, level: LevelType): number[] => {
        // These properties should be calculated by the 'buildClusterReport' utility
        switch (level) {
            case 'cluster':
                return [item.totalLoks, item.totalVidhans, item.totalMandals, item.totalSakhas, item.totalBooths];
            case 'lok':
                return [item.totalVidhans, item.totalMandals, item.totalSakhas, item.totalBooths];
            case 'vidhansabha':
                return [item.totalMandals, item.totalSakhas, item.totalBooths];
            case 'mandal':
                return [item.totalSakhas, item.totalBooths];
            case 'sakha':
                return [item.totalBooths];
            default: // booth
                return [];
        }
    };

    // --- Get counts for total rows (for non-cluster levels) ---
    const getTotalRowCounts = (cluster: ClusterData, level: LevelType): number[] => {
        const counts: number[] = [];
        switch (level) {
            case 'lok': 
                counts.push(cluster.totalVidhans || cluster.visibleChildren.length);
                counts.push(cluster.totalMandals || 0);
                counts.push(cluster.totalSakhas || 0);
                counts.push(cluster.totalBooths || 0);
                break;
            case 'vidhansabha': 
                counts.push(cluster.totalMandals || cluster.visibleChildren.length);
                counts.push(cluster.totalSakhas || 0);
                counts.push(cluster.totalBooths || 0);
                break;
            case 'mandal': 
                counts.push(cluster.totalSakhas || cluster.visibleChildren.length);
                counts.push(cluster.totalBooths || 0);
                break;
            case 'sakha': 
                counts.push(cluster.totalBooths || cluster.visibleChildren.length);
                break;
            default: // cluster or booth
                break;
        }
        return counts;
    };


    // --- Helper function to get the displayed name(s) for a child row ---
    const getChildNames = (child: ChildData, level: LevelType): string[] => {
        let names: string[] = [];
        // Note: I'm assuming the child objects have properties like 'lokName', 'vidName', etc., which are populated by 'buildClusterReport'.
        if (level === 'lok') {
            names = [child.lokName || ''];
        } else if (level === 'vidhansabha') {
            names = [child.lokName || '', child.vidName || ''];
        } else if (level === 'mandal') {
            names = [child.lokName || '', child.vidName || '', child.manName || ''];
        } else if (level === 'sakha') {
            names = [child.lokName || '', child.vidName || '', child.mandalName || '', child.sakName || ''];
        } else if (level === 'booth') {
            names = [child.lokName || '', child.vidName || '', child.mandalName || '', child.sakhaName || '', child.boothName || ''];
        }
        return names;
    };


    // The main render function uses two main branches: 'upTo === cluster' (summary table) and 'upTo !== cluster' (detailed tables with page breaks)
    return (
        <div className="p-8 bg-white min-h-screen">
            {/* Conditional Styles for Print/PDF - Standardized for monochrome print */}
            <style>
                {`
                    /* CSS for PDF generation with Puppeteer */
                    ${upTo !== 'cluster' ? '.cluster-page:not(:first-child) { page-break-before: always !important; }' : ''}
                    .cluster-page {
                        page-break-inside: auto !important;
                        overflow: visible !important;
                    }
                    table {
                        page-break-inside: auto !important;
                        border-collapse: collapse !important;
                        width: 100% !important;
                    }
                    tbody {
                        page-break-inside: auto !important;
                    }
                    tr {
                        page-break-inside: avoid !important;
                    }

                    /* Print styles for A4 landscape with Puppeteer */
                    @page {
                        size: A4 landscape;
                        margin: 0.5in;
                    }
                    
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    @media print {
                        .no-print {
                            display: none !important;
                        }
                    }
                    
                    /* Table styling standardization */
                    th, td {
                        border: 2px solid #000 !important;
                        padding: 12px 8px !important;
                        font-size: 14px !important;
                        line-height: 1.4 !important;
                        background-color: #ffffff !important;
                    }
                    
                    th {
                        font-weight: bold !important;
                        background-color: transparent !important;
                        color: #000000 !important;
                    }
                    
                    .cluster-header, .summary-row {
                        background-color: transparent !important;
                        font-weight: bold;
                    }

                    .cluster-page:not(:first-child) {
                        page-break-before: always !important;
                    }
                    
                    .cluster-page {
                        page-break-inside: auto !important;
                        overflow: visible !important;
                    }
                    
                    tbody tr {
                        page-break-inside: avoid !important;
                    }
                    
                    .print-header {
                        font-size: 14px !important;
                        margin-bottom: 10px !important;
                    }
                `}
            </style>

            {/* Header (No Print) */}
            <header className="flex justify-between items-center mb-6 border-b pb-4 no-print">
                <h1 className="text-3xl font-bold text-gray-800">📊 क्लस्टर बूथ रिपोर्ट (Cluster Booth Report)</h1>
                <div className="flex space-x-4">
                    {/* Level Selector */}
                    <select
                        value={upTo}
                        onChange={(e) => setUpTo(e.target.value as LevelType)}
                        className="p-2 border border-gray-400 rounded-md shadow-sm"
                    >
                        <option value="cluster">क्लस्टर तक (Up to Cluster)</option>
                        <option value="lok">लोकसभा तक (Up to Lok Sabha)</option>
                        <option value="vidhansabha">विधानसभा तक (Up to Vidhan Sabha)</option>
                        <option value="mandal">मंडल तक (Up to Mandal)</option>
                        <option value="sakha">शाखा तक (Up to Sakha)</option>
                        <option value="booth">बूथ तक (Up to Booth)</option>
                    </select>

                    {/* PDF Export Button */}
                    <button
                        onClick={exportPdf}
                        disabled={isExporting}
                        className={`px-4 py-2 font-semibold rounded-md shadow-md transition duration-300 ${
                            isExporting
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-700 text-white hover:bg-gray-800'
                            }`}
                    >
                        {isExporting ? '⏳ Generating...' : '⬇️ Export to PDF'}
                    </button>
                </div>
            </header>


            <div ref={reportRef} className="shadow-lg rounded-lg overflow-hidden border border-gray-400">
                {/* --- 1. CLUSTER SUMMARY VIEW ('upTo' is 'cluster') --- */}
                {upTo === 'cluster' ? (
                    <table className="min-w-full divide-y divide-gray-300 border border-gray-400">
                        {/* Table Header */}
                        <thead className="border-b border-gray-400">
                            <tr>
                                {/* Hierarchy Headers */}
                                {headers.hierarchy.map((header, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black border-r"
                                    >
                                        {header}
                                    </th>
                                ))}

                                {/* Count Headers */}
                                {headers.counts.map((header, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-black border-r last:border-r-0"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-300">
                            {reportData.map((cluster) => (
                                <tr key={cluster.clusterId} className="font-extrabold border-t-4 border-black hover:bg-gray-100 transition duration-150">
                                    {/* Cluster Name */}
                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 border-r border-b cluster-header" colSpan={headers.hierarchy.length}>
                                        {cluster.clusterId} - {cluster.clusterName}
                                    </td>
                                    {/* Counts for the Cluster level */}
                                    {getRowCounts(cluster, 'cluster').map((count, index) => (
                                        <td
                                            key={index}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-center font-extrabold text-gray-900 border-r border-b last:border-r-0 summary-row"
                                        >
                                            {count}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    /* --- 2. DETAILED VIEW (Lok Sabha, Vidhansabha, etc. with per-cluster page breaks) --- */
                    <div>
                        {reportData.map((cluster, clusterIndex) => (
                            <div key={cluster.clusterId} className={`cluster-page ${clusterIndex > 0 ? "cluster-section" : ""}`}>
                                
                                <table className="min-w-full divide-y divide-gray-400 border-2 border-gray-600">
                                    {/* Table Header (Repeated for each cluster's table) */}
                                    <thead className="border-b border-gray-600">
                                        <tr>
                                            {headers.hierarchy.map((header, index) => (
                                                <th
                                                    key={index}
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black border-r"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                            {headers.counts.map((header, index) => (
                                                <th
                                                    key={index}
                                                    scope="col"
                                                    className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-black border-r last:border-r-0"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-300">
                                        {/* Children Rows (Lok Sabha, Vidhansabha, Mandal, etc.) */}
                                        {cluster.visibleChildren.map((child, index) => {
                                            const rowNames = getChildNames(child, upTo);
                                            const rowCounts = getRowCounts(child, upTo);
                                            
                                            // Calculate the number of hierarchy cells to skip (empty cells)
                                            const emptyCellsCount = headers.hierarchy.length - rowNames.length - 1;

                                            return (
                                                <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                                    {/* Cluster Cell (1st cell, show cluster name only once with rowspan) */}
                                                    {index === 0 && (
                                                        <td
                                                            rowSpan={cluster.visibleChildren.length}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium align-middle cluster-header"
                                                        >
                                                            {cluster.clusterId} - {cluster.clusterName}
                                                        </td>
                                                    )}

                                                    {/* Empty Cells for higher levels not shown in this row */}
                                                    {[...Array(emptyCellsCount)].map((_, i) => (
                                                        <td key={`empty-${i}`} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-r border-b`}>
                                                            {/* --- */}
                                                        </td>
                                                    ))}

                                                    {/* Children Hierarchy Cells (The current level being displayed) */}
                                                    {rowNames.map((name, nameIndex) => (
                                                        <td
                                                            key={nameIndex}
                                                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 border-r border-b`}
                                                        >
                                                            {name}
                                                        </td>
                                                    ))}

                                                    {/* Count Cells (Lower Levels totals) */}
                                                    {rowCounts.map((count, countIndex) => (
                                                        <td
                                                            key={countIndex}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r border-b last:border-r-0"
                                                        >
                                                            {count}
                                                        </td>
                                                    ))}
                                                </tr>
                                            )
                                        })}

                                        {/* Summary Row for the current Cluster */}
                                        <tr className="font-extrabold border-t border-gray-600 border-b-4 border-gray-600 summary-row">
                                            {/* Total Label */}
                                            <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900" colSpan={1}>
                                                Total
                                            </td>
                                            {/* Lok Sabha Count (Always the first count after the cluster name) */}
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-center font-bold text-gray-900 border-r border-b">
                                                {cluster.totalLoks || new Set(cluster.visibleChildren.map(child => child.lokName)).size}
                                            </td>
                                            {/* Empty cells to align with remaining hierarchy columns */}
                                            {[...Array(headers.hierarchy.length - 2)].map((_, i) => (
                                                <td key={`total-empty-${i}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-r border-b">
                                                    {/* Empty */}
                                                </td>
                                            ))}
                                            
                                            {/* Count Totals */}
                                            {getTotalRowCounts(cluster, upTo).map((count, index) => (
                                                <td
                                                    key={index}
                                                    className="px-6 py-4 whitespace-nowrap text-base text-center font-extrabold text-gray-900 border-r border-b last:border-r-0"
                                                >
                                                    {count}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Add spacing after each table/cluster section */}
                                <div className="mb-8"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClusterReportPage;