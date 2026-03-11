# Job portal website folder setup

job-portal/
│
├── public/
│ ├── favicon.ico
│
├── src/
│
│ ├── assets/
│ │ ├── images/
│ │ │ ├── logo.png
│ │ │ ├── hero-banner.jpg
│ │ │
│ │ ├── icons/
│ │ │ ├── dashboard.svg
│ │ │ ├── job.svg
│
│ ├── components/
│ │ ├── common/
│ │ │ ├── Navbar.jsx
│ │ │ ├── Navbar.css
│ │ │ ├── Footer.jsx
│ │ │ ├── Footer.css
│ │ │ ├── Sidebar.jsx
│ │ │ ├── Sidebar.css
│ │ │ ├── Loader.jsx
│ │ │ ├── ErrorMessage.jsx
│ │ │
│ │ ├── ui/
│ │ │ ├── Button.jsx
│ │ │ ├── Button.css
│ │ │ ├── Input.jsx
│ │ │ ├── Input.css
│ │ │ ├── Modal.jsx
│ │ │ ├── Card.jsx
│
│ ├── features/
│ │
│ │ ├── public/
│ │ │ ├── home/
│ │ │ │ ├── Home.jsx
│ │ │ │ ├── Home.css
│ │ │ │ ├── components/
│ │ │ │ │ ├── Hero.jsx
│ │ │ │ │ ├── Hero.css
│ │ │ │ │ ├── FeaturedJobs.jsx
│ │ │ │ │ ├── FeaturedJobs.css
│ │ │ │
│ │ │ ├── about/
│ │ │ │ ├── About.jsx
│ │ │ │ ├── About.css
│ │ │ │
│ │ │ ├── contact/
│ │ │ │ ├── Contact.jsx
│ │ │ │ ├── Contact.css
│ │ │ │
│ │ │ ├── job-search/
│ │ │ │ ├── JobSearch.jsx
│ │ │ │ ├── JobSearch.css
│ │ │ │ ├── components/
│ │ │ │ │ ├── SearchBar.jsx
│ │ │ │ │ ├── FilterPanel.jsx
│ │ │ │ │ ├── JobResultCard.jsx
│ │
│ │ ├── auth/
│ │ │ ├── LoginPage.jsx
│ │ │ ├── LoginPage.css
│ │ │ ├── RegisterPage.jsx
│ │ │ ├── RegisterPage.css
│ │ │ ├── authService.js
│ │ │ ├── useAuth.js
│ │
│ │ ├── admin/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── ManageUsers.jsx
│ │ │ ├── ManageJobs.jsx
│ │ │ ├── Reports.jsx
│ │ │ ├── adminService.js
│ │
│ │ ├── recruiter/
│ │ │ ├── RecruiterDashboard.jsx
│ │ │ ├── PostJob.jsx
│ │ │ ├── ManageMyJobs.jsx
│ │ │ ├── ViewApplicants.jsx
│ │ │ ├── recruiterService.js
│ │
│ │ ├── jobseeker/
│ │ │ ├── JobSeekerDashboard.jsx
│ │ │ ├── Profile.jsx
│ │ │ ├── MyApplications.jsx
│ │ │ ├── jobSeekerService.js
│ │
│ │ ├── jobs/
│ │ │ ├── jobService.js
│ │ │ ├── JobCard.jsx
│ │ │ ├── JobList.jsx
│
│ ├── layouts/
│ │ ├── MainLayout.jsx
│ │ ├── AdminLayout.jsx
│ │ ├── RecruiterLayout.jsx
│ │ ├── JobSeekerLayout.jsx
│
│ ├── routes/
│ │ ├── AppRoutes.jsx
│ │ ├── ProtectedRoute.jsx
│ │ ├── RoleBasedRoute.jsx
│
│ ├── services/
│ │ ├── axiosInstance.js
│ │ ├── api.js
│
│ ├── context/
│ │ ├── AuthContext.jsx
│
│ ├── hooks/
│ │ ├── useFetch.js
│ │ ├── useDebounce.js
│
│ ├── utils/
│ │ ├── constants.js
│ │ ├── validators.js
│ │ ├── formatDate.js
│
│ ├── styles/
│ │ ├── global.css
│
│ ├── App.jsx
│ ├── main.jsx
│
├── .env
├── package.json
├── vite.config.js
