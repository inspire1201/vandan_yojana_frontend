

import { useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  BarChart3,
  ChevronRight,
  LucideAlignCenter,

} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const adminSections = [
    {
      category: 'Reports & Analytics',
      items: [
        {
          title: 'Mahatari Vandan Yojana Report',
          path: '/reports',
          icon: LayoutDashboard,
          description: 'View comprehensive reports and analytics',
          color: 'bg-blue-500'
        },
        {
          title: 'Dashboard Analytics',
          // path: '/dashboard', 
          path: '/dashboard',
          icon: BarChart3,
          description: 'Real-time statistics and insights',
          color: 'bg-green-500'
        },
        {
          title: 'Champaingn Dashboard',
          path: '/campaign-dashboard',
          icon: LucideAlignCenter,
          description: 'Call center performance metrics',
          color: 'bg-yellow-500'
        },


      ]
    },

  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">


      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center">
            <div className=''>
              <h2 className="text-2xl font-bold mb-2">Welcome to Admin Portal</h2>

            </div>

          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-8">
          {adminSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col items-center justify-center">
              {/* Section Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 ">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
                  {section.category}
                </h3>
              </div>

              {/* Section Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6 ">
                  {section.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => navigate(item.path)}
                      className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {/* Icon with colored background */}
                      <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <h4 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors duration-200">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Action Indicator */}
                      <div className="flex items-center justify-between">
                        <span className="text-orange-600 text-sm font-medium group-hover:underline">
                          Access Module
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200" />
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-200 transition-all duration-300 pointer-events-none"></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default AdminDashboard;