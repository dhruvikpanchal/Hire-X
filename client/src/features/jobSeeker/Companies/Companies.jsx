import React, { useState } from 'react';
import './Companies.css';

const MOCK_COMPANIES = [
  {
    id: 1,
    name: "Stripe",
    industry: "FinTech",
    size: "4,000+",
    openJobs: 38,
    location: "San Francisco",
    logo: "S",
    description: "Financial infrastructure platform for the internet, helping businesses accept payments and manage revenue.",
  },
  {
    id: 2,
    name: "Vercel",
    industry: "Dev Tools",
    size: "500+",
    openJobs: 21,
    location: "Remote",
    logo: "V",
    description: "The platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
  },
  {
    id: 3,
    name: "Linear",
    industry: "SaaS",
    size: "100+",
    openJobs: 12,
    location: "San Francisco",
    logo: "L",
    description: "The issue tracking tool you'll enjoy using. Streamline software projects, sprints, tasks, and bug tracking.",
  },
  {
    id: 4,
    name: "Notion",
    industry: "Productivity",
    size: "600+",
    openJobs: 29,
    location: "New York",
    logo: "N",
    description: "The all-in-one workspace for your notes, tasks, wikis, and databases. A new tool that blends your everyday work apps into one.",
  },
  {
    id: 5,
    name: "Figma",
    industry: "Design Tools",
    size: "800+",
    openJobs: 44,
    location: "San Francisco",
    logo: "F",
    description: "Connect everyone in the design process so teams can deliver better products, faster.",
  },
  {
    id: 6,
    name: "Loom",
    industry: "Video Comms",
    size: "300+",
    openJobs: 17,
    location: "Remote",
    logo: "L",
    description: "Video messaging for work. Record your screen and camera and share it instantly with a link.",
  },
];

const INDUSTRIES = ["All", "FinTech", "Dev Tools", "SaaS", "Productivity", "Design Tools", "Video Comms"];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const filteredCompanies = MOCK_COMPANIES.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="companies-container">
      {/* 1. Hero Section */}
      <section className="companies-hero">
        <div className="companies-hero-content">
          <h1 className="companies-title">Explore Top Companies</h1>
          <p className="companies-description">
            Discover leading companies building the future, explore their culture, and find your next career opportunity.
          </p>
          <div className="companies-search-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search companies by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="companies-search-input"
            />
          </div>
        </div>
      </section>

      {/* 3. Filter Section */}
      <section className="companies-filters-section">
        <div className="industry-filters">
          {INDUSTRIES.map(industry => (
            <button 
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`filter-btn ${selectedIndustry === industry ? 'active' : ''}`}
            >
              {industry}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Companies Grid */}
      <section className="companies-list-section">
        <div className="companies-header-bar">
          <p className="results-count">Showing <span>{filteredCompanies.length}</span> companies</p>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="no-results">
            <p>No companies found matching your criteria.</p>
            <button className="reset-btn" onClick={() => { setSearchTerm(''); setSelectedIndustry('All'); }}>Reset Filters</button>
          </div>
        ) : (
          <div className="companies-grid">
            {filteredCompanies.map(company => (
              <div className="company-card" key={company.id}>
                <div className="company-card-header">
                  <div className="company-logo-container">
                    <span className="company-logo-text">{company.logo}</span>
                  </div>
                  <div className="company-title-info">
                    <h3 className="company-name">{company.name}</h3>
                    <span className="company-industry">{company.industry}</span>
                  </div>
                </div>
                
                <div className="company-card-body">
                  <p className="company-short-desc">{company.description}</p>
                  
                  <div className="company-meta">
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {company.location}
                    </div>
                    <div className="meta-item highlight">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                      {company.openJobs} Open Jobs
                    </div>
                  </div>
                </div>

                <div className="company-card-footer">
                  <button className="view-jobs-btn">
                    View Jobs
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Companies;
