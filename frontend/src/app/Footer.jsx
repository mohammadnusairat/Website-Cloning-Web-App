// components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer style={{
      backgroundColor: "#f1f5f9",
      color: "#374151",
      padding: "1rem",
      fontSize: "0.875rem",
      textAlign: "center"
    }}>
      <p>© {new Date().getFullYear()} Website Cloner | 
        <a href="#" style={{ marginLeft: "10px", color: "#2563eb", textDecoration: "none" }}>Terms</a> | 
        <a href="#" style={{ marginLeft: "10px", color: "#2563eb", textDecoration: "none" }}>Privacy</a> | 
        <a href="https://www.mohammadnusairat.com/" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px", color: "#2563eb", textDecoration: "none" }}>Contact</a>
      </p>
    </footer>
  );
}

export default Footer;
