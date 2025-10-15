import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (token && role) {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on required role
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    } else if (requiredRole === 'staff') {
      return <Navigate to="/staff/login" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate login page based on required role
    if (requiredRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    } else if (requiredRole === 'staff') {
      return <Navigate to="/staff/login" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
