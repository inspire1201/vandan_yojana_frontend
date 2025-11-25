import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { loadFromStorage } from './store/authSlice';

import Navbar from './Components/Navbar';
import ReportsDashboard from './Components/Report/ReportsDashboard';
import BoothSummary from './Components/Report/BoothSummary';
import Login from './Components/auth/Login';
import RegisterUser from './Components/auth/RegisterUser';
import AllUsers from './Components/auth/AllUsers';
import AdminDashboard from './Components/Admin/AdminDashboard';
import CallCenterReport from './Components/CallCenter/CallCenterReport';
import './i18n';
// import DistrictWrapper from './wrapper/DistrictWrapper';
// import AssemblyWrapper from './wrapper/AssemblyWrapper';
// import LokSabhaWrapper from './wrapper/LokSabhaWrapper';
import UnifiedMapPage from './Components/Maps/UnifiedMapPage';
// import HierarchyDropdownTable from './Components/Inspire_FulStack/HierarchyDropdownTable';
import ShowCountPage from './Components/Inspire_FulStack/ShowCountPage';
import NewHierarchyDropdownTable from './Components/Inspire_FulStack/NewHierarchyDropdownTable';
import HierarchyDropdownTable from './Components/Inspire_FulStack/HierarchyDropdownTable';


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === 'ADMIN' ? <>{children}</> : <Navigate to="/" replace />;
};

const HomePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user?.role === 'ADMIN' ? <AdminDashboard /> : <ReportsDashboard />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  if (isLoading) return <div>Loading...</div>;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function AppContent() {
  const dispatch = useAppDispatch();


  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

 

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/maps" element={<ProtectedRoute><UnifiedMapPage/></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><HierarchyDropdownTable/></ProtectedRoute>} />
        <Route path="/new-dashboard" element={<ProtectedRoute><NewHierarchyDropdownTable/></ProtectedRoute>} />
        <Route path="/show-count" element={<ProtectedRoute><ShowCountPage/></ProtectedRoute>} />
      
        <Route path="/reports" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
        <Route path="/booth-summary" element={<ProtectedRoute><BoothSummary /></ProtectedRoute>} />
   
        <Route path="/register" element={<AdminRoute><RegisterUser /></AdminRoute>} />
        <Route path="/users" element={<AdminRoute><AllUsers /></AdminRoute>} />
        <Route path="/call-center" element={<ProtectedRoute><CallCenterReport /></ProtectedRoute>} />
      </Routes>
    </>
  );
} 

function App() {
  return (
    <Provider store={store}>
     
        <Router>
          <AppContent />
        </Router>
   
    </Provider>
  );
}

export default App;
