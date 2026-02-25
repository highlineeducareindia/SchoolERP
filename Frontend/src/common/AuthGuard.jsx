import React from "react";
import { Navigate, Outlet } from "react-router-dom";


const AuthGuard = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole"); // Check 'userRole' key instead of 'user' object

  if (!token) {
     const userType = window.location.pathname.includes("admin") ? "school" : "teacher";
    return <Navigate to={`/${userType === 'school' ? 'admin' : 'teacher'}/login`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If user role is not allowed, redirect to login or dashboard
     const userType = window.location.pathname.includes("admin") ? "school" : "teacher";
    return <Navigate to={`/${userType === 'school' ? 'admin' : 'teacher'}/login`} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
