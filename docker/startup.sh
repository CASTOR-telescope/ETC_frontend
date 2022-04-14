#!/bin/bash

LOGLEVEL=${1:debug}

echo "Starting gunicorn..."

cd /backend
gunicorn -b 0.0.0.0:5000 connector:app --log-level=${LOGLEVEL} --log-file=/dev/stdout