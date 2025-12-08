// import React, { useState, useMemo } from 'react';
// import { FaCog, FaPhoneAlt, FaSms, FaWhatsapp, FaChartBar, FaTh } from 'react-icons/fa';
// import { Link, useLocation } from 'react-router-dom';

// // Assuming the image import is handled correctly in the final file structure
// // const img = './assets/image.png'; 

// // --- Type Definitions ---
// interface NavItem {
//     path: string;
//     label: string;
//     icon: React.ElementType;
// }

// // --- Constants ---
// const PRIMARY_COLOR = 'indigo'; // Tailwind color base
// const ACCENT_COLOR_CLASS = `bg-${PRIMARY_COLOR}-600 text-white`;
// const HOVER_COLOR_CLASS = `hover:bg-${PRIMARY_COLOR}-100 hover:text-${PRIMARY_COLOR}-700`;
// const DEFAULT_COLOR_CLASS = 'text-gray-700';

// const NAV_ITEMS: NavItem[] = [
//     { path: "/campaign-dashboard", label: "Dashboard", icon: FaTh },
//     { path: "/campaign-whatsapp", label: "WhatsApp", icon: FaWhatsapp },
//     { path: "/campaign-sms", label: "SMS", icon: FaSms },
//     { path: "/campaign-calling", label: "OBD (Calling)", icon: FaPhoneAlt },
//     { path: "/campaign-settings", label: "Settings", icon: FaCog },
// ];

// // --- Component ---
// const Sidebar: React.FC = () => {
//     const location = useLocation();
//     const [activeItem, setActiveItem] = useState(location.pathname);

//     // Update active item when the route changes
//     useMemo(() => {
//         setActiveItem(location.pathname);
//     }, [location.pathname]);

//     const getLinkClasses = (path: string) => {
//         const isActive = activeItem === path;

//         // Base classes for all links
//         let classes = `flex items-center p-3 text-base font-medium rounded-lg transition duration-200 ease-in-out `;

//         if (isActive) {
//             // Active state: prominent background color
//             classes += ACCENT_COLOR_CLASS;
//         } else {
//             // Inactive state: default text color and hover effect
//             classes += `${DEFAULT_COLOR_CLASS} ${HOVER_COLOR_CLASS}`;
//         }

//         return classes;
//     };

//     return (
//         // Fixed Sidebar Container - styled for a clean, permanent look
//         <nav className="flex flex-col h-full w-64 bg-white shadow-xl border-r border-gray-200 p-4 sticky top-0">

//             {/* --- Logo/Header Section --- */}
//             <div className="flex items-center justify-center mb-6 py-2 border-b border-gray-100">
//                 {/* Placeholder for imported image */}
//                 {/* The original image size was 70x190, which is wide. Adjusting the image style to fit a standard sidebar width. */}
//                 {/* Since the image variable 'img' is not provided, I will use a simple text/icon logo */}
//                 <span className="text-2xl font-bold text-gray-800">
//                     <FaChartBar className={`inline mr-2 text-${PRIMARY_COLOR}-600`} />
//                     <span className={`text-${PRIMARY_COLOR}-600`}>Acu</span>Dashboard
//                 </span>
//             </div>

//             {/* --- Navigation Links --- */}
//             <ul className="flex flex-col space-y-2">
//                 {NAV_ITEMS.map((item) => (
//                     <li key={item.path}>
//                         <Link
//                             to={item.path}
//                             className={getLinkClasses(item.path)}
//                             onClick={() => setActiveItem(item.path)}
//                         >
//                             {/* Icon Component */}
//                             <item.icon className="w-5 h-5 mr-3" />

//                             {/* Link Label */}
//                             <span>{item.label}</span>
//                         </Link>
//                     </li>
//                 ))}
//             </ul>

//             {/* Optional Footer/Version Info */}
//             <div className="mt-auto pt-4 text-center text-xs text-gray-400 border-t border-gray-100">
//                 <p>&copy; {new Date().getFullYear()} Dashboard</p>
//             </div>
//         </nav>
//     );
// };

// export default Sidebar;



import { FaPhoneAlt, FaSms, FaWhatsapp, FaChartBar, FaTh } from 'react-icons/fa';

const NAV_ITEMS = [
    { key: "home", label: "Dashboard", icon: FaTh },
    { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
    { key: "sms", label: "SMS", icon: FaSms },
    { key: "calling", label: "OBD Calling", icon: FaPhoneAlt },
    { key: "campaign-details", label: "Campaign Details", icon: FaChartBar }, // Using ChartBar for now or import another

    // { key: "settings", label: "Settings", icon: FaCog },
];

const Sidebar = ({ activePage, setActivePage }: any) => {
    return (
        <nav className="flex flex-col w-64 bg-white shadow-xl p-4">
            <div className="mb-6 text-base font-bold flex items-center gap-2 ">
                <FaChartBar />  ChampaignDashboard
            </div>

            <ul className="flex flex-col gap-2">
                {NAV_ITEMS.map(item => (
                    <li key={item.key}>
                        <button
                            onClick={() => setActivePage(item.key)}
                            className={`w-full flex items-center p-3 rounded-lg text-base font-medium
                              ${activePage === item.key
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"}
                            `}
                        >
                            <item.icon className="mr-3" />
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;
