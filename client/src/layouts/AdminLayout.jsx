import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/common/Navbar/AdminNavbar";
import Footer from "../components/common/Footer/Footer";

function AdminLayout() {
  return (
    <div className="AdminLayout">
      <AdminNavbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AdminLayout;
