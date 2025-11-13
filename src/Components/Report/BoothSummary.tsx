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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 mt-[12vh] md:mt-[20vh]">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
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
  );
}

export default BoothSummary;