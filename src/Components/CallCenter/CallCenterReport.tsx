import React from 'react';
import { Phone} from 'lucide-react';

const CallCenterReport: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-4">Call Center Report</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-8 h-[50vh] flex flex-col items-center justify-center">
              <Phone className="w-24 h-24 text-orange-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Coming Soon</h2>

            </div>
   </div>
        </div>
      </div>
    </div>
  );
};

export default CallCenterReport;