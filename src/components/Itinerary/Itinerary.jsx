import React, { useEffect, useState } from "react";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./ItineraryStyles.module.css";
import Modal from "../Modal/Modal";

function Itinerary() {
  const navigate = useNavigate();
  const { itineraryId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destinationName, setDestinationName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const fetchItinerary = () => {
    setLoading(true);
    fetch(`https://travdoodle-api.onrender.com/itineraries/${itineraryId}`)
      .then((response) => response.json())
      .then((data) => {
        setItinerary(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching itinerary details:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItinerary();
  }, [itineraryId, refreshTrigger]);

  if (loading) return <p>Loading...</p>;
  if (!itinerary) return <p>Itinerary not found</p>;

  const handleCreateDestination = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDestinationName("");
  };

  const handleSubmit = async () => {
    if (!destinationName.trim()) return alert("Destination name is required");

    const newDestination = {
      name: destinationName,
      itinerary_id: itineraryId,
    };

    try {
      const response = await fetch("https://travdoodle-api.onrender.com/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDestination),
      });

      if (!response.ok) throw new Error("Failed to add destination");

      await response.json();
      setRefreshTrigger((prev) => !prev);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding destination:", error);
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(`https://travdoodle-api.onrender.com/itineraries/${itineraryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete itinerary");

      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      alert("Failed to delete the trip. Please try again.");
    }
  };

  const fields = [
    { name: "destinationName", label: "Destination Name", type: "text", value: destinationName, onChange: (e) => setDestinationName(e.target.value) }
  ];

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.itineraryDetails}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.itineraryTitle}>{itinerary.name} Trip</h1>
        <p>Start date - {itinerary.start_date}</p>
        <p>End date - {itinerary.end_date}</p>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.packingListContainer}>
          <h2>Packing List</h2>
          <ul>
            {itinerary.packing_items.map((item) => (
              <li key={item.id} className={item.packed ? styles.packedItem : ""}>
                {item.item_name} (x{item.quantity}) {item.packed && "✔"}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.destinationsContainer}>
          <h2>Destinations</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.card} onClick={handleCreateDestination}>
              <h3>+ Add Destination</h3>
            </div>
            {itinerary.destinations.map((destination) => (
              <div key={destination.id} className={styles.card}>
                <h3 className={styles.destinationTitle}>
                  <FaUmbrellaBeach className={styles.icon} /> {destination.name}
                </h3>
                <button
                  className={styles.editButton}
                  onClick={() => navigate(`/destination/${destination.id}`)}
                >
                  View/Edit Destination
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal title="Add New Destination" fields={fields} isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      <button className={styles.deleteButton} onClick={handleDeleteTrip}>Delete Trip</button>
      <Footer />
    </div>
  );
}

export default Itinerary;
