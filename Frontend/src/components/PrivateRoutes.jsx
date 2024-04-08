import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = ({ tokenType }) => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('token') !== null;
    // Check if token type matches
    const storedTokenType = localStorage.getItem('token-type');

    // Check if both conditions are met: user is authenticated and token type matches
    const canAccess = isAuthenticated && storedTokenType === tokenType;

    useEffect(() => {
        if (!canAccess) {
            alert("You don't have permission to view that page");
        }
    }, [canAccess]);

    return canAccess ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
