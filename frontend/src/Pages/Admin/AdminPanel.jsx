import React from "react";
import { Link } from "react-router-dom";

function AdminPanel() {
  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <nav className="admin-link">
        <Link to="/admin/bookings">Booking Requests</Link>
        <Link to="/admin/rooms">Room Management</Link>
        <Link to="/admin/guests">Guest Management</Link>
        <Link to="/admin/availability">Room Availability</Link>
        <Link to="/admin/profiles">Guest Profiles</Link>

      </nav>
    </div>
  );
}

export default AdminPanel;
