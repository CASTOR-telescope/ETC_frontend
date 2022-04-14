# As of April 2022, the LTS node version is v16.14.2
FROM node:lts-alpine as frontend-builder

WORKDIR /frontend/build
COPY frontend/build /frontend/build

# -------------------------------------------------------------------------------------- #

# FROM python:3.9-alpine
FROM python:3.9-slim

USER root
# RUN apk add --no-cache bash
RUN mkdir /opt/image-build && chmod 777 /opt/image-build
# Add required files for CANFAR (gunicorn for Flask server)
ADD docker/nsswitch.conf /etc/
COPY docker/apt-install.sh /opt/image-build
WORKDIR /opt/image-build
RUN ./apt-install.sh sssd acl gunicorn gcc libcurl4-openssl-dev libssl-dev

# Don't need flask-restful...
RUN pip3 install flask flask-cors wheel gunicorn

ARG CACHEBUST_BACKEND=1
WORKDIR /backend
COPY backend /backend

# Install castor_etc package
# TODO: Do it from git+ in the future. Copying files just for testing
ARG CACHEBUST_CASTOR=1
ADD castor_etc /opt/mypackage/castor_etc
COPY setup.py /opt/mypackage/
WORKDIR /opt/mypackage
RUN pip3 install .

# Copy the minified frontend files
ARG CACHEBUST_FRONTEND=1
COPY --from=frontend-builder /frontend/build /frontend/build

EXPOSE 5000

# Change this to the proper CANFAR URL & port

# Use this or startup.sh?
# WORKDIR /backend
# CMD ["gunicorn", "-b", "0.0.0.0:5000", "connector:app", "--log-level=debug", "--log-file=/dev/stdout"]

# RUN mkdir /skaha
ADD docker/startup.sh /skaha/
RUN chmod u+x /skaha/startup.sh
