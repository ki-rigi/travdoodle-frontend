import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaEdit, FaSignOutAlt, FaTrash, FaTimes, FaBars } from 'react-icons/fa';
import useAuthStore from '../AuthStore/AuthStore';
import styles from './HeaderStyles.module.css';

function Header() {
  const { userId, username, userEmail, logout, deleteAccount } = useAuthStore();
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout(navigate);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      await deleteAccount(userId, handleLogout);
    }
  };

  // Toggle User Info & Hide Navigation
  const handleUserInfoClick = () => {
    setShowUserInfo(!showUserInfo);
    setMenuOpen(false); // Hide menu when user info opens
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>Travdoodle</div>

      {/* Hamburger Menu Icon for Small Screens */}
      <button
        className={styles.hamburger}
        onClick={() => {
          setMenuOpen(!menuOpen);
          setShowUserInfo(false); // Hide user info when menu opens
        }}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Menu */}
      <div className={`${styles.nav} ${menuOpen ? styles.showNav : ''} ${showUserInfo ? styles.hideNav : ''}`}>
        <Link to="/dashboard">
          <button className={styles.navButton}>Dashboard</button>
        </Link>
        <button className={styles.navButton} onClick={handleUserInfoClick}>
          User Info
        </button>
      </div>

      {/* User Info Dropdown */}
      {showUserInfo && (
        <div className={styles.userInfoDropdown}>
          <button className={styles.closeButton} onClick={() => setShowUserInfo(false)}>
            <FaTimes />
          </button>
          <div className={styles.userInfoItem}>
            <FaUser className={styles.icon1} />
            <p>Username :</p>
            <p>{username}</p>
          </div>
          <div className={styles.userInfoItem}>
            <FaEnvelope className={styles.icon1} />
            <p>Email :</p>
            <p>{userEmail}</p>
          </div>
          <button className={styles.userInfoButton}>
            <FaEdit className={styles.icon} /> Edit Info
          </button>
          <button className={styles.userInfoButton} onClick={handleLogout}>
            <FaSignOutAlt className={styles.icon} /> Logout
          </button>
          <button className={styles.deleteButton} onClick={handleDeleteAccount}>
            <FaTrash className={styles.icon} /> Delete Account
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
