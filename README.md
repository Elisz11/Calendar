# Calendar
A containerized web application built with Vue 3 (Vite), Node.js (Express) and PostgreSQL.

<img width="2554" height="1345" alt="image" src="https://github.com/user-attachments/assets/5ea57198-a0c6-4e38-8b6f-7415e370d2af" />
<img width="2557" height="1348" alt="image" src="https://github.com/user-attachments/assets/fb548544-c64e-4356-82f4-a936025ec135" />

## Getting Started
1. Prerequisites

    Docker and Docker Compose installed.

    Node.js (for local frontend builds).

2. Environment Setup (.env)

    Copy the .env.example file in a .env file and modify it with your configuration:
```
# Docker compose environment variables
DB_USER=postgres
DB_PASSWORD=NEW_PASSWORD_HERE # Change this to a new password
DB_NAME=calendar_db
DB_PORT=5432
DB_HOST=db


PORT=5000

# Nginx
APP_PORT=80 # Change this if you want to run Nginx on a different port

# Frontend
VITE_API_URL=/api
```

3: Launch the Stack
    Run the following command to build images and start the containers:
```
docker-compose up
```
Step 3: Access the App
```
http://IP:APP_PORT
```
📁 Project Structure
```
├── backend/
│   ├── api/            # Express Routes (events, subjects, types)
│   ├── db/             # Database connection & Init scripts
│   └── server.js       # Entry point
├── frontend/
│   ├── dist/           # Compiled production assets
│   ├── src/            # Vue components & Logic
│   └── .env            # Frontend-specific build vars
├── nginx/
│   └── default.conf.template
├── docker-compose.yml
└── .env                # Global environment variables
```
