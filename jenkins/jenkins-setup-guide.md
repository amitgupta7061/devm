# Jenkins CI/CD Setup & Demonstration Guide

Course: **INT333 - DevOps Advanced Configuration Management**  
Project: **Smart Campus Service Management System**

---

## 1. Quick Local Demonstration via Docker

To run Jenkins locally for viva/lab demonstration:

```bash
# 1. Run official Jenkins LTS with Docker socket mounted (Docker-in-Docker / Docker-outside-of-Docker)
docker run -d \
  --name campus_jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# 2. Get the initial administrative password
docker exec campus_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open `http://localhost:8080` in your web browser, paste the password, and select "Install Suggested Plugins".

---

## 2. Pipeline Job Configuration

1. In the Jenkins Dashboard, click **New Item**.
2. Enter name: `Smart-Campus-Pipeline` and select **Pipeline**. Click **OK**.
3. Scroll down to the **Pipeline** section:
   - **Definition**: Select `Pipeline script from SCM` (or `Pipeline script` and copy contents of `jenkins/Jenkinsfile`).
   - **SCM**: Git
   - **Repository URL**: Your Git repository URL (or local path).
   - **Script Path**: `jenkins/Jenkinsfile`
4. Click **Save**.

---

## 3. Running the Pipeline

1. Click **Build Now** on the left menu.
2. Observe Stage View:
   - ✅ Stage 1: Checkout SCM
   - ✅ Stage 2: Code Quality & Lint
   - ✅ Stage 3: Backend Unit Tests
   - ✅ Stage 4: Frontend Build Verification
   - ✅ Stage 5: Build Docker Images
   - ✅ Stage 6: Deploy Application Stack
   - ✅ Stage 7: Health & Smoke Verification
3. Check the Console Output to show the examiner the clean execution logs, automated tests passing, and the `/api/health` response validation!

