
# ⚡ Energy-Efficient VM Consolidation using Q-Learning

A full-stack web application developed as part of an IBM Internship project.  
This system simulates and visualizes intelligent VM placement in cloud data centers using Q-Learning (a Reinforcement Learning algorithm), with the goal of minimizing energy consumption, VM migrations, and SLA violations.

---

## 🚀 Features

- 🧠 **Q-Learning Agent** for intelligent VM migration decisions
- 🌐 **Flask API** backend for simulation and control
- 📊 **React.js dashboard** for live metrics and charts
- ⚙️ **Cloud Environment Simulator** for dynamic workloads
- 📉 Real-time stats: energy saved, utilization, SLA, migrations

---

## 🏗️ Tech Stack

| Layer        | Technology      |
|--------------|-----------------|
| Frontend     | React.js + Recharts |
| Backend      | Python Flask    |
| AI Engine    | Q-Learning (Reinforcement Learning) |
| Communication| RESTful APIs    |
| Collaboration| Git + GitHub    |

---

## 📁 Directory Structure

```
energy-efficient-vm-consolidation/
├── backend/                # Flask backend
│   ├── app.py
│   └── src/
│       ├── agent/          # Q-learning logic
│       ├── env/            # Cloud environment simulator
│       ├── utils/          # Helper functions
│       └── api/            # API route handlers
├── frontend/               # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── index.js
├── data/                   # Sample workloads and logs
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

---

## 📦 Setup Instructions

### 🖥️ Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # or source venv/bin/activate on Linux/macOS
pip install -r requirements.txt
python app.py
```

### 🌐 Frontend (React)

```bash
cd frontend
npm install
npm start
```

App will run at: `http://localhost:3000`  
Backend will run at: `http://localhost:5000`

---

## 📊 API Endpoints

| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| POST   | `/api/simulate`  | Run VM simulation          |
| GET    | `/api/results`   | Get simulation results     |

---

## 👥 Team Members

- Aditya Pandey – Backend / API Logic
- Abhinav Mishra – Frontend + Integration
- Shubh Gupta – Q-learning Logic
- Adarsh Verma – Testing + Metrics
- Harsh Sharma – Docs + Dashboard UI

---

## 📄 Contributing

Check the [CONTRIBUTING.md](./CONTRIBUTING.md) file for full workflow, branch naming, and commit message conventions.

---

## 🧠 Future Work

- Integrate Deep Q-Learning
- Add support for I/O and memory-intensive workloads
- Deploy with Docker and host on cloud
- Real-time charts from live simulation

---

## 📜 License

MIT License — free to use and modify with attribution.
