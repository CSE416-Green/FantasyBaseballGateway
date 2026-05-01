"use client";
import { useState } from "react";

function getRequestUrl() {
    if (process.env.NODE_ENV == "development") {
        return "http://localhost:3001"
    }
    return "https://fantasybaseballapikeymanagementserver.onrender.com"
}
export default function GetAPIKeyPage() {
  const [form, setForm] = useState({ username: "", firstName: "", lastName: "", email: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch(
        `${"http://localhost:3001"}/getAPIKey`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: form.username, 
                firstname: form.firstName,
                lastname: form.lastName, 
                email: form.email
            })
        }
    )

    if (!res.ok) {
        const msg = await res.json();
        alert(`request for api key failed: ${msg.message}`)
        return;
    }

    const apiKeyRes = await res.json();
    alert(`API key requested for ${form.username} is ${apiKeyRes.keyId}:${apiKeyRes.keySecret}`);
    return;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Get API Key</h2>

      <div>
        <label>Username</label><br />
        <input name="username" value={form.username} onChange={handleChange} required />
      </div>

      <div>
        <label>First Name</label><br />
        <input name="firstName" value={form.firstName} onChange={handleChange} required />
      </div>

      <div>
        <label>Last Name</label><br />
        <input name="lastName" value={form.lastName} onChange={handleChange} required />
      </div>

      <div>
        <label>Email</label><br />
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>

      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
