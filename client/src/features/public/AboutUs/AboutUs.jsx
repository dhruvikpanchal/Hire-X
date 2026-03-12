import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">About Hire X</h1>
          <p className="about-description">
            Hire X helps connect talented job seekers with the right companies and opportunities. We make the job market accessible, transparent, and easy to navigate.
          </p>
        </div>
      </section>

      {/* 2. Project Information Section */}
      <section className="about-project-section">
        <div className="project-grid">
          <div className="project-text">
            <h2 className="section-title">What is Hire X?</h2>
            <p className="section-text">
              Hire X is a modern job portal designed to streamline the hiring process for both candidates and employers. Our goal is to bridge the gap between top talent and leading organizations.
            </p>
            <ul className="project-features">
              <li>
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div className="feature-content">
                  <h3>Job Search</h3>
                  <p>Find the perfect role quickly and efficiently.</p>
                </div>
              </li>
              <li>
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <div className="feature-content">
                  <h3>Company Discovery</h3>
                  <p>Explore top organizations and their cultures.</p>
                </div>
              </li>
              <li>
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div className="feature-content">
                  <h3>Easy Job Applications</h3>
                  <p>Apply to multiple jobs with a streamlined process.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Creator / Developer Section */}
      <section className="about-creator-section">
        <h2 className="section-title center">Meet the Developer</h2>
        <div className="developer-card">
          <div className="developer-image-container">
            {/* Using an avatar placeholder since no external image was provided */}
            <div className="developer-avatar">
              <span>DP</span>
            </div>
          </div>
          <div className="developer-info">
            <h3 className="developer-name">Dhruvik Panchal</h3>
            <p className="developer-role">Full Stack Developer</p>
            <p className="developer-bio">
              A passionate developer dedicated to building impactful digital experiences. I created Hire X to solve real-world problems in the recruitment process, making it simple for everyone involved.
            </p>
            <div className="developer-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
