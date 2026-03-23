import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// import files
import "./Hero.css";
import { Image } from "../../../../utils/image_paths.js";

const Hero = () => {
  const navigate = useNavigate();
  const [companyQuery, setCompanyQuery] = useState("");

  const onSearchCompanies = () => {
    const q = companyQuery.trim();
    if (!q) {
      navigate("/companies");
      return;
    }
    navigate(`/companies?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="hero section">
      <div className="container hero-container">
        <div className="hero-content">
          <h1
            className="hero-title"
          >
            Find Your <span className="highlight">Dream Job</span>
            <br />
            Are You Ready?
          </h1>

          <p
            className="hero-subtitle"
          >
            Find the job that fits your life. Connect with the best companies
            and start your career today.
          </p>

          <div
            className="search-box glass"
          >
            <div className="input-group">
              <Search className="icon" />
              <input
                type="text"
                placeholder="Search companies"
                value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearchCompanies();
                }}
              />
            </div>
            <div className="divider"></div>
            <div className="input-group">
              <MapPin className="icon" />
              <input type="text" placeholder="Location" />
            </div>
            <button className="btn btn-primary search-btn" onClick={onSearchCompanies} type="button">
              Search
            </button>
          </div>

          <div className="suggestions">
            <span>Popular:</span>
            <span className="tag">Design</span>
            <span className="tag">Development</span>
            <span className="tag">Marketing</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-circle"></div>
          <img src={Image.heroImg} alt="Hero" className="hero-img" />
          {/* Floating Cards */}
          <div className="floating-card c1 glass">
            <img src={Image.jobs} alt="" className="fc-icon" />
            <div className="fc-text">
              <h5>10k+</h5>
              <p>Jobs</p>
            </div>
          </div>

          <div className="floating-card c2 glass">
            <div className="fc-icon">⭐</div>
            <div className="fc-text">
              <h5>Top</h5>
              <p>Rated</p>
            </div>
          </div>

          <div className="floating-card c3 glass">
            <img src={Image.join_community} alt="" className="fc-icon" />
            <div className="fc-text">
              <h5>Join Community</h5>
              <p>Connect</p>
            </div>
          </div>

          <div className="floating-card c4 glass">
            <img src={Image.remote} alt="" className="fc-icon" />
            <div className="fc-text">
              <h5>Remote</h5>
              <p>Work Options</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
