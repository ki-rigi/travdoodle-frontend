import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaUmbrellaBeach } from "react-icons/fa";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./DashboardStyles.module.css";
import useAuthStore from "../AuthStore/AuthStore";
import Modal from "../Modal/Modal";

function Dashboard() {
  const [itineraries, setItineraries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    if (!userId) return;

    fetch(`https://travdoodle-api.onrender.com/users/${userId}`)
      .then((response) => response.json())
      .then((userData) => {
        setItineraries(userData.itineraries || []);
      })
      .catch((error) => console.error("Error fetching user details:", error));
  }, [userId]);

  const handleCreateItinerary = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setName("");
    setStartDate("");
    setEndDate("");
  };

  const handleDownloadReport = async (itineraryId, itineraryName) => {
    try {
      const response = await fetch(`https://travdoodle-api.onrender.com/itineraries/${itineraryId}/report/pdf`);
      if (!response.ok) {
        throw new Error("Failed to download report");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${itineraryName}_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Error downloading report. Please try again.");
    }
  };
  

  const handleSubmit = async () => {
    if (!userId) {
      alert("You must be logged in to create an itinerary.");
      return;
    }

    const newItinerary = { name, start_date: startDate, end_date: endDate, user_id: userId };

    try {
      const response = await fetch("https://travdoodle-api.onrender.com/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItinerary),
      });

      if (response.ok) {
        const result = await response.json();
        setItineraries([...itineraries, result.itinerary]);
        handleCloseModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create itinerary");
      }
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  const fields = [
    { name: "name", label: "Trip Name", type: "text", value: name, onChange: (e) => setName(e.target.value) },
    { name: "startDate", label: "Start Date", type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value) },
    { name: "endDate", label: "End Date", type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value) },
  ];

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.dashboardTitle}>Dashboard</h1>
      <div className={styles.cardsContainer}>
        <div className={styles.card} onClick={handleCreateItinerary}>
          <h3>+ Create New Itinerary</h3>
        </div>

        {itineraries.map((itinerary) => (
          <div key={itinerary.id} className={styles.card}>
            <h3 className={styles.itineraryTitle}>
              <FaUmbrellaBeach className={styles.icon} /> {itinerary.name} Trip
            </h3>
            <p>
              {itinerary.start_date} - {itinerary.end_date}
            </p>
            <button
              className={styles.editButton}
              onClick={() => navigate(`/itinerary/${itinerary.id}`)} // Navigate to the itinerary page
            >
              View/Edit Trip
            </button>
            <button
              className={styles.editButton} // New Button Style
              onClick={() => handleDownloadReport(itinerary.id, itinerary.name)}
            >
              Download Report
            </button>
          </div>
        ))}
      </div>

      <Modal title="Create New Itinerary" fields={fields} isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />

      <Footer />
    </div>
  );
}

export default Dashboard;
