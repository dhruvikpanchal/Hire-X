import "./jobSeeker_dashboard.css";
import { Briefcase, Bookmark, User, Bell } from "lucide-react";
const cards = [
    { icon: <Briefcase size={22} />, label: "Applications", value: "12" },
    { icon: <Bookmark size={22} />, label: "Saved Jobs", value: "8" },
    { icon: <User size={22} />, label: "Profile Completion", value: "75%" },
    { icon: <Bell size={22} />, label: "Job Alerts", value: "5" },
];
const JobSeekerDashboard = () => (
    <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="dashboard-cards">
            {cards.map((c) => (
                <div className="dashboard-card" key={c.label}>
                    <div className="dashboard-card-icon">{c.icon}</div>
                    <div className="dashboard-card-info">
                        <h3>{c.label}</h3>
                        <p>{c.value}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
export default JobSeekerDashboard;