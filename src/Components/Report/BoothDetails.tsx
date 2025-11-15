// import { useState, useEffect, useCallback } from 'react';
// import axiosInstance from '../../service/axiosInstance';
// import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

// interface Booth {
//   id: number;
//   booth_no: number;
//   booth_name: string;
//   assemblyId: number;
//   isBla2: string;
//   bla2_name: string;
//   bla2_mobile_no: string;
//   slr_per: string;
//   update_date: string;
//   update_count: number;
// }

// interface BoothDetailsProps {
//   assemblyId: number;
//   assemblyName: string;
//   onBack: () => void;
// }

// function BoothDetails({ assemblyId, assemblyName, onBack }: BoothDetailsProps) {
//   const { t } = useTranslation();
//   const [booths, setBooths] = useState<Booth[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>('');
//   const [editingBooth, setEditingBooth] = useState<number | null>(null);
//   const [editData, setEditData] = useState<{bla2_name: string, bla2_mobile_no: string, slr_per: string}>({
//     bla2_name: '',
//     bla2_mobile_no: '',
//     slr_per: ''
//   });
//   const [saving, setSaving] = useState(false);

//   const getBlaStatus = (isBla2: string) => {
//     switch (isBla2) {
//       case 'VALUE_0':
//         return { label: 'Not Sure', color: 'bg-gray-100 text-gray-800' };
//       case 'VALUE_1':
//         return { label: 'Sure', color: 'bg-green-100 text-green-800' };
//       case 'VALUE_2':
//         return { label: 'Dummy Account', color: 'bg-red-100 text-red-800' };
//       default:
//         return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
//     }
//   };

//   const fetchBooths = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await axiosInstance.get(`/districts/get-all-booth-by-assembly/${assemblyId}`);
//       if (response.data && response.data.data) {
//         setBooths(response.data.data);
//       }
//     } catch (err) {
//       setError(t('booth.failedBooths') || 'Failed to fetch booths');
//       console.error('Error fetching booths:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [assemblyId, t]);

//   useEffect(() => {
//     fetchBooths();
//   }, [fetchBooths]);

//   const handleEdit = (booth: Booth) => {
//     setEditingBooth(booth.id);
//     setEditData({
//       bla2_name: booth.bla2_name,
//       bla2_mobile_no: booth.bla2_mobile_no,
//       slr_per: booth.slr_per
//     });
//   };

//   const handleCancel = () => {
//     setEditingBooth(null);
//     setEditData({ bla2_name: '', bla2_mobile_no: '', slr_per: '' });
//   };

//   const handleSave = async (boothId: number) => {
//     setSaving(true);
//     try {
//       await axiosInstance.put(`/districts/update-booth/${boothId}`, editData);
//       await fetchBooths();
//       setEditingBooth(null);
//       setEditData({ bla2_name: '', bla2_mobile_no: '', slr_per: '' });
//     } catch (err: any) {
//       setError(err.response?.data?.error || 'Failed to update booth');
//       console.error('Error updating booth:', err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleFieldChange = (field: string, value: string) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <span className="mt-4 text-gray-600 text-sm sm:text-base">{t('booth.loadingBooths')}</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 sm:p-6">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-700 font-medium transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           {t('booth.backToAssemblies')}
//         </button>
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             {error}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       <button
//         onClick={onBack}
//         className="flex items-center gap-2 mb-6 text-orange-600 hover:text-orange-700 font-medium transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         Back to Assemblies
//       </button>

//       <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-orange-500 p-2 rounded-lg">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               </svg>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">{assemblyName}</h3>
//               <p className="text-sm text-gray-600">{booths.length} {t('booth.booths')} available</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-orange-600">{booths.length}</div>
//             <div className="text-xs text-gray-500">Total Booths</div>
//           </div>
//         </div>
//       </div>

//       {booths.length > 0 ? (
//         <>
//           {/* Mobile Grid */}
//           <div className="block sm:hidden">
//             <div className="grid gap-3">
//               {booths.map((booth) => (
//                 <div key={booth.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-orange-100 p-2 rounded-lg">
//                         <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-gray-900 text-sm">{booth.booth_name}</h4>
//                         <p className="text-xs text-gray-500">Booth #{booth.booth_no}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
//                         #{booth.booth_no}
//                       </span>
//                       {editingBooth === booth.id ? (
//                         <div className="flex gap-1">
//                           <button
//                             onClick={() => handleSave(booth.id)}
//                             disabled={saving}
//                             className="bg-green-500 text-white p-1 rounded hover:bg-green-600 disabled:opacity-50"
//                           >
//                             <Save className="w-3 h-3" />
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             disabled={saving}
//                             className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 disabled:opacity-50"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => handleEdit(booth)}
//                           className="bg-orange-500 text-white p-1 rounded hover:bg-orange-600"
//                         >
//                           <Edit2 className="w-3 h-3" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                   <div className="space-y-2 text-xs">
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">BLA2:</span>
//                       {editingBooth === booth.id ? (
//                         <input
//                           type="text"
//                           value={editData.bla2_name}
//                           onChange={(e) => handleFieldChange('bla2_name', e.target.value)}
//                           className="text-xs border rounded px-1 py-0.5 w-24"
//                         />
//                       ) : (
//                         <span className="font-medium">{booth.bla2_name}</span>
//                       )}
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Status:</span>
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
//                         {getBlaStatus(booth.isBla2).label}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Mobile:</span>
//                       {editingBooth === booth.id ? (
//                         <input
//                           type="text"
//                           value={editData.bla2_mobile_no}
//                           onChange={(e) => handleFieldChange('bla2_mobile_no', e.target.value)}
//                           className="text-xs border rounded px-1 py-0.5 w-24"
//                         />
//                       ) : (
//                         <span className="font-medium">{booth.bla2_mobile_no}</span>
//                       )}
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">SLR %:</span>
//                       {editingBooth === booth.id ? (
//                         <input
//                           type="number"
//                           value={editData.slr_per}
//                           onChange={(e) => handleFieldChange('slr_per', e.target.value)}
//                           className="text-xs border rounded px-1 py-0.5 w-16"
//                         />
//                       ) : (
//                         <span className="font-medium text-green-600">{booth.slr_per}%</span>
//                       )}
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Updates:</span>
//                       <span className="font-medium">{booth.update_count}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Desktop Table */}
//           <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200">
//             <div className="overflow-x-auto">
//               <table className="w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('booth.boothNo')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('booth.boothName')}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       BLA2 Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Mobile No
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       SLR %
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Updates
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Last Updated
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {booths.map((booth) => (
//                     <tr key={booth.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
//                             <span className="text-xs font-medium text-orange-600">#{booth.booth_no}</span>
//                           </div>
//                           <div className="ml-3">
//                             <div className="text-sm font-medium text-gray-900">Booth {booth.booth_no}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{booth.booth_name}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingBooth === booth.id ? (
//                           <input
//                             type="text"
//                             value={editData.bla2_name}
//                             onChange={(e) => handleFieldChange('bla2_name', e.target.value)}
//                             className="text-sm border rounded px-2 py-1 w-full"
//                           />
//                         ) : (
//                           <div className="text-sm text-gray-900">{booth.bla2_name}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
//                           {getBlaStatus(booth.isBla2).label}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingBooth === booth.id ? (
//                           <input
//                             type="text"
//                             value={editData.bla2_mobile_no}
//                             onChange={(e) => handleFieldChange('bla2_mobile_no', e.target.value)}
//                             className="text-sm border rounded px-2 py-1 w-full"
//                           />
//                         ) : (
//                           <div className="text-sm text-gray-900">{booth.bla2_mobile_no}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingBooth === booth.id ? (
//                           <input
//                             type="number"
//                             value={editData.slr_per}
//                             onChange={(e) => handleFieldChange('slr_per', e.target.value)}
//                             className="text-sm border rounded px-2 py-1 w-20"
//                           />
//                         ) : (
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                             {booth.slr_per}%
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{booth.update_count}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {new Date(booth.update_date).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingBooth === booth.id ? (
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleSave(booth.id)}
//                               disabled={saving}
//                               className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
//                             >
//                               <Save className="w-4 h-4" />
//                               Save
//                             </button>
//                             <button
//                               onClick={handleCancel}
//                               disabled={saving}
//                               className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50 flex items-center gap-1"
//                             >
//                               <X className="w-4 h-4" />
//                               Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => handleEdit(booth)}
//                             className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 flex items-center gap-1"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                             Edit
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="text-center py-12">
//           <div className="bg-gray-50 rounded-lg p-8">
//             <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//             </svg>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No Booths Found</h3>
//             <p className="text-gray-500">{t('booth.noBooths')}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default BoothDetails;






import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../service/axiosInstance';
import { ArrowLeft} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BoothRowOrCard from './BoothRowOrCard';// New component import

// --- Interfaces (Kept as is) ---
interface Booth {
  id: number;
  booth_no: number;
  booth_name: string;
  assemblyId: number;
  isBla2: string;
  bla2_name: string;
  bla2_mobile_no: string;
  slr_per: string;
  update_date: string;
  update_count: number;
}

interface BoothDetailsProps {
  assemblyId: number;
  assemblyName: string;
  onBack: () => void;
}
// -------------------------------

function BoothDetails({ assemblyId, assemblyName, onBack }: BoothDetailsProps) {
  const { t } = useTranslation();
  const [booths, setBooths] = useState<Booth[]>([]);
  const [filteredBooths, setFilteredBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'null'>('all');

  // The state that tracks *which* booth is currently saving
  const [savingBoothId, setSavingBoothId] = useState<number | null>(null);

  // Function to determine BLA Status (Kept as is)
  const getBlaStatus = (isBla2: string) => {
    switch (isBla2) {
      case 'VALUE_0':
        return { label: 'Dummy Account', color: 'bg-gray-100 text-gray-800' };
      case 'VALUE_1':
        return { label: 'Unverified', color: 'bg-green-100 text-green-800' };
      case 'VALUE_2':
        return { label: 'Verified', color: 'bg-red-100 text-red-800' };
      case null:
      case undefined:
      case '':
        return { label: 'null', color: 'bg-gray-200 text-gray-500 italic' };
      default:
        return { label: 'null', color: 'bg-gray-200 text-gray-500 italic' };
    }
  };

  const fetchBooths = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Using an abort controller for cleanup is good practice
      const controller = new AbortController();
      const response = await axiosInstance.get(`/districts/get-all-booth-by-assembly/${assemblyId}`, { signal: controller.signal });
      
      if (response.data && response.data.data) {
        setBooths(response.data.data);
        setFilteredBooths(response.data.data);
      }
      return () => controller.abort();
    } catch (err: any) {
      
      setError(t('booth.failedBooths') || 'Failed to fetch booths');
      console.error('Error fetching booths:', err);
    } finally {
      setLoading(false);
    }
  }, [assemblyId, t]);

  useEffect(() => {
    fetchBooths();
  }, [fetchBooths]);

  // Handler passed down to BoothRowOrCard for saving data
  const handleSaveBooth = async (boothId: number, data: { bla2_name: string, bla2_mobile_no: string, slr_per: string, isBla2?: string }) => {
    setSavingBoothId(boothId);
    try {
      await axiosInstance.put(`/districts/update-booth/${boothId}`, data);
      
      // OPTIMIZATION: Instead of refetching the *entire* list, 
      // you could update the single item in the `booths` state,
      // which is faster for small updates.
      // For simplicity, we'll refetch the list as in the original code, but
      // a targeted state update is the best practice for performance.
      await fetchBooths(); 
      applyFilter(statusFilter);

      return { success: true, message: 'Update successful' };
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update booth');
      console.error('Error updating booth:', err);
      return { success: false, message: err.response?.data?.error || 'Failed to update booth' };
    } finally {
      setSavingBoothId(null);
    }
  };

  const applyFilter = (filter: 'all' | 'verified' | 'unverified' | 'null') => {
    let filtered = [...booths];
    
    switch (filter) {
      case 'verified':
        filtered = booths.filter(booth => booth.isBla2 === 'VALUE_2');
        break;
      case 'unverified':
        filtered = booths.filter(booth => booth.isBla2 === 'VALUE_1' || booth.isBla2 === 'VALUE_0');
        break;
      case 'null':
        filtered = booths.filter(booth => 
          !booth.bla2_name || 
          booth.bla2_name.trim() === '' || 
          !booth.bla2_mobile_no || 
          booth.bla2_mobile_no.trim() === '' ||
          !booth.slr_per ||
          booth.slr_per.trim() === ''
        );
        break;
      default:
        filtered = booths;
    }
    
    setFilteredBooths(filtered);
  };

  const handleStatusFilter = (filter: 'all' | 'verified' | 'unverified' | 'null') => {
    setStatusFilter(filter);
    applyFilter(filter);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="mt-4 text-gray-600 text-sm sm:text-base">{t('booth.loadingBooths')}</span>
      </div>
    );
  }

  if (error) {
    return (
      // ... Error display (kept as is) ...
      <div className="p-4 sm:p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('booth.backToAssemblies')}
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-orange-600 hover:text-orange-700 font-medium transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assemblies
      </button>

      {/* Assembly Header (Kept as is) */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{assemblyName}</h3>
              <p className="text-sm text-gray-600">{filteredBooths.length} of {booths.length} {t('booth.booths')} shown</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{filteredBooths.length}</div>
            <div className="text-xs text-gray-500">Filtered</div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <h4 className="text-sm font-semibold text-gray-800">Filter Booths</h4>
          </div>
          {statusFilter !== 'all' && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {statusFilter === 'verified' ? 'Verified Only' : 
               statusFilter === 'unverified' ? 'Unverified Only' : 'Incomplete Data'}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === 'all'
                ? 'bg-gray-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({booths.length})
          </button>
          <button
            onClick={() => handleStatusFilter('verified')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === 'verified'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Verified ({booths.filter(b => b.isBla2 === 'VALUE_2').length})
          </button>
          <button
            onClick={() => handleStatusFilter('unverified')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === 'unverified'
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Unverified (inc. Dummy) ({booths.filter(b => b.isBla2 === 'VALUE_1' || b.isBla2 === 'VALUE_0').length})
          </button>
          <button
            onClick={() => handleStatusFilter('null')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === 'null'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Incomplete ({booths.filter(b => 
              !b.bla2_name || b.bla2_name.trim() === '' || 
              !b.bla2_mobile_no || b.bla2_mobile_no.trim() === '' ||
              !b.slr_per || b.slr_per.trim() === ''
            ).length})
          </button>
        </div>
      </div>

      {booths.length > 0 ? (
        <>
          {filteredBooths.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306" />
                </svg>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No booths match the filter</h3>
                <p className="text-xs text-gray-500">Try selecting a different filter option</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Grid */}
              <div className="block sm:hidden">
                <div className="grid gap-3">
                  {filteredBooths.map((booth) => (
                    <BoothRowOrCard 
                      key={booth.id} 
                      booth={booth} 
                      isMobile={true}
                      getBlaStatus={getBlaStatus}
                      onSave={handleSaveBooth}
                      isSaving={savingBoothId === booth.id}
                    />
                  ))}
                </div>
              </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('booth.boothNo')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('booth.boothName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BLA2 Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SLR %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBooths.map((booth) => (
                    <BoothRowOrCard 
                      key={booth.id} 
                      booth={booth} 
                      isMobile={false}
                      getBlaStatus={getBlaStatus}
                      onSave={handleSaveBooth}
                      isSaving={savingBoothId === booth.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
              </div>
            </>
          )}
        </>
      ) : (
        // ... No Booths Found (kept as is) ...
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Booths Found</h3>
            <p className="text-gray-500">{t('booth.noBooths')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoothDetails;