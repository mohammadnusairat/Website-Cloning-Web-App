// components/Header.jsx
import React from 'react';
import Link from 'next/link';

function Header() {
  return (
    <header style={{
      backgroundColor: "#1f2937",
      color: "#ffffff",
      padding: "1rem 2rem",
      textAlign: "center",
      fontSize: "1.25rem",
      fontWeight: "bold"
    }}>
      <Link href="/" style={{ color: "#ffffff", textDecoration: "none" }}>
        Minimal Version of Orchids Website Cloning Feature
      </Link>
    </header>
  );
}

export default Header;
