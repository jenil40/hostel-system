import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token"); // Check if token exists

    if (!token) {
        return <Navigate to="/admin-login" replace />; // Redirect to login if not authenticated
    }

    return children;
};

export default ProtectedRoute;
