import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";

// import files
import "./Hero.css";
import { Image } from "../../../../utils/image_paths.js";

const Hero = () => {
  return (
    <section className="hero section">
      <div className="container hero-container">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            Find Your <span className="highlight">Dream Job</span>
            <br />
            Are You Ready?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            Find the job that fits your life. Connect with the best companies
            and start your career today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="search-box glass"
          >
            <div className="input-group">
              <Search className="icon" />
              <input type="text" placeholder="Job title or keywords" />
            </div>
            <div className="divider"></div>
            <div className="input-group">
              <MapPin className="icon" />
              <input type="text" placeholder="Location" />
            </div>
            <button className="btn btn-primary search-btn">Search</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="suggestions"
          >
            <span>Popular:</span>
            <span className="tag">Design</span>
            <span className="tag">Development</span>
            <span className="tag">Marketing</span>
          </motion.div>
        </div>

        <div className="hero-visual">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="visual-circle"
          ></motion.div>
          <motion.img
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src={Image.heroImg}
            alt="Hero"
            className="hero-img"
          />
          {/* Floating Cards */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="floating-card c1 glass"
          >
            <img src={Image.jobs} alt="" className="fc-icon" />
            <div className="fc-text">
              <h5>10k+</h5>
              <p>Jobs</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, delay: 1 }}
            className="floating-card c2 glass"
          >
            <div className="fc-icon">⭐</div>
            <div className="fc-text">
              <h5>Top</h5>
              <p>Rated</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, delay: 1 }}
            className="floating-card c3 glass"
          >
            <img src={Image.join_community} alt="" className="fc-icon" />
            <div className="fc-text">
              <h5>Join Community</h5>
              <p>Connect</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, delay: 0.5 }}
            className="floating-card c4 glass"
          >
            <img src={Image.remote} alt="" className="fc-icon" />
            <div className="fc-text">
              <h5>Remote</h5>
              <p>Work Options</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
