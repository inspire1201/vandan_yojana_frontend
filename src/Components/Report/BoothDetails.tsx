// // import  { useState, useEffect } from 'react';
// // import axiosInstance from '../../service/axiosInstance';
// // import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
// // import { useTranslation } from 'react-i18next';

// // interface Booth {
// //   id: number;
// //   booth_no: number;
// //   booth_name: string;
// //   assemblyId: number;
// //   isBla2: string;
// //   bla2_name: string;
// //   bla2_mobile_no: string;
// //   slr_per: string;
// //   update_date: string;
// //   update_count: number;
// // }

// // interface BoothDetailsProps {
// //   assemblyId: number;
// //   assemblyName: string;
// //   onBack: () => void;
// // }

// // function BoothDetails({ assemblyId, assemblyName, onBack }: BoothDetailsProps) {
// //   const { t } = useTranslation();
// //   const [booths, setBooths] = useState<Booth[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string>('');
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editedBooths, setEditedBooths] = useState<{[key: number]: {bla2_name: string, bla2_mobile_no: string, slr_per: string}}>({});
// //   const [saving, setSaving] = useState(false);

// //   const getBlaStatus = (isBla2: string) => {
// //     switch (isBla2) {
// //       case 'VALUE_0':
// //         return { label: 'Not Sure', color: 'bg-gray-100 text-gray-800' };
// //       case 'VALUE_1':
// //         return { label: 'Sure', color: 'bg-green-100 text-green-800' };
// //       case 'VALUE_2':
// //         return { label: 'Dummy Account', color: 'bg-red-100 text-red-800' };
// //       default:
// //         return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
// //     }
// //   };

// //   const handleEditAll = () => {
// //     setIsEditing(true);
// //     const initialEditData: {[key: number]: {bla2_name: string, bla2_mobile_no: string, slr_per: string}} = {};
// //     booths.forEach(booth => {
// //       initialEditData[booth.id] = {
// //         bla2_name: booth.bla2_name,
// //         bla2_mobile_no: booth.bla2_mobile_no,
// //         slr_per: booth.slr_per
// //       };
// //     });
// //     setEditedBooths(initialEditData);
// //   };

// //   const handleCancel = () => {
// //     setIsEditing(false);
// //     setEditedBooths({});
// //   };

// //   const handleFieldChange = (boothId: number, field: string, value: string) => {
// //     setEditedBooths(prev => ({
// //       ...prev,
// //       [boothId]: {
// //         ...prev[boothId],
// //         [field]: value
// //       }
// //     }));
// //   };

// //   const handleSaveAll = () => {
// //     console.log('=== SAVING ALL BOOTH CHANGES ===');
// //     Object.entries(editedBooths).forEach(([boothId, data]) => {
// //       console.log(`Booth ID: ${boothId}`, {
// //         boothId: parseInt(boothId),
// //         bla2_name: data.bla2_name,
// //         bla2_mobile_no: data.bla2_mobile_no,
// //         slr_per: data.slr_per
// //       });
// //     });
// //     console.log('=== END OF CHANGES ===');
    
// //     // TODO: Add API call here later
// //     setIsEditing(false);
// //     setEditedBooths({});
// //   };

// //   useEffect(() => {
// //     fetchBooths();
// //   }, [assemblyId]);

// //   const fetchBooths = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axiosInstance.get(`/districts/get-all-booth-by-assembly/${assemblyId}`);
// //       if (response.data && response.data.data) {
// //         setBooths(response.data.data);
// //       }
// //     } catch (err) {
// //       setError(t('booth.failedBooths'));
// //       console.error('Error fetching booths:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex flex-col justify-center items-center py-12">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
// //         <span className="mt-4 text-gray-600 text-sm sm:text-base">{t('booth.loadingBooths')}</span>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="p-4 sm:p-6">
// //         <button
// //           onClick={onBack}
// //           className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-700 font-medium transition-colors"
// //         >
// //           <ArrowLeft className="w-4 h-4" />
// //           {t('booth.backToAssemblies')}
// //         </button>
// //         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
// //           <div className="flex items-center">
// //             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
// //               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //             </svg>
// //             {error}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 sm:p-6">
// //       {/* Back Button */}
// //       <button
// //         onClick={onBack}
// //         className="flex items-center gap-2 mb-6 text-orange-600 hover:text-orange-700 font-medium transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg"
// //       >
// //         <ArrowLeft className="w-4 h-4" />
// //         Back to Assemblies
// //       </button>

// //       {/* Stats Header */}
// //       <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-6">
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="bg-orange-500 p-2 rounded-lg">
// //               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
// //               </svg>
// //             </div>
// //             <div>
// //               <h3 className="text-lg font-semibold text-gray-900">{assemblyName}</h3>
// //               <p className="text-sm text-gray-600">{booths.length} {t('booth.booths')} available</p>
// //             </div>
// //           </div>
// //           <div className="text-right">
// //             <div className="text-2xl font-bold text-orange-600">{booths.length}</div>
// //             <div className="text-xs text-gray-500">Total Booths</div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Edit All Button */}
// //       {booths.length > 0 && (
// //         <div className="mb-4 flex justify-end gap-2">
// //           {isEditing ? (
// //             <>
// //               <button
// //                 onClick={handleSaveAll}
// //                 disabled={saving}
// //                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
// //               >
// //                 <Save className="w-4 h-4" />
// //                 Save All Changes
// //               </button>
// //               <button
// //                 onClick={handleCancel}
// //                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
// //               >
// //                 <X className="w-4 h-4" />
// //                 Cancel
// //               </button>
// //             </>
// //           ) : (
// //             <button
// //               onClick={handleEditAll}
// //               className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
// //             >
// //               <Edit2 className="w-4 h-4" />
// //               Edit All Booths
// //             </button>
// //           )}
// //         </div>
// //       )}

// //       {/* Booth Grid for Mobile, Table for Desktop */}
// //       {booths.length > 0 ? (
// //         <>
// //           {/* Mobile Grid */}
// //           <div className="block sm:hidden">
// //             <div className="grid gap-3">
// //               {booths.map((booth) => (
// //                 <div key={booth.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
// //                   <div className="flex items-center justify-between mb-3">
// //                     <div className="flex items-center gap-3">
// //                       <div className="bg-orange-100 p-2 rounded-lg">
// //                         <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
// //                         </svg>
// //                       </div>
// //                       <div>
// //                         <h4 className="font-semibold text-gray-900 text-sm">{booth.booth_name}</h4>
// //                         <p className="text-xs text-gray-500">Booth #{booth.booth_no}</p>
// //                       </div>
// //                     </div>
// //                     <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
// //                       #{booth.booth_no}
// //                     </span>
// //                   </div>
// //                   <div className="space-y-2 text-xs">
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-500">BLA2:</span>
// //                       {isEditing ? (
// //                         <input
// //                           type="text"
// //                           value={editedBooths[booth.id]?.bla2_name || booth.bla2_name}
// //                           onChange={(e) => handleFieldChange(booth.id, 'bla2_name', e.target.value)}
// //                           className="text-xs border rounded px-1 py-0.5 w-24"
// //                         />
// //                       ) : (
// //                         <span className="font-medium">{booth.bla2_name}</span>
// //                       )}
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-500">Status:</span>
// //                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
// //                         {getBlaStatus(booth.isBla2).label}
// //                       </span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-500">Mobile:</span>
// //                       {isEditing ? (
// //                         <input
// //                           type="text"
// //                           value={editedBooths[booth.id]?.bla2_mobile_no || booth.bla2_mobile_no}
// //                           onChange={(e) => handleFieldChange(booth.id, 'bla2_mobile_no', e.target.value)}
// //                           className="text-xs border rounded px-1 py-0.5 w-24"
// //                         />
// //                       ) : (
// //                         <span className="font-medium">{booth.bla2_mobile_no}</span>
// //                       )}
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-500">SLR %:</span>
// //                       {isEditing ? (
// //                         <input
// //                           type="number"
// //                           value={editedBooths[booth.id]?.slr_per || booth.slr_per}
// //                           onChange={(e) => handleFieldChange(booth.id, 'slr_per', e.target.value)}
// //                           className="text-xs border rounded px-1 py-0.5 w-16"
// //                         />
// //                       ) : (
// //                         <span className="font-medium text-green-600">{booth.slr_per}%</span>
// //                       )}
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-500">Updates:</span>
// //                       <span className="font-medium">{booth.update_count}</span>
// //                     </div>

// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Desktop Table */}
// //           <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200">
// //             <div className="overflow-x-auto">
// //               <table className="w-full divide-y divide-gray-200">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       {t('booth.boothNo')}
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       {t('booth.boothName')}
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       BLA2 Name
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Status
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Mobile No
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       SLR %
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Updates
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Last Updated
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {booths.map((booth) => (
// //                     <tr key={booth.id} className="hover:bg-gray-50 transition-colors">
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="flex items-center">
// //                           <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
// //                             <span className="text-xs font-medium text-orange-600">#{booth.booth_no}</span>
// //                           </div>
// //                           <div className="ml-3">
// //                             <div className="text-sm font-medium text-gray-900">Booth {booth.booth_no}</div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{booth.booth_name}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         {isEditing ? (
// //                           <input
// //                             type="text"
// //                             value={editedBooths[booth.id]?.bla2_name || booth.bla2_name}
// //                             onChange={(e) => handleFieldChange(booth.id, 'bla2_name', e.target.value)}
// //                             className="text-sm border rounded px-2 py-1 w-full"
// //                           />
// //                         ) : (
// //                           <div className="text-sm text-gray-900">{booth.bla2_name}</div>
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
// //                           {getBlaStatus(booth.isBla2).label}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         {isEditing ? (
// //                           <input
// //                             type="text"
// //                             value={editedBooths[booth.id]?.bla2_mobile_no || booth.bla2_mobile_no}
// //                             onChange={(e) => handleFieldChange(booth.id, 'bla2_mobile_no', e.target.value)}
// //                             className="text-sm border rounded px-2 py-1 w-full"
// //                           />
// //                         ) : (
// //                           <div className="text-sm text-gray-900">{booth.bla2_mobile_no}</div>
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         {isEditing ? (
// //                           <input
// //                             type="number"
// //                             value={editedBooths[booth.id]?.slr_per || booth.slr_per}
// //                             onChange={(e) => handleFieldChange(booth.id, 'slr_per', e.target.value)}
// //                             className="text-sm border rounded px-2 py-1 w-20"
// //                           />
// //                         ) : (
// //                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //                             {booth.slr_per}%
// //                           </span>
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{booth.update_count}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-500">
// //                           {new Date(booth.update_date).toLocaleDateString()}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </>
// //       ) : (
// //         <div className="text-center py-12">
// //           <div className="bg-gray-50 rounded-lg p-8">
// //             <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
// //             </svg>
// //             <h3 className="text-lg font-medium text-gray-900 mb-2">No Booths Found</h3>
// //             <p className="text-gray-500">{t('booth.noBooths')}</p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default BoothDetails;




// import { useState, useEffect, useCallback, useRef } from 'react';
// import axiosInstance from '../../service/axiosInstance';
// import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

// // --- INTERFACES ---

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

// interface EditableFields {
//   bla2_name: string;
//   bla2_mobile_no: string;
//   slr_per: string;
// }

// interface BoothDetailsProps {
//   assemblyId: number;
//   assemblyName: string;
//   onBack: () => void;
// }

// // --- UTILITY FUNCTIONS ---

// /**
//  * Custom hook for debouncing state updates.
//  * This ensures the expensive setEditedBooths update only runs after the user pauses typing.
//  * It uses a local state for immediate visual feedback and a debounced effect for the global state update.
//  */
// function useDebouncedState<T>(initialValue: T, delay: number, callback: (value: T) => void): [T, React.Dispatch<React.SetStateAction<T>>] {
//   const [value, setValue] = useState<T>(initialValue);
//   const callbackRef = useRef(callback);
//   callbackRef.current = callback; // Ensure the latest callback is used

//   useEffect(() => {
//     // Only debounce if the current value is different from the initial value
//     // In our case, the initial value will be set on edit, and subsequent changes are debounced
//     const handler = setTimeout(() => {
//       callbackRef.current(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return [value, setValue];
// }


// const getBlaStatus = (isBla2: string) => {
//   switch (isBla2) {
//     case 'VALUE_0':
//       return { label: 'Not Sure', color: 'bg-gray-100 text-gray-800' };
//     case 'VALUE_1':
//       return { label: 'Sure', color: 'bg-green-100 text-green-800' };
//     case 'VALUE_2':
//       return { label: 'Dummy Account', color: 'bg-red-100 text-red-800' };
//     default:
//       return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
//   }
// };

// // --- COMPONENT ---

// function BoothDetails({ assemblyId, assemblyName, onBack }: BoothDetailsProps) {
//   const { t } = useTranslation();
//   const [booths, setBooths] = useState<Booth[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
  
//   // The main source of truth for all edits, updated via the debounced hook
//   const [editedBooths, setEditedBooths] = useState<{[key: number]: EditableFields}>({});

//   // --- API CALL ---

//   const fetchBooths = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await axiosInstance.get(`/districts/get-all-booth-by-assembly/${assemblyId}`);
//       if (response.data && response.data.data) {
//         setBooths(response.data.data);
//       } else {
//         setBooths([]);
//       }
//     } catch (err) {
//       setError(t('booth.failedBooths') || 'Failed to fetch booths.');
//       console.error('Error fetching booths:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [assemblyId, t]);

//   useEffect(() => {
//     fetchBooths();
//   }, [fetchBooths]);

//   // --- EDIT HANDLERS ---

//   const handleEditAll = () => {
//     setIsEditing(true);
//     // Initialize editedBooths with current booth values
//     const initialEditData: {[key: number]: EditableFields} = {};
//     booths.forEach(booth => {
//       initialEditData[booth.id] = {
//         bla2_name: booth.bla2_name,
//         bla2_mobile_no: booth.bla2_mobile_no,
//         slr_per: booth.slr_per
//       };
//     });
//     setEditedBooths(initialEditData);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedBooths({}); // Clear any unsaved changes
//   };
  
//   // --- OPTIMIZED SAVE HANDLER ---
  
//   const handleSaveAll = async () => {
//     setSaving(true);
    
//     // 1. Identify and consolidate ONLY the modified booth data
//     const updatedBooths = booths
//       .map(booth => {
//         const editedData = editedBooths[booth.id];
        
//         // If editedData is missing or we're not in editing mode, skip
//         if (!editedData) return null;

//         // Check if any field for this booth has been modified
//         const isModified = (
//           editedData.bla2_name !== booth.bla2_name ||
//           editedData.bla2_mobile_no !== booth.bla2_mobile_no ||
//           editedData.slr_per !== booth.slr_per
//         );

//         if (isModified) {
//           // Structure the data for the API
//           return {
//             boothId: booth.id,
//             bla2_name: editedData.bla2_name,
//             bla2_mobile_no: editedData.bla2_mobile_no,
//             slr_per: editedData.slr_per,
//             // You can add assemblyId here if the API requires it for routing/security
//           };
//         }
//         return null;
//       })
//       .filter((booth): booth is { boothId: number; bla2_name: string; bla2_mobile_no: string; slr_per: string } => booth !== null);

//     console.log('=== CONSOLIDATED MODIFIED BOOTH DATA FOR API CALL ===');
//     console.log(updatedBooths);
//     console.log(`Total Booths Modified: ${updatedBooths.length}`);
//     console.log('=====================================================');

//     if (updatedBooths.length === 0) {
//       console.log('No changes detected, cancelling save operation.');
//       setSaving(false);
//       setIsEditing(false);
//       setEditedBooths({});
//       return;
//     }
    
//     // TODO: IMPLEMENT ACTUAL API CALL HERE (Placeholder Logic Below)
//     /*
//     try {
//         const response = await axiosInstance.post('/districts/bulk-update-booths', { updates: updatedBooths });
//         // After successful save, update the local booth state for immediate display
//         await fetchBooths(); 
//     } catch (err) {
//         setError(t('booth.failedSave') || 'Failed to save booth data.');
//         console.error('Error saving booths:', err);
//     } finally {
//         setSaving(false);
//         setIsEditing(false);
//         setEditedBooths({});
//     }
//     */
    
//     // Placeholder logic to simulate API success and update local state immediately
//     setTimeout(() => {
//         setBooths(prevBooths => 
//             prevBooths.map(booth => {
//                 const update = updatedBooths.find(u => u.boothId === booth.id);
//                 if (update) {
//                     return {
//                         ...booth,
//                         bla2_name: update.bla2_name,
//                         bla2_mobile_no: update.bla2_mobile_no,
//                         slr_per: update.slr_per,
//                         update_count: booth.update_count + 1,
//                         update_date: new Date().toISOString()
//                     };
//                 }
//                 return booth;
//             })
//         );
//         setSaving(false);
//         setIsEditing(false);
//         setEditedBooths({});
//     }, 1000); // Simulate network latency
//   };


//   // --- RENDER LOGIC ---

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//         <span className="mt-4 text-gray-600 text-sm sm:text-base">{t('booth.loadingBooths') || 'Loading booths...'}</span>
//       </div>
//     );
//   }

//   if (error) {
//     // ... (Error display remains the same)
//     return (
//       <div className="p-4 sm:p-6">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-700 font-medium transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           {t('booth.backToAssemblies') || 'Back to Assemblies'}
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
//       {/* Back Button */}
//       <button
//         onClick={onBack}
//         className="flex items-center gap-2 mb-6 text-orange-600 hover:text-orange-700 font-medium transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         {t('booth.backToAssemblies') || 'Back to Assemblies'}
//       </button>

//       {/* Stats Header */}
//       <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-6">
//         <div className="flex items-center justify-between">
//           {/* ... (Header content remains the same) */}
//           <div className="flex items-center gap-3">
//             <div className="bg-orange-500 p-2 rounded-lg">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               </svg>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">{assemblyName}</h3>
//               <p className="text-sm text-gray-600">{booths.length} {t('booth.booths') || 'booths'} available</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-orange-600">{booths.length}</div>
//             <div className="text-xs text-gray-500">Total Booths</div>
//           </div>
//         </div>
//       </div>

//       {/* Edit All Button */}
//       {booths.length > 0 && (
//         <div className="mb-4 flex justify-end gap-2">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={handleSaveAll}
//                 disabled={saving || Object.keys(editedBooths).length === 0} 
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
//               >
//                 {saving ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 ) : (
//                     <Save className="w-4 h-4" />
//                 )}
//                 {saving ? 'Saving...' : 'Save All Changes'}
//               </button>
//               <button
//                 onClick={handleCancel}
//                 disabled={saving}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//                 Cancel
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={handleEditAll}
//               className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 transition-colors"
//             >
//               <Edit2 className="w-4 h-4" />
//               Edit All Booths
//             </button>
//           )}
//         </div>
//       )}

//       {/* Booth Grid/Table */}
//       {booths.length > 0 ? (
//         <>
//           {/* Mobile Grid */}
//           <div className="block sm:hidden">
//             <div className="grid gap-3">
//               {booths.map((booth) => (
//                 <OptimizedBoothRowMobile 
//                     key={booth.id}
//                     booth={booth}
//                     isEditing={isEditing}
//                     currentEditedData={editedBooths[booth.id]}
//                     setEditedBooths={setEditedBooths}
//                     saving={saving}
//                     getBlaStatus={getBlaStatus}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Desktop Table */}
//           <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('booth.boothNo') || 'Booth No'}
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {t('booth.boothName') || 'Booth Name'}
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
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {booths.map((booth) => (
//                     <OptimizedBoothRowDesktop 
//                         key={booth.id}
//                         booth={booth}
//                         isEditing={isEditing}
//                         currentEditedData={editedBooths[booth.id]}
//                         setEditedBooths={setEditedBooths}
//                         saving={saving}
//                         getBlaStatus={getBlaStatus}
//                     />
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="text-center py-12">
//           {/* ... (No Booths Found section remains the same) */}
//           <div className="bg-gray-50 rounded-lg p-8">
//             <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//             </svg>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No Booths Found</h3>
//             <p className="text-gray-500">{t('booth.noBooths') || 'There are no booth details available for this assembly.'}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default BoothDetails;


// // --- OPTIMIZED CHILD COMPONENTS FOR DEBOUNCING ---

// interface OptimizedRowProps {
//     booth: Booth;
//     isEditing: boolean;
//     currentEditedData: EditableFields | undefined;
//     setEditedBooths: React.Dispatch<React.SetStateAction<{[key: number]: EditableFields}>>;
//     saving: boolean;
//     getBlaStatus: (isBla2: string) => { label: string; color: string };
// }

// // 1. Mobile Row Component
// function OptimizedBoothRowMobile({ booth, isEditing, currentEditedData, setEditedBooths, saving, getBlaStatus }: OptimizedRowProps) {
//     // Determine the initial value based on the global state
//     const initialValues: EditableFields = currentEditedData || {
//         bla2_name: booth.bla2_name,
//         bla2_mobile_no: booth.bla2_mobile_no,
//         slr_per: booth.slr_per,
//     };

//     // This local state updates immediately on every keystroke for instant UI feedback
//     const [localName, setLocalName] = useState(initialValues.bla2_name);
//     const [localMobile, setLocalMobile] = useState(initialValues.bla2_mobile_no);
//     const [localSlr, setLocalSlr] = useState(initialValues.slr_per);

//     // This effect ensures the local state is reset when the global edit state changes (e.g., when the user clicks 'Edit All' or 'Cancel')
//     useEffect(() => {
//         setLocalName(initialValues.bla2_name);
//         setLocalMobile(initialValues.bla2_mobile_no);
//         setLocalSlr(initialValues.slr_per);
//     }, [isEditing, booth.id, initialValues.bla2_name, initialValues.bla2_mobile_no, initialValues.slr_per]);

//     // Use a custom debounce hook to update the global editedBooths state
//     // This is the expensive operation we want to throttle
//     const handleDebouncedUpdate = (field: keyof EditableFields, value: string) => {
//         setEditedBooths(prev => ({
//             ...prev,
//             [booth.id]: {
//                 ...prev[booth.id], // Ensure existing fields are kept
//                 [field]: value
//             }
//         }));
//     };
    
//     // We only need one instance of the hook to manage updates, but we'll use a local function to trigger the update logic
//     const updateDebouncedState = useDebouncedState(localName, 300, () => {
//         handleDebouncedUpdate('bla2_name', localName);
//         handleDebouncedUpdate('bla2_mobile_no', localMobile);
//         handleDebouncedUpdate('slr_per', localSlr);
//     });

//     const handleFieldChange = (field: keyof EditableFields, value: string) => {
//         let finalValue = value;
//         if (field === 'bla2_mobile_no') {
//             finalValue = value.replace(/[^0-9]/g, '');
//             setLocalMobile(finalValue);
//         } else if (field === 'slr_per') {
//             finalValue = value.replace(/[^0-9.]/g, '');
//             setLocalSlr(finalValue);
//         } else {
//             setLocalName(finalValue);
//         }
        
//         // This line triggers the debounced update after 300ms of inactivity
//         updateDebouncedState[1](finalValue); 
//     };

//     const displayData = isEditing ? { bla2_name: localName, bla2_mobile_no: localMobile, slr_per: localSlr } : booth;

//     return (
//         <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-3">
//               <div className="bg-orange-100 p-2 rounded-lg">
//                 <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-gray-900 text-sm">{booth.booth_name}</h4>
//                 <p className="text-xs text-gray-500">Booth #{booth.booth_no}</p>
//               </div>
//             </div>
//             <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
//               #{booth.booth_no}
//             </span>
//           </div>
//           <div className="space-y-2 text-xs">
//             {/* BLA2 Name */}
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500">BLA2:</span>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={displayData.bla2_name}
//                   onChange={(e) => handleFieldChange('bla2_name', e.target.value)}
//                   className="text-xs border rounded px-1 py-0.5 w-24 focus:ring-orange-500 focus:border-orange-500"
//                   disabled={saving}
//                 />
//               ) : (
//                 <span className="font-medium truncate max-w-[50%]">{booth.bla2_name}</span>
//               )}
//             </div>
//             {/* Status */}
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500">Status:</span>
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
//                 {getBlaStatus(booth.isBla2).label}
//               </span>
//             </div>
//             {/* Mobile */}
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500">Mobile:</span>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={displayData.bla2_mobile_no}
//                   onChange={(e) => handleFieldChange('bla2_mobile_no', e.target.value)}
//                   className="text-xs border rounded px-1 py-0.5 w-24 focus:ring-orange-500 focus:border-orange-500"
//                   maxLength={15}
//                   disabled={saving}
//                 />
//               ) : (
//                 <span className="font-medium">{booth.bla2_mobile_no}</span>
//               )}
//             </div>
//             {/* SLR % */}
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500">SLR %:</span>
//               {isEditing ? (
//                 <input
//                   type="number"
//                   value={displayData.slr_per}
//                   onChange={(e) => handleFieldChange('slr_per', e.target.value)}
//                   className="text-xs border rounded px-1 py-0.5 w-16 focus:ring-orange-500 focus:border-orange-500"
//                   min="0"
//                   max="100"
//                   disabled={saving}
//                 />
//               ) : (
//                 <span className="font-medium text-green-600">{booth.slr_per}%</span>
//               )}
//             </div>
//             {/* Updates */}
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500">Updates:</span>
//               <span className="font-medium">{booth.update_count}</span>
//             </div>
//           </div>
//         </div>
//     );
// }

// // 2. Desktop Row Component
// function OptimizedBoothRowDesktop({ booth, isEditing, currentEditedData, setEditedBooths, saving, getBlaStatus }: OptimizedRowProps) {
//     // Determine the initial value based on the global state
//     const initialValues: EditableFields = currentEditedData || {
//         bla2_name: booth.bla2_name,
//         bla2_mobile_no: booth.bla2_mobile_no,
//         slr_per: booth.slr_per,
//     };

//     // This local state updates immediately on every keystroke for instant UI feedback
//     const [localName, setLocalName] = useState(initialValues.bla2_name);
//     const [localMobile, setLocalMobile] = useState(initialValues.bla2_mobile_no);
//     const [localSlr, setLocalSlr] = useState(initialValues.slr_per);

//     // This effect ensures the local state is reset when the global edit state changes (e.g., when the user clicks 'Edit All' or 'Cancel')
//     useEffect(() => {
//         setLocalName(initialValues.bla2_name);
//         setLocalMobile(initialValues.bla2_mobile_no);
//         setLocalSlr(initialValues.slr_per);
//     }, [isEditing, booth.id, initialValues.bla2_name, initialValues.bla2_mobile_no, initialValues.slr_per]);

//     // Use a custom debounce hook to update the global editedBooths state
//     const handleDebouncedUpdate = (field: keyof EditableFields, value: string) => {
//         setEditedBooths(prev => ({
//             ...prev,
//             [booth.id]: {
//                 ...prev[booth.id], // Ensure existing fields are kept
//                 [field]: value
//             }
//         }));
//     };

//     // We only need one instance of the hook to manage updates
//     const updateDebouncedState = useDebouncedState(localName, 300, () => {
//         // Since we debounce on localName change, we must update all fields in the global state
//         // to ensure any changes in localMobile or localSlr are also captured when the user pauses.
//         handleDebouncedUpdate('bla2_name', localName);
//         handleDebouncedUpdate('bla2_mobile_no', localMobile);
//         handleDebouncedUpdate('slr_per', localSlr);
//     });

//     const handleFieldChange = (field: keyof EditableFields, value: string) => {
//         let finalValue = value;
//         if (field === 'bla2_mobile_no') {
//             finalValue = value.replace(/[^0-9]/g, '');
//             setLocalMobile(finalValue);
//         } else if (field === 'slr_per') {
//             finalValue = value.replace(/[^0-9.]/g, '');
//             setLocalSlr(finalValue);
//         } else {
//             setLocalName(finalValue);
//         }
        
//         // This line triggers the debounced update after 300ms of inactivity
//         // Since all three fields share the same debounce mechanism, a change in any one will trigger the combined update.
//         updateDebouncedState[1](finalValue); 
//     };

//     const displayData = isEditing ? { bla2_name: localName, bla2_mobile_no: localMobile, slr_per: localSlr } : booth;

//     return (
//         <tr key={booth.id} className="hover:bg-gray-50 transition-colors">
//             <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center">
//                     <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
//                         <span className="text-xs font-medium text-orange-600">#{booth.booth_no}</span>
//                     </div>
//                     <div className="ml-3">
//                         <div className="text-sm font-medium text-gray-900">Booth {booth.booth_no}</div>
//                     </div>
//                 </div>
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-900">{booth.booth_name}</div>
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap w-48">
//                 {isEditing ? (
//                     <input
//                         type="text"
//                         value={displayData.bla2_name}
//                         onChange={(e) => handleFieldChange('bla2_name', e.target.value)}
//                         className="text-sm border rounded px-2 py-1 w-full focus:ring-orange-500 focus:border-orange-500"
//                         disabled={saving}
//                     />
//                 ) : (
//                     <div className="text-sm text-gray-900">{booth.bla2_name}</div>
//                 )}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap">
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
//                     {getBlaStatus(booth.isBla2).label}
//                 </span>
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap w-40">
//                 {isEditing ? (
//                     <input
//                         type="text"
//                         value={displayData.bla2_mobile_no}
//                         onChange={(e) => handleFieldChange('bla2_mobile_no', e.target.value)}
//                         className="text-sm border rounded px-2 py-1 w-full focus:ring-orange-500 focus:border-orange-500"
//                         maxLength={15}
//                         disabled={saving}
//                     />
//                 ) : (
//                     <div className="text-sm text-gray-900">{booth.bla2_mobile_no}</div>
//                 )}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap w-24">
//                 {isEditing ? (
//                     <input
//                         type="number"
//                         value={displayData.slr_per}
//                         onChange={(e) => handleFieldChange('slr_per', e.target.value)}
//                         className="text-sm border rounded px-2 py-1 w-20 focus:ring-orange-500 focus:border-orange-500"
//                         min="0"
//                         max="100"
//                         disabled={saving}
//                     />
//                 ) : (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         {booth.slr_per}%
//                     </span>
//                 )}
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-900">{booth.update_count}</div>
//             </td>
//             <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="text-sm text-gray-500">
//                     {new Date(booth.update_date).toLocaleDateString()}
//                 </div>
//             </td>
//         </tr>
//     );
// }







import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axiosInstance from '../../service/axiosInstance';
import { ArrowLeft, Save, X } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

// --- INTERFACES ---

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

interface EditableFields {
  bla2_name: string;
  bla2_mobile_no: string;
  slr_per: string;
}

interface BoothDetailsProps {
  assemblyId: number;
  assemblyName: string;
  onBack: () => void;
}

interface InlineEditRowPropsBase {
    booth: Booth;
    editedData: EditableFields | undefined;
    updateGlobalEditedBooths: (boothId: number, field: keyof EditableFields, value: string) => void;
    saving: boolean;
    getBlaStatus: (isBla2: string) => { label: string; color: string };
    activeCell: {boothId: number | null, field: keyof EditableFields | null};
    setActiveCell: React.Dispatch<React.SetStateAction<{boothId: number | null, field: keyof EditableFields | null}>>;
}

/**
 * NEW: Interface for the EditableCell component props
 */
interface EditableCellProps {
    boothId: number;
    field: keyof EditableFields;
    initialValue: string;
    updateGlobalEditedBooths: (boothId: number, field: keyof EditableFields, value: string) => void;
    activeCell: {boothId: number | null, field: keyof EditableFields | null};
    setActiveCell: React.Dispatch<React.SetStateAction<{boothId: number | null, field: keyof EditableFields | null}>>;
    type: 'text' | 'number';
    validation: 'text' | 'mobile' | 'slr';
    saving: boolean; // Pass saving status down to disable the input
}


// --- UTILITY HOOKS & FUNCTIONS ---

const getBlaStatus = (isBla2: string) => {
  switch (isBla2) {
    case 'VALUE_0':
      return { label: 'Not Sure', color: 'bg-gray-100 text-gray-800' };
    case 'VALUE_1':
      return { label: 'Sure', color: 'bg-green-100 text-green-800' };
    case 'VALUE_2':
      return { label: 'Dummy Account', color: 'bg-red-100 text-red-800' };
    default:
      return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  }
};

// --- MAIN COMPONENT ---

export default function BoothDetails({ assemblyId, assemblyName, onBack }: BoothDetailsProps) {
  const { t } = useTranslation();
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [editedBooths, setEditedBooths] = useState<{[key: number]: EditableFields}>({});
  const [saving, setSaving] = useState(false);
  
  const [activeCell, setActiveCell] = useState<{boothId: number | null, field: keyof EditableFields | null}>({ boothId: null, field: null });


  // --- API CALLS ---

  const fetchBooths = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get(`/districts/get-all-booth-by-assembly/${assemblyId}`);
      if (response.data && response.data.data) {
        setBooths(response.data.data);
      } else {
        setBooths([]);
      }
    } catch (err) {
      setError(t('booth.failedBooths') || 'Failed to fetch booths.');
      console.error('Error fetching booths:', err);
    } finally {
      setLoading(false);
      setEditedBooths({}); 
    }
  }, [assemblyId, t]);

  useEffect(() => {
    fetchBooths();
  }, [fetchBooths]);
  
  // --- INLINE EDIT HANDLERS ---
  
  const updateGlobalEditedBooths = useCallback((boothId: number, field: keyof EditableFields, value: string) => {
    
    const originalBooth = booths.find(b => b.id === boothId);

    if (!originalBooth) return;

    const originalValue = originalBooth[field];
    
    // Check if the new value is different from the original value.
    if (value === originalValue) {
        // If it's the same as the original, clear it from editedBooths to keep the object clean
        setEditedBooths(prev => {
            const newBoothEdit = { ...prev[boothId], [field]: undefined };
            
            // Check if all fields for this booth are either undefined or match the original
            const isBoothCleared = (
                newBoothEdit.bla2_name === undefined || newBoothEdit.bla2_name === originalBooth.bla2_name
            ) && (
                newBoothEdit.bla2_mobile_no === undefined || newBoothEdit.bla2_mobile_no === originalBooth.bla2_mobile_no
            ) && (
                newBoothEdit.slr_per === undefined || newBoothEdit.slr_per === originalBooth.slr_per
            );

            if (isBoothCleared) {
                // If cleared, remove the whole boothId entry from editedBooths
                const { [boothId]: removed, ...rest } = prev;
                return rest;
            }
            return { ...prev, [boothId]: newBoothEdit };
        });
        return;
    }
    
    // If it changed, save the new value in the global edited state
    setEditedBooths(prev => ({
      ...prev,
      [boothId]: {
        ...(prev[boothId] || {} as EditableFields),
        [field]: value
      }
    }));
  }, [booths]);

  const handleCancel = () => {
    setEditedBooths({});
    setActiveCell({ boothId: null, field: null });
  };
  
  // --- BULK SAVE HANDLER ---
  
  const handleBulkSave = useCallback(async () => {
    setSaving(true);
    setError('');
    setActiveCell({ boothId: null, field: null });

    const updatedBooths = Object.entries(editedBooths)
      .map(([id, editedData]) => {
        const boothId = Number(id);
        const originalBooth = booths.find(b => b.id === boothId);

        const payload: any = { boothId };
        
        (['bla2_name', 'bla2_mobile_no', 'slr_per'] as Array<keyof EditableFields>).forEach(field => {
            const originalValue = originalBooth?.[field];
            const editedValue = editedData[field];

            // Only include fields that are explicitly set AND different from original
            if (editedValue !== undefined && editedValue !== originalValue) {
                // Apply final cleanup for DB: map empty string to null
                payload[field] = editedValue.trim() === '' ? null : editedValue;
            }
        });
        
        // If the payload only contains boothId, it means no valid fields were changed
        if (Object.keys(payload).length > 1) {
            return payload;
        }
        return null;
      })
      .filter((item): item is { boothId: number; bla2_name?: string; bla2_mobile_no?: string; slr_per?: string | null } => item !== null);


    if (updatedBooths.length === 0) {
      setSaving(false);
      return;
    }
    
    // API Call for Bulk Update
    try {
        // Using PUT as defined in your userRoute
        await axiosInstance.put('/districts/bulk-update-booths', { updates: updatedBooths });
        await fetchBooths(); 
        
    } catch (err: any) {
        const errorMessage = err.response?.data?.error || t('booth.failedSave') || 'Failed to save booth data.';
        setError(errorMessage);
        console.error('Error saving booths:', err);
    } finally {
        setSaving(false);
        setEditedBooths({});
    }
  }, [editedBooths, booths, fetchBooths, t]);


  // --- RENDER LOGIC ---

  const renderContent = useMemo(() => {
    // ... (Loading and Error states remain the same)
    if (loading || error || booths.length === 0) {
        if (loading) return (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <span className="mt-4 text-gray-600 text-sm sm:text-base">{t('booth.loadingBooths') || 'Loading booths...'}</span>
            </div>
        );
        
        if (error) return (
             <div className="p-4 sm:p-6">
                <button onClick={onBack} className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-700 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {t('booth.backToAssemblies') || 'Back to Assemblies'}
                </button>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        {error}
                    </div>
                </div>
            </div>
        );

        if (booths.length === 0) return (
            <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Booths Found</h3>
                    <p className="text-gray-500">{t('booth.noBooths') || 'There are no booth details available for this assembly.'}</p>
                </div>
            </div>
        );
    }
    
    // const changesCount = Object.keys(editedBooths).length;

    return (
      <>
        {/* Mobile Grid */}
        <div className="block sm:hidden">
          <div className="grid gap-3">
            {booths.map((booth) => (
              <InlineEditRowMobile 
                  key={booth.id}
                  booth={booth}
                  editedData={editedBooths[booth.id]}
                  updateGlobalEditedBooths={updateGlobalEditedBooths}
                  activeCell={activeCell}
                  setActiveCell={setActiveCell}
                  saving={saving}
                  getBlaStatus={getBlaStatus}
              />
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('booth.boothNo') || 'Booth No'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('booth.boothName') || 'Booth Name'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BLA2 Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLR %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {booths.map((booth) => (
                  <InlineEditRowDesktop 
                      key={booth.id}
                      booth={booth}
                      editedData={editedBooths[booth.id]}
                      updateGlobalEditedBooths={updateGlobalEditedBooths}
                      activeCell={activeCell}
                      setActiveCell={setActiveCell}
                      saving={saving}
                      getBlaStatus={getBlaStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        

      </>
    );

  }, [loading, error, booths, editedBooths, saving, t, onBack, updateGlobalEditedBooths, activeCell, handleBulkSave]);


  return (
    <div className="p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-orange-600 hover:text-orange-700 font-medium transition-colors bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('booth.backToAssemblies') || 'Back to Assemblies'}
      </button>

      {/* Stats Header with Edit Button */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mb-6">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{assemblyName}</h3>
                <p className="text-xs text-gray-600">{booths.length} booths</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-600">{booths.length}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
          {booths.length > 0 && (
            <div className="flex flex-col gap-2">
              {Object.keys(editedBooths).length > 0 ? (
                <>
                  <div className="text-center text-xs text-gray-600 font-medium">
                    {Object.keys(editedBooths).length} booth(s) modified
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkSave}
                      disabled={saving}
                      className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <button
                  className="w-full bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 transition-colors text-sm"
                  onClick={() => setActiveCell({ boothId: booths[0]?.id || null, field: 'bla2_name' })}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Booths
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{assemblyName}</h3>
              <p className="text-sm text-gray-600">{booths.length} {t('booth.booths') || 'booths'} available</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{booths.length}</div>
              <div className="text-xs text-gray-500">Total Booths</div>
            </div>
            {booths.length > 0 && (
              <div className="flex gap-2">
                {Object.keys(editedBooths).length > 0 ? (
                  <>
                    <span className="self-center text-sm text-gray-600 font-medium mr-2">
                      {Object.keys(editedBooths).length} booth(s) modified
                    </span>
                    <button
                      onClick={handleBulkSave}
                      disabled={saving}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saving ? 'Saving...' : 'Save All'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 transition-colors"
                    onClick={() => setActiveCell({ boothId: booths[0]?.id || null, field: 'bla2_name' })}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Booths
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Content (Table/Grid and Save Bar) */}
      {renderContent}
    </div>
  );
}


// --- INLINE EDIT ROW COMPONENTS ---

/**
 * Utility Component for managing a single editable cell's state and focus.
 */
const EditableCell: React.FC<EditableCellProps> = ({boothId, field, initialValue, updateGlobalEditedBooths, activeCell, setActiveCell, type, validation, saving}) => {
    const isEditing = activeCell.boothId === boothId && activeCell.field === field;
    const [localValue, setLocalValue] = useState(initialValue);
    const [error, setError] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync local state when the cell is activated or global data changes
    useEffect(() => {
        setLocalValue(initialValue);
        setError('');
    }, [initialValue]);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const validateField = (value: string): string => {
        if (field === 'bla2_name' && value.trim() === '') {
            return 'Name cannot be empty';
        }
        if (field === 'bla2_mobile_no') {
            const cleanValue = value.replace(/[^0-9]/g, '');
            if (cleanValue === '') {
                return 'Mobile number cannot be empty';
            }
            if (cleanValue.length < 10) {
                return 'Mobile number must be at least 10 digits';
            }
        }
        if (field === 'slr_per') {
            const cleanValue = value.replace(/[^0-9.]/g, '');
            if (cleanValue === '') {
                return 'Percentage cannot be empty';
            }
        }
        return '';
    };

    const handleBlur = () => {
        // Apply validation and update global state
        let finalValue = localValue;
        
        if (validation === 'mobile') {
            finalValue = finalValue.replace(/[^0-9]/g, '');
        } else if (validation === 'slr') {
             finalValue = finalValue.replace(/[^0-9.]/g, '');
        }
        
        const validationError = validateField(finalValue);
        setError(validationError);
        
        if (!validationError) {
            updateGlobalEditedBooths(boothId, field, finalValue);
            setActiveCell({ boothId: null, field: null });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current?.blur(); // Trigger blur to save changes
        }
        if (e.key === 'Escape') {
            setError('');
            setLocalValue(initialValue);
            setActiveCell({ boothId: null, field: null });
        }
    };
    
    // Determine the color if the cell has been modified
    const isModified = initialValue !== localValue;
    const valueClass = isModified ? 'font-medium text-orange-700' : 'text-gray-900';
    const hasError = error !== '';

    if (isEditing) {
        return (
            <div className="w-full">
                <input
                    ref={inputRef}
                    type={type}
                    value={localValue}
                    onChange={(e) => {
                        setLocalValue(e.target.value);
                        if (error) setError(''); // Clear error on typing
                    }}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`text-sm border rounded px-2 py-1 w-full focus:ring-orange-500 focus:border-orange-500 ${
                        hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    maxLength={field === 'bla2_mobile_no' ? 15 : undefined}
                    min={field === 'slr_per' ? 0 : undefined}
                    max={field === 'slr_per' ? 100 : undefined}
                    disabled={saving}
                />
                {hasError && (
                    <div className="text-xs text-red-500 mt-1">{error}</div>
                )}
            </div>
        );
    }

    return (
        <div 
            onClick={() => setActiveCell({ boothId, field })}
            className={`cursor-pointer w-full h-full p-0.5 min-h-[36px] flex items-center ${valueClass} ${field === 'slr_per' ? 'bg-green-50' : ''}`}
        >
            {field === 'slr_per' ? `${initialValue}%` : initialValue}
        </div>
    );
};


// 1. Mobile Row Component 
const InlineEditRowMobile: React.FC<InlineEditRowPropsBase> = ({ booth, editedData, updateGlobalEditedBooths, activeCell, setActiveCell, saving, getBlaStatus }) => {
    const getCurrentValue = (field: keyof EditableFields) => editedData?.[field] ?? booth[field];
    
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{booth.booth_name}</h4>
                  <p className="text-xs text-gray-500">Booth #{booth.booth_no}</p>
                </div>
              </div>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                #{booth.booth_no}
              </span>
            </div>
            <div className="space-y-2 text-xs">
                {/* BLA2 Name */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">BLA2:</span>
                    <div className="w-24">
                        <EditableCell
                            boothId={booth.id}
                            field='bla2_name'
                            initialValue={getCurrentValue('bla2_name')}
                            updateGlobalEditedBooths={updateGlobalEditedBooths}
                            activeCell={activeCell}
                            setActiveCell={setActiveCell}
                            type="text"
                            validation='text'
                            saving={saving}
                        />
                    </div>
                </div>
                {/* Status (Non-Editable) */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
                        {getBlaStatus(booth.isBla2).label}
                    </span>
                </div>
                {/* Mobile */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Mobile:</span>
                    <div className="w-24">
                        <EditableCell
                            boothId={booth.id}
                            field='bla2_mobile_no'
                            initialValue={getCurrentValue('bla2_mobile_no')}
                            updateGlobalEditedBooths={updateGlobalEditedBooths}
                            activeCell={activeCell}
                            setActiveCell={setActiveCell}
                            type="text"
                            validation='mobile'
                            saving={saving}
                        />
                    </div>
                </div>
                {/* SLR % */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">SLR %:</span>
                    <div className="w-16">
                        <EditableCell
                            boothId={booth.id}
                            field='slr_per'
                            initialValue={getCurrentValue('slr_per')}
                            updateGlobalEditedBooths={updateGlobalEditedBooths}
                            activeCell={activeCell}
                            setActiveCell={setActiveCell}
                            type="number"
                            validation='slr'
                            saving={saving}
                        />
                    </div>
                </div>
                {/* Updates (Non-Editable) */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Updates:</span>
                    <span className="font-medium">{booth.update_count}</span>
                </div>
            </div>
        </div>
    );
}

// 2. Desktop Row Component (Table view)
const InlineEditRowDesktop: React.FC<InlineEditRowPropsBase> = ({ booth, editedData, updateGlobalEditedBooths, activeCell, setActiveCell, saving, getBlaStatus }) => {
    const getCurrentValue = (field: keyof EditableFields) => editedData?.[field] ?? booth[field];
    
    // Highlight the row if it has any pending edits
    const rowClass = editedData ? 'bg-orange-50' : 'hover:bg-gray-50';

    return (
        <tr className={`transition-colors ${rowClass}`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-orange-600">#{booth.booth_no}</span>
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">Booth {booth.booth_no}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{booth.booth_name}</div>
            </td>
            <td className="px-6 py-2 whitespace-nowrap w-48">
                <EditableCell
                    boothId={booth.id}
                    field='bla2_name'
                    initialValue={getCurrentValue('bla2_name')}
                    updateGlobalEditedBooths={updateGlobalEditedBooths}
                    activeCell={activeCell}
                    setActiveCell={setActiveCell}
                    type="text"
                    validation='text'
                    saving={saving}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
                    {getBlaStatus(booth.isBla2).label}
                </span>
            </td>
            <td className="px-6 py-2 whitespace-nowrap w-40">
                <EditableCell
                    boothId={booth.id}
                    field='bla2_mobile_no'
                    initialValue={getCurrentValue('bla2_mobile_no')}
                    updateGlobalEditedBooths={updateGlobalEditedBooths}
                    activeCell={activeCell}
                    setActiveCell={setActiveCell}
                    type="text"
                    validation='mobile'
                    saving={saving}
                />
            </td>
            <td className="px-6 py-2 whitespace-nowrap w-24">
                <EditableCell
                    boothId={booth.id}
                    field='slr_per'
                    initialValue={getCurrentValue('slr_per')}
                    updateGlobalEditedBooths={updateGlobalEditedBooths}
                    activeCell={activeCell}
                    setActiveCell={setActiveCell}
                    type="number"
                    validation='slr'
                    saving={saving}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{booth.update_count}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                    {new Date(booth.update_date).toLocaleDateString()}
                </div>
            </td>
        </tr>
    );
}