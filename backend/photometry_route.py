"""
telescope_route.py

Wrapper for the Flask API interfacing with the castor_etc Telescope class.

Isaac Cheng - 2022
"""

import re

import astropy.units as u
from castor_etc.photometry import Photometry
from flask import jsonify, request

from utils import DataHolder, app, bad_request, server_error

import pandas as pd
import numpy as np


@app.route("/photometry", methods=["PUT"])
def put_photometry_json():
    """
    Create a `Photometry` object from the JSON request

    ...

    and return some attributes of the
    object (i.e., TelescopeObj.full_passband_curves, mirror_diameter, phot_zpts,
    passband_pivots, fwhm, px_scale, dark_current, read_noise, redleak_thresholds) of the
    `Telescope` object as a JSON response.

    OLD description: Create a `Telescope` object with the given kwargs and return the
    object as a dictionary. Note that the returned dictionary contains elements (i.e.,
    `astropy.Quantity` objects) that are not JSON serializable by the default encoder. See
    `./utils.py` for a custom JSON encoder that can handle these elements.

    Attributes (for `DataHolder` class)
    ----------
      TelescopeObj :: `Telescope` object
        The `Telescope` object created from the given kwargs.

    Returns
    -------
      telescope_json :: Flask JSON response
        Some attributes (i.e., passband_limits, mirror_diameter, phot_zpts,
        passband_pivots, fwhm, px_scale, dark_current, read_noise, redleak_thresholds) of
        the `Telescope` object as a JSON response.
    """
    # TODO: redleak fraction

    # Flask will raise exception 500 if any code raises an error
    print("request_data:", request.get_json())
    try:
        #
        # Check inputs
        #
        try:
            # Convert all inputs to floats
            request_data = request.get_json()
            extinction_coeffs = {
                band: float(coeff)
                for band, coeff in request_data["extinctionCoeffs"].items()
            }
            aper_shape = request_data["aperShape"].lower()
            aper_params_input = request_data["aperParams"]  # dict of dicts
            phot_input = request_data["photInput"]  # dict
            #
            aper_params = dict.fromkeys(aper_params_input[aper_shape])
            for key, val in aper_params_input[aper_shape].items():
                try:
                    parsed_val = float(val)
                    if key != "rotation":
                        parsed_val *= u.arcsec
                except Exception:
                    # Extract numbers from string (for center)
                    parsed_val = [
                        float(num) for num in re.findall(r"-?\d+\.?\d*", val)
                    ] << u.arcsec
                aper_params[key] = parsed_val
        except Exception:
            return bad_request(
                "Inputs to initialize the `Photometry` object "
                + "do not match required inputs."
            )
        #
        # Create the `Photometry` object
        #
        try:
            PhotometryObj = Photometry(
                DataHolder.TelescopeObj, DataHolder.SourceObj, DataHolder.BackgroundObj
            )
        except Exception:
            return server_error(
                "Server could not initialize the `Photometry` object "
                + "from server-side stored data"
            )
        #
        # TODO: validation of all request data
        #
        # For now, just return the attributes I know I will have set
        PhotometryObj.use_elliptical_aperture(**aper_params)
        if phot_input["val_type"] == "snr":
            phot_results = PhotometryObj.calc_snr_or_t(
                snr=float(phot_input["val"]), extinction=extinction_coeffs
            )
        elif phot_input["val_type"] == "t":
            phot_results = PhotometryObj.calc_snr_or_t(
                t=float(phot_input["val"]), extinction=extinction_coeffs
            )
        else:
            return bad_request("Couldn't read `photInput`")
        DataHolder.PhotometryObj = PhotometryObj
        #
        # Convert 2D arrays to JSON, replace NaN with null, and only want the data array
        #
        aper_mask = pd.DataFrame(PhotometryObj._aper_mask).to_json(orient="values")
        source_weights = pd.DataFrame(PhotometryObj.source_weights).to_json(
            orient="values"
        )
        # Only return the attributes that we want to show on the frontend
        return jsonify(
            photResults=phot_results,
            effNpix=PhotometryObj._eff_npix,
            # aperMask=PhotometryObj._aper_mask.tolist(),
            # sourceWeights=PhotometryObj.source_weights.tolist(),
            aperMask=aper_mask,
            sourceWeights=source_weights,
            aperExtent=PhotometryObj._aper_extent,  # already a list
        )
    except Exception:
        return bad_request(
            "There was a problem initializing the `Photometry` object and "
            + "returning some of its attributes in a JSON format."
        )


# if __name__ == "__main__":
#     #     import json
#     #     import jsonpickle
#     #     import sys
#     mydict = put_telescope_json(
#         dark_current=1,
#         fwhm=1 << u.arcsec,
#         # px_scale=1,
#         px_scale=1 << u.arcsec,
#         read_noise=1,
#         redleak_thresholds={"uv": 1 << u.AA, "u": 1 << u.AA, "g": 1 << u.AA},
#     )
#     # print(sys.getsizeof(mydict))
#     # print(jsonpickle.decode(mydict).redleak_thresholds)
#     # print(blah)
#     # myjson = json.dumps(mydict, cls=JsonCustomEncoder)
#     # print(json.loads(myjson)["redleak_thresholds"]["uv"])
#     # print(sys.getsizeof(myjson))
#     # print(pickle.load(mydict.stream))

# # {
# #     "darkCurrent": 1,
# #     "fwhm": 2,
# #     "pxScale": 3,
# #     "readNoise": 4,
# #     "redleakThresholds": {"uv": 5, "u": 6, "g": 7}
# }
