# ==============================================================
# Puppet Manifest: site.pp
# Course: INT333 - DevOps Advanced Configuration Management
# University: Lovely Professional University
# Project: Smart Campus Service Management System
# ==============================================================

# Default node configuration for campus server
node default {
  include 'campus_system'
}

# Explicit node classification for production campus host
node /campus-(server|node|prod).*/ {
  include 'campus_system'
}

