"""
telescope_route.py

Wrapper for the Flask API interfacing with the castor_etc Telescope class.

Isaac Cheng - 2022
"""

import astropy.units as u
from castor_etc.telescope import Telescope
from flask import jsonify, request

from utils import DataHolder, app, logger, log_traceback, bad_request, server_error


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
    #
    # Convert all inputs to floats
    #
    try:
        try:
            request_data = request.get_json()
            logger.info("Telescope request_data: " + str(request_data))
            fwhm = float(request_data["fwhm"])
            logger.debug("fwhm: " + str(fwhm))
            px_scale = float(request_data["pxScale"])
            logger.debug("px_scale: " + str(px_scale))
            mirror_diameter = float(request_data["mirrorDiameter"])
            logger.debug("mirror_diameter: " + str(mirror_diameter))
            dark_current = float(request_data["darkCurrent"])
            logger.debug("dark_current: " + str(dark_current))
            read_noise = float(request_data["readNoise"])
            logger.debug("read_noise: " + str(read_noise))
            redleak_thresholds = request_data["redleakThresholds"]
            extinction_coeffs = request_data["extinctionCoeffs"]
            for band in redleak_thresholds:
                redleak_thresholds[band] = float(redleak_thresholds[band])
            logger.debug("redleak_thresholds: " + str(redleak_thresholds))
            for band in extinction_coeffs:
                extinction_coeffs[band] = float(extinction_coeffs[band])
            logger.debug("extinction_coeffs: " + str(extinction_coeffs))
        except Exception as e:
            log_traceback(e)
            logger.error(
                "Inputs to initialize the `Telescope` object "
                + "do not match required inputs."
            )
            return bad_request(
                "Inputs to initialize the `Telescope` object "
                + "do not match required inputs."
            )
        #
        # Create and store `Telescope` object
        #
        TelescopeObj = Telescope(
            fwhm=fwhm * u.arcsec,
            px_scale=px_scale * u.arcsec,
            mirror_diameter=mirror_diameter * u.cm,
            dark_current=dark_current,
            read_noise=read_noise,
            redleak_thresholds={
                # Convert float to `astropy.Quantity`
                key: val * u.AA
                for key, val in redleak_thresholds.items()
            },
            extinction_coeffs=extinction_coeffs,
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
            extinctionCoeffs={
                # Should already be a Python int/float
                key: val
                for key, val in TelescopeObj.extinction_coeffs.items()
            },
        )
    except Exception as e:
        log_traceback(e)
        logger.error(
            "There was a problem initializing the `Telescope` object and "
            + "returning some of its attributes in a JSON format."
        )
        return server_error(
            "There was a problem initializing the `Telescope` object and "
            + "returning some of its attributes in a JSON format."
        )
