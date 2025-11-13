import  { useState, useEffect } from 'react';
import axiosInstance from '../../service/axiosInstance';
import { useTranslation } from 'react-i18next';

interface Assembly {
  id: number;
  assembly_id: number;
  assembly_name: string;
  _count: {
    booths: number;
  };
}

interface AssemblyListProps {
  onAssemblySelect: (assemblyId: number, assemblyName: string) => void;
}

function AssemblyList({ onAssemblySelect }: AssemblyListProps) {
  const { t } = useTranslation();
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAssemblies();
  }, []);

  const fetchAssemblies = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/districts/get-all-assembly');
      if (response.data && response.data.data) {
        setAssemblies(response.data.data);
      }
    } catch (err) {
      setError(t('booth.failedAssemblies'));
      console.error('Error fetching assemblies:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">{t('booth.loadingAssemblies')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6" style={{color: '#3b954b'}}>{t('booth.assemblyList')}</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {t('booth.allAssemblies')} ({assemblies.length} {t('booth.assemblies')})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('booth.assemblyName')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('booth.boothCount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('booth.action')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assemblies.map((assembly) => (
                <tr key={assembly.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {assembly.assembly_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assembly._count.booths}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onAssemblySelect(assembly.assembly_id, assembly.assembly_name)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {t('booth.showAllBooths')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssemblyList;