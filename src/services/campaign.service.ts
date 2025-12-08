
import axiosInstance from "../service/axiosInstance";

export const uploadCampaignFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(`/champaings/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getCampaigns = async () => {
    const response = await axiosInstance.get(`/champaings/campaign-details`);
    return response.data;
};
