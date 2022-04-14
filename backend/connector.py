"""
connector.py

Flask REST API for interfacing with the frontend GUI.

Isaac Cheng - 2022

Helpful links:
- What is an endpoint in Flask (incl. `url_for()`): <https://stackoverflow.com/a/19262349>
- How to get different parts of a URL: <https://stackoverflow.com/a/15975041>
"""
import re

from flask import abort, request

from utils import app, cors, bad_route, logger
from telescope_route import put_telescope_json
from background_route import put_background_json
from source_route import put_source_json
from photometry_route import put_photometry_json

# from utils import MyCustomJsonEncoder

# app = Flask(__name__)
# api = Api(app)
# cors = CORS()
# app.json_encoder = MyCustomJsonEncoder


@app.route("/")
def index():
    """
    With this route, when the client requests the https://example.com/
    the server will send the contents of the index.html static file.
    """
    return app.send_static_file("index.html")


# N.B. only use GET requests for default path
# See <https://flask.palletsprojects.com/en/2.0.x/api/#url-route-registrations>
@app.route("/", defaults={"path": ""})
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

    else:
        return bad_route(path)


if __name__ == "__main__":
    cors.init_app(app)
    # For development, port=5000 and debug=True
    app.run(port=5000, debug=True)
    # Change port and debug mode in production. not necessary since using gunicorn?
    # app.run(debug=False)
