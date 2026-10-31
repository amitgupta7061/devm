# Smart Campus Service Management System with Automated DevOps Lifecycle and Infrastructure Monitoring

**Course:** INT333 – DevOps Advanced Configuration Management  
**Institution:** Lovely Professional University (LPU)  
**Academic Year:** 2026  

---

## 📌 Executive Summary

The **Smart Campus Service Management System** is a full-stack, enterprise-grade campus service and maintenance platform designed to streamline grievance redressal, laboratory maintenance, network issues, and facility management across university blocks.

Built specifically for the **INT333 - DevOps Advanced Configuration Management** curriculum, the project combines a modern web application with an automated DevOps toolchain:
1. **Terraform**: Infrastructure-as-Code (IaC) provisioning on AWS.
2. **Puppet**: Declarative configuration management, package automation, and daemon enforcement.
3. **Docker & Docker Compose**: Containerization and service orchestration.
4. **Jenkins**: Automated Continuous Integration and Continuous Deployment (CI/CD) pipeline.
5. **Nagios Core**: Continuous infrastructure and application health monitoring.

---

## 🏗️ System Architecture

```
                                  [ STUDENTS / ADMIN / STAFF ]
                                                │
                                                ▼ HTTP (Port 80/3000)
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Docker Host / AWS EC2 Instance (Provisioned via Terraform, Configured via Puppet)       │
│                                                                                         │
│  ┌─────────────────────────────┐        ┌─────────────────────────────┐                 │
│  │    Frontend Container       │        │     Backend Container       │                 │
│  │    React.js + Vite + Nginx  │───────>│     Node.js + Express.js    │                 │
│  │    (Port 80 / 3000)         │ /api/  │     (Port 5000)             │                 │
│  └─────────────────────────────┘        └──────────────┬──────────────┘                 │
│                                                        │ Mongoose                       │
│                                                        ▼                                │
│                                         ┌─────────────────────────────┐                 │
│                                         │      Database Container     │                 │
│                                         │      MongoDB 7.0 (Port 27017)│                │
│                                         └─────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
        ▲                                                ▲
        │ CI/CD Deployment                               │ Active Health Polling
┌───────┴───────────────┐                        ┌───────┴───────────────┐
│ Jenkins Automation    │                        │ Nagios Core Monitoring│
│ Declarative Pipeline  │                        │ 8 Proactive Checks    │
└───────────────────────┘                        └───────────────────────┘
```

---

## 🚀 DevOps Lifecycle & Technology Mapping (INT333)

| DevOps Stage | Tool Utilized | Implementation Details | Directory / Files |
| :--- | :--- | :--- | :--- |
| **1. Cloud Provisioning** | **Terraform** | AWS VPC, Public Subnet, Internet Gateway, Security Groups (ports 22, 80, 5000, 3000, 8080, 5666), Cost-conscious EC2 (`t2.micro` / `t3.micro`). | `terraform/main.tf`<br>`terraform/variables.tf`<br>`terraform/outputs.tf`<br>`terraform/user_data.sh` |
| **2. Configuration Management** | **Puppet** | Automated installation of Docker CE, Docker Compose, Git, Nagios plugins; user group permission delegation (`ubuntu`, `jenkins` in `docker` group); systemd unit automation (`smart-campus.service`). | `puppet/manifests/site.pp`<br>`puppet/manifests/docker_setup.pp`<br>`puppet/manifests/campus_app.pp`<br>`puppet/manifests/monitoring_agent.pp` |
| **3. Containerization** | **Docker** | Multi-stage Dockerfile for React frontend served by Nginx with reverse proxy; production Dockerfile for Express API; bridge network orchestration and healthchecks. | `frontend/Dockerfile`<br>`backend/Dockerfile`<br>`docker-compose.yml` |
| **4. Continuous Delivery** | **Jenkins** | Declarative 7-stage CI/CD pipeline: SCM checkout, syntax lint, automated unit testing, frontend build verification, Docker image tagging, container deployment, and smoke testing. | `jenkins/Jenkinsfile`<br>`Jenkinsfile`<br>`jenkins/jenkins-setup-guide.md` |
| **5. Infrastructure Monitoring** | **Nagios** | Proactive monitoring of server alive state, HTTP Web frontend, `/api/health` JSON check, MongoDB port 27017, disk space, CPU load, RAM usage, and Docker daemon. | `nagios/nagios.cfg`<br>`nagios/objects/campus_server.cfg`<br>`nagios/plugins/check_campus_health.sh` |

---

## 💻 Application Features by Role

### 👨‍🎓 1. Student Portal
- **Authentication**: Register with University Email, Student ID / Registration Number, and School.
- **Lodge Complaint**: Submit tickets with Title, Campus Category (Wi-Fi, Laboratory, Classroom, Electricity, Sanitation, Security), Priority level (Low, Medium, High, Urgent), Block/Building name, and Room identifier.
- **Live Ticket Tracking**: Real-time status badges (*Pending*, *In Progress*, *Resolved*), assigned maintenance officer details, and timeline work log remarks.

### 🛡️ 2. Campus Administrator Console
- **Central Triage Table**: View all campus complaints across all blocks with multi-field search and filters.
- **Staff Dispatch**: Assign tickets to maintenance specialists based on workload.
- **Priority Escalation**: Adjust ticket priority levels (e.g. escalating critical lab switch failures to *Urgent*).
- **Campus Analytics**: Real-time KPI cards, category breakdown distribution progress bars, priority distribution, and staff workload distribution.
- **User Directory**: View and manage roles of registered students, maintenance engineers, and administrators.

### 🔧 3. Maintenance Staff Console
- **Work Order Queue**: View tasks assigned specifically to the logged-in staff member.
- **Status Progression**: One-click actions to transition tickets from *Pending* ➔ *In Progress* ➔ *Resolved*.
- **Work Log Remarks**: Add technical resolution remarks and inspection notes before officially closing tickets.

### 📊 4. Embedded Live DevOps Monitor
- Directly accessible from the application header.
- Visualizes live health state from `/api/health`, process uptime, Node.js memory pressure, Jenkins stage status, and Nagios check statuses.

---

## 🔑 Pre-Seeded Demonstration Accounts

For viva examinations and quick evaluation, the system includes pre-configured demo accounts (Password for all: `password123`):

| Role | Name | Email Address | Password | Department / Specialization |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. Ramesh Sharma | `admin@lpu.in` | `password123` | Campus Administration & DevOps Lead |
| **Staff** | Sunil Kumar | `sunil.network@lpu.in` | `password123` | Campus Wi-Fi & IT Infrastructure |
| **Staff** | Rajesh Verma | `rajesh.maintenance@lpu.in` | `password123` | Electrical Maintenance & HVAC |
| **Student** | Aarav Patel | `aarav.student@lpu.in` | `password123` | B.Tech CSE (Reg: 12104523) |
| **Student** | Ananya Gupta | `ananya.student@lpu.in` | `password123` | B.Tech IT (Reg: 12108912) |

> 💡 **Viva Tip:** The login page includes **"One-Click Viva Demo Roles"** buttons to log in as Student, Admin, or Staff instantly with a single click!

---

## 🛠️ Local Setup & Running Instructions

### Method A: Running with Docker Compose (Recommended)

Ensure Docker Desktop is running on your machine:

```bash
# 1. Clone or navigate to the project directory
cd c:\Coding\devops

# 2. Build and start all 3 containers in detached mode
docker-compose up -d --build

# 3. Verify running containers
docker-compose ps
```

- **Frontend Portal**: `http://localhost:3000` (or `http://localhost:80`)
- **Backend API**: `http://localhost:5000`
- **Health Check Endpoint**: `http://localhost:5000/api/health`

---

### Method B: Running Directly with Node.js

#### 1. Start the Backend API:
```bash
cd backend

# Install dependencies (already completed)
npm install

# Run automated tests
npm test

# Start the server (runs on port 5000)
npm start
```

#### 2. Start the Frontend Application:
In a new terminal:
```bash
cd frontend

# Install dependencies (already completed)
npm install

# Start Vite development server (runs on port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📂 Project Structure

```
c:\Coding\devops\
├── backend/
│   ├── config/
│   │   └── db.js                  # Mongoose connection & retry logic
│   ├── middleware/
│   │   └── auth.js                # JWT verification & role authorization
│   ├── models/
│   │   ├── Complaint.js           # Complaint ticket schema & timestamps
│   │   └── User.js                # User schema & bcrypt password hashing
│   ├── routes/
│   │   ├── auth.js                # Registration, login & profile routes
│   │   ├── complaints.js          # Role-based CRUD operations for tickets
│   │   ├── health.js              # Health & metrics endpoints for Nagios
│   │   ├── stats.js               # Dashboard metrics & workload aggregator
│   │   └── users.js               # User directory & role assignment
│   ├── tests/
│   │   └── health.test.js         # Automated backend test suite
│   ├── Dockerfile                 # Production Node.js alpine container
│   ├── package.json
│   ├── seed.js                    # Database demo seeder
│   └── server.js                  # Express application entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryBadge.jsx  # Category visual indicator
│   │   │   ├── ComplaintModal.jsx # Ticket creation & update modal
│   │   │   ├── DevOpsStatusBanner.jsx # Top DevOps health strip
│   │   │   ├── Navbar.jsx         # Navigation & user role badge
│   │   │   ├── PriorityBadge.jsx  # Priority status pill
│   │   │   └── StatusBadge.jsx    # Complaint workflow status badge
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # JWT auth state provider
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx # Campus triage & statistics console
│   │   │   ├── DevOpsMonitoring.jsx # INT333 DevOps interactive console
│   │   │   ├── Login.jsx          # Login with one-click demo roles
│   │   │   ├── Register.jsx       # Student registration page
│   │   │   ├── StaffDashboard.jsx # Assigned maintenance tickets
│   │   │   └── StudentDashboard.jsx # Student ticket submission & tracking
│   │   ├── services/
│   │   │   └── api.js             # REST API client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile                 # Multi-stage Docker build (React + Nginx)
│   ├── nginx.conf                 # Nginx reverse proxy configuration
│   ├── package.json
│   └── vite.config.js
│
├── terraform/
│   ├── main.tf                    # AWS VPC, Subnet, Security Groups, EC2
│   ├── outputs.tf                 # Public IP, URLs, SSH commands
│   ├── variables.tf               # Region, AMI, instance type parameters
│   ├── user_data.sh               # Cloud-init bootstrap script
│   └── terraform.tfvars.example   # Sample credentials template
│
├── puppet/
│   ├── manifests/
│   │   ├── campus_app.pp          # App directories & Systemd unit
│   │   ├── docker_setup.pp        # Docker CE installation & groups
│   │   ├── monitoring_agent.pp    # Nagios NRPE configuration
│   │   └── site.pp                # Node classifier
│   ├── modules/
│   │   └── campus_system/
│   │       └── manifests/init.pp  # Master module entrypoint
│   └── README.md                  # Puppet execution & validation guide
│
├── jenkins/
│   ├── Jenkinsfile                # Declarative 7-stage CI/CD pipeline
│   └── jenkins-setup-guide.md     # Step-by-step Jenkins run instructions
│
├── nagios/
│   ├── objects/
│   │   ├── campus_server.cfg      # Host definition & 8 service checks
│   │   ├── commands.cfg           # Check commands & plugin paths
│   │   ├── contacts.cfg           # DevOps team alert contacts
│   │   └── timeperiods.cfg        # 24x7 monitoring definition
│   ├── plugins/
│   │   └── check_campus_health.sh # Custom bash plugin for /api/health
│   ├── docker-compose.monitoring.yml # Standalone Nagios Core container
│   ├── nagios.cfg                 # Main Nagios configuration file
│   └── README.md                  # Monitoring documentation & run guide
│
├── docker-compose.yml             # Local production orchestration file
├── Jenkinsfile                    # Root Jenkinsfile symlink/evaluator
└── README.md                      # Comprehensive project documentation
```

---

## 🎓 INT333 Viva & Oral Examination Guide

### Q1: What is the fundamental difference between Terraform and Puppet in this project?
> **Answer:**  
> - **Terraform** is an **Infrastructure as Code (IaC)** orchestration tool used to *provision* the underlying virtual hardware on AWS (VPC, Subnets, Internet Gateway, Security Groups, and EC2 instance).
> - **Puppet** is a **Configuration Management** tool used to *configure* the provisioned operating system (installing Docker CE, setting file permissions in `/opt/campus-system`, configuring the `smart-campus` systemd service, and installing the Nagios NRPE monitoring agent).
> - *Rule of thumb:* Terraform builds the house; Puppet furnishes the house.

### Q2: What does idempotence mean in Puppet?
> **Answer:**  
> Idempotence means that applying the Puppet manifest multiple times will result in the same system state without producing errors or duplicate actions. If Docker is already installed and running, Puppet verifies this state and takes no redundant action.

### Q3: Explain the stages in your Jenkins CI/CD pipeline.
> **Answer:**  
> The pipeline defined in `jenkins/Jenkinsfile` consists of 7 declarative stages:
> 1. **Checkout SCM**: Clones the latest commit from Git.
> 2. **Code Quality & Lint**: Verifies package integrity.
> 3. **Backend Unit Tests**: Executes `npm test` (`tests/health.test.js`) to guarantee API endpoints function before packaging.
> 4. **Frontend Build Verification**: Executes `npm run build` with Vite to generate static assets.
> 5. **Build Docker Images**: Builds optimized Docker images tagged with `${BUILD_NUMBER}`.
> 6. **Deploy Application Stack**: Executes `docker compose up -d` to restart services with zero downtime.
> 7. **Smoke & Health Verification**: Queries `http://localhost:5000/api/health` to confirm the deployment succeeded.

### Q4: How does Nagios monitor the application health?
> **Answer:**  
> Nagios uses both standard plugins and custom scripts:
> - `check_http` validates that the web frontend returns HTTP 200.
> - `check_campus_api_health` queries the `/api/health` REST endpoint and verifies that `"status":"UP"` is returned.
> - `check_tcp` probes port 27017 to ensure MongoDB is accepting connections.
> - `check_campus_health.sh` is our custom plugin that maps the application status to Nagios exit codes: `0` for OK, `1` for WARNING, and `2` for CRITICAL.

### Q5: Why is a multi-stage Dockerfile used for the frontend?
> **Answer:**  
> In `frontend/Dockerfile`, Stage 1 uses `node:20-alpine` to compile the React code with Vite into HTML, CSS, and JS bundles. Stage 2 discards the Node runtime and uses a lightweight `nginx:alpine` image to serve only the compiled static files. This reduces image size from over 800MB to under 30MB and eliminates security vulnerabilities associated with development dependencies.

---

## 📜 Academic Declaration

This project was built for **INT333 - DevOps Advanced Configuration Management** at **Lovely Professional University**. All components adhere to standard enterprise conventions and are ready for live laboratory presentation and grading.

