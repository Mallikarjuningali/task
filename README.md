📁 Project Structure
crud-deploy/
 ├── backend/
 │     ├── server.js
 │     ├── app/
 │     │     ├── controllers/
 │     │     └── routes/
 │     └── ...
 ├── frontend/
 │     ├── nginx.conf
 │     └── Angular code...
 ├── docker-compose.yml 
 ├── Dockerfile.frontend
 ├── Dockerfile.backend
 ├── Jenkinsfile
 └── README.md

⚙️ Technologies Used
Angular 15 – Frontend
Node.js + Express – Backend
MongoDB – Database
Docker & Docker Compose
Nginx – Reverse proxy
Jenkins – CI/CD automation
AWS EC2 – Deployment environment
Docker Hub – Image registry
🐳 Docker Setup
1️⃣ Backend Build
docker build -t mallikarjuningali/crud-dd-backend:latest -f Dockerfile.backend .

2️⃣ Frontend Build
docker build -t mallikarjuningali/crud-dd-frontend:latest -f Dockerfile.frontend .

3️⃣ Run Using Compose
docker-compose up -d

🔄 CI/CD Pipeline (Jenkins)

The CI/CD pipeline performs:

Pull latest code from GitHub

Build Docker images (frontend + backend)

Tag & push to Docker Hub

SSH into EC2

Pull latest images

Restart containers via docker-compose

🚀 Deployment Steps (On AWS EC2)
Step 1: Install dependencies
sudo apt update
sudo apt install docker.io docker-compose -y

Step 2: Clone Repo
git clone https://github.com/Mallikarjuningali/task.git
cd task

Step 3: Start App
docker-compose up -d

Step 4: View Logs
docker logs crud_backend
docker logs crud_frontend
docker logs crud_nginx

The application runs at:
http://13.203.158.118/

🌐 Nginx Reverse Proxy

frontend/nginx.conf

server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location / {
        proxy_pass http://frontend:80/;
        try_files $uri $uri/ /index.html;
    }
}
