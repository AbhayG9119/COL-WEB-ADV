# 📄 Documentation: Free AI Agent for College Website

## 🎯 Objective
- Students ke queries ka jawab dena (attendance, timetable, fees, notices, syllabus).
- Pre‑loaded FAQ buttons dena jahan student tap karke turant answer le sake.
- Pure stack **₹0/month** me chalana (free hosting + open‑source tools).

---

## 🏗️ Architecture Overview

**Flow:**
Student → Website Chat Widget (React/Next.js) → n8n Workflow → Open‑source LLM (Ollama + LLaMA/Mistral) → ERP Database/API → Response → Chatbot

### Components
- **Frontend**: React/Next.js chatbot widget (Vercel/Netlify free tier)
- **Backend Automation**: n8n (Railway/Render free tier)
- **AI Model**: LLaMA 3 / Mistral via Ollama (self‑hosted, free)
- **Database**: MongoDB Atlas / PostgreSQL (free tier)
- **Knowledge Base (optional)**: Chroma / Weaviate (free vector DB)

---

## ⚙️ Step‑by‑Step Setup

### 1. AI Model (Free)
- Install **Ollama** on your server (local or Railway free tier).
- Pull model:
  ```bash
  ollama pull mistral
  ```
- Expose API endpoint: `http://localhost:11434/api/generate`

---

### 2. n8n Backend (Free)
- Deploy n8n on **Railway/Render free tier**.
- Create workflow:
  - **Webhook Trigger** → receive student query
  - **Function Node** → parse query
  - **HTTP Request Node** → call Ollama (LLM)
  - **Database Node** → fetch ERP data (attendance, fees, timetable)
  - **Respond to Webhook** → send answer back

---

### 3. Database (Free)
- Use **MongoDB Atlas** or **PostgreSQL free tier**.
- Store:
  - Student records (attendance, fees)
  - Notices, syllabus, timetable
- Example schema:
  ```json
  {
    "student_id": "123",
    "attendance": "82%",
    "fees_due": "0",
    "timetable": "Mon-Fri 9AM-3PM"
  }
  ```

---

### 4. Frontend (Free)
- Build chatbot widget in **React/Next.js**.
- Features:
  - Input box for queries
  - Pre‑loaded FAQ buttons (Exam Date, Fee Structure, Syllabus)
  - Display AI response

- Example API call:
  ```js
  fetch("https://your-n8n-webhook-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userInput })
  })
  .then(res => res.json())
  .then(data => setResponse(data.answer));
  ```

---

### 5. Hosting (Free)
- **Frontend** → Vercel/Netlify free tier
- **Backend (n8n + Ollama)** → Railway/Render free tier
- **Database** → MongoDB Atlas/Postgres free tier

---

## 📊 Cost Summary
- Ollama (LLM) → Free (self‑hosted)
- n8n → Free (self‑hosted)
- Vercel/Netlify → Free frontend hosting
- Railway/Render → Free backend hosting
- MongoDB Atlas/Postgres → Free tier
- Vector DB (Chroma/Weaviate) → Free

👉 **Total Monthly Cost = ₹0**

---

## 🚀 Future Scaling Tips
- Agar usage badh jaye toh:
  - Railway/Render ka paid plan le sakte ho (₹500–₹1000/month).
  - GPU server use karke Ollama ko fast bana sakte ho.
  - Hybrid model: Routine queries → Free LLM, Complex queries → OpenAI API.

---

## ✅ Final Note
Tum abhi **n8n me backend workflows** bana lo (dummy ERP data ke saath). Jab website ready ho jaaye, bas **frontend → n8n webhook** connect karna hoga. Is tarah tum ek **student‑centric AI agent** free me launch kar sakte ho.

---
