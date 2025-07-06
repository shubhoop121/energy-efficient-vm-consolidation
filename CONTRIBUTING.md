
# 🤝 Contributing Guidelines

Welcome to the **Energy-Efficient VM Consolidation using Q-Learning** project!  
This document outlines the contribution workflow, Git practices, and standards to ensure smooth collaboration.

---

## 🧠 Project Overview

This is a full-stack project that combines:
- 🔧 **Flask** backend (Q-Learning + VM environment)
- 🎨 **React.js** frontend (interactive dashboard)
- 🔗 RESTful API integration
- ⚡ Focus: Minimize energy, VM migrations, SLA violations

---

## 🧑‍💻 Team Roles

| Name             | Responsibility                 |
|------------------|--------------------------------|
| Aditya Pandey    | Backend / API logic            |
| Abhinav Mishra   | Frontend + integration         |
| Shubh Gupta      | Q-learning logic               |
| Adarsh Verma     | Testing + simulation metrics   |
| Harsh Sharma     | Documentation + dashboard UI   |

---

## 🪜 Contribution Workflow

### ❌ DO NOT push directly to `main`  
Use feature branches and Pull Requests (PRs) only.

### ✅ Workflow Steps

1. **Checkout dev branch**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create a new feature branch**
   ```bash
   git checkout -b feat/your-task-name
   ```

3. **Make changes**
   - Write clear, modular code
   - Commit often with meaningful messages

4. **Stage & Commit**
   ```bash
   git add .
   git commit -m "Add: implemented feature X"
   ```

5. **Push your branch**
   ```bash
   git push origin feat/your-task-name
   ```

6. **Create Pull Request (PR)**
   - Go to [GitHub Pull Requests](https://github.com/shubhoop121/energy-efficient-vm-consolidation/pulls)
   - PR base: `dev`, compare: your branch
   - Add a clear title + description of changes

7. **Wait for review**
   - At least one reviewer should approve
   - After review, merge to `dev`

---

## 📂 Branch Naming Conventions

| Type   | Prefix      | Example                    |
|--------|-------------|----------------------------|
| Feature | `feat/`     | `feat/q-learning-engine`   |
| Bugfix  | `fix/`      | `fix/simulation-bug`       |
| Docs    | `docs/`     | `docs/update-readme`       |
| UI      | `ui/`       | `ui/chart-component`       |
| Test    | `test/`     | `test/api-load-tests`      |

---

## 🧪 Testing & Code Quality

- Run all changes locally before pushing
- Use meaningful variable/function names
- Modularize reusable logic into `utils/`
- Avoid hardcoding where possible

---

## 🧼 Commit Message Guidelines

| Format              | Example                          |
|---------------------|----------------------------------|
| `Add:`              | Add: simulate API in Flask       |
| `Fix:`              | Fix: SLA calculation rounding    |
| `Refactor:`         | Refactor: moved logic to helpers |
| `Docs:`             | Docs: update CONTRIBUTING.md     |
| `Test:`             | Test: add API response checks    |

---

## 📊 Project Board

Track progress in our [GitHub Project Board](https://github.com/shubhoop121/energy-efficient-vm-consolidation/projects)

---

## 🛟 Need Help?

- Reach out in the team group chat
- Use GitHub Issues for bugs or requests
- Tag relevant team members in your PRs

---

Happy coding! ✨  
— Team EEVC 💡
