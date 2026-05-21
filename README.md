# 🚀 EduBridge

EduBridge is a **full-stack web application** that provides interactive learning resources, quizzes, and AI-driven guidance for students. It is designed to help learners explore web development, AI & ML concepts, and career opportunities through a modern, user-friendly platform.

---

## 📌 Project Overview

EduBridge bridges the gap between learning and career guidance by combining structured educational content with AI-powered assistance. Students can:
- Learn technical topics  
- Test their knowledge through quizzes  
- Receive AI-powered career and learning suggestions  

---

## ✨ Features

- 🔐 **User Authentication** – Secure login and registration system  
- 👤 **Personalized Profiles** – Users can manage and update their profiles  
- 🧠 **Quizzes** – Assess knowledge on various technical topics  
- 🤖 **AI Assistance** – AI-powered learning and guidance  
- 🎯 **Career Guidance** – Resources and career advice  
- 📱 **Responsive Design** – Works across desktops, tablets, and mobile devices  

---

## 🛠 Technologies Used

### 🌐 Frontend
- **HTML:** Semantic structure and accessibility 
- **CSS:** Styling, layout, and responsiveness  
- **JavaScript:** Interactivity and API handling  

### ⚙️ Backend
- **Python:** Core backend language 
- **Flask:** Lightweight web framework  

### 🤖 APIs
- **OpenAI API:** AI-driven features

### 🔧 Tools
- **Git:** Version control 
- **GitHub:** Collaboration and project hosting  

---

## 📂 Folder Structure
EduBridge/  
├── backend/  
│ └── app.py  
├── assets/  
├── styles/  
├── templates/  
├── auth/  
├── scripts/  
├── server/  
├── images/  
├── index.html  
├── login.html  
├── profile.html  
├── quiz.html  
├── ai.html  
├── webdev.html  
├── career.html  

```text
EduBridge/
├── backend/
│ └── app.py
├── assets/
├── Styles/
├── templates/
├── auth/
├── scripts/
├── server/
├── images/
├── index.html
├── login.html
├── profile.html
├── quiz.html
├── ai.html
├── webdev.html
├── career.html
└── register.html
```

---

## ⚙️ Setup Instructions

1️⃣ Clone the repository
```bash
git clone https://github.com/AditixAnand/EduBridge.git
cd EduBridge
```
2️⃣ Setup Python Backend (recommended)
```bash
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
pip install -r backend/requirements.txt
```
3️⃣ Create your env file
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your OPENAI_API_KEY
```
4️⃣ Run the Backend
```bash
python backend/app.py
```
5️⃣ Open the Frontend

Open `index.html` in your browser or serve the project root with a static server (e.g. `python -m http.server 8000`) and navigate to:

```
http://127.0.0.1:8000/index.html
```

**✅ Important:**
The chatbot frontend will call the backend at `http://127.0.0.1:5000/chat`. If `OPENAI_API_KEY` is not set the backend will return a clear error message and the frontend will fall back to a local response mode.

---

## 🤝 Contribution Guidelines
1️⃣ Fork the repository  
2️⃣ Create a new branch for your feature or fix  
3️⃣ Work only on admin-approved issues  
4️⃣ Write clean, readable, and well-documented code  
5️⃣ Make meaningful commit messages  
6️⃣ Submit a Pull Request with a clear description  
7️⃣ Wait for Project Admin review before merge

---

## 🏷 Issue Management
1️⃣ Issues are created and managed by the Project Admin  
2️⃣ Contributors must request issue assignment before starting work  
3️⃣ One issue is assigned to one contributor at a time  
4️⃣ Inactive contributors may be unassigned  
5️⃣ Issues are clearly defined and achievable

**Issue Labels Used**
- easy
- medium
- hard
- good first issue
- bug
- feature
- documentation
- help wanted

---

## 🔍 Pull Request Rules
1️⃣ PRs must be linked to an assigned issue  
2️⃣ Code must be original and plagiarism-free  
3️⃣ Low-effort, spam, or duplicate PRs will be rejected  
4️⃣ Admin may request changes before approval  
5️⃣ Only merged PRs are considered valid contributions
### 1. Clone the repository

`git clone <your-repo-url>`

cd EduBridge

### 2. Setup Python Backend

cd backend

pip install flask python-dotenv openai

### 3. Run the Backend

python app.py

### 4. Open Frontend

Open index.html in your browser

### Ensure JavaScript API calls point to:

http://127.0.0.1:5000/

---

## 🤝 Contribution Guidelines
- Fork the repository
- Create a new branch for your feature or fix
- Work only on admin-approved issues
- Write clean, readable, and well-documented code
- Make meaningful commit messages
- Submit a Pull Request with a clear description
- Wait for Project Admin review before merge

---

## 🏷 Issue Management
Issues are created and managed by the Project admin

Contributors must request issue assignment before starting work

One issue is assigned to one contributor at a time

Inactive contributors may be unassigned

Issues are clearly defined and achievable

### Issue Labels Used
- easy
- medium
- hard
- good first issue
- bug
- feature
- documentation
- help wanted

---

## 🔍 Pull Request Rules
- PRs must be linked to an assigned issue
- Code must be original and plagiarism-free
- Low-effort, spam, or duplicate PRs will be rejected
- Admin may request changes before approval
- Only merged PRs are considered valid contributions

---

## 🚀 Future Enhancements
Leaderboard system

---

## 🚀 Future Enhancements
- Leaderboard system
- Advanced learning analytics
- Enhanced AI personalization
- Mobile application support

---

---

## 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## 📬 Contact
- LinkedIn: Aditi Anand
- Email: aditianand09tkp@gmail.com

## 📬 Contact
LinkedIn: Aditi Anand

Email: aditianand09tkp@gmail.com

---
