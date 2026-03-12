import { useState } from "react";
import "./SavedJobs.css";
const initialJobs = [
    { id: 1, title: "Senior React Developer", company: "Spotify", location: "Remote" },
    { id: 2, title: "Frontend Engineer", company: "Figma", location: "San Francisco, CA" },
    { id: 3, title: "UI/UX Developer", company: "Notion", location: "New York, NY" },
    { id: 4, title: "JavaScript Developer", company: "Vercel", location: "Remote" },
    { id: 5, title: "Web Developer", company: "Shopify", location: "Toronto, CA" },
    { id: 6, title: "React Native Dev", company: "Discord", location: "Remote" },
];
const SavedJobs = () => {
    const [jobs, setJobs] = useState(initialJobs);
    return (
        <div className="saved-jobs">
            <h1>Saved Jobs</h1>
            <div className="saved-jobs-grid">
                {jobs.map((job) => (
                    <div className="saved-job-card" key={job.id}>
                        <h3>{job.title}</h3>
                        <p className="company">{job.company}</p>
                        <p className="location">{job.location}</p>
                        <button className="remove-btn" onClick={() => setJobs(jobs.filter((j) => j.id !== job.id))}>
                            Remove
                        </button>
                    </div>
                ))}
                {jobs.length === 0 && <p style={{ color: "#94a3b8" }}>No saved jobs.</p>}
            </div>
        </div>
    );
};
export default SavedJobs;
