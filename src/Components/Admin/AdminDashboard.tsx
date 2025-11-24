import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { LayoutDashboard, Users, UserPlus, FileText, Map, PieChart, BarChart3 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // Define buttons with titles, paths, and Lucide icons
  const adminButtons = [
    { title: 'Reports Dashboard', path: '/reports', icon: LayoutDashboard },
    // { title: 'Show All Users', path: '/users', icon: Users },
    // { title: 'Register New User', path: '/register', icon: UserPlus },
    { title: 'Booth Summary', path: '/booth-summary', icon: FileText },
    { title: 'Maps View', path: '/maps', icon: Map },
    { title: 'Dashboard Analytics', path: '/dashboard', icon: PieChart },
    { title: 'Show Count Page', path: '/show-count', icon: BarChart3 }
  ];

  return (
    // Minimalistic background
    <div className="min-h-screen bg-gray-50 py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Simple Header Section */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-8 border-l-4 border-orange-500">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm">
            Welcome, **{user?.name || 'Admin'}**. Use the links below to navigate the system.
          </p>
        </div>

        {/* Simplified Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {adminButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(button.path)}
                // Clean, focused styling
                className={`flex items-center justify-start w-full px-5 py-4 
                           bg-white rounded-lg shadow-sm border border-gray-200 
                           text-gray-700 transition-all duration-200 
                           hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600`}
              >
                <Icon className="w-5 h-5 mr-3 text-orange-500" />
                <span className="font-medium text-left">{button.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;