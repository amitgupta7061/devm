# DevOps Continuous Assessment (CA) & Viva Evaluation Guide

This guide is designed for your **DevOps Continuous Assessment (CA) and Lab Evaluation**. It outlines the exact talking points, interactive live demonstrations, and terminal commands to present to your teacher.

---

## 🎯 1. Two-Minute Live Demonstration Flow

When the teacher asks you to present your project, follow this exact flow:

### Step 1: Open the Application & Launch the DevOps Center
1. Open **[http://localhost:3000](http://localhost:3000)** in your browser.
2. Even without logging in, click the prominent top banner:  
   👉 **"Launch DevOps Architecture & Infrastructure Console"**  
   *(Or click "DevOps Command Center" in the top navbar).*

---

### Step 2: Show the Interactive Jenkins CI/CD Pipeline
- Click the **"1. Jenkins CI/CD Pipeline"** tab.
- Click **"▶ Run Live CI/CD Build"**.
- **What to tell the teacher:**
  > *"Sir/Ma'am, our Jenkinsfile uses a declarative pipeline with 7 automated stages: SCM Checkout, Syntax Lint, Backend Unit Tests, Frontend Vite Build, Docker Image Building, Docker Compose Deployment, and Healthcheck Verification. Here you can see the real-time stage progression and streaming console logs."*

---

### Step 3: Demonstrate Nagios & Chaos Engineering (Highest Impact!)
- Click the **"2. Nagios Monitoring & Chaos Testing"** tab.
- Explain the 8 active checks (HTTP Web, API Health, MongoDB TCP, Disk, CPU Load, RAM, Docker Daemon).
- Click **"Simulate DB Outage"**:
  - Point to the screen: The API health instantly turns **DEGRADED (HTTP 503)** and the Nagios check turns **CRITICAL**!
- Click **"Restore All (OK)"**:
  - The health recovers to **UP (HTTP 200)** and Nagios returns to **OK (Green)**.
- **What to tell the teacher:**
  > *"A key requirement of monitoring is failure reactivity. Using our `/api/health/chaos` endpoint, we simulated a database crash. Nagios immediately detected the degraded health state and raised a CRITICAL alert. Upon service recovery, it automatically transitioned back to OK without human intervention."*

---

### Step 4: Explain Docker Multi-Stage Optimization
- Click the **"5. Docker Multi-Stage & Compose"** tab.
- Show the **Multi-Stage Size Comparison** card:
  - Standard Single-Stage Node: **~842 MB**
  - Our Multi-Stage Nginx Alpine: **28.4 MB** (**96.6% size reduction**)
- **What to tell the teacher:**
  > *"We used a multi-stage Docker build in `frontend/Dockerfile`. In Stage 1 (`node:20-alpine`), we compile the code. In Stage 2 (`nginx:alpine`), we copy only the static production assets and discard the heavy Node runtime and build dependencies. This drastically reduces attack surface and network bandwidth."*

---

### Step 5: Explain Terraform & Puppet Roles
- Click the **"3. Terraform AWS IaC"** tab to show the VPC, Subnet, Security Groups (ports 22, 80, 5000, 8080, 5666), and EC2 blueprint, along with the `terraform plan` output.
- Click the **"4. Puppet Configuration"** tab to show the manifests, package/daemon management, and the `puppet apply --noop` idempotency output.

---

## 💻 2. Terminal Commands to Run in Front of the Teacher

Keep a terminal open at `C:\Coding\devops` to run these live commands:

### Command 1: Run Backend Automated Tests
```powershell
cd backend
npm test
```
*Output: 4 tests pass, 0 fail (validates root route, `/api/health`, and Nagios plain-text metrics).*

### Command 2: Validate Docker Compose Configuration
```powershell
cd ..
docker-compose config
```
*Output: Displays the parsed container tree with MongoDB, Backend, Frontend, volumes, and healthchecks.*

### Command 3: Execute Custom Nagios Plugin
```bash
# Simulates how Nagios executes our health plugin:
bash nagios/plugins/check_campus_health.sh -H 127.0.0.1 -p 5000
```
*Output: `OK - Smart Campus API is UP | Database: CONNECTED, Uptime: ...` (Exit code: 0).*

---

## 🧠 3. Quick-Fire Viva Questions & Ready Answers

### Q1: Why did you use both Terraform AND Puppet? Isn't one enough?
> **Answer:**  
> *"No, sir. They solve two different problems in the DevOps lifecycle:  
> - **Terraform** is an **Orchestration / Infrastructure-as-Code (IaC)** tool. It provisions the virtual hardware in the cloud (AWS VPC, Subnet, Security Groups, and EC2 instance).  
> - **Puppet** is a **Configuration Management** tool. Once the server is running, Puppet configures the internal operating system (installs Docker, configures user permissions, sets up systemd services, and deploys monitoring agents).  
> In short: **Terraform builds the server; Puppet configures the server.**"*

### Q2: What is idempotence in Configuration Management?
> **Answer:**  
> *"Idempotence means running a configuration manifest multiple times produces the exact same result without unintended side effects or duplicate services. In our Puppet manifest `docker_setup.pp`, Puppet first checks if Docker is installed. If already installed, it does nothing; if missing, it installs it."*

### Q3: What exit codes does Nagios expect from custom plugins?
> **Answer:**  
> *"Nagios plugin standards require specific integer return codes:  
> - **0 = OK** (Service running normally)  
> - **1 = WARNING** (Service degraded or warning threshold exceeded)  
> - **2 = CRITICAL** (Service down or critical threshold breached)  
> - **3 = UNKNOWN** (Invalid syntax or unreadable response)  
> Our plugin `nagios/plugins/check_campus_health.sh` strictly adheres to these codes."*

### Q4: How does Docker Compose handle service networking and order of startup?
> **Answer:**  
> *"Docker Compose automatically creates an isolated bridge network (`campus_net`) with built-in DNS service discovery, allowing the backend to connect to MongoDB simply using `mongodb://mongo:27017`. We use `depends_on` with `condition: service_healthy` so the backend only starts after MongoDB passes its database ping healthcheck."*

### Q5: Why is Declarative Pipeline preferred over Scripted Pipeline in Jenkins?
> **Answer:**  
> *"Our `jenkins/Jenkinsfile` uses the Declarative syntax because it enforces structured blocks (`stages`, `steps`, `post`, `environment`), provides strict syntax checking, makes stage-view visual rendering clearer, and handles failure cleanups cleanly via `post { failure { ... } }`."*

