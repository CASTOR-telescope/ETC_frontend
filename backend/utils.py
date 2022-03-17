"""
utils.py

General utilities for the CASTOR Flask API.

Isaac Cheng - 2022
"""

# import json

# from astropy.utils.misc import JsonCustomEncoder
from flask import Flask, jsonify, Response

# from flask.json import JSONEncoder
from flask_cors import CORS
from flask_restful import Api

app = Flask(__name__)
api = Api(app)
cors = CORS()


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
