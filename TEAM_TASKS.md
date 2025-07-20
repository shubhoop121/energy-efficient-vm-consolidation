# ✅ Team Task Assignments — Energy-Efficient VM Consolidation using Q-Learning

This file lists everyone's responsibilities, task priorities, and what needs to be done first.

---

## 🔁 Workflow Reminder

> ✅ Do **NOT** push directly to `main`
> ✅ Everyone should work on a feature branch from `dev`
> ✅ After completing your task, create a **Pull Request** (PR) to merge into `dev`

---

## 🧠 Foundational Tasks (Must be done first)

### 👤 **Abhinav Mishra** — VM & Host Environment (`cloud_env.py`)

- [X] Define `VM` and `Host` classes
- [X] Implement `assign_vm`, `remove_vm`
- [ ] Add SLA violation detection
- [ ] Add power consumption model (optional)
- [ ] Track number of migrations

➡️ This is the **core of the simulation**, required by Q-Learning

---

## 🧠 Learning Agent Logic

### 👤 **Shubh Gupta** — Q-Learning Agent (`q_learning.py`)

- [X] Setup `QLearningAgent` class
- [X] Implement Q-table update logic
- [X] Action selection using ε-greedy
- [ ] Plug into real environment state (wait for Abhinav)
- [ ] Design reward function based on SLA/energy/migration
- [ ] Export metrics (energy, SLA, migrations, etc.)

➡️ Can start with dummy environment until actual one is finished

---

## 🔧 Backend & Integration

### 👤 **Aditya Pandey** — API & Flask Integration (`app.py`, `routes.py`)

- [X] Setup Flask server
- [ ] Create `/simulate` and `/results` endpoints
- [ ] Accept simulation parameters from frontend
- [ ] Connect API to real `QLearningAgent` and return metrics

➡️ Ensure backend is clean, modular, and JSON-compatible

---

## 🎨 Frontend Development

### 👤 **Harsh Sharma** — React Dashboard

- [ ] Create input form for parameters (VMs, hosts, alpha, etc.)
- [ ] Connect to `/api/simulate` using `axios` or `fetch()`
- [ ] Show simulation result metrics
- [ ] Add charts: Energy saved, SLA violations, VM migrations

➡️ Can use dummy data to design now, real API later

---

## 🧪 Documentation & Testing

### 👤 **Adarsh Verma** — Docs & Quality Assurance

- [X] Add `README.md`, `LICENSE`, `CONTRIBUTING.md`
- [ ] Create sample JSON request/response files
- [ ] Document environment design (`cloud_env.py`)
- [ ] Write test cases for simulation logic
- [ ] Help finalize team task tracking and GitHub issues

---

## 📌 Git Workflow for Everyone

```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-task-name
# make changes
git add .
git commit -m "Add: your summary"
git push origin feat/your-task-name
# create a PR to dev
```

---

Let’s collaborate, commit clean code, and build something awesome 🚀
