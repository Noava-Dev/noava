import { Navigate, Outlet } from 'react-router-dom';
import { useUserRole } from '../../../hooks/useUserRole';
import type { UserRole } from '../../../models/User';

const PrivateRoute = ({ allowedRoles }: { allowedRoles: readonly UserRole[] }) => {
  const { userRole, loading } = useUserRole();

  if (loading) return <div>Loading...</div>;

  if (!userRole) return <Navigate to={import.meta.env.VITE_CLERK_SIGN_IN_URL} />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/not-found" />;
  }

  return <Outlet />;
};

export default PrivateRoute;