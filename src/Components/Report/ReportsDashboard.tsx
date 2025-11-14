import { useState } from "react";
import { BlockReportPage } from "./BlockReportPage";
import { DistrictReportPage } from "./DistrictReportPage";
import { FullPageLoader } from "./LoaderComponents";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
type Tab = "block" | "district" | "vidhansabha" | "loksabha";



export default function ReportsDashboard() {
  const user = useSelector((state: any) => state.auth.user);
  const { t } = useTranslation();
  // const token = useSelector((state: any) => state.auth.token);

  // Role-based tab access
  const getAvailableTabs = (): Tab[] => {
    switch (user?.role) {
      case "DISTRICT_USER":
        return ["block", "district"];
      case "VIDHANSABHA_USER":

        return ["block", "district", "vidhansabha"];
      case "LOKSABHA_USER":
        return ["block", "district", "vidhansabha", "loksabha"];
      case "ADMIN":
        return ["block", "district", "vidhansabha", "loksabha"];
      default:
        return ["block", "district"];
    }
  };

  const availableTabs = getAvailableTabs();
  const [activeTab, setActiveTab] = useState<Tab>(availableTabs[0]);
  const [loadingTab, setLoadingTab] = useState(false);


  const TabButton = ({ tab }: { tab: Tab }) => {
    const handleTabClick = () => {
      if (tab !== activeTab) {
        setLoadingTab(true);
        setTimeout(() => {
          setActiveTab(tab);
          setLoadingTab(false);
        }, 300);
      }
    };

    // Don't render if tab not available for user role
    if (!availableTabs.includes(tab)) {
      return null;
    }

    return (
      <button
        onClick={handleTabClick}
        disabled={loadingTab}
        className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-xs sm:text-sm ${
          activeTab === tab 
            ? "bg-orange-500 text-white shadow-md" 
            : "text-orange-600 hover:bg-orange-50 border border-orange-200"
        }`}
      >
        {tab === 'block' ? t('reports.blockReport') : tab === 'district' ? t('reports.districtReport') : tab === 'vidhansabha' ? t('reports.vidhansabha') : t('reports.loksabha')}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-4">{t('reports.title')}</h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
            {availableTabs.map(tab => (
              <TabButton key={tab} tab={tab} />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">

          <div className="min-h-[500px]">
            {loadingTab ? (
              <FullPageLoader message={t('reports.loading')} />
            ) : (
              <>
                {activeTab === "block" && <BlockReportPage />}
                {activeTab === "district" && <DistrictReportPage />}
                {activeTab === "vidhansabha" && (
                  <div className="text-center py-12 sm:py-20">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 sm:p-8 rounded-xl border border-yellow-200 max-w-md mx-auto">
                      <div className="text-4xl sm:text-6xl mb-4">🚧</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">{t('reports.vidhansabha')}</h3>
                      <p className="text-sm sm:text-base text-gray-500">{t('reports.vidhansabhaDesc')}</p>
                    </div>
                  </div>
                )}
                {activeTab === "loksabha" && (
                  <div className="text-center py-12 sm:py-20">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-xl border border-blue-200 max-w-md mx-auto">
                      <div className="text-4xl sm:text-6xl mb-4">🚧</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">{t('reports.loksabha')}</h3>
                      <p className="text-sm sm:text-base text-gray-500">{t('reports.loksabhaDesc')}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}