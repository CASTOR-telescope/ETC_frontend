# CASTOR ETC GUI Frontend

Isaac Cheng - 2022

**This is a work in progress!**

This repository is for the  graphical user interface (GUI) frontend for the CASTOR
Exposure Time Calculator (ETC). This is meant to be used with the CASTOR ETC Python
backend.

TODO: finish docstrings

---

## Dependencies

CASTOR frontend uses [Typescript](https://www.typescriptlang.org/) and
[React](https://reactjs.org/) for the ETC GUI. We bridge this GUI with the CASTOR ETC
Python backend using an application programming interface (API) created using the
[Flask](https://flask.palletsprojects.com/en/2.0.x/) microframework.

---

## Build

1. Download the git repo:

   ```bash
   git clone https://github.com/CASTOR-telescope/ETC_frontend.git
   ```

2. Ensure you have [Docker](https://docs.docker.com/get-started/) installed.

3. Ensure you have `npm` installed (I am using v8.5.2). Go into the
   [`frontend/`](frontend/) folder and run `npm run build` in the terminal to build the
   React application (this may take some time). The aim of building locally rather than in
   the Docker container is to minimize loading time (? Does this even affect CANFAR
   loading time ?).

Can override parameters (e.g., `VERSION`) in Docker_env.

NOTE THAT DEBUG VERSION UTILS.PY IS DIFFERENT FROM PRODUCTION (I.E., CONTAINERIZED)
UTILS.PY!!!

Make docker container. Don't forget to remove default node version and to install the
CASTOR ETC Python package.

### Conda

Make conda environment file.

Please ensure you have the [CASTOR ETC Python
package](https://github.com/CASTOR-telescope/ETC) installed. Don't forget to remove
default node version and to install the CASTOR ETC Python package.

<!--
After npm install, may need to use

```bash
npm install --save-dev react-split-pane --force
```

because of a dependency issue (<https://github.com/tomkp/react-split-pane/issues/713>).
-->

---

## Help

Please reach out to me at [isaac.cheng.ca@gmail.com](mailto:isaac.cheng.ca@gmail.com) or
via the [discussions tab](https://github.com/CASTOR-telescope/ETC_frontend/discussions) on
GitHub if there are any questions. Larger issues or feature requests can be posted and
tracked via the [issues page](https://github.com/CASTOR-telescope/ETC_frontend/issues).

## Some notes for myself (remove later)

For local development (inside conda environment):

```bash
gunicorn -b 127.0.0.1:5000 connector:app
```
