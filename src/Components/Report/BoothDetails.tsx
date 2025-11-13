import  { useState, useEffect } from 'react';
import axiosInstance from '../../service/axiosInstance';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Booth {
  id: number;
  booth_no: number;
  booth_name: string;
  assemblyId: number;
}

interface BoothDetailsProps {
  assemblyId: number;
  assemblyName: string;
  onBack: () => void;
}

function BoothDetails({ assemblyId, assemblyName, onBack }: BoothDetailsProps) {
  const { t } = useTranslation();
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchBooths();
  }, [assemblyId]);

  const fetchBooths = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/districts/get-all-booth-by-assembly/${assemblyId}`);
      if (response.data && response.data.data) {
        setBooths(response.data.data);
      }
    } catch (err) {
      setError(t('booth.failedBooths'));
      console.error('Error fetching booths:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">{t('booth.loadingBooths')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('booth.backToAssemblies')}
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-green-600 hover:text-green-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assemblies
      </button>

      <h2 className="text-2xl font-bold mb-6" style={{color: '#3b954b'}}>
        {t('booth.boothDetails')} - {assemblyName}
      </h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden max-w-2xl mx-auto">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {t('booth.allBooths')} ({booths.length} {t('booth.booths')})
          </h3>
        </div>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {booths.map((booth) => (
                <tr key={booth.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booth.booth_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booth.booth_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {booths.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-500">{t('booth.noBooths')}</div>
        </div>
      )}
    </div>
  );
}

export default BoothDetails;