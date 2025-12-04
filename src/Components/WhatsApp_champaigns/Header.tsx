import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa"; // Added icons for better UX

// --- Type Definitions ---
// Note: Props are not strictly necessary here, but good practice for future expansion.
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        // 1. Clear session storage items
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        
        // 2. Redirect the user to the login page
        navigate('/login');
    };

    return (
        <header 
            // Tailwind classes replace inline styles for styling and layout
            className="sticky top-0 z-40 bg-white shadow-lg h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8"
        >
            {/* --- Welcome/Branding Section --- */}
            <h1 className="text-xl font-semibold flex items-center m-0">
                {/* Dynamic greeting with custom color and weight */}
                <span className="text-gray-700">Welcome,</span>
                <span className="text-indigo-600 font-bold ml-1.5">
                    {username || 'Guest'}
                </span>
                {role && (
                    <span className="ml-3 text-sm text-gray-500 hidden sm:inline">
                        (Role: {role})
                    </span>
                )}
            </h1>

            {/* --- Actions Section --- */}
            <div className="flex items-center space-x-4">
                {/* User Profile Icon */}
                <FaUserCircle className="text-indigo-500 w-6 h-6" title={username || 'User'} />
                
                {/* Logout Button */}
                <button 
                    onClick={handleLogout} 
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 shadow-md"
                >
                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;