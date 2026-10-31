# Nagios Infrastructure & Application Monitoring

Course: **INT333 - DevOps Advanced Configuration Management**  
Project: **Smart Campus Service Management System**

---

## 1. Overview of Monitored Services

Nagios Core performs proactive polling and service checks on both infrastructure metrics and application endpoints:

| Service Check | Plugin / Command | Thresholds / Conditions | Purpose |
| :--- | :--- | :--- | :--- |
| **Network Latency (PING)** | `check_ping` | RTA < 100ms, Loss < 20% | Host reachability & network stability |
| **Frontend Web Server** | `check_http` (Port 80/3000) | HTTP 200 within 10s | Ensures students & staff can access portal |
| **Backend API Health** | `check_campus_api_health` | HTTP 200, `"status":"UP"` | Validates Node.js Express server health |
| **Database Connectivity** | `check_tcp` (Port 27017) | TCP handshake within 10s | Ensures MongoDB is listening and responsive |
| **Disk Space Utilization** | `check_disk` | Warn < 20%, Crit < 10% | Prevents disk full crashes |
| **CPU Load Average** | `check_load` | Warn > 2.0, Crit > 4.0 | Detects CPU exhaustion |
| **Physical Memory (RAM)** | `check_mem` | Warn > 80%, Crit > 90% | Detects memory leaks |
| **Docker Daemon Process** | `check_procs` | Min 1 `dockerd` process | Ensures container engine is operational |

---

## 2. Running Nagios via Docker for Live Demonstration

To launch the Nagios monitoring console locally:

```bash
# Inside the nagios/ directory:
docker compose -f docker-compose.monitoring.yml up -d
```

- **Nagios Web URL**: `http://localhost:8085`
- **Default Username**: `nagiosadmin`
- **Default Password**: `nagios`

Navigate to **Current Status -> Services** to see the 8 green checks!

---

## 3. Custom Health Check Plugin: `check_campus_health.sh`

Nagios follows strict exit code conventions:
- **Exit Code 0 (OK)**: API is UP, database connection status is CONNECTED.
- **Exit Code 1 (WARNING)**: API is responding but reporting DEGRADED (e.g. database reconnecting).
- **Exit Code 2 (CRITICAL)**: API is unreachable (connection refused, timeout, or 500 error).
- **Exit Code 3 (UNKNOWN)**: Invalid CLI syntax or unexpected response payload.

Run directly in terminal:
```bash
./plugins/check_campus_health.sh -H 127.0.0.1 -p 5000
# Output: OK - Smart Campus API is UP | Database: CONNECTED, Uptime: 45s
```

