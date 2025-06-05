// src/app/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f1f5f9",
        color: "#374151",
        padding: "1rem",
        fontSize: "0.875rem",
        textAlign: "center",
      }}
    >
      <p style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <span>© {new Date().getFullYear()} Website Cloner</span>
        <span>|</span>
        <a
          href="#"
          style={{ color: "#2563eb", textDecoration: "none" }}
        >
          Terms
        </a>
        <span>|</span>
        <a
          href="#"
          style={{ color: "#2563eb", textDecoration: "none" }}
        >
          Privacy
        </a>
        <span>|</span>
        <a
          href="https://www.mohammadnusairat.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2563eb", textDecoration: "none" }}
        >
          Contact
        </a>
      </p>
    </footer>
  );
};

export default Footer;
