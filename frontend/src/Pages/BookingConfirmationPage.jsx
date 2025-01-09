import React from "react";
import { useLocation } from "react-router-dom";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div>
        <h1>Error</h1>
        <p>Booking details not found. Please try again.</p>
      </div>
    );
  }

  return (
    <div style={{ color: "black" }}>
      <h1>Booking Confirmation</h1>
      <p><strong>Booking ID:</strong> {booking.bookingId}</p>
      <p><strong>Guest Name:</strong> {booking.guestName}</p>
      <p><strong>Room Name:</strong> {booking.roomName}</p>
      <p><strong>Price:</strong> ${booking.price}</p>
      <p><strong>Number of Guests:</strong> {booking.guests}</p>
      <p><strong>Check-In:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
      <p><strong>Check-Out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
    </div>
  );
};

export default BookingConfirmationPage;
