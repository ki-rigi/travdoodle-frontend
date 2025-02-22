import React, { useEffect, useState } from 'react';
import { FaUmbrellaBeach } from "react-icons/fa"; // Alternative travel-related icon
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from "./DashboardStyles.module.css";

function Dashboard() {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    fetch('https://travdoodle-api.onrender.com/itineraries')
      .then(response => response.json())
      .then(data => setItineraries(data))
      .catch(error => console.error("Error fetching itineraries:", error));
  }, []);

  const handleEdit = (id) => {
    alert(`Navigate to edit page for itinerary ID: ${id}`);
  };

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.dashboardTitle}>Dashboard</h1>
      <div className={styles.cardsContainer}>
        <div className={styles.card} onClick={() => alert("Navigate to create itinerary page")}>
          <h3>+ Create New Itinerary</h3>
        </div>

        {itineraries.map(itinerary => (
          <div key={itinerary.id} className={styles.card}>
            <h3 className={styles.itineraryTitle}>
              <FaUmbrellaBeach className={styles.icon} /> {itinerary.name}
            </h3>
            <p>{itinerary.start_date} - {itinerary.end_date}</p>
            <button className={styles.editButton} onClick={() => handleEdit(itinerary.id)}>View/Edit Trip</button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
