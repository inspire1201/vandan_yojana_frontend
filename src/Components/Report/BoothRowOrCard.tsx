import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

// Re-defining the necessary types for the new component
interface Booth {
  id: number;
  booth_no: number;
  booth_name: string;
  isBla2: string;
  bla2_name: string;
  bla2_mobile_no: string;
  slr_per: string;
  update_date: string;
  update_count: number;
}

interface BlaStatus {
  label: string;
  color: string;
}

interface BoothRowOrCardProps {
  booth: Booth;
  isMobile: boolean;
  getBlaStatus: (isBla2: string) => BlaStatus;
  onSave: (boothId: number, data: { bla2_name: string, bla2_mobile_no: string, slr_per: string, isBla2?: string }) => Promise<{ success: boolean, message: string }>;
  isSaving: boolean;
}

function BoothRowOrCard({ booth, isMobile, getBlaStatus, onSave, isSaving }: BoothRowOrCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localEditData, setLocalEditData] = useState<{bla2_name: string, bla2_mobile_no: string, slr_per: string, isBla2: string}>({
    bla2_name: booth.bla2_name || '',
    bla2_mobile_no: booth.bla2_mobile_no || '',
    slr_per: booth.slr_per || '',
    isBla2: booth.isBla2 || ''
  });
  const [errors, setErrors] = useState<{bla2_name?: string, bla2_mobile_no?: string, slr_per?: string, isBla2?: string}>({});

  const validateFields = () => {
    const newErrors: {bla2_name?: string, bla2_mobile_no?: string, slr_per?: string, isBla2?: string} = {};
    
    if (!localEditData.bla2_name.trim()) {
      newErrors.bla2_name = 'Name is required';
    }
    
    if (!localEditData.bla2_mobile_no.trim()) {
      newErrors.bla2_mobile_no = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(localEditData.bla2_mobile_no)) {
      newErrors.bla2_mobile_no = 'Mobile number must be 10 digits';
    }
    
    if (!localEditData.slr_per.trim()) {
      newErrors.slr_per = 'Percentage is required';
    } else if (isNaN(Number(localEditData.slr_per)) || Number(localEditData.slr_per) < 0 || Number(localEditData.slr_per) > 100) {
      newErrors.slr_per = 'Percentage must be between 0-100';
    }
    
    if (!booth.isBla2 && !localEditData.isBla2) {
      newErrors.isBla2 = 'Status is required for null booths';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    return localEditData.bla2_name !== booth.bla2_name ||
           localEditData.bla2_mobile_no !== booth.bla2_mobile_no ||
           localEditData.slr_per !== booth.slr_per ||
           localEditData.isBla2 !== booth.isBla2;
  };

  const handleEdit = () => {
    setLocalEditData({
      bla2_name: booth.bla2_name || '',
      bla2_mobile_no: booth.bla2_mobile_no || '',
      slr_per: booth.slr_per || '',
      isBla2: booth.isBla2 || ''
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    
    if (!hasChanges()) {
      setIsEditing(false);
      return;
    }
    
    const result = await onSave(booth.id, localEditData);
    if (result.success) {
      // Update booth data locally to reflect changes immediately
      Object.assign(booth, {
        bla2_name: localEditData.bla2_name || null,
        bla2_mobile_no: localEditData.bla2_mobile_no || null,
        slr_per: localEditData.slr_per || null,
        isBla2: localEditData.isBla2 || null,
        update_date: new Date().toISOString(),
        update_count: (booth.update_count || 0) + 1
      });
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleFieldChange = (field: keyof typeof localEditData, value: string) => {
    setLocalEditData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const MobileCard = (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        {/* ... Booth Header ... */}
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
        {/* ... Mobile Actions ... */}
        <div className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
            #{booth.booth_no}
          </span>
          {isEditing ? (
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1 min-w-[60px]"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="text-sm">Save</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 disabled:opacity-50 flex items-center gap-1 min-w-[70px]"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Cancel</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 flex items-center gap-1 min-w-[50px]"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm">Edit</span>
            </button>
          )}
        </div>
      </div>
      {/* ... Mobile Detail Fields ... */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-start">
          <span className="text-gray-500">BLA2:</span>
          <div className="flex flex-col items-end">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={localEditData.bla2_name}
                  onChange={(e) => handleFieldChange('bla2_name', e.target.value)}
                  className={`w-32 text-xs border rounded px-2 py-1 ${errors.bla2_name ? 'border-red-500' : ''}`}
                />
                {errors.bla2_name && <span className="text-red-500 text-xs mt-1">{errors.bla2_name}</span>}
              </>
            ) : (
              booth.bla2_name ? (
                <span className="font-medium">{booth.bla2_name}</span>
              ) : (
                <span className="text-gray-400 italic">null</span>
              )
            )}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-gray-500">Status:</span>
          <div className="flex flex-col items-end">
            {isEditing ? (
              <>
                <select
                  value={localEditData.isBla2}
                  onChange={(e) => handleFieldChange('isBla2', e.target.value)}
                  className={`text-xs border rounded px-2 py-1 ${errors.isBla2 ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Status</option>
                  <option value="VALUE_0">Dummy Account</option>
                  <option value="VALUE_1">Unverified</option>
                  <option value="VALUE_2">Verified</option>
                </select>
                {errors.isBla2 && <span className="text-red-500 text-xs mt-1">{errors.isBla2}</span>}
              </>
            ) : (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
                {getBlaStatus(booth.isBla2).label}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-gray-500">Mobile:</span>
          <div className="flex flex-col items-end">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={localEditData.bla2_mobile_no}
                  onChange={(e) => handleFieldChange('bla2_mobile_no', e.target.value)}
                  className={`w-28 text-xs border rounded px-2 py-1 ${errors.bla2_mobile_no ? 'border-red-500' : ''}`}
                  maxLength={10}
                />
                {errors.bla2_mobile_no && <span className="text-red-500 text-xs mt-1">{errors.bla2_mobile_no}</span>}
              </>
            ) : (
              booth.bla2_mobile_no ? (
                <span className="font-medium">{booth.bla2_mobile_no}</span>
              ) : (
                <span className="text-gray-400 italic">null</span>
              )
            )}
          </div>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-gray-500">SLR %:</span>
          <div className="flex flex-col items-end">
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={localEditData.slr_per}
                  onChange={(e) => handleFieldChange('slr_per', e.target.value)}
                  className={`w-20 text-xs border rounded px-2 py-1 ${errors.slr_per ? 'border-red-500' : ''}`}
                  min="0"
                  max="100"
                />
                {errors.slr_per && <span className="text-red-500 text-xs mt-1">{errors.slr_per}</span>}
              </>
            ) : (
              booth.slr_per ? (
                <span className="font-medium text-green-600">{booth.slr_per}%</span>
              ) : (
                <span className="text-gray-400 italic">null</span>
              )
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Updates:</span>
          {booth.update_count !== null ? (
            <span className="font-medium">{booth.update_count}</span>
          ) : (
            <span className="text-gray-400 italic">null</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Last Updated:</span>
          {booth.update_date ? (
            <span className="font-medium text-xs">{new Date(booth.update_date).toLocaleDateString()}</span>
          ) : (
            <span className="text-gray-400 italic">null</span>
          )}
        </div>
      </div>
    </div>
  );

  const DesktopRow = (
    <tr className="hover:bg-gray-50 transition-colors">
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
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={localEditData.bla2_name}
              onChange={(e) => handleFieldChange('bla2_name', e.target.value)}
              className={`text-sm border rounded px-2 py-1 w-full ${errors.bla2_name ? 'border-red-500' : ''}`}
            />
            {errors.bla2_name && <div className="text-red-500 text-xs mt-1">{errors.bla2_name}</div>}
          </div>
        ) : (
          booth.bla2_name ? (
            <div className="text-sm text-gray-900">{booth.bla2_name}</div>
          ) : (
            <div className="text-gray-400 italic text-sm">null</div>
          )
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div>
            <select
              value={localEditData.isBla2}
              onChange={(e) => handleFieldChange('isBla2', e.target.value)}
              className={`text-sm border rounded px-2 py-1 ${errors.isBla2 ? 'border-red-500' : ''}`}
            >
              <option value="">Select Status</option>
              <option value="VALUE_0">Dummy Account</option>
              <option value="VALUE_1">Unverified</option>
              <option value="VALUE_2">Verified</option>
            </select>
            {errors.isBla2 && <div className="text-red-500 text-xs mt-1">{errors.isBla2}</div>}
          </div>
        ) : (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
            {getBlaStatus(booth.isBla2).label}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={localEditData.bla2_mobile_no}
              onChange={(e) => handleFieldChange('bla2_mobile_no', e.target.value)}
              className={`text-sm border rounded px-2 py-1 w-full ${errors.bla2_mobile_no ? 'border-red-500' : ''}`}
              maxLength={10}
            />
            {errors.bla2_mobile_no && <div className="text-red-500 text-xs mt-1">{errors.bla2_mobile_no}</div>}
          </div>
        ) : (
          booth.bla2_mobile_no ? (
            <div className="text-sm text-gray-900">{booth.bla2_mobile_no}</div>
          ) : (
            <div className="text-gray-400 italic text-sm">null</div>
          )
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div>
            <input
              type="number"
              value={localEditData.slr_per}
              onChange={(e) => handleFieldChange('slr_per', e.target.value)}
              className={`text-sm border rounded px-2 py-1 w-20 ${errors.slr_per ? 'border-red-500' : ''}`}
              min="0"
              max="100"
            />
            {errors.slr_per && <div className="text-red-500 text-xs mt-1">{errors.slr_per}</div>}
          </div>
        ) : (
          booth.slr_per ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {booth.slr_per}%
            </span>
          ) : (
            <span className="text-gray-400 italic text-sm">null</span>
          )
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {booth.update_count !== null ? (
          <div className="text-sm text-gray-900">{booth.update_count}</div>
        ) : (
          <div className="text-gray-400 italic text-sm">null</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {booth.update_date ? (
          <div className="text-sm text-gray-500">
            {new Date(booth.update_date).toLocaleDateString()}
          </div>
        ) : (
          <div className="text-gray-400 italic text-sm">null</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </td>
    </tr>
  );

  return isMobile ? MobileCard : DesktopRow;
}

export default BoothRowOrCard;