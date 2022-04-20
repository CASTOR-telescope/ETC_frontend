"""
utils.py

General utilities for the CASTOR Flask API.

Isaac Cheng - 2022
"""
import os
import logging
from traceback import format_exception

# from astropy.utils.misc import JsonCustomEncoder
from flask import Flask, Response, jsonify
from werkzeug.utils import secure_filename

# from flask.json import JSONEncoder
from flask_cors import CORS

# from flask_restful import Api

# TODO: check that the static url path works with CANFAR!

session_id = os.getenv("session_id")

if session_id is None:
    # --- Python ---
    app = Flask(__name__)  # python
    # api = Api(app)
    cors = CORS()
    #
    # Configure logger
    #
    app.logger.handlers.clear()  # prevent double-logging with Flask logger
    log_handler = logging.StreamHandler()  # log to stdout/stderr
    # log_handler = logging.FileHandler("etc_frontend.log")  # log to file
    # Add logger to Flask app (only logs application errors, not HTTP errors)
    log_formatter = logging.Formatter(
        "%(asctime)s [%(name)-12s] %(levelname)-8s %(message)s"
    )
    log_handler.setFormatter(log_formatter)
    log_handler.setLevel(logging.DEBUG)
    app.logger.addHandler(log_handler)
    # Use this logger for manual addition of log messages
    logger = logging.getLogger("werkzeug")
    logger.setLevel(logging.DEBUG)
    # logger.setFormatter(log_formatter)  # this line doesn't work for some reason...
else:
    # --- Gunicorn ---
    app = Flask(
        __name__,
        # static_folder="../frontend/build",
        static_folder="/backend/client",
        static_url_path="/session/castor-etc/" + os.getenv("session_id") + "/",
    )  # gunicorn on CANFAR
    # app = Flask(
    #     __name__, static_folder="../frontend/build", static_url_path="/"
    # )  # gunicorn
    # api = Api(app)
    cors = CORS()
    # Add logger to Flask app (only logs application errors, not HTTP errors)
    logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = logger.handlers
    app.logger.setLevel(logger.level)

#
# Configure file uploads
#
# https://flask.palletsprojects.com/en/2.1.x/patterns/fileuploads/
ALLOWED_EXTENSIONS = {"fits", "fit", "txt", "dat"}
app.config["UPLOAD_FOLDER"] = "./flask_uploads"


def save_file(file):
    """
    If the file has an allowed file extension, save the file to the configured upload
    folder using a secure filename.

    Returns
    -------
      secure_filepath : str or None
        The path to the (safely-named) saved file. If None, the file was not saved.
    """
    bad_filename = file.filename
    if (
        "." in bad_filename
        and bad_filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    ):
        good_filename = secure_filename(bad_filename)
        secure_filepath = os.path.join(app.config["UPLOAD_FOLDER"], good_filename)
        file.save(secure_filepath)
        logger.info(f"Saved file {bad_filename} to {secure_filepath}")
        return secure_filepath
    else:
        logger.error("Bad filename!")
        return None


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
