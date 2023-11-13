# CASTOR ETC GUI

FORECASTOR Team - 2022-2023

**This is a work in progress!**

This is the browser-based graphical user interface (GUI) for the CASTOR Exposure Time
Calculator (ETC). This is meant to be used with the [CASTOR ETC Python
backend](https://github.com/CASTOR-telescope/ETC).

## Table of Contents

- [CASTOR ETC GUI](#castor-etc-gui)
  - [Table of Contents](#table-of-contents)
  - [Accessing the GUI](#accessing-the-gui)
  - [Deployment on CANFAR](#deployment-on-canfar)
    - [Dependencies](#dependencies)
    - [CANFAR Build Instructions](#canfar-build-instructions)
  - [Building the Docker image for local machine] (#docker/README.md)
  - [Roadmap](#roadmap)
  - [Known Issues](#known-issues)
  - [Questions, Issues, Suggestions, and Other Feedback](#questions-issues-suggestions-and-other-feedback)

## Accessing the GUI

1. Ensure you have a Canadian Astronomy Data Centre account (or [request
   one](https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/auth/request.html) if you do not
   have one yet).
2. Go to [CANFAR](https://www.canfar.net/en/) and sign in to the [Science
   Portal](https://www.canfar.net/science-portal/). If you cannot access this, then you
   must send an email to [support@canfar.net](mailto:support@canfar.net) requesting access
   to the Science Portal.
3. Inside the [Science Portal](https://www.canfar.net/science-portal/), click the "`+`"
   icon to launch a new session. Under "`type`", select "`contributed`". If multiple ETC
   GUI versions are available, you can select the specific version you would like to use
   under the "`container image`" field. The version number is denoted by the string
   following the colon (e.g., `images.canfar.net/castor/castor_etc_gui:1.0.0` means
   version `1.0.0` of the `castor_etc_gui` CASTOR ETC GUI image).
4. Assign a name to your ETC GUI container and choose the maximum amount of memory (RAM)
   and maximum number of CPU cores you would like to have available for your GUI instance.
   Note that RAM and CPU are shared resources. The ETC GUI should _not_ require a lot of
   CPU or RAM to run. I cannot imagine a case where using the ETC GUI would require more
   than, for example, 4 GB of RAM and 1 or 2 CPU cores.
5. Click the blue "`Launch`" button to start your new ETC GUI session. It can take up to a
   minute to launch the session depending on which computing node you are assigned to and
   the last time the image was launched. Additionally, only 1 session of each type is
   allowed at a time and they automatically shut down after 14 consecutive days.

## Deployment on CANFAR

### Dependencies

CASTOR frontend uses [Typescript](https://www.typescriptlang.org/) and
[React](https://reactjs.org/) for the ETC GUI. We bridge this GUI with the [CASTOR ETC
Python backend](https://github.com/CASTOR-telescope/ETC) using an application programming
interface (API) created using the [Flask](https://flask.palletsprojects.com/en/2.1.x/)
microframework.

### CANFAR Build Instructions

1. Download the git repo:

   ```bash
   git clone https://github.com/CASTOR-telescope/ETC_frontend.git
   ```

2. Ensure you have [Docker](https://docs.docker.com/get-started/) installed.

3. Ensure you have `npm` installed (I am using v8.5.2). Go into the
   [`frontend/`](frontend/) folder and run `npm run build` in the terminal to build the
   React application (this may take some time). There have been [reported performance
   issues](https://github.com/npm/cli/issues/3208#issuecomment-966579441) regarding
   executing `npm run build` within a container. If you're curious, feel free to try fa
   multi-stage build (i.e., building the app within the container then copying the built
   files to the Python base image); a basic outline of how this would be integrated is
   provided in the [Dockerfile](docker/Dockerfile) comments.

4. Important: remember to double-check the `API_URL` in [env.ts](frontend/src/env.ts). The
   `API_URL` used in development is different from the one required for
   [CANFAR](https://www.canfar.net/en/)!

5. Run the [`build.sh`](docker/build.sh) script to build the Docker container. It takes 4
   optional arguments: `CACHEBUST_CASTOR` (default: `1`), `CACHEBUST_BACKEND` (default:
   `1`), `CACHEBUST_FRONTEND` (default: `1`), and `RUN` (default: `false`). The first 3
   variables attempt to invalidate the [Docker
   cache](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#leverage-build-cache)
   for: (a) installing the `castor_etc` package in the Docker image, (b) copying the
   backend files to the Docker image, and (c) copying the built frontend files to the
   Docker image. The last variable, when `true`, will also automatically run the Docker
   image (convenient for local testing).
   - (Optional) Set a custom `VERSION` for the built image in
     [Docker_env](docker/Docker_env). This follows the same procedure as documented in the
     [ETC Docker README](https://github.com/CASTOR-telescope/ETC/tree/master/docker).
   - (Optional) You can also set custom `CACHEBUST_CASTOR`, `CACHEBUST_BACKEND`,
     `CACHEBUST_FRONTEND`, and `RUN` variables in [Docker_env](docker/Docker_env). Note,
     however, that command-line arguments provided will overwrite the value(s) if
     provided.

6. Finally, follow the instructions detailed on the skaha GitHub for [session
   containers](https://github.com/opencadc/skaha/tree/master/containers#publishing-skaha-containers).
   Remember to tag the pushed image as `contributed` on
   [Harbor](https://images.canfar.net) to be able to access it via the Science Portal
   drop-down menu!

7. (EXTRA NOTE) In the future, when developing any FORECASTOR projects or web apps that
   will be deployed on the CANFAR Science Platform, consider using port 5000 as the server
   connection. See [this pull request](https://github.com/opencadc/skaha/pull/323) and
   [this comment](https://github.com/opencadc/skaha/pull/317#issuecomment-1110086152) for
   more details. I am happy to provide support or to clarify any questions you might have
   on this topic.

## Roadmap

- Report some telescope, background, and source parameters (e.g., under the photometry
  tab). For example, telescope passband limits, background surface brightness AB
  magnitudes, source AB magnitudes.
- Fully implement validation on all forms.
- Figure out how to auto-update all other parameters upon submitting one form (e.g., after
  saving Telescope, Background + Source + Photometry should all resubmit).
- Add more transparent error messages visible via the GUI, as application errors are
  currently only viewable via the CANFAR session logs. See [these
  instructions](https://github.com/CASTOR-telescope/ETC/blob/master/docker/how_to_view_session_logs.md)
  for how to view these logs.
- Add loading of custom surface brightness profiles (i.e., from a FITS file) on the GUI.
  This functionality is available in the `castor_etc` Python package but has not been made
  available on the GUI yet.

## Known Issues

- There is a quirk when vertically resizing the plots (i.e., changing their vertical
  heights). When clicking on the horizontal divider, only the right half of the divider is
  highlighted. We are using the [`allotment`](https://github.com/johnwalley/allotment)
  package for our resizable panes.

## Questions, Issues, Suggestions, and Other Feedback

Please reach out if you have any questions, suggestions, or other feedback related to this
software—either through email
([isaac.cheng.ca@gmail.com](mailto:isaac.cheng.ca@gmail.com)) or the [discussions
page](https://github.com/CASTOR-telescope/ETC_frontend/discussions). You can also ping me
on Slack or even set up an online video/audio call! Larger issues or feature requests can
be posted and tracked via the [issues
page](https://github.com/CASTOR-telescope/ETC_frontend/issues). Finally, you can also
reach out to Dr. Tyrone Woods, the Science Planning Tools Lead for CASTOR.
