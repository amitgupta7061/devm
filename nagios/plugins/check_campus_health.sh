#!/usr/bin/env bash
# ==============================================================
# Nagios Custom Plugin: check_campus_health.sh
# Checks Smart Campus REST API health status and MongoDB connection
# Nagios Return Codes:
#   0 - OK
#   1 - WARNING
#   2 - CRITICAL
#   3 - UNKNOWN
# Course: INT333 - DevOps Advanced Configuration Management
# ==============================================================

HOST="127.0.0.1"
PORT="5000"
TIMEOUT=5

# Parse arguments
while getopts "H:p:t:" opt; do
  case $opt in
    H) HOST="$OPTARG" ;;
    p) PORT="$OPTARG" ;;
    t) TIMEOUT="$OPTARG" ;;
    *) echo "Usage: $0 -H <host> -p <port> -t <timeout>" >&2; exit 3 ;;
  esac
done

HEALTH_URL="http://${HOST}:${PORT}/api/health"

# Query API endpoint
RESPONSE=$(curl -s -m "$TIMEOUT" -w "\n%{http_code}" "$HEALTH_URL" 2>/dev/null)

if [ $? -ne 0 ] || [ -z "$RESPONSE" ]; then
  echo "CRITICAL - Smart Campus API is UNREACHABLE at ${HEALTH_URL}"
  exit 2
fi

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 200 ] && [ "$HTTP_CODE" -ne 503 ]; then
  echo "CRITICAL - Smart Campus API returned HTTP code ${HTTP_CODE}"
  exit 2
fi

# Parse JSON fields using grep / sed / python / jq
STATUS=$(echo "$BODY" | grep -o '"status":"[^"]*"' | cut -d':' -f2 | tr -d '"')
DB_STATUS=$(echo "$BODY" | grep -o '"status":"[^"]*"' | sed -n '2p' | cut -d':' -f2 | tr -d '"')
UPTIME=$(echo "$BODY" | grep -o '"uptimeSeconds":[0-9]*' | cut -d':' -f2)

if [ "$STATUS" = "UP" ]; then
  echo "OK - Smart Campus API is UP | Database: CONNECTED, Uptime: ${UPTIME}s"
  exit 0
elif [ "$STATUS" = "DEGRADED" ]; then
  echo "WARNING - Smart Campus API is DEGRADED | Database: ${DB_STATUS:-DISCONNECTED}, Uptime: ${UPTIME}s"
  exit 1
else
  echo "CRITICAL - Smart Campus API status UNKNOWN or FAILURE | Response: ${BODY}"
  exit 2
fi

