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

## Weird Error Message...

```text
node:internal/process/promises:265
            triggerUncaughtException(err, true /* fromPromise */);
            ^

RpcIpcMessagePortClosedError: Cannot send the message - the message port has been closed for the process 1752.
    at /arc/home/IsaacCheng/CASTOR/ETC_frontend/frontend/node_modules/fork-ts-checker-webpack-plugin/lib/rpc/rpc-ipc/RpcIpcMessagePort.js:47:47
    at processTicksAndRejections (node:internal/process/task_queues:82:21) {
  code: undefined,
  signal: undefined
}
```


```text
The build failed because the process exited too early. This probably means the system ran
out of memory or someone called `kill -9` on the process.
```

For local development (inside conda environment):
```bash
gunicorn -b 127.0.0.1:5000 connector:app
```