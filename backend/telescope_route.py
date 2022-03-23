"""
telescope_route.py

Wrapper for the Flask API interfacing with the castor_etc Telescope class.

Isaac Cheng - 2022
"""

import astropy.units as u
from castor_etc.telescope import Telescope
from flask import jsonify, request

from utils import app, DataHolder, bad_request


@app.route("/telescope", methods=["PUT"])
def put_telescope_json():
    """
    Create a `Telescope` object from the JSON request and return some attributes of the
    object (i.e., passband_limits, mirror_diameter, phot_zpts, passband_pivots, fwhm,
    px_scale, dark_current, read_noise, redleak_thresholds) of the `Telescope` object as a
    JSON response.

    OLD description: Create a `Telescope` object with the given kwargs and return the
    object as a dictionary. Note that the returned dictionary contains elements (i.e.,
    `astropy.Quantity` objects) that are not JSON serializable by the default encoder. See
    `./utils.py` for a custom JSON encoder that can handle these elements.

    Attributes (for `DataHolder` class)
    ----------
      TelescopeObj :: `Telescope` object
        The `Telescope` object created from the request parameters.

    Returns
    -------
      telescope_json :: Flask JSON response
        Some attributes (i.e., passband_limits, mirror_diameter, phot_zpts,
        passband_pivots, fwhm, px_scale, dark_current, read_noise, redleak_thresholds) of
        the `Telescope` object as a JSON response.
    """
    # Flask will raise exception 500 if any code raises an error
    print("request_data:", request.get_json())
    try:
        #
        # Check inputs
        #
        try:
            # Convert all inputs to floats
            request_data = request.get_json()
            fwhm = float(request_data["fwhm"])
            px_scale = float(request_data["pxScale"])
            mirror_diameter = float(request_data["mirrorDiameter"])
            dark_current = float(request_data["darkCurrent"])
            read_noise = float(request_data["readNoise"])
            redleak_thresholds = request_data["redleakThresholds"]
            for band in redleak_thresholds:
                redleak_thresholds[band] = float(redleak_thresholds[band])
        except Exception:
            return bad_request(
                "Inputs to initialize the `Telescope` object "
                + "do not match required inputs."
            )
        #
        # Create and store `Telescope` object
        #
        TelescopeObj = Telescope(
            fwhm=fwhm << u.arcsec,
            px_scale=px_scale << u.arcsec,
            mirror_diameter=mirror_diameter << u.cm,
            dark_current=dark_current,
            read_noise=read_noise,
            redleak_thresholds={
                # Convert float to `astropy.Quantity`
                key: val << u.AA
                for key, val in redleak_thresholds.items()
            },
        )
        DataHolder.TelescopeObj = TelescopeObj
        # Only return the attributes that we want to show on the frontend
        return jsonify(
            passbandLimits={
                # Convert numpy arrays to list of floats
                key: val.to(u.AA).value.tolist()
                for key, val in TelescopeObj.passband_limits.items()
            },
            # Full passband curves is around 123 kB (estimated using `sys.getsizeof()`)
            fullPassbandCurves={
                band: {
                    "wavelength": curve["wavelength"].to(u.AA).value.tolist(),
                    "response": curve["response"].tolist(),
                }
                for band, curve in TelescopeObj.full_passband_curves.items()
            },
            mirrorDiameter=float(TelescopeObj.mirror_diameter.to(u.cm).value),
            photZpts={
                # Convert numpy float to Python float
                key: float(val)
                for key, val in TelescopeObj.phot_zpts.items()
            },
            passbandPivots={
                # Convert `astropy.Quantity` to float
                key: float(val.to(u.AA).value)
                for key, val in TelescopeObj.passband_pivots.items()
            },
            fwhm=float(TelescopeObj.fwhm.to(u.arcsec).value),
            pxScale=float(TelescopeObj.px_scale.to(u.arcsec).value),
            darkCurrent=float(TelescopeObj.dark_current),
            readNoise=float(TelescopeObj.read_noise),
            redleakThresholds={
                # Convert `astropy.Quantity` to float
                key: float(val.to(u.AA).value)
                for key, val in TelescopeObj.redleak_thresholds.items()
            },
        )
    except Exception:
        return bad_request(
            "There was a problem initializing the `Telescope` object and "
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
