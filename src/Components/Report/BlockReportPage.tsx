import React, { useState, useRef, useMemo } from "react";
import { userService } from "../../service/user.service";
import { DistrictSelect } from "./DistrictSelect";
import { ReportLayout } from "./ReportLayout";
import { ChartSection } from "./ChartSection";
import { FullPageLoader, ButtonLoader, BlockFetchingLoader } from "./LoaderComponents";
import { ErrorMessage } from "./ErrorComponents";
import EconomicStatusChart from "../../Components/EconomicStatusChart";
import SchemeSpendingAndSavingChart from "../SchemeInfoMediumChart";
import MinisterReachImpactChart from "../MinisterReachImpactChart";
import MinisterYearPerformanceChart from "../../Components/MinisterYearPerformanceChart";
import CooperativeSchemesAwareness from "../../Components/CooperativeSchemesAwareness";
import BjpGovernmentSatisfactionChart from "../../Components/BjpGovernmentSatisfactionChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";

interface Block {
  bolck_Id: number;
  block_name: string;
  Block_Type: "R" | "U";
  [key: string]: any;
}

export const BlockReportPage: React.FC = () => {

  // const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  // console.log("Logged in token in BlockReportPage:", token);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");
  const [allBlocks, setAllBlocks] = useState<Block[]>([]);
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [selectedBlockName, setSelectedBlockName] = useState<string>("");
  const [blockData, setBlockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [blockType, setBlockType] = useState<"ALL" | "R" | "U">("ALL");
  const [blocksError, setBlocksError] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Load blocks
  const handleDistrictChange = async (id: number, districtName: string = "") => {
    setSelectedDistrict(id);
    setSelectedDistrictName(districtName);
    setSelectedBlockName("");
    setBlockData(null);
    setAllBlocks([]);
    setFilteredBlocks([]);
    setBlocksError(null);
    setLoadingBlocks(true);
    if(!token){
      setBlocksError("token not authenticated");
      setLoadingBlocks(false);
      return;
    }
    try {
      const res = await userService.getDistrictMeta(id,token);
      if (res.success) {
        const blocks = res.data.blocks;
        setAllBlocks(blocks);
        filterBlocks(blocks, blockType);
      } else {
        setBlocksError("Failed to load blocks for selected district");
      }
    } catch (err) {
      setBlocksError("Network error while loading blocks");
    } finally {
      setLoadingBlocks(false);
    }
  };

  const filterBlocks = (blocks: Block[], type: "ALL" | "R" | "U") => {
    if (type === "ALL") {
      setFilteredBlocks(blocks);
    } else {
      setFilteredBlocks(blocks.filter((b) => b.Block_Type === type));
    }
  };

  React.useEffect(() => {
    if (allBlocks.length > 0) {
      filterBlocks(allBlocks, blockType);
    }
    setSelectedBlockName("");
    setBlockData(null);
    setReportError(null);
  }, [blockType, allBlocks]);

  // === GROUP BLOCKS BY CLEAN NAME ===
  const groupedBlockNames = useMemo(() => {
    const map = new Map<string, Block[]>();
    filteredBlocks.forEach(b => {
      // Normalize block name: remove (R)/(U), convert to uppercase, trim spaces
      const cleanName = b.block_name
        .replace(/\s*\([RU]\)$/, "")
        .trim()
        .toUpperCase();
      
      if (!map.has(cleanName)) map.set(cleanName, []);
      map.get(cleanName)!.push(b);
    });
    return Array.from(map.keys()).sort();
  }, [filteredBlocks]);

  // === SUBMIT: Send block name to backend ===
  const handleSubmit = async () => {
    if (!selectedBlockName) return;
    setLoadingReport(true);
    setReportError(null);

    try {
      let res;
      
      if (blockType === "ALL") {
        // Call combined API for ALL blocks
        res = await userService.getCombinedBlockReport(selectedBlockName, selectedDistrict!, token);
      } else {
        // Call getBlockById API for R or U blocks
        const selectedBlock = filteredBlocks.find(b => 
          b.block_name.replace(/\s*\([RU]\)$/, "").trim().toUpperCase() === selectedBlockName
        );
        
        if (!selectedBlock) {
          setReportError("Selected block not found");
          setLoadingReport(false);
          return;
        }
        
        res = await userService.getBlockById(selectedBlock.bolck_Id, token);
      }
      
      if (res.success) {
        setBlockData(res.data);
      } else {
        setReportError("Failed to generate report for selected block");
      }
    } catch (err) {
      setReportError("Network error while generating report");
    } finally {
      setLoadingReport(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current || !blockData) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${blockData.block_name}_Report.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalBlocks = allBlocks.length;
  const ruralCount = allBlocks.filter((b) => b.Block_Type === "R").length;
  const urbanCount = allBlocks.filter((b) => b.Block_Type === "U").length;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Block Report Generator</h2>
        <DistrictSelect selected={selectedDistrict} onChange={(id, name) => handleDistrictChange(id, name || "")} />
      </div>

      {/* Loading blocks */}
      {loadingBlocks && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <BlockFetchingLoader />
        </div>
      )}
      
      {/* Blocks error */}
      {blocksError && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <ErrorMessage 
            message={blocksError} 
            onRetry={() => selectedDistrict && handleDistrictChange(selectedDistrict, selectedDistrictName)} 
          />
        </div>
      )}

      {selectedDistrict && allBlocks.length > 0 && !loadingBlocks && (
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Filter Section */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Block Type</h3>
            <div className="flex gap-3">
              {(["ALL", "R", "U"] as const).map((t) => (
                <label key={t} className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all ${
                  blockType === t 
                    ? "bg-orange-50 border-orange-300 text-orange-700" 
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}>
                  <input
                    type="radio"
                    name="blockType"
                    checked={blockType === t}
                    onChange={() => setBlockType(t)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm">
                    {t === "ALL" ? "All" : t === "R" ? "Rural" : "Urban"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-semibold text-orange-600">{totalBlocks}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">{ruralCount}</div>
                <div className="text-xs text-gray-600">Rural</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">{urbanCount}</div>
                <div className="text-xs text-gray-600">Urban</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Selection */}
      {groupedBlockNames.length > 0 && !loadingBlocks && !blocksError && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Block</label>
            
            <div className="relative">
              <select
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none cursor-pointer"
                value={selectedBlockName}
                onChange={(e) => setSelectedBlockName(e.target.value)}
              >
                <option value="">Choose block...</option>
                {groupedBlockNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {selectedBlockName && (
              <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-2">
                <span className="text-xs text-orange-700">✓ {selectedBlockName}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* No blocks available */}
      {selectedDistrict && !loadingBlocks && !blocksError && groupedBlockNames.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500">No blocks found for the selected district.</p>
        </div>
      )}

      {/* Generate Report Button */}
      {selectedBlockName && !loadingBlocks && !blocksError && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <button
            onClick={handleSubmit}
            disabled={loadingReport}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            {loadingReport ? (
              <>
                <ButtonLoader />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Report</span>
            )}
          </button>
        </div>
      )}

      {/* Loading report */}
      {loadingReport && <FullPageLoader message="Generating report..." />}
      
      {/* Report error */}
      {reportError && (
        <ErrorMessage 
          message={reportError} 
          onRetry={handleSubmit} 
        />
      )}

      {/* REPORT */}
      {blockData && !reportError && (
        <div ref={reportRef}>
          <ReportLayout
            title={`${blockData.block_name} - Block Report`}
            subtitle={`Generated: ${new Date().toLocaleDateString()}`}
            onDownload={downloadPDF}
            loading={loading}
          >
            <div className="space-y-12">
              <ChartSection title="Economic Status" loading={loadingReport}>
                <EconomicStatusChart data={{
                  first: { c20: Number(blockData.c20) || 0, c21: Number(blockData.c21) || 0, c22: Number(blockData.c22) || 0, c23: Number(blockData.c23) || 0 },
                  second: { c25: Number(blockData.c25) || 0, c26: Number(blockData.c26) || 0, c27: Number(blockData.c27) || 0, c28: Number(blockData.c28) || 0 },
                }} />
              </ChartSection>

              <ChartSection title="Scheme Spending & Saving" loading={loadingReport}>
                <SchemeSpendingAndSavingChart data={{
                  first: { c31: Number(blockData.c31), c30: Number(blockData.c30), c33: Number(blockData.c33), c32: Number(blockData.c32) },
                  second: { c35: Number(blockData.c35), c38: Number(blockData.c38), c36: Number(blockData.c36), c37: Number(blockData.c37) }
                }} />
              </ChartSection>

              <ChartSection title="Minister Reach Impact" loading={loadingReport}>
                <MinisterReachImpactChart data={{
                  first: { c40: Number(blockData.c40), c41: Number(blockData.c41), c42: Number(blockData.c42), c43: Number(blockData.c43) },
                  second: { c45: Number(blockData.c45), c46: Number(blockData.c46), c47: Number(blockData.c47), c48: Number(blockData.c48) }
                }} />
              </ChartSection>

              <ChartSection title="Minister Year Performance" loading={loadingReport}>
                <MinisterYearPerformanceChart data={{
                  first: { c51: Number(blockData.c51), c50: Number(blockData.c50), c52: Number(blockData.c52), c53: Number(blockData.c53) },
                  second: { c57: Number(blockData.c57), c56: Number(blockData.c56), c58: Number(blockData.c58), c59: Number(blockData.c59) }
                }} />
              </ChartSection>

              <ChartSection title="Cooperative Schemes Awareness" loading={loadingReport}>
                <CooperativeSchemesAwareness data={{
                  first: { c63: Number(blockData.c63), c62: Number(blockData.c62), c65: Number(blockData.c65), c64: Number(blockData.c64), c66: Number(blockData.c66) },
                  second: { c69: Number(blockData.c69), c68: Number(blockData.c68), c71: Number(blockData.c71), c70: Number(blockData.c70), c72: Number(blockData.c72) }
                }} />
              </ChartSection>

              <ChartSection title="BJP Government Satisfaction" loading={loadingReport}>
                <BjpGovernmentSatisfactionChart data={{
                  first: { c75: Number(blockData.c75), c74: Number(blockData.c74), c77: Number(blockData.c77), c76: Number(blockData.c76) },
                  second: { c80: Number(blockData.c80), c79: Number(blockData.c79), c82: Number(blockData.c82), c81: Number(blockData.c81) }
                }} />
              </ChartSection>
            </div>
          </ReportLayout>
        </div>
      )}
    </div>
  );
};