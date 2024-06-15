import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Route {...rest} element={isLoggedIn ? <Component /> : <Navigate to="/loginRegister" replace />} />
  );
};

export default ProtectedRoute;
