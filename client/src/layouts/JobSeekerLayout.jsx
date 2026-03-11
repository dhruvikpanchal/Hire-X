import { Outlet } from "react-router-dom";
import JobSeekerNavbar from "../components/common/Navbar/JobSeekerNavbar";
import Footer from "../components/common/Footer/Footer";

function JobSeekerLayout() {
  return (
    <div className="JobSeekerLayout">
      <JobSeekerNavbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default JobSeekerLayout;
