import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Sử dụng:
 * - Chỉ cho khách: <RequireRole user={user} guestOnly><Login /></RequireRole>
 * - Chỉ cho user đã đăng nhập: <RequireRole user={user} authOnly><Personal /></RequireRole>
 * - Phân quyền role: <RequireRole user={user} roles={["ADMIN"]}><Dashboard /></RequireRole>
 */
const RequireRole = ({ user, roles, guestOnly, authOnly, children }) => {
  // Chỉ cho khách (chưa đăng nhập)
  if (guestOnly) {
    if (user) return <Navigate to="/" replace />;
    return children;
  }
  // Chỉ cho user đã đăng nhập
  if (authOnly) {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  }
  // Phân quyền theo role
  if (roles) {
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  }
  // Mặc định cho phép truy cập
  return children;
};

export default RequireRole;