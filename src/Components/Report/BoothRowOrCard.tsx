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
  onSave: (boothId: number, data: { bla2_name: string, bla2_mobile_no: string, slr_per: string }) => Promise<{ success: boolean, message: string }>;
  isSaving: boolean;
}

function BoothRowOrCard({ booth, isMobile, getBlaStatus, onSave, isSaving }: BoothRowOrCardProps) {
//   const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [localEditData, setLocalEditData] = useState<{bla2_name: string, bla2_mobile_no: string, slr_per: string}>({
    bla2_name: booth.bla2_name,
    bla2_mobile_no: booth.bla2_mobile_no,
    slr_per: booth.slr_per
  });

  const handleEdit = () => {
    setLocalEditData({
      bla2_name: booth.bla2_name,
      bla2_mobile_no: booth.bla2_mobile_no,
      slr_per: booth.slr_per
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    const result = await onSave(booth.id, localEditData);
    if (result.success) {
      setIsEditing(false);
      // Optional: Add a success notification here
    } else {
      // Optional: Add an error notification here
    }
  };

  const handleFieldChange = (field: keyof typeof localEditData, value: string) => {
    setLocalEditData(prev => ({
      ...prev,
      [field]: value
    }));
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
                className="bg-green-500 text-white p-1 rounded hover:bg-green-600 disabled:opacity-50"
              >
                <Save className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-orange-500 text-white p-1 rounded hover:bg-orange-600"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      {/* ... Mobile Detail Fields ... */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">BLA2:</span>
          {isEditing ? (
            <input
              type="text"
              value={localEditData.bla2_name}
              onChange={(e) => handleFieldChange('bla2_name', e.target.value)}
              className="text-xs border rounded px-1 py-0.5 w-24"
            />
          ) : (
            <span className="font-medium">{booth.bla2_name}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
            {getBlaStatus(booth.isBla2).label}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Mobile:</span>
          {isEditing ? (
            <input
              type="text"
              value={localEditData.bla2_mobile_no}
              onChange={(e) => handleFieldChange('bla2_mobile_no', e.target.value)}
              className="text-xs border rounded px-1 py-0.5 w-24"
            />
          ) : (
            <span className="font-medium">{booth.bla2_mobile_no}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">SLR %:</span>
          {isEditing ? (
            <input
              type="number"
              value={localEditData.slr_per}
              onChange={(e) => handleFieldChange('slr_per', e.target.value)}
              className="text-xs border rounded px-1 py-0.5 w-16"
            />
          ) : (
            <span className="font-medium text-green-600">{booth.slr_per}%</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Updates:</span>
          <span className="font-medium">{booth.update_count}</span>
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
          <input
            type="text"
            value={localEditData.bla2_name}
            onChange={(e) => handleFieldChange('bla2_name', e.target.value)}
            className="text-sm border rounded px-2 py-1 w-full"
          />
        ) : (
          <div className="text-sm text-gray-900">{booth.bla2_name}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBlaStatus(booth.isBla2).color}`}>
          {getBlaStatus(booth.isBla2).label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={localEditData.bla2_mobile_no}
            onChange={(e) => handleFieldChange('bla2_mobile_no', e.target.value)}
            className="text-sm border rounded px-2 py-1 w-full"
          />
        ) : (
          <div className="text-sm text-gray-900">{booth.bla2_mobile_no}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="number"
            value={localEditData.slr_per}
            onChange={(e) => handleFieldChange('slr_per', e.target.value)}
            className="text-sm border rounded px-2 py-1 w-20"
          />
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {booth.slr_per}%
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{booth.update_count}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {new Date(booth.update_date).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
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