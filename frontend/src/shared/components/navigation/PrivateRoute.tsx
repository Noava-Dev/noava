import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserRole } from '../../../hooks/useUserRole';
import type { UserRole } from '../../../models/User';

const PrivateRoute = ({ allowedRoles }: { allowedRoles: readonly UserRole[] }) => {
  const { userRole, loading } = useUserRole();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!userRole) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${import.meta.env.VITE_CLERK_SIGN_IN_URL}?redirect_url=${redirectUrl}`} replace />;
  } 

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;