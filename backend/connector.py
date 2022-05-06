"""
connector.py

Flask REST API for interfacing with the frontend GUI.

Isaac Cheng - 2022

Helpful links:
- What is an endpoint in Flask (incl. `url_for()`): <https://stackoverflow.com/a/19262349>
- How to get different parts of a URL: <https://stackoverflow.com/a/15975041>
- TODO: Returning API errors as JSON: <https://flask.palletsprojects.com/en/2.1.x/errorhandling/#returning-api-errors-as-json>
"""
import re

from flask import abort, request, send_from_directory

from utils import app, cors, bad_route, logger
from telescope_route import put_telescope_json
from background_route import put_background_json
from source_route import put_source_json
from photometry_route import put_photometry_json

if __name__ != "__main__":
    logger.debug("Assuming app is configured for gunicorn in Docker container.")

    @app.route("/")
    def index():
        """
        Serve the index.html file when client requests the static url (e.g.,
        <http://localhost:5000/>).
        """
        logger.info(f"Serving index.html because client requested {app.static_url_path}/")
        return app.send_static_file("index.html")


# N.B. only use GET requests for default path
# See <https://flask.palletsprojects.com/en/2.0.x/api/#url-route-registrations>
@app.route("/", defaults={"path": ""})
@app.route("/<string:path>", methods=["GET", "PUT"])  # needed to redirect everything else
@app.route("/<path:path>", methods=["GET", "PUT"])
def redirect(path):
    """
    Redirects request to the appropriate function based on the path. This is required
    because CANFAR URLs change with each session.

    Parameters
    ----------
      path :: str
        The request path. For example, if the URL displayed in the browser is
        `https://ws-uv.canfar.net/castor/<sessionID>/foo`, the path is
        `castor/<sessionID>/foo`.
    """

    logger.info(f"Parsing request for /{path}")
    logger.info("URL of request: " + str(request.url))

    if re.search(r"\btelescope\b", path) is not None:  # match whole word
        logger.info("Redirecting request to /telescope")
        if request.method != "PUT":
            abort(405)
        return put_telescope_json()

    if re.search(r"\bbackground\b", path) is not None:  # match whole word
        logger.info("Redirecting request to /background")
        if request.method != "PUT":
            abort(405)
        return put_background_json()

    if re.search(r"\bsource\b", path) is not None:  # match whole word
        logger.info("Redirecting request to /source")
        if request.method != "PUT":
            abort(405)
        return put_source_json()

    elif re.search(r"\bphotometry\b", path) is not None:  # match whole word
        logger.info(request.method)
        if request.method != "PUT":
            abort(405)

        return put_photometry_json()

    elif re.search(r"\bmanifest.json\b", path) is not None:  # match whole word
        logger.info("Serving manifest.json")
        if request.method != "GET":
            abort(405)
        return app.send_static_file("manifest.json")

    elif re.search(r"\bfavicon.ico\b", path) is not None:  # match whole word
        logger.info("Serving favicon.ico")
        if request.method != "GET":
            abort(405)
        return app.send_static_file("favicon.ico")

    elif re.search(r"\brobots.txt\b", path) is not None:  # match whole word
        logger.info("Serving robots.txt")
        if request.method != "GET":
            abort(405)
        return app.send_static_file("robots.txt")

    else:
        filename = re.search(r"[^/?]*\.(?:gif|png|jpeg|jpg|ico|js|css)$", path)
        if app.static_folder is not None and filename is not None:
            if request.method != "GET":
                abort(405)
            logger.debug(f"Serving some image/js/css at /{path}")
            return send_from_directory(app.static_folder, filename.group())

        else:
            logger.error(f"Bad route: route=/{path}")
            return bad_route(path)


if __name__ == "__main__":
    # i.e., not running via gunicorn
    cors.init_app(app)
    app.run(port=5000, debug=True)

