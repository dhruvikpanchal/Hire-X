import { Outlet } from "react-router-dom";
import RecruiterNavbar from "../components/common/Navbar/RecruiterNavbar";
import Footer from "../components/common/Footer/Footer";

function RecruiterLayout() {
  return (
    <div className="RecruiterLayout">
      <RecruiterNavbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default RecruiterLayout;
