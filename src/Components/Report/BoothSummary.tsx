import  { useState } from 'react';
import AssemblyList from './AssemblyList';
import BoothDetails from './BoothDetails';


function BoothSummary() {
  const [selectedAssembly, setSelectedAssembly] = useState<{id: number, name: string} | null>(null);

  const handleAssemblySelect = (assemblyId: number, assemblyName: string) => {
    setSelectedAssembly({ id: assemblyId, name: assemblyName });
  };

  const handleBackToAssemblies = () => {
    setSelectedAssembly(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-2">
            {selectedAssembly ? `${selectedAssembly.name} - Booth Details` : 'Assembly & Booth Summary'}
          </h1>
          <p className="text-center text-gray-600 text-sm sm:text-base">
            {selectedAssembly ? 'View all booths in this assembly' : 'Select an assembly to view booth details'}
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {selectedAssembly ? (
            <BoothDetails 
              assemblyId={selectedAssembly.id} 
              assemblyName={selectedAssembly.name}
              onBack={handleBackToAssemblies}
            />
          ) : (
            <AssemblyList onAssemblySelect={handleAssemblySelect} />
          )}
        </div>
      </div>
    </div>
  );
}

export default BoothSummary;