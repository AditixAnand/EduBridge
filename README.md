# 🚀 EduBridge

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![GSSoC](https://img.shields.io/badge/GSSoC-2025-orange)

**EduBridge** is a full-stack web application that provides interactive learning resources, quizzes, and AI-driven guidance for students. It bridges the gap between learning and career success.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Folder Structure](#-folder-structure) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 📌 Overview

EduBridge helps learners explore web development, AI & ML concepts, and career opportunities through a modern, user-friendly platform. Students can:

- 📖 Learn technical topics through curated resources
- 🧠 Test their knowledge through interactive quizzes
- 🤖 Receive AI-powered career and learning suggestions
- 👤 Manage personalized learning profiles

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure login and registration system |
| 👤 **Personalized Profiles** | Users can manage and update their profiles |
| 🧠 **Quizzes** | Assess knowledge on Web Dev, AI, and Career topics |
| 🤖 **AI Assistance** | AI-powered learning and career guidance via OpenAI |
| 🎯 **Career Guidance** | Curated resources and career advice |
| 🌙 **Dark / Light Mode** | Theme toggle saved to localStorage |
| 📱 **Responsive Design** | Works across desktops, tablets, and mobile devices |

---

## 🛠 Tech Stack

### 🌐 Frontend
- **HTML5** — Semantic structure and accessibility
- **CSS3** — Styling, layout, and responsiveness
- **JavaScript (Vanilla)** — Interactivity and API handling

### ⚙️ Backend
- **Python** — Core backend language
- **Flask** — Lightweight web framework

### 🤖 APIs
- **OpenAI API** — AI-driven chat features

### 🔧 Tools
- **Git** — Version control
- **GitHub** — Collaboration and project hosting

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- A modern browser (Chrome, Firefox, Edge)
- An OpenAI API key (for AI features)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/AditixAnand/EduBridge.git
cd EduBridge
```

### 2️⃣ Set Up the Python Backend

```bash
cd backend
pip install flask python-dotenv openai flask-cors
```

> 💡 **Recommended:** Use a virtual environment:
> ```bash
> python -m venv venv
> venv\Scripts\activate    # Windows
> source venv/bin/activate # macOS/Linux
> ```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4️⃣ Run the Backend

```bash
python app.py
```

The backend runs at: `http://127.0.0.1:5000/`

### 5️⃣ Open the Frontend

Open `index.html` in your browser directly, or use a live server (e.g., VS Code Live Server extension).

> ✅ **Important:** Ensure JavaScript API calls target `http://127.0.0.1:5000/`.

---

## ⚙️ How It Works

```
User visits EduBridge
    │
    ├── index.html  → Home page: featured courses, hero section
    ├── login/register → Auth (stored in localStorage)
    ├── webdev.html / ai.html / career.html → Learning pages
    ├── quiz.html   → Course-specific quizzes with timer & score
    ├── profile.html → User profile & progress
    └── AI chatbot  → Powered by Flask backend + OpenAI API
```

---

## 📂 Folder Structure

```
EduBridge/
├── backend/
│   └── app.py              # Flask backend, OpenAI integration
├── Styles/
│   ├── main.css            # Global styles & design system
│   ├── quiz.css            # Quiz-specific styles
│   ├── auth.css            # Login/Register styles
│   ├── chat.css            # AI chatbot styles
│   ├── profile.css         # Profile page styles
│   └── admin.css           # Admin panel styles
├── scripts/
│   ├── main.js             # Core JS: nav, theme, animations
│   ├── auth.js             # Authentication logic
│   ├── quiz.js             # Quiz engine
│   ├── quiz-data.js        # Question bank
│   └── chatbot.js          # AI chatbot integration
├── templates/
│   └── chatbot.html        # Chatbot widget template
├── server/
│   └── server.js           # Node.js server (optional)
├── resources/
│   ├── webdev.html         # Web Development resources
│   ├── ai.html             # AI & ML resources
│   └── career.html         # Career resources
├── images/                 # Project images
├── assets/                 # Static assets
├── index.html              # Home page
├── login.html              # Login page
├── register.html           # Registration page
├── profile.html            # User profile
├── quiz.html               # Quiz selection & engine
├── webdev.html             # Web Development learning page
├── ai.html                 # AI & ML learning page
├── career.html             # Career guidance page
└── admin.html              # Admin panel
```

---

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork** the repository
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Work only on admin-approved issues** (comment to get assigned first)
4. **Write clean, readable, and well-documented code**
5. **Make meaningful commit messages** (e.g., `fix: correct stylesheet link in resource pages`)
6. **Submit a Pull Request** with a clear description linking the issue

### Issue Labels

| Label | Description |
|-------|-------------|
| `easy` | Good for first-time contributors |
| `medium` | Moderate complexity |
| `hard` | Advanced changes |
| `good first issue` | Beginner-friendly |
| `bug` | Something isn't working |
| `feature` | New feature request |
| `documentation` | Documentation improvements |
| `help wanted` | Extra attention is needed |

---

## 🔍 Pull Request Rules

- PRs must be linked to an assigned issue
- Code must be original and plagiarism-free
- Low-effort, spam, or duplicate PRs will be rejected
- Admin may request changes before approval
- Only merged PRs are considered valid contributions

---

## 🚀 Future Enhancements

- [ ] Leaderboard system
- [ ] Advanced learning analytics
- [ ] Enhanced AI personalization
- [ ] Mobile application support
- [ ] Progress tracking dashboard

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

- **Project Lead:** Aditi Anand
- **LinkedIn:** [Aditi Anand](https://www.linkedin.com/in/aditi-anand/)
- **Email:** aditianand09tkp@gmail.com

---

<div align="center">
⭐ If you find EduBridge helpful, please consider starring the repository!
</div>
