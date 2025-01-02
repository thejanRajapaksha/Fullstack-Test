import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <h2>Tranquil Resorts | Hotel Room Book</h2>
      <p>
        &copy; <span>{year}</span> TranquilResorts.com - All Rights
        Reserved {" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.facebook.com/SamiurRahmanMukul"
        >
          Plymouth Batch 11 Group 8
        </a>
      </p>
    </footer>
  );
}
