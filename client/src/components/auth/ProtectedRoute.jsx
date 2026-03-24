import { Navigate } from "react-router-dom";
import authService from "../../services/authService";

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        if (user?.role === "recruiter") {
            return <Navigate to="/recruiter/dashboard" replace />;
        }
        return <Navigate to="/jobSeeker/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;