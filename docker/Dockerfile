# As of April 2022, the LTS node version is v16.14.2
# Don't need this since I'm not building within the Docker container...
#
# FROM node:lts-alpine as frontend-builder

# WORKDIR /frontend/build
# COPY frontend/build /frontend/build

# -------------------------------------------------------------------------------------- #

FROM python:3.9-slim

USER root

RUN mkdir /opt/image-build && chmod 777 /opt/image-build
# Add required files for CANFAR (gunicorn for Flask server)
ADD docker/nsswitch.conf /etc/
COPY docker/apt-install.sh /opt/image-build
WORKDIR /opt/image-build
RUN ./apt-install.sh sssd acl gunicorn gcc libcurl4-openssl-dev libssl-dev git

RUN pip3 install flask flask-cors wheel gunicorn

# Install castor_etc package
ARG CACHEBUST_CASTOR=1
# ADD castor_etc /opt/mypackage/castor_etc
# COPY setup.py /opt/mypackage/
# WORKDIR /opt/mypackage
# RUN pip3 install .
RUN pip3 install git+https://github.com/CASTOR-telescope/ETC.git

ARG CACHEBUST_BACKEND=1
# REVIEW: cachebust not working?
COPY backend /backend
RUN chmod a+w /backend/flask_uploads


# Copy the minified frontend files
ARG CACHEBUST_FRONTEND=1
# COPY --from=frontend-builder /frontend/build /backend/client
COPY frontend/build /backend/client

EXPOSE 5000

ADD docker/startup.sh /skaha/
RUN chmod a+x /skaha/startup.sh

# https://stackoverflow.com/a/67206046
ENV skaha_sessionid=1
ENTRYPOINT [ "/bin/bash", "-c", "exec /skaha/startup.sh ${skaha_sessionid} \"${@}\"", "--" ]
# ENTRYPOINT [ "/skaha/startup.sh" ]
