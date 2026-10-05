# Wealth Orchestrator

Wealth Orchestrator is a personal finance web application for keeping track of transactions, budgets, and savings goals. Its React frontend talks to a Spring Boot REST API, which stores each user's data in MySQL.

## What you can do

- Create an account, sign in, and reset a forgotten password by email.
- Review a financial dashboard with summaries, spending categories, and monthly trends.
- Add, edit, and delete transactions.
- Create and manage budgets and savings goals.
- View financial reports and personalized spending, budget, and goal insights.

The insights are generated from the user's transaction, budget, and goal data by the backend; no external AI service is required.

## Technology

- **Frontend:** React 19, Vite 7, React Router, Axios, Chart.js, and Recharts
- **Backend:** Java 17, Spring Boot 4, Spring Security, Spring Data JPA, and Maven
- **Database:** MySQL

## Requirements

Install the following before running the application:

- Git
- Node.js 20.19+ (or Node.js 22.12+) and npm
- Java 17
- MySQL 8 (or a compatible MySQL server)

The backend includes the Maven wrapper, so a separate Maven installation is not required.

## Fork and clone

1. Open the [Wealth Orchestrator repository](https://github.com/Wajeehathabbu2206/wealth-orchestrator-finance-application) on GitHub and click **Fork**.
2. Clone your fork, replacing `<your-github-username>` with your GitHub username:

   ```bash
   git clone https://github.com/<your-github-username>/wealth-orchestrator-finance-application.git
   cd wealth-orchestrator-finance-application
   ```

3. (Optional) Add the original repository as `upstream` to make it easier to fetch later changes:

   ```bash
   git remote add upstream https://github.com/Wajeehathabbu2206/wealth-orchestrator-finance-application.git
   git remote -v
   ```

## Configure MySQL and the backend

Create a database in MySQL:

```sql
CREATE DATABASE wealth_orchestrator;
```

The backend reads its database, email, JWT, and frontend settings from environment variables. Set them in the terminal where you will start the backend. The following is for **Windows PowerShell**; replace the example values with your own:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/wealth_orchestrator"
$env:DB_USERNAME = "your_mysql_username"
$env:DB_PASSWORD = "your_mysql_password"
$env:JWT_SECRET = "replace-with-a-private-random-secret-at-least-32-characters"
$env:MAIL_USERNAME = "your-gmail-address@gmail.com"
$env:MAIL_PASSWORD = "your-gmail-app-password"
$env:FRONTEND_URL = "http://localhost:5173"
```

For Gmail password-reset email, use a Google App Password rather than your regular account password. Email settings are required by the current backend configuration even if you do not plan to use password resets.

From the repository root, start the backend:

```powershell
cd .\wealth-orchestrator-backend
.\mvnw.cmd spring-boot:run
```

The API listens on `http://localhost:8080`. Spring Data JPA creates or updates the local schema on startup. This setting is for development; use a managed schema migration strategy for production.

Keep the backend running. If you open another PowerShell window to run the frontend, the backend environment variables do not need to be set in that second window.

## Run the frontend

In a second terminal, from the repository root:

```powershell
cd .\wealth-orchestrator-frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The frontend is configured to call the backend at `http://localhost:8080/api`.

### macOS/Linux

Use the same MySQL setup and environment variable names in the shell where the backend will run. For example:

```bash
export DB_URL='jdbc:mysql://localhost:3306/wealth_orchestrator'
export DB_USERNAME='your_mysql_username'
export DB_PASSWORD='your_mysql_password'
export JWT_SECRET='replace-with-a-private-random-secret-at-least-32-characters'
export MAIL_USERNAME='your-gmail-address@gmail.com'
export MAIL_PASSWORD='your-gmail-app-password'
export FRONTEND_URL='http://localhost:5173'

cd wealth-orchestrator-backend
./mvnw spring-boot:run
```

In another terminal, run:

```bash
cd wealth-orchestrator-frontend
npm ci
npm run dev
```

## Useful development commands

Run these from `wealth-orchestrator-frontend`:

```bash
npm run lint
npm run build
```

Run backend tests from `wealth-orchestrator-backend`:

```powershell
.\mvnw.cmd test
```

## Project layout

```text
wealth-orchestrator-finance/
├── wealth-orchestrator-backend/   # Spring Boot REST API and MySQL persistence
│   └── src/main/
└── wealth-orchestrator-frontend/  # React/Vite single-page application
    └── src/
```
