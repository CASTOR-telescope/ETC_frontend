# CASTOR ETC GUI Frontend

Isaac Cheng - 2022

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

## Local Build

### Docker

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

Please reach out to me at [isaac.cheng.ca@gmail.com](mailto:isaac.cheng.ca@gmail.com) if
there are any questions. Larger issues or feature requests can be posted and tracked via
the [issues page](https://github.com/CASTOR-telescope/ETC_frontend/issues).

## Some notes for myself (remove later)

For local development (inside conda environment):

```bash
gunicorn -b 127.0.0.1:5000 connector:app
```
