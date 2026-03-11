import "./recruiter_dashboard.css";
import { Briefcase, Users, CalendarCheck, CheckCircle2 } from "lucide-react";

const RecruiterDashboard = () => {
    const stats = [
        { title: "Active Jobs", value: "8", icon: Briefcase, color: "#3b82f6" },
        { title: "Total Applicants", value: "245", icon: Users, color: "#10b981" },
        { title: "Interviews", value: "12", icon: CalendarCheck, color: "#f59e0b" },
        { title: "Hired", value: "24", icon: CheckCircle2, color: "#8b5cf6" },
    ];

    return (
        <div className="recruiter-dashboard-container">

            <main className="recruiter-main-content">
                <div className="recruiter-dashboard-header">
                    <h1>Recruiter Dashboard</h1>
                    <p>Welcome back! Manage your job postings and applicants here.</p>
                </div>

                <div className="recruiter-stats-grid">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="recruiter-stat-card">
                                <div
                                    className="recruiter-stat-icon"
                                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                                >
                                    <Icon size={24} />
                                </div>
                                <div className="recruiter-stat-details">
                                    <h3>{stat.title}</h3>
                                    <p className="recruiter-stat-value">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="recruiter-recent-section">
                    <h2>Recent Applicants</h2>
                    <div className="recruiter-empty-state">
                        <p>No new applicants to review today.</p>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default RecruiterDashboard;
