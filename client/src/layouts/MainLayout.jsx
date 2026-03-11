import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";

function MainLayout() {
  return (
    <div className="MainLayout">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;
