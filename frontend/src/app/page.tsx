// src/app/clone.tsx
"use client";
import { useState } from "react";
import Header from "../app/Header";
import Footer from "../app/Footer";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  async function handleClone() {
    if (!url) return;
    setLoading(true);
    setHtml(null);

    const res = await fetch("http://localhost:8000/clone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    // remove "```html ```" for better UI
    let cleanedHtml = data.cloned_html.trim();
    if (cleanedHtml.startsWith("```html") && cleanedHtml.endsWith("```")) {
      cleanedHtml = cleanedHtml.replace(/^```html/, "").replace(/```$/, "").trim();
    }

    setHtml(cleanedHtml);
    setLoading(false);
  }

  return (
    <>
      <Header />

      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1rem",
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          textAlign: "center"
        }}>
          Website Cloner
        </h1>

        <p style={{
          fontSize: "1rem",
          maxWidth: "700px",
          textAlign: "center",
          color: "#4b5563",
          marginBottom: "2rem",
          lineHeight: "1.6"
        }}>
          Paste the URL of any public website, and this app will use AI to clone its visual structure. 
          The cloned HTML will be generated and previewed below once the process completes.
        </p>

        <div style={{
          display: "flex",
          gap: "0.5rem",
          width: "100%",
          maxWidth: "768px",
          marginBottom: "1.5rem"
        }}>
          <input
            type="text"
            placeholder="Enter URL to clone"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              outline: "none"
            }}
          />
          <button
            onClick={handleClone}
            disabled={loading}
            style={{
              padding: "0.5rem 1.25rem",
              backgroundColor: "#6366f1",
              color: "#fff",
              borderRadius: "0.5rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Cloning..." : "Clone"}
          </button>
        </div>

        {html && (
          <div style={{
            marginTop: "2rem",
            width: "100%",
            maxWidth: "1024px",
            border: "1px solid #ddd",
            borderRadius: "0.5rem",
            padding: "1rem",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}>
              Cloned Output
            </h2>
            <iframe
              srcDoc={html}
              style={{
                width: "100%",
                height: "600px",
                border: "1px solid #ccc",
              }}
              sandbox="allow-same-origin"
            ></iframe>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}