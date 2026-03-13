import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import JobSeekerLayout from "../layouts/JobSeekerLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";

// Job Seeker Pages
import JobSeekerHome from "../features/jobSeeker/Home/Home";
import JobSeekerDashboard from "../features/jobSeeker/jobSeeker_dashboard/jobSeeker_dashboard";
import JobSeekerCompanies from "../features/jobSeeker/Companies/Companies";
import JobSeekerJobSearch from "../features/jobSeeker/JobSearch/JobSearch";
import Profile from "../features/jobSeeker/Profile/Profile";
import SavedJobs from "../features/jobSeeker/SavedJobs/SavedJobs";
import JobAlerts from "../features/jobSeeker/JobAlerts/JobAlerts";
import MyApplications from "../features/jobSeeker/MyApplications/MyApplications";
import JobSeekerMessages from "../features/jobSeeker/Messages/Messages";
import JobSeekerEditProfile from "../features/jobSeeker/EditProfile/EditProfile";

// Recruiter Pages
import RecruiterDashboard from "../features/recruiter/recruiter_dashboard/recruiter_dashboard";
import FindCandidates from "../features/recruiter/FindCandidates/FindCandidates";
import PostJob from "../features/recruiter/PostJob/PostJob";
import MyJobs from "../features/recruiter/MyJobs/MyJobs";
import Applications from "../features/recruiter/Applications/Applications";
import RecruiterMessages from "../features/recruiter/Messages/Messages";
import RecruiterPricing from "../features/recruiter/Pricing/Pricing";
import RecruiterProfile from "../features/recruiter/RecruiterProfile/RecruiterProfile";
import RecruiterEditProfile from "../features/recruiter/RecruiterEditProfile/RecruiterEditProfile";

// Public Pages
import Home from "../features/public/Home/Home";
import JobSearch from "../features/public/JobSearch/JobSearch";
import Companies from "../features/public/Companies/Companies";
import AboutUs from "../features/public/AboutUs/AboutUs";
import Pricing from "../features/public/Pricing/Pricing";

// Auth Pages
import Register from "../features/auth/Register/Register";
import Login from "../features/auth/Login/Login";
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Job Seeker Layout */}
      <Route path="/jobSeeker" element={<JobSeekerLayout />}>
        <Route path="/jobSeeker/home" element={<JobSeekerHome />} />
        <Route path="/jobSeeker/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/jobSeeker/companies" element={<JobSeekerCompanies />} />
        <Route path="/jobSeeker/jobSearch" element={<JobSeekerJobSearch />} />
        <Route path="/jobSeeker/profile" element={<Profile />} />
        <Route path="/jobSeeker/jobAlerts" element={<JobAlerts />} />
        <Route path="/jobSeeker/messages" element={<JobSeekerMessages />} />
        <Route path="/jobSeeker/savedJobs" element={<SavedJobs />} />
        <Route path="/jobSeeker/myApplications" element={<MyApplications />} />
        <Route path="/jobSeeker/EditProfile" element={<JobSeekerEditProfile />} />
      </Route>

      {/* RecruiterLayout Layout */}
      <Route path="/recruiter" element={<RecruiterLayout />}>
        <Route path="/recruiter/home" element={<Home />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/findCandidates" element={<FindCandidates />} />
        <Route path="/recruiter/Post" element={<PostJob />} />
        <Route path="/recruiter/my-jobs" element={<MyJobs />} />
        <Route path="/recruiter/applications" element={<Applications />} />
        <Route path="/recruiter/messages" element={<RecruiterMessages />} />
        <Route path="/recruiter/profile" element={<RecruiterProfile />} />
        <Route path="/recruiter/editProfile" element={<RecruiterEditProfile />} />
        <Route path="/recruiter/pricing" element={<RecruiterPricing />} />
      </Route>
    </Routes>
  );
}

export default AppContent;
