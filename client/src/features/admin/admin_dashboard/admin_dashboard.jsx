import "./admin_dashboard.css";
import { Users, Briefcase, Building2, Activity } from "lucide-react";

const AdminDashboard = () => {
    const stats = [
        { title: "Total Users", value: "1,245", icon: Users, color: "#3b82f6" },
        { title: "Active Jobs", value: "342", icon: Briefcase, color: "#10b981" },
        { title: "Companies", value: "89", icon: Building2, color: "#f59e0b" },
        { title: "Applications", value: "4,521", icon: Activity, color: "#8b5cf6" },
    ];

    return (
        <div className="admin-dashboard-container">

            <main className="admin-main-content">
                <div className="admin-dashboard-header">
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back, Admin. Here's what's happening today.</p>
                </div>

                <div className="admin-stats-grid">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="admin-stat-card">
                                <div
                                    className="admin-stat-icon"
                                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                                >
                                    <Icon size={24} />
                                </div>
                                <div className="admin-stat-details">
                                    <h3>{stat.title}</h3>
                                    <p className="admin-stat-value">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="admin-recent-section">
                    <h2>Recent Activity</h2>
                    <div className="admin-empty-state">
                        <p>No recent activity to display.</p>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AdminDashboard;
