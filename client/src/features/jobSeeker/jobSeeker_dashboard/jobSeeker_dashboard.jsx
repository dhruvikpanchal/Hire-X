import "./jobSeeker_dashboard.css";
import { Briefcase, Calendar, Bookmark, Eye } from "lucide-react";

const JobSeekerDashboard = () => {
    const stats = [
        { title: "Jobs Applied", value: "34", icon: Briefcase, color: "#3b82f6" },
        { title: "Interviews", value: "3", icon: Calendar, color: "#10b981" },
        { title: "Saved Jobs", value: "12", icon: Bookmark, color: "#f59e0b" },
        { title: "Profile Views", value: "89", icon: Eye, color: "#8b5cf6" },
    ];

    return (
        <div className="jobseeker-dashboard-container">


            <main className="jobseeker-main-content">
                <div className="jobseeker-dashboard-header">
                    <h1>My Dashboard</h1>
                    <p>Welcome back! Here is your activity summary.</p>
                </div>

                <div className="jobseeker-stats-grid">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="jobseeker-stat-card">
                                <div
                                    className="jobseeker-stat-icon"
                                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                                >
                                    <Icon size={24} />
                                </div>
                                <div className="jobseeker-stat-details">
                                    <h3>{stat.title}</h3>
                                    <p className="jobseeker-stat-value">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="jobseeker-recent-section">
                    <h2>Recent Applications</h2>
                    <div className="jobseeker-empty-state">
                        <p>You haven't applied to any recent jobs.</p>
                    </div>
                </div>
            </main>


        </div>
    );
};

export default JobSeekerDashboard;
