import { Outlet } from "react-router-dom";
import JobSeekerNavbar from "../features/jobSeeker/JobSeekerNavbar/JobSeekerNavbar";
import Footer from "../components/common/Footer";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function JobSeekerLayout() {
  return (
    <ProtectedRoute>
      <div className="JobSeekerLayout">
        <JobSeekerNavbar />
        <Outlet />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

export default JobSeekerLayout;
