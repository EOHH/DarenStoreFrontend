import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirigir al login, pero guardando la ubicación actual para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;