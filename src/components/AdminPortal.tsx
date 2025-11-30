import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboardEditable from './AdminDashboardEditable';
import { validateToken } from '../utils/auth';

const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string>('');
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setAdminData(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken && validateToken(savedToken, handleLogout)) {
      setToken(savedToken);
      setIsAuthenticated(true);
      // Set default admin data if not available
      setAdminData({
        email: 'admin@CredNest.com',
        role: 'admin'
      });
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (authToken: string, userData: any) => {
    setToken(authToken);
    setAdminData(userData);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminDashboardEditable 
      token={token} 
      adminData={adminData} 
      onLogout={handleLogout} 
    />
  );
};

export default AdminPortal;
