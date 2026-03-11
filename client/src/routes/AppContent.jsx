import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import JobSeekerLayout from "../layouts/JobSeekerLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";

// Public Pages
import AdminDashboard from "../features/admin/admin_dashboard/admin_dashboard";

// Job Seeker Pages
import JobSeekerDashboard from "../features/jobSeeker/jobSeeker_dashboard/jobSeeker_dashboard";

// Recruiter Pages
import RecruiterDashboard from "../features/recruiter/recruiter_dashboard/recruiter_dashboard";

// Public Pages
import Home from "../features/public/Home/Home";
import JobSearch from "../features/public/JobSearch/JobSearch";
import Companies from "../features/public/Companies/Companies";
import Pricing from "../features/public/Pricing/Pricing";
import AboutUs from "../features/public/AboutUs/AboutUs";

// Auth Pages
import Register from "../features/auth/Register/Register";
import Login from "../features/auth/Login/Login";
import Admin_Login from "../features/auth/Admin_Login/Admin_Login";
import ForgotPassword from "../features/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword/ResetPassword";
import VerifyEmail from "../features/auth/VerifyEmail/VerifyEmail";

function AppContent() {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<AboutUs />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Admin_Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Job Seeker Layout */}
      <Route path="/jobSeeker" element={<JobSeekerLayout />}>
        <Route path="/jobSeeker/dashboard" element={<JobSeekerDashboard />} />
      </Route>

      {/* RecruiterLayout Layout */}
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      </Route>
    </Routes>
  );
}

export default AppContent;
