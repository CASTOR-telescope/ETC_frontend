"""
connector.py

Flask REST API for interfacing with the frontend GUI.

Isaac Cheng - 2022

Helpful links:
- What is an endpoint in Flask (incl. `url_for()`): <https://stackoverflow.com/a/19262349>
- How to get different parts of a URL: <https://stackoverflow.com/a/15975041>
"""
import re
import os

import astropy.units as u
import numpy as np
from castor_etc.background import Background
from castor_etc.photometry import Photometry
from castor_etc.sources import ExtendedSource, PointSource, Profiles
from castor_etc.telescope import Telescope
from flask import Flask, abort, jsonify, request, flash, url_for, session, send_file
from flask_restful import Resource
from flask_cors import CORS

from utils import app, api, cors, DataHolder, bad_request, bad_route
from telescope_route import put_telescope_json
from background_route import put_background_json
from source_route import put_source_json
from photometry_route import put_photometry_json

# from utils import MyCustomJsonEncoder

# app = Flask(__name__)
# api = Api(app)
# cors = CORS()
# app.json_encoder = MyCustomJsonEncoder


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

    print(app.url_map)
    print(f"Parsing request for /{path}")

    if re.search(r"\btelescope\b", path) is not None:  # match whole word
        print("Redirecting request to /telescope")
        if request.method != "PUT":
            abort(405)
        return put_telescope_json()

    if re.search(r"\bbackground\b", path) is not None:  # match whole word
        print("Redirecting request to /background")
        if request.method != "PUT":
            abort(405)
        return put_background_json()

    if re.search(r"\bsource\b", path) is not None:  # match whole word
        print("Redirecting request to /source")
        if request.method != "PUT":
            abort(405)
        return put_source_json()

    elif re.search(r"\bphotometry\b", path) is not None:  # match whole word
        print(request.method)
        if request.method != "PUT":
            abort(405)

        return put_photometry_json()

        # MyTelescope = Telescope()
        # #
        # MyBackground = Background()
        # MyBackground.add_geocoronal_emission(flux="high")
        # MyBackground.calc_mags_per_sq_arcsec(MyTelescope)
        # #
        # flux_profile = Profiles.uniform()
        # MySource = PointSource(flux_profile, angle=0.1 * u.arcsec)
        # MySource.generate_bb(5500 * u.K)  # (in erg/s/cm^2/A)
        # MySource.add_emission_line(
        #     center=3000 * u.AA,
        #     fwhm=200 * u.AA,
        #     peak=2e-15,
        #     shape="gaussian",
        #     abs_peak=False,
        # )
        # MySource.add_absorption_line(
        #     center=5005 * u.AA,
        #     fwhm=50 * u.AA,
        #     dip=2e-15,
        #     shape="lorentzian",
        #     abs_dip=True,
        # )
        # MySource.norm_to_value(
        #     28,
        #     "mag",
        #     passband_lims=MyTelescope.passband_limits["uv"],
        #     pivot_wavelength=MyTelescope.passband_pivots["uv"],
        # )
        # print(
        #     "\nSource AB mags",
        #     MySource.get_avg_value(value_type="mag", TelescopeObj=MyTelescope),
        # )
        # print()
        # MyPhot = Photometry(MyTelescope, MySource, MyBackground)
        # MyPhot.use_optimal_aperture(quiet=True)
        # result = MyPhot.calc_snr_or_t(snr=5, include_redleak=False)
        # return result

    elif re.search(r"\bbar\b", path) is not None:
        # Do something
        print(DataHolder.TelescopeObj)
        print(DataHolder.TelescopeObj.fwhm)
        return jsonify(message=f"In 2nd redirect(), path=/{path}")
    elif re.search(r"\bapi\b", path) is not None:
        return ApiDir().get()
    else:
        # print(f"Page not found for path=/{path}")
        # abort(404)
        return bad_route(path)


api.add_resource(ApiDir, "/api", endpoint="script_dir")

if __name__ == "__main__":
    cors.init_app(app)
    # jsglue.init_app(app)
    # For development, port=5000 and debug=True
    app.run(port=5000, debug=True)
    # Change port and debug mode in production
    # app.run()
