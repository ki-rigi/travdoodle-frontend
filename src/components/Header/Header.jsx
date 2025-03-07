import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSignOutAlt,
  FaTrash,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import useAuthStore from "../AuthStore/AuthStore";
import Modal from "../Modal/Modal"; // Import the modal component
import styles from "./HeaderStyles.module.css";

function Header() {
  const { userId, username, userEmail, logout, deleteAccount } = useAuthStore();
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: username || "",
    email: userEmail || "",
  });

  // Handle logout
  const handleLogout = async () => {
    await logout(navigate);
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      await deleteAccount(userId, handleLogout);
    }
  };

  // Toggle user info dropdown
  const handleUserInfoClick = () => {
    setShowUserInfo(!showUserInfo);
    setMenuOpen(false);
  };

  // Open edit modal
  const openEditModal = () => {
    setEditedUser({ username, email: userEmail });
    setIsEditModalOpen(true);
  };

  
  

  // Submit PATCH request to update user info
const { setUserInfo } = useAuthStore(); // Add this at the top of the component

const handleUpdateUser = async () => {
  try {
    const response = await fetch(`https://travdoodle-api.onrender.com/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedUser),
    });

    if (!response.ok) {
      throw new Error("Failed to update user info");
    }

    const updatedUser = await response.json();

    // ✅ Update Zustand Store with New User Info
    setUserInfo(updatedUser.username, updatedUser.email);

    alert("User info updated successfully!");
    setIsEditModalOpen(false);
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Error updating user information");
  }
};

  

  return (
    <div className={styles.header}>
      <div className={styles.logo}>Travdoodle</div>

      {/* Hamburger Menu */}
      <button
        className={styles.hamburger}
        onClick={() => {
          setMenuOpen(!menuOpen);
          setShowUserInfo(false);
        }}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation */}
      <div className={`${styles.nav} ${menuOpen ? styles.showNav : ""} ${showUserInfo ? styles.hideNav : ""}`}>
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
            <p>Username:</p>
            <p>{username}</p>
          </div>
          <div className={styles.userInfoItem}>
            <FaEnvelope className={styles.icon1} />
            <p>Email:</p>
            <p>{userEmail}</p>
          </div>
          <button className={styles.userInfoButton} onClick={openEditModal}>
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

<Modal
  title="Edit User Info"
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  onSubmit={handleUpdateUser}
  fields={[
    {
      name: "username",
      label: "Username",
      type: "text",
      value: editedUser.username, // Make sure this reflects the latest state
      onChange: (e) => setEditedUser({ ...editedUser, username: e.target.value })
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: editedUser.email, // Make sure this reflects the latest state
      onChange: (e) => setEditedUser({ ...editedUser, email: e.target.value })
    },
  ]}
/>




    </div>
  );
}

export default Header;
