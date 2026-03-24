import { Link } from "react-router-dom";
import { Image } from "../../../utils/image_paths";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
      <h1 className="notfound-title">404 - Page Not Found</h1>
      <p className="notfound-text">The page you are looking for doesn't exist.</p>
        {/* <img src={Image.notFound} alt="not found" className="notfound-image" /> */}
        <video 
          className="notfound-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={Image.notFound} type="video/mp4" />
        </video>
        <Link to="/" className="btn-notfound" >Go back to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
