#!/bin/bash

# The session ID is no longer necessary for the backend (see
# <https://github.com/opencadc/skaha/pull/323>), but keep this to let the Flask app know
# it is running in gunicorn
skaha_sessionid=${1:-test123}
TIMEOUT=120

echo "Starting gunicorn..."

cd /backend
gunicorn -b 0.0.0.0:5000 connector:app \
        --log-level=debug \
        --log-file=/dev/stdout \
        --timeout $TIMEOUT \
        -e skaha_sessionid=${skaha_sessionid}
