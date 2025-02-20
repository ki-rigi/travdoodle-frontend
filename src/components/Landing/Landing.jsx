import React from "react";
import styles from "./LandingStyles.module.css";

function Landing() {
  return (
    <div className={styles.landing}>
      {/* Header with Logo and Login Button */}
      <div className={styles.header}>
        <div className={styles.logo}>Travdoodle</div>
        <button className={styles.loginButton}>Login</button>
      </div>

      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1>Explore the World with Travdoodle</h1>
          <p>Easily plan your trips, organize itineraries, track destinations, and manage your packing list—all in one place.</p>
          <button className={styles.button}>Get Started</button>
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
