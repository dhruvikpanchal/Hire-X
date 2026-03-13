import { Outlet } from "react-router-dom";
import RecruiterNavbar from "../features/recruiter/RecruiterNavbar/RecruiterNavbar";
import Footer from "../components/common/Footer";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function RecruiterLayout() {
  return (
    <ProtectedRoute>
      <div className="RecruiterLayout">
        <RecruiterNavbar />
        <Outlet />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default RecruiterLayout;
