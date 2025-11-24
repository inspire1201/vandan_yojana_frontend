import axiosInstance from "./axiosInstance";

// Helper to get token
const getHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const hierarchyService = {
  // Level 0
  getClusters: () => axiosInstance.get("/admin/hierarchy/clusters", getHeader()),
  getSambhags: () => axiosInstance.get("/admin/hierarchy/sambhags", getHeader()),

  // Level 1
  getLokSabhas: (clusterId: number) => axiosInstance.get(`/admin/hierarchy/loksabha/${clusterId}`, getHeader()),
  getJilas: (sambhagId: number) => axiosInstance.get(`/admin/hierarchy/jila/${sambhagId}`, getHeader()),

  // Level 2
  getVidhanByLok: (lokId: number) => axiosInstance.get(`/admin/hierarchy/vidhansabha/loksabha/${lokId}`, getHeader()),
  getVidhanByJila: (jilaId: number) => axiosInstance.get(`/admin/hierarchy/vidhansabha/jila/${jilaId}`, getHeader()),

  // Level 3, 4, 5
  getMandals: (vidId: number) => axiosInstance.get(`/admin/hierarchy/mandal/${vidId}`, getHeader()),
  getSakhas: (vidId: number, manId: number) => axiosInstance.get(`/admin/hierarchy/sakha/${vidId}/${manId}`, getHeader()),
  getBooths: (vidId: number, sakId: number) => axiosInstance.get(`/admin/hierarchy/booth/${vidId}/${sakId}`, getHeader()),

  getHierarchyDataMultiple: async (payload: { [key: string]: number[] }) => {
        const params: Record<string, string> = {};
        
        // Convert array IDs to comma-separated strings for query parameters
        Object.keys(payload).forEach(key => {
            if (payload[key].length > 0) {
                params[key.replace('Id', 'Id')] = payload[key].join(','); // Ensure key casing matches controller's req.query names (e.g., clusterId)
            }
        });

        // Use a GET request with query parameters
        const response = await axiosInstance.get(`/admin/hierarchy/get-hierarchy-data-mutiple`, { 
            ...getHeader(), 
            params 
        });
        
        return response;
    },
};
