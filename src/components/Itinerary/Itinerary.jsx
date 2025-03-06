import React, { useEffect, useState } from "react";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./ItineraryStyles.module.css";
import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom";

function Itinerary() {
const navigate = useNavigate();
  const { itineraryId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destinationName, setDestinationName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false); // 🔄 State to trigger refresh

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
  }, [itineraryId, refreshTrigger]); // 🔄 Re-fetch when `refreshTrigger` changes

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
      setRefreshTrigger((prev) => !prev); // 🔄 Trigger re-fetch
      handleCloseModal();
    } catch (error) {
      console.error("Error adding destination:", error);
    }
  };

  const fields = [
    { name: "destinationName", label: "Destination Name", type: "text", value: destinationName, onChange: (e) => setDestinationName(e.target.value) }
  ];

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.itineraryDetails}>
        {/* Back Button */}
        <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
        
        <h1 className={styles.itineraryTitle}>{itinerary.name}</h1>
        <p>
          {itinerary.start_date} - {itinerary.end_date}
        </p>
      </div>
      
      <div className={styles.contentContainer}>
        {/* Packing List */}
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
        
        {/* Destinations */}
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
                    onClick={() => navigate(`/destination/${destination.id}`)} // Navigate to the itinerary page
                    >
                    View/Edit Destination
                    </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Modal title="Add New Destination" fields={fields} isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      <Footer />
    </div>
  );
}

export default Itinerary;
