import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/bjp_logo.png";
import HeaderImage from "../assets/mahatari_header.jpg";
import { Mail, Phone, Globe, ChevronDown, Menu, X, User, LogOut, UserPlus, Users, } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, selectedReport } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const language = i18n.language === 'hi' ? 'HI' : 'EN';
  const setLanguage = (lang: 'EN' | 'HI') => {
    i18n.changeLanguage(lang === 'EN' ? 'en' : 'hi');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };



  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-orange-100 text-orange-800 px-4 py-2 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span className="hidden sm:inline">dirwcd.cg@gov.in</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>हेल्प डेस्क: +91-771-2220006</span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 hover:text-orange-600 transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span className="text-xs">{language}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1 w-24 bg-white rounded-lg shadow-lg border z-50">
                <button
                  onClick={() => { setLanguage("EN"); setIsLangOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-xs hover:bg-orange-50 rounded-t-lg ${language === "EN" ? "text-orange-600 font-semibold" : "text-gray-700"}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage("HI"); setIsLangOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-xs hover:bg-orange-50 rounded-b-lg ${language === "HI" ? "text-orange-600 font-semibold" : "text-gray-700"}`}
                >
                  हिन्दी
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-orange-500 shadow-lg fixed top-10 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img src={Logo} alt="BJP Logo" className="w-10 h-10 object-contain" />
              <img src={HeaderImage} alt="Mahatari Header" className="h-10 object-contain hidden sm:block" />
              <h1 className="text-white text-lg font-bold hidden md:block">
                {selectedReport || t('navbar.title')}
              </h1>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Desktop Navigation */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-1">

                </div>
              )}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-white hover:bg-orange-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-orange-500 hover:bg-orange-50 transition-colors font-medium shadow-md"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user?.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">Code: {user?.code}</p>
                        <p className="text-xs text-gray-400">{user?.role}</p>
                      </div>

                      {user?.role === 'ADMIN' && (
                        <div className="py-1">

                          <button
                            onClick={() => { navigate('/'); setIsUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Users className="w-4 h-4" />
                             Admin Dasboard
                          </button>
                          <button
                            onClick={() => { navigate('/register'); setIsUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            {t('navbar.registerUser')}
                          </button>
                          <button
                            onClick={() => { navigate('/users'); setIsUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Users className="w-4 h-4" />
                            {t('navbar.allUsers')}
                          </button>
                          
                        </div>
                      )}

                      <div className="py-1 border-t">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('navbar.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-white text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium shadow-md"
                >
                  {t('navbar.login')}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && isAuthenticated && (
            <div className="md:hidden border-t border-orange-400 bg-orange-400 py-3">
              <div className="flex flex-col gap-1">

              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-[104px]" />
    </>
  );
};

export default Navbar;

