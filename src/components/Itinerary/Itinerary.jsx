import React, { useEffect, useState } from "react";
import { FaUmbrellaBeach } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa";
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPackingModalOpen, setIsAddPackingModalOpen] = useState(false);
  const [packingItem, setPackingItem] = useState({ id: null, item_name: "", quantity: 1, packed: false });

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

  const handleOpenEditModal = (item) => {
    setPackingItem({ id: item.id, item_name: item.item_name, quantity: item.quantity, packed: item.packed });
    console.log("Opening modal with packingItem:", item);
    setIsEditModalOpen(true);
  };
  

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setPackingItem({ id: null, item_name: "", quantity: 1, packed: false });
  };

  const handleEditSubmit = async () => {
    const updatedItem = {
        ...packingItem,
        quantity: Number(packingItem.quantity), // Ensure it's a number
    };

    try {
        const response = await fetch(`https://travdoodle-api.onrender.com/packing_items/${packingItem.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedItem),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update packing item");
        }

        setIsEditModalOpen(false);
        setRefreshTrigger((prev) => !prev);
    } catch (error) {
        console.error("Error updating packing item:", error);
    }
};

const handleDeletePackingItem = async (itemId) => {
  if (!window.confirm("Are you sure you want to delete this packing item?")) return;
  
  try {
    const response = await fetch(`https://travdoodle-api.onrender.com/packing_items/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete packing item");
    
    setRefreshTrigger((prev) => !prev);
  } catch (error) {
    console.error("Error deleting packing item:", error);
  }
};
const handleAddPackingItem = async () => {
  if (!packingItem.item_name.trim()) return alert("Item name is required");

  const newPackingItem = {
    ...packingItem,
    itinerary_id: itineraryId,
    quantity: Number(packingItem.quantity),
  };

  try {
    const response = await fetch("https://travdoodle-api.onrender.com/packing_items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPackingItem),
    });

    if (!response.ok) throw new Error("Failed to add packing item");

    await response.json();
    setRefreshTrigger((prev) => !prev);
    handleCloseAddPackingModal();
  } catch (error) {
    console.error("Error adding packing item:", error);
  }
};

const handleOpenAddPackingModal = () => setIsAddPackingModalOpen(true);
  const handleCloseAddPackingModal = () => {
    setIsAddPackingModalOpen(false);
    setPackingItem({ id: null, item_name: "", quantity: 1, packed: false });
  };

  

  const fields = [
    { name: "destinationName", label: "Destination Name", type: "text", value: destinationName, onChange: (e) => setDestinationName(e.target.value) }
  ];

  const editFields = [
    { 
      name: "item_name", 
      label: "Item Name", 
      type: "text", 
      value: packingItem.item_name, 
      onChange: (e) => setPackingItem({ ...packingItem, item_name: e.target.value }) 
    },
    { 
      name: "quantity", 
      label: "Quantity", 
      type: "number", 
      value: packingItem.quantity, 
      onChange: (e) => setPackingItem({ ...packingItem, quantity: e.target.value }) 
    },
    { 
      name: "packed", 
      label: "Packed", 
      type: "checkbox", 
      checked: packingItem.packed,  // Ensure it correctly reflects the state
      onChange: (e) => setPackingItem({ ...packingItem, packed: e.target.checked }) 
    }
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
                <button className={styles.editButton} onClick={() => handleOpenEditModal(item)}>
                  <FaEdit />
                </button>
                <button className={styles.editButton} onClick={() => handleDeletePackingItem(item.id)}>
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          <button className={styles.addButton} onClick={handleOpenAddPackingModal}>+ Add Packing Item</button>
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
      <Modal
        title="Edit Packing Item"
        fields={editFields}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={() => handleEditSubmit()} // Ensure it doesn't pass an event
      />
      <Modal
        title="Add Packing Item"
        fields={[
          { name: "item_name", label: "Item Name", type: "text", value: packingItem.item_name, onChange: (e) => setPackingItem({ ...packingItem, item_name: e.target.value }) },
          { name: "quantity", label: "Quantity", type: "number", value: packingItem.quantity, onChange: (e) => setPackingItem({ ...packingItem, quantity: e.target.value }) },
          { name: "packed", label: "Packed", type: "checkbox", checked: packingItem.packed, onChange: (e) => setPackingItem({ ...packingItem, packed: e.target.checked }) }
        ]}
        isOpen={isAddPackingModalOpen}
        onClose={handleCloseAddPackingModal}
        onSubmit={handleAddPackingItem}
      />
      <Modal title="Add New Destination" fields={fields} isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      <button className={styles.deleteButton} onClick={handleDeleteTrip}>Delete Trip</button>
      <Footer />
    </div>
  );
}

export default Itinerary;
