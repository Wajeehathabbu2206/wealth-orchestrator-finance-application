# Wealth Orchestrator frontend

This React and Vite application is the web client for Wealth Orchestrator. It includes the sign-in and registration screens, dashboard, transactions, budgets, savings goals, reports, and financial insights.

## Run locally

Install Node.js 20.19+ (or Node.js 22.12+) and npm. From this directory, install the locked dependencies and start Vite:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. The frontend calls the backend API at `http://localhost:8080/api`; start and configure the Spring Boot backend and MySQL database first. See the root [README](../README.md) for fork, database, and backend setup instructions.

## Check the frontend

```bash
npm run lint
npm run build
```
