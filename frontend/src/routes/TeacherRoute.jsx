import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const TeacherRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'TEACHER') {
        return <Navigate to="/" replace />;
    }

    if (!user?.is_approved) {
        return <Navigate to="/pending-approval" replace />;
    }

    return children;
};

export default TeacherRoute;
