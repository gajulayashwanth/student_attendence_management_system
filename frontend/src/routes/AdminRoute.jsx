import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/secret-hq-entrance" replace />;
    }

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
