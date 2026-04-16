import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const GuestRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user?.role === 'ADMIN') {
        return <Navigate to="/secret-hq-console/analytics" replace />;
    }

    if (isAuthenticated && user?.role === 'TEACHER' && user?.is_approved) {
        return <Navigate to="/teacher/selection" replace />;
    }

    if (isAuthenticated && user?.role === 'TEACHER' && !user?.is_approved) {
        return <Navigate to="/pending-approval" replace />;
    }

    return children;
};

export default GuestRoute;
