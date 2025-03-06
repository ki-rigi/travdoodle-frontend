import React, { useEffect, useState } from 'react';
import { FaUmbrellaBeach } from "react-icons/fa";
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from "./DashboardStyles.module.css";
import useAuthStore from "../AuthStore/AuthStore"; // Import auth store

function Dashboard() {
  const [itineraries, setItineraries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const userId = useAuthStore((state) => state.userId); // Get logged-in user's ID

  useEffect(() => {
    if (!userId) return; // Prevent fetching if user is not logged in
  
    fetch(`https://travdoodle-api.onrender.com/users/${userId}`) // Fetch user details
      .then(response => response.json())
      .then(userData => {
        if (userData.itineraries) {
          setItineraries(userData.itineraries); // Extract and set itineraries
        } else {
          setItineraries([]); // Handle case where there are no itineraries
        }
      })
      .catch(error => console.error("Error fetching user details:", error));
  }, [userId]); // Re-run when userId changes
  
  const handleCreateItinerary = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName("");
    setStartDate("");
    setEndDate("");
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("You must be logged in to create an itinerary.");
      return;
    }

    const newItinerary = { name, start_date: startDate, end_date: endDate, user_id: userId };

    try {
      const response = await fetch('https://travdoodle-api.onrender.com/itineraries', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItinerary),
      });

      if (response.ok) {
        const result = await response.json();
        setItineraries([...itineraries, result.itinerary]); // Update with the created itinerary
        handleCloseModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create itinerary");
      }
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.dashboardTitle}>Dashboard</h1>
      <div className={styles.cardsContainer}>
        <div className={styles.card} onClick={handleCreateItinerary}>
          <h3>+ Create New Itinerary</h3>
        </div>

        {itineraries.map(itinerary => (
          <div key={itinerary.id} className={styles.card}>
            <h3 className={styles.itineraryTitle}>
              <FaUmbrellaBeach className={styles.icon} /> {itinerary.name}
            </h3>
            <p>{itinerary.start_date} - {itinerary.end_date}</p>
            <button 
              className={styles.editButton} 
              onClick={() => alert(`Navigate to edit page for itinerary ID: ${itinerary.id}`)}
            >
              View/Edit Trip
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h2>Create New Itinerary</h2>

            <label className={styles.label} htmlFor="tripName">Trip Name:</label>
            <input id="tripName" type="text" value={name} onChange={(e) => setName(e.target.value)} />

            <label className={styles.label} htmlFor="startDate">Start Date:</label>
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

            <label className={styles.label} htmlFor="endDate">End Date:</label>
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <button className={styles.saveButton} onClick={handleSubmit}>Save</button>
            <button className={styles.cancelButton} onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;
