
import React, { useEffect, useState } from "react";
import { uploadCampaignFile, getCampaigns } from "../../../services/campaign.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Campaign {
    sn: number;
    type?: string;
    campaign_id?: string;
    campaign_name?: string;
    content_type?: string;
    campaign_size?: string;
    sent_count?: string;
    delivered_count?: string;
    status?: string;
    execution_date?: string;
    execution_time?: string;
    channels?: string;
    campaign_report?: string;
    user_id?: string;
}

const CampaignDashboard = () => {
    const [file, setFile] = useState<File | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCampaigns = async () => {
        try {
            const data = await getCampaigns();
            setCampaigns(data);
        } catch (error) {
            console.error("Error fetching campaigns", error);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }

        setLoading(true);
        try {
            await uploadCampaignFile(file);
            toast.success("File uploaded successfully!");
            setFile(null);
            fetchCampaigns();
        } catch (error) {
            console.error("Error uploading file", error);
            toast.error("Failed to upload file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Campaign Dashboard</h1>

                {/* Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Upload Campaign Details (Excel)</h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4">Campaign List</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SN</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {campaigns.map((campaign) => (
                                <tr key={campaign.sn} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.sn}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.campaign_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.campaign_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.campaign_size}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${campaign.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.execution_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {campaigns.length === 0 && (
                        <div className="text-center py-4 text-gray-500">No campaigns found. Upload a file to get started.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignDashboard;
