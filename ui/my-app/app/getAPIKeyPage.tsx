"use client";
import { useState } from "react";

function getRequestUrl() {
  if (process.env.NODE_ENV == "development") {
    return "http://localhost:3001";
  }
  return "https://fantasybaseballapikeymanagementserver.onrender.com";
}

export default function GetAPIKeyPage() {
  const [form, setForm] = useState({ username: "", firstName: "", lastName: "", email: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${getRequestUrl()}/getAPIKey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        firstname: form.firstName,
        lastname: form.lastName,
        email: form.email,
      }),
    });

    if (!res.ok) {
      const msg = await res.json();
      alert(`request for api key failed: ${msg.message}`);
      return;
    }

    const apiKeyRes = await res.json();
    alert(`API key requested for ${form.username} is ${apiKeyRes.keyId}:${apiKeyRes.keySecret}`);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f5f3" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "2rem 2.5rem", width: "100%", maxWidth: 420 }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", color: "#999", margin: "0 0 4px", textTransform: "uppercase" }}>
            Fantasy Baseball Gateway
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: "#111" }}>Get API Key</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "#666", marginBottom: 6 }}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="your_username"
              required
              style={{ width: "100%", boxSizing: "border-box", color: "#666"}}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#666", marginBottom: 6 }}>First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Jane"
                required
                style={{ width: "100%", boxSizing: "border-box", color: "#666"}}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "#666", marginBottom: 6 }}>Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Smith"
                required
                style={{ width: "100%", boxSizing: "border-box", color: "#666" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "#666", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              required
              style={{ width: "100%", boxSizing: "border-box", color: "#666" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button
              type="submit"
              style={{ padding: "0 20px", height: 36, background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}