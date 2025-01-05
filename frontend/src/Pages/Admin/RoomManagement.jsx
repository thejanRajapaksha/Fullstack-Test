import React, { useState, useEffect } from "react";

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newRoom, setNewRoom] = useState({
    room_id: "",
    room_name: "",
    capacity: "",
    price: "",
    size: "",
    room_type: "Single", // Default room type
    pets: false,
    breakfast: false,
    details: "",
    extras: "",
    images: "",
  });

  // Fetch all rooms on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch rooms.");
        }
        return res.json();
      })
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  // Handle Add or Update Room
  const handleAddOrUpdateRoom = () => {
    const formData = new FormData();
    formData.append("room_id", newRoom.room_id);
    formData.append("room_name", newRoom.room_name);
    formData.append("capacity", parseInt(newRoom.capacity, 10) || 0);
    formData.append("price", parseFloat(newRoom.price) || 0);
    formData.append("size", parseInt(newRoom.size) || 0);
    formData.append("room_type", newRoom.room_type);
    formData.append("details", newRoom.details);
    formData.append("pets", newRoom.pets);
    formData.append("breakfast", newRoom.breakfast);
    formData.append("extras", newRoom.extras);

    Array.from(newRoom.images).forEach((image) => {
      formData.append("images", image);
    });

    const url = isEditMode
      ? `http://localhost:5000/api/rooms/${editingRoomId}`
      : "http://localhost:5000/api/rooms";

    fetch(url, {
      method: isEditMode ? "PUT" : "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((room) => {
        if (isEditMode) {
          // Update the room in the list
          setRooms((prevRooms) =>
            prevRooms.map((r) => (r._id === room._id ? room : r))
          );
        } else {
          // Add the new room to the list
          setRooms((prevRooms) => [...prevRooms, room]);
        }
        resetForm();
      })
      .catch((error) => console.error("Error adding/updating room:", error));
  };

  // Load room data into form for editing
  const handleEditRoom = (room) => {
    setNewRoom({
      room_id: room.room_id,
      room_name: room.room_name,
      capacity: room.capacity,
      price: room.price,
      size: room.size,
      room_type: room.room_type,
      pets: room.pets,
      breakfast: room.breakfast,
      details: room.details,
      extras: room.extras.join(", "),
      images: "",
    });
    setEditingRoomId(room._id);
    setIsEditMode(true);
  };

  // Reset form after adding/updating
  const resetForm = () => {
    setNewRoom({
      room_id: "",
      room_name: "",
      capacity: "",
      price: "",
      size: "",
      room_type: "Single",
      pets: false,
      breakfast: false,
      details: "",
      extras: "",
      images: "",
    });
    setIsEditMode(false);
    setEditingRoomId(null);
  };

  // Handle file change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewRoom({ ...newRoom, images: files });
  };

  // Handle Delete Room
  const handleDeleteRoom = (id) => {
    fetch(`http://localhost:5000/api/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: 3 }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete room.");
        }
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === id ? { ...room, status: 3 } : room
          )
        );
      })
      .catch((error) => console.error("Error deleting room:", error));
  };

  return (
    <div className="room-management">
      <h3>Room Management</h3>
      <div className="content-wrapper">
        {/* Left Form Section */}
        <div className="room-form">
          <input
            type="text"
            placeholder="Room ID"
            value={newRoom.room_id}
            onChange={(e) => setNewRoom({ ...newRoom, room_id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Room Name"
            value={newRoom.room_name}
            onChange={(e) => setNewRoom({ ...newRoom, room_name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newRoom.capacity}
            onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Size"
            value={newRoom.size}
            onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
          />
          <input
            type="text"
            placeholder="Room Details"
            value={newRoom.details}
            onChange={(e) => setNewRoom({ ...newRoom, details: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          />
          <div className="room-type-container">
            <label htmlFor="room-type">Room Type</label>
            <select
              id="room_type"
              value={newRoom.room_type}
              onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Family">Family</option>
              <option value="Presidential">Presidential</option>
            </select>
          </div>
          <textarea
            placeholder="Extras (comma-separated)"
            value={newRoom.extras}
            onChange={(e) => setNewRoom({ ...newRoom, extras: e.target.value })}
          />
          <div className="checkbox-container">
            <label>Allow Pets
              <input
                type="checkbox"
                checked={newRoom.pets}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, pets: e.target.checked })
                }
              />             
            </label>
            <label>Include Breakfast
              <input
                type="checkbox"
                checked={newRoom.breakfast}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, breakfast: e.target.checked })
                }
              />              
            </label>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <button onClick={handleAddOrUpdateRoom}>
            {isEditMode ? "Update Room" : "Add Room"}
          </button>
          {isEditMode && (
            <button onClick={resetForm}>Cancel Edit</button>
          )}
        </div>

        {/* Right Table Section */}
        <div className="room-table-container">
          <table className="room-table">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Room Name</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Size</th>
                <th>Room Type</th>
                <th>Details</th>
                <th>Pets</th>
                <th>Breakfast</th>
                <th>Extras</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms
                .filter((room) => room.status !== 3)
                .map((room) => (
                  <tr key={room._id}>
                    <td>{room.room_id}</td>
                    <td>{room.room_name}</td>
                    <td>{room.capacity}</td>
                    <td>${room.price}</td>
                    <td>{room.size} sq ft</td>
                    <td>{room.room_type}</td>
                    <td>{room.details}</td>
                    <td>{room.pets ? "Yes" : "No"}</td>
                    <td>{room.breakfast ? "Yes" : "No"}</td>
                    <td>{room.extras.join(", ")}</td>
                    <td>
                      {room.images &&
                        room.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Room ${room.room_id} - ${index + 1}`}
                            style={{ width: "50px", height: "50px" }}
                          />
                        ))}
                    </td>
                    <td>
                      <button onClick={() => handleEditRoom(room)}>Edit</button>
                      <button onClick={() => handleDeleteRoom(room._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RoomManagement;
