import React, { useState } from 'react';
import './RecruiterEditProfile.css';

const RecruiterEditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCompanyLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="recruitereditprofile-page">
      <div className="recruitereditprofile-container">
        <header className="recruitereditprofile-header">
          <h1 className="recruitereditprofile-title">Edit Profile</h1>
          <p className="recruitereditprofile-subtitle">Update your recruiter and company information.</p>
        </header>

        <form className="recruitereditprofile-form">
          <section className="recruitereditprofile-section">
            <h2 className="recruitereditprofile-section-title">Profile Information</h2>
            
            <div className="recruitereditprofile-image-upload">
              <label className="recruitereditprofile-label">Recruiter Profile Image (optional)</label>
              <div className="recruitereditprofile-image-preview-wrapper">
                {profileImage ? (
                  <img src={profileImage} alt="Profile Preview" className="recruitereditprofile-preview-img" />
                ) : (
                  <div className="recruitereditprofile-placeholder">No Image</div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfileImageChange} 
                  className="recruitereditprofile-file-input" 
                />
              </div>
            </div>

            <div className="recruitereditprofile-grid">
              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Recruiter Name</label>
                <input type="text" className="recruitereditprofile-input" placeholder="e.g. John Doe" />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Job Title / Position</label>
                <input type="text" className="recruitereditprofile-input" placeholder="e.g. Senior Technical Recruiter" />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Email</label>
                <input type="email" className="recruitereditprofile-input" placeholder="e.g. john@company.com" />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Phone Number</label>
                <input type="tel" className="recruitereditprofile-input" placeholder="e.g. +1 234 567 890" />
              </div>
              
              <div className="recruitereditprofile-input-group recruitereditprofile-full-width">
                <label className="recruitereditprofile-label">Location</label>
                <input type="text" className="recruitereditprofile-input" placeholder="e.g. New York, USA" />
              </div>
            </div>
          </section>

          <section className="recruitereditprofile-section">
            <h2 className="recruitereditprofile-section-title">Company Information</h2>
            
            <div className="recruitereditprofile-image-upload">
              <label className="recruitereditprofile-label">Company Logo (optional)</label>
              <div className="recruitereditprofile-image-preview-wrapper">
                {companyLogo ? (
                  <img src={companyLogo} alt="Company Logo Preview" className="recruitereditprofile-preview-img company-logo-preview" />
                ) : (
                  <div className="recruitereditprofile-placeholder">No Logo</div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleCompanyLogoChange} 
                  className="recruitereditprofile-file-input" 
                />
              </div>
            </div>

            <div className="recruitereditprofile-grid">
              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Company Name</label>
                <input type="text" className="recruitereditprofile-input" placeholder="e.g. Tech Solutions Inc." />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Industry</label>
                <input type="text" className="recruitereditprofile-input" placeholder="e.g. Information Technology" />
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Company Size</label>
                <select className="recruitereditprofile-input">
                  <option value="">Select Company Size</option>
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="500+">500+ Employees</option>
                </select>
              </div>

              <div className="recruitereditprofile-input-group">
                <label className="recruitereditprofile-label">Company Website</label>
                <input type="url" className="recruitereditprofile-input" placeholder="e.g. https://www.techsolutions.com" />
              </div>

              <div className="recruitereditprofile-input-group recruitereditprofile-full-width">
                <label className="recruitereditprofile-label">Company Description / About Company</label>
                <textarea className="recruitereditprofile-input recruitereditprofile-textarea" placeholder="Tell us about the company..." rows="4"></textarea>
              </div>
            </div>
          </section>

          <div className="recruitereditprofile-actions">
            <button type="button" className="recruitereditprofile-btn recruitereditprofile-btn-cancel">Cancel</button>
            <button type="submit" className="recruitereditprofile-btn recruitereditprofile-btn-save">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterEditProfile;
