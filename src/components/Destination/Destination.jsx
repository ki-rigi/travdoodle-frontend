import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./DestinationStyles.module.css";
import Modal from "../Modal/Modal";

function Destination() {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isAccommodationModalOpen, setIsAccommodationModalOpen] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [accommodationName, setAccommodationName] = useState("");
  const [accommodationAddress, setAccommodationAddress] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [price, setPrice] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
  const [isEditAccommodationModalOpen, setIsEditAccommodationModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

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
  }, [destinationId, refreshTrigger]);

  if (loading) return <p>Loading...</p>;
  if (!destination) return <p>Destination not found</p>;

  const handleCreateActivity = () => {
    setActivityName("");  // Reset activity name
    setActivityDescription(""); // Reset activity description
    setIsActivityModalOpen(true);
  };
  
  const handleCreateAccommodation = () => {
    setAccommodationName("");
    setAccommodationAddress("");
    setCheckInDate("");
    setCheckOutDate("");
    setPrice("");
    setIsAccommodationModalOpen(true);
  };
  
  const handleCloseActivityModal = () => {
    setIsActivityModalOpen(false);
    setActivityName("");
    setActivityDescription("");
  };
  const handleCloseAccommodationModal = () => {
    setIsAccommodationModalOpen(false);
    setAccommodationName("");
    setAccommodationAddress("");
    setCheckInDate("");
    setCheckOutDate("");
    setPrice("");
  };

  const handleSubmitActivity = async () => {
    if (!activityName.trim() || !activityDescription.trim()) {
      return alert("Activity name and description are required");
    }
    const newActivity = {
      name: activityName,
      description: activityDescription,
      destination_id: destinationId,
    };
    try {
      const response = await fetch("https://travdoodle-api.onrender.com/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      });
      if (!response.ok) throw new Error("Failed to add activity");
      await response.json();
      setRefreshTrigger((prev) => !prev);
      handleCloseActivityModal();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const handleSubmitAccommodation = async () => {
    if (!accommodationName.trim() || !accommodationAddress.trim() || !checkInDate || !checkOutDate || !price) {
      return alert("All fields are required");
    }
    const newAccommodation = {
      name: accommodationName,
      address: accommodationAddress,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      price: parseFloat(price),
      destination_id: destinationId,
    };
    try {
      const response = await fetch("https://travdoodle-api.onrender.com/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccommodation),
      });
      if (!response.ok) throw new Error("Failed to add accommodation");
      await response.json();
      setRefreshTrigger((prev) => !prev);
      handleCloseAccommodationModal();
    } catch (error) {
      console.error("Error adding accommodation:", error);
    }
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setActivityName(activity.name);
    setActivityDescription(activity.description);
    setIsEditActivityModalOpen(true);
  };

  const handleEditAccommodation = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setAccommodationName(accommodation.name);
    setAccommodationAddress(accommodation.address);
    setCheckInDate(accommodation.check_in_date);
    setCheckOutDate(accommodation.check_out_date);
    setPrice(accommodation.price);
    setIsEditAccommodationModalOpen(true);
  };

  const handleUpdateActivity = async () => {
    if (!selectedActivity) return;

    const updatedActivity = {
        name: activityName,
        description: activityDescription,
        destination_id: selectedActivity.destination_id, // Ensure this is a number, not an object
      };

    try {
      const response = await fetch(`https://travdoodle-api.onrender.com/activities/${selectedActivity.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedActivity),
      });
      if (!response.ok) throw new Error("Failed to update activity");
      await response.json();
      setRefreshTrigger((prev) => !prev);
      setIsEditActivityModalOpen(false);
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const handleUpdateAccommodation = async () => {
    if (!selectedAccommodation) return;

    const updatedAccommodation = {
      name: accommodationName,
      address: accommodationAddress,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      price: parseFloat(price),
      destination_id: selectedActivity.destination_id,
    };
    

    try {
      const response = await fetch(`https://travdoodle-api.onrender.com/accommodations/${selectedAccommodation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAccommodation),
      });
      if (!response.ok) throw new Error("Failed to update accommodation");
      await response.json();
      setRefreshTrigger((prev) => !prev);
      setIsEditAccommodationModalOpen(false);
    } catch (error) {
      console.error("Error updating accommodation:", error);
    }
  };

  const handleDeleteActivity = async (activity) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the activity: "${activity.name}"?`);
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://travdoodle-api.onrender.com/activities/${activity.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete activity");
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };
  
  const handleDeleteAccommodation = async (accommodation) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the accommodation: "${accommodation.name}"?`);
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://travdoodle-api.onrender.com/accommodations/${accommodation.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete accommodation");
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error deleting accommodation:", error);
    }
  };
  


  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.destinationDetails}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className={styles.destinationTitle}>{destination.name}</h1>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.activitiesContainer}>
          <h2>Activities</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.card} onClick={handleCreateActivity}>
              <h3>+ Add Activity</h3>
            </div>
            {destination.activities.map((activity) => (
              <div key={activity.id} className={styles.card}>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.editButton} onClick={() => handleEditActivity(activity)}>
                        <FaEdit />
                    </button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteActivity(activity)}>
                        <FaTrash />
                    </button>
                    </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.accommodationsContainer}>
          <h2>Accommodations</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.card} onClick={handleCreateAccommodation}>
              <h3>+ Add Accommodation</h3>
            </div>
            {destination.accommodations.map((accommodation) => (
              <div key={accommodation.id} className={styles.card}>
                <h3>{accommodation.name}</h3>
                <p>{accommodation.address}</p>
                <p>Check-in: {accommodation.check_in_date}</p>
                <p>Check-out: {accommodation.check_out_date}</p>
                <p>Price: ${accommodation.price.toFixed(2)}</p>
                <div className={styles.buttonContainer}>
                <button className={styles.editButton} onClick={() => handleEditAccommodation(accommodation)}>
                    <FaEdit />
                </button>
                <button className={styles.deleteButton} onClick={() => handleDeleteAccommodation(accommodation)}>
                    <FaTrash />
                </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        title="Add New Activity"
        isOpen={isActivityModalOpen}
        onClose={handleCloseActivityModal}
        onSubmit={handleSubmitActivity}
        fields={[
          { name: "activityName", label: "Activity Name", type: "text", value: activityName, onChange: (e) => setActivityName(e.target.value) },
          { name: "activityDescription", label: "Description", type: "text", value: activityDescription, onChange: (e) => setActivityDescription(e.target.value) }
        ]}
      />
      <Modal
        title="Add New Accommodation"
        isOpen={isAccommodationModalOpen}
        onClose={handleCloseAccommodationModal}
        onSubmit={handleSubmitAccommodation}
        fields={[
          { name: "accommodationName", label: "Name", type: "text", value: accommodationName, onChange: (e) => setAccommodationName(e.target.value) },
          { name: "accommodationAddress", label: "Address", type: "text", value: accommodationAddress, onChange: (e) => setAccommodationAddress(e.target.value) },
          { name: "checkInDate", label: "Check-in Date", type: "date", value: checkInDate, onChange: (e) => setCheckInDate(e.target.value) },
          { name: "checkOutDate", label: "Check-out Date", type: "date", value: checkOutDate, onChange: (e) => setCheckOutDate(e.target.value) },
          { name: "price", label: "Price", type: "number", value: price, onChange: (e) => setPrice(e.target.value) }
        ]}
      />
      <Modal
        title="Edit Activity"
        isOpen={isEditActivityModalOpen}
        onClose={() => setIsEditActivityModalOpen(false)}
        onSubmit={handleUpdateActivity}
        fields={[
            { name: "activityName", label: "Activity Name", type: "text", value: activityName, onChange: (e) => setActivityName(e.target.value) },
            { name: "activityDescription", label: "Description", type: "text", value: activityDescription, onChange: (e) => setActivityDescription(e.target.value) }
        ]}
        />

        <Modal
        title="Edit Accommodation"
        isOpen={isEditAccommodationModalOpen}
        onClose={() => setIsEditAccommodationModalOpen(false)}
        onSubmit={handleUpdateAccommodation}
        fields={[
            { name: "accommodationName", label: "Name", type: "text", value: accommodationName, onChange: (e) => setAccommodationName(e.target.value) },
            { name: "accommodationAddress", label: "Address", type: "text", value: accommodationAddress, onChange: (e) => setAccommodationAddress(e.target.value) },
            { name: "checkInDate", label: "Check-in Date", type: "date", value: checkInDate, onChange: (e) => setCheckInDate(e.target.value) },
            { name: "checkOutDate", label: "Check-out Date", type: "date", value: checkOutDate, onChange: (e) => setCheckOutDate(e.target.value) },
            { name: "price", label: "Price", type: "number", value: price, onChange: (e) => setPrice(e.target.value) }
        ]}
        />


      <Footer />
    </div>
  );
}

export default Destination;
