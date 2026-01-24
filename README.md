# 📧 Email Writer Assistant (AI-Powered Gmail Reply Generator)

Email Writer Assistant is a full-stack AI-powered system that helps users generate professional, context-aware email replies instantly. The project consists of three tightly integrated parts:

1. **Chrome Extension for Gmail** – Injects an "AI Reply" button directly into Gmail’s compose window
2. **React Frontend** – A standalone web UI to generate replies manually
3. **Spring Boot Backend** – Handles AI prompt construction and communicates with Google Gemini API

This project demonstrates real-world full-stack development, browser automation, DOM mutation handling, and AI integration.

---

## 🚀 Features

* ✨ One-click **AI Reply button inside Gmail**
* 🤖 AI-generated replies with selectable tone (Professional, Casual, Friendly)
* 🔄 Real-time Gmail DOM detection using `MutationObserver`
* 🌐 REST API built with Spring Boot
* ⚛️ Modern React UI using Material UI
* 🔐 Secure AI key handling via environment variables
* 📋 Copy-to-clipboard support

---

## 🧠 System Architecture

```
Gmail UI
   │
   ▼
Chrome Extension (Content Script)
   │  fetch()
   ▼
Spring Boot REST API
   │
   ▼
Google Gemini API
```

---

## 🧩 Tech Stack

### Frontend

* React
* Material UI (MUI)
* Axios

### Backend

* Spring Boot
* WebClient (Reactive HTTP client)
* Lombok

### Browser Extension

* Chrome Extensions API (Manifest v3)
* MutationObserver
* Vanilla JavaScript

### AI

* Google Gemini API

---

## 📂 Project Structure

```
email-writer/
│
├── email-writer-extension/
│   ├── manifest.json
│   └── contentScript.js
│
├── email-writer-react/
│   └── src/
│       └── App.jsx
│
├── email-writer-springboot/
│   └── src/main/java/com/email/writer/
│       ├── controller/
│       ├── service/
│       ├── config/
│       └── model/
│
└── README.md
```

---

## 🧪 How It Works

### 1️⃣ Gmail Extension

* Uses `MutationObserver` to detect when a compose or reply window opens
* Injects a custom **AI Reply** button into Gmail’s toolbar
* Extracts the original email content from the DOM
* Sends content + tone to backend API
* Inserts AI-generated reply into Gmail compose box

### 2️⃣ React Web App

* Allows manual testing of the email generator
* User inputs email content and selects tone
* Displays AI-generated response with copy option

### 3️⃣ Spring Boot Backend

* Exposes `/api/email/generate` endpoint
* Builds a **strict AI prompt** to avoid extra explanations
* Sends request to Google Gemini API
* Parses and returns only the generated reply text

---

## 🔧 Setup Instructions

### Backend (Spring Boot)

1. Navigate to backend folder
2. Add the following to `application.properties`:

```properties
gemini.api.url=https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
gemini.api.key=YOUR_API_KEY
```

3. Run the application:

```bash
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

### Frontend (React)

```bash
cd email-writer-react
npm install
npm run dev
```

---

### Chrome Extension

1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `email-writer-extension` folder
5. Open Gmail and start replying to an email

---

## ⚠️ Notes & Limitations

* Gmail DOM class names may change; selectors may require updates
* `document.execCommand` is deprecated but currently works in Gmail
* Backend must be running for the extension to function

---

## 📌 Future Improvements

* OAuth-based Gmail API integration
* Streaming AI responses
* Tone detection from email context
* Chrome Web Store deployment
* Authentication & rate limiting

---

## 🧑‍💻 Author

**Adil Javed**
B.Tech Computer Science (2026)
Interests: Full-Stack Development, AI Integration, System Design

---

⭐ If you found this project useful, consider giving it a star!

