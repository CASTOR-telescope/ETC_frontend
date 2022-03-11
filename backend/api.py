"""
api.py

Flask RESTful API for interfacing with the frontend GUI.

Isaac Cheng - 2022

Helpful links:
- What is an endpoint in Flask (incl. `url_for()`): <https://stackoverflow.com/a/19262349>
- How to get different parts of a URL: <https://stackoverflow.com/a/15975041>
"""
import re
from flask import Flask, request, jsonify, url_for, abort
from flask_restful import Resource, Api
import plotly.express as px


app = Flask(__name__)
api = Api(app)


# @app.route("/", methods=["GET"])
# def test():
#     return {"userID": 1, "title": "Flask React Application", "completed": False}
#     # return {"path": request.path}


class ApiDir(Resource):
    def get(self):
        """
        Get the URL of the session. Helpful link: <https://stackoverflow.com/a/15975041>.

        Returns
        -------
          script_root :: str
            The path of the current session. For example, if the requested URL is
            `https://ws-uv.canfar.net/castor/<sessionID>/foo/page.html`, then script_root
            is `/castor/<sessionID>`.
        """
        # return jsonify(path=app.instance_path)
        # return jsonify(path=request.script_root)
        return jsonify(path=request.base_url)


# N.B. only use GET requests for default path
# See <https://flask.palletsprojects.com/en/2.0.x/api/#url-route-registrations>
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
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
    if re.search(r"\bfoo\b", path) is not None:  # match whole word
        # Do something
        print()
        return jsonify(message=f"In 1st redirect(), path=/{path}")
    elif re.search(r"\bbar\b", path) is not None:
        # Do something
        return jsonify(message=f"In 2nd redirect(), path=/{path}")
    elif re.search(r"\bapi\b", path) is not None:
        return ApiDir().get()
    else:
        print(f"Page not found for path=/{path}")
        abort(404)


api.add_resource(ApiDir, "/api", endpoint="script_dir")

if __name__ == "__main__":
    app.run(debug=True)
