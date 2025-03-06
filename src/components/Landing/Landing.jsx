import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "./LandingStyles.module.css";

function Landing() {

  useEffect(() => {
    // Preload the images
    const preloadImages = ["/landing.jpg"];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className={styles.landing}>
      {/* Header with Logo and Login Button */}
      <div className={styles.header}>
        <div className={styles.logo}>Travdoodle</div>
        <Link to="/login">
          <button className={styles.loginButton}>Login</button>
        </Link>
      </div>

      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1>Explore the World with Travdoodle</h1>
          <p>Easily plan your trips, organize itineraries, track destinations, and manage your packing list — all in one place.</p>
          <Link to="/sign-up">
          <button className={styles.button}>Get Started</button>
        </Link>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>Made with ❤️ by Travdoodle</p>
        <p>© {new Date().getFullYear()} Travdoodle. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
