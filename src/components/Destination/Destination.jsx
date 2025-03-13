import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./DestinationStyles.module.css";

function Destination() {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://travdoodle-api.onrender.com/destinations/${destinationId}`)
      .then((response) => response.json())
      .then((data) => {
        setDestination(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching destination details:", error);
        setLoading(false);
      });
  }, [destinationId]);

  if (loading) return <p>Loading...</p>;
  if (!destination) return <p>Destination not found</p>;

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.destinationDetails}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className={styles.destinationTitle}>Destination: {destination.name}</h1>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.activitiesContainer}>
          <h2>Activities</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <h3>+ Add Activity</h3>
            </div>
            {destination.activities.map((activity) => (
              <div key={activity.id} className={styles.card}>
                <h3>Activity: {activity.name}</h3>
                <p>Description: {activity.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.accommodationsContainer}>
          <h2>Accommodations</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <h3>+ Add Accommodation</h3>
            </div>
            {destination.accommodations.map((accommodation) => (
              <div key={accommodation.id} className={styles.card}>
                <h3>Name: {accommodation.name}</h3>
                <p>Address: {accommodation.address}</p>
                <p>Check-in: {accommodation.check_in_date}</p>
                <p>Check-out: {accommodation.check_out_date}</p>
                <p>Price: ${accommodation.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Destination;