"""
utils.py

General utilities for the CASTOR Flask API.

Isaac Cheng - 2022
"""

import logging
from traceback import format_exception

# from astropy.utils.misc import JsonCustomEncoder
from flask import Flask, Response, jsonify

# from flask.json import JSONEncoder
from flask_cors import CORS
# from flask_restful import Api

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")  # gunicorn
# app = Flask(__name__)  # python
# api = Api(app)
cors = CORS()

# --- Python ---
# app.logger.handlers.clear()  # prevent double-logging with Flask logger

# log_handler = logging.StreamHandler()  # log to stdout/stderr
# # log_handler = logging.FileHandler("etc_frontend.log")  # log to file

# # Add logger to Flask app
# log_formatter = logging.Formatter("%(asctime)s [%(name)-12s] %(levelname)-8s %(message)s")
# log_handler.setFormatter(log_formatter)
# log_handler.setLevel(logging.DEBUG)  # only logs application errors, not HTTP errors
# app.logger.addHandler(log_handler)

# # Use this logger for manual addition of log messages
# logger = logging.getLogger("werkzeug")  # when using `python connector.py`

# --- Gunicorn ---
logger = logging.getLogger("gunicorn.error")
app.logger.handlers = logger.handlers
app.logger.setLevel(logger.level)

# class MyCustomJsonEncoder(JSONEncoder):
#     """
#     Custom JSON encoder with support for astropy units.

#     See <https://stackoverflow.com/a/44158611>.
#     """

#     def default(self, obj):
#         return json.dumps(obj, cls=JsonCustomEncoder)


class DataHolder:
    """
    Class to store data between Flask requests. Idea from
    <https://stackoverflow.com/q/63195823>.

    Note that this approach is NOT safe for multiple or concurrent users. I am simply
    taking advantage of the fact that all sessions will be run inside individual Docker
    containers with a maximum limit of 1 container per person.

    For multi-user support, something along the lines of redis + cookie-based session
    storage would be required.
    """

    # Class variables
    # Set/unset them via DataHolder.<class_variable> = ...
    TelescopeObj = None
    BackgroundObj = None
    SourceObj = None
    PhotometryObj = None


def bad_request(message):
    """
    Return a 400 error with the given message as JSON.
    """
    response = jsonify({"error": message})
    response.status_code = 400
    return response


def server_error(message):
    """
    Return a 500 error with the given message as JSON.
    """
    response = jsonify({"error": message})
    response.status_code = 500
    return response


def bad_route(path):
    """
    Return a 404 error with the given path contained in the HTML.
    """
    response = f"""
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
    <title>404 Not Found</title>
    <h1>Not Found</h1>
    <p>The requested URL (path=/{path}) was not found on the server.
    If you entered the URL manually please check your spelling and try again.</p>
    """
    return Response(response, status=404, mimetype="text/html")


def log_traceback(e):
    lines = format_exception(type(e), e, e.__traceback__)
    traceback = "".join(lines)
    logger.error(traceback)
