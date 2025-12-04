import { useState } from "react";
import Sidebar from "./Sidebar";
import ChampaignHome from "./ChampaignHome";
import WhatsappCampaigns from "./Whatsapp";
import CallingCampaigns from "./Calling";
import SMSCampaigns from "./SMS";
const DashboardLayout = () => {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <ChampaignHome />;
      case "whatsapp":
        return <WhatsappCampaigns />;
      case "sms":
        return <SMSCampaigns />;
      case "calling":
        return <CallingCampaigns />;
      case "settings":
        return <h1>Settings</h1>;
      default:
        return <ChampaignHome />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 p-4 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default DashboardLayout;
