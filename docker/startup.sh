#!/bin/bash

SESSIONID=$1
LOGLEVEL=${2:-debug}

echo "Starting gunicorn..."

cd /backend
gunicorn -b 0.0.0.0:5000 connector:app \
        --log-level=${LOGLEVEL} \
        --log-file=/dev/stdout \
        -e session_id=${SESSIONID}

# gunicorn -b 0.0.0.0:5000 connector:app --log-level=debug --log-file=/dev/stdout -e session_id=12345