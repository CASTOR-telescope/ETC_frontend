"""
background_route.py

Wrapper for the Flask API interfacing with the castor_etc Background class.

Isaac Cheng - 2022
"""

import astropy.units as u
from castor_etc.background import Background
from flask import jsonify, request

from utils import DataHolder, app, bad_request, log_traceback, logger, server_error


@app.route("/background", methods=["PUT"])
def put_background_json():
    """
    Create a `Background` object from the JSON request and return some attributes of the
    object (i.e., mags_per_sq_arcsec, geo_flux, geo_wavelength, geo_linewidth) of the
    `Background` object as a JSON response.

    Attributes (for `DataHolder` class)
    ----------
      BackgroundObj :: `Background` object
        The `Background` object created from the request parameters.

    Returns
    -------
      background_json :: Flask JSON response
        Some attributes (i.e., mags_per_sq_arcsec, geo_flux, geo_wavelength,
        geo_linewidth) of the `Background` object as a JSON response.
    """
    # Flask will raise exception 500 if any code raises an error
    try:
        #
        # Check inputs
        #
        try:
            # Convert inputs to required types except geo_emission_params (for efficiency)
            request_data = request.get_json()
            logger.info("Background request_data: " + str(request_data))
            #
            use_default_sky_background = request_data["useDefaultSkyBackground"]
            if use_default_sky_background.lower() == "true":
                use_default_sky_background = True
            elif use_default_sky_background.lower() == "false":
                use_default_sky_background = False
            else:
                logger.error("useDefaultSkyBackground must be either 'true' or 'false'")
                return bad_request(
                    "useDefaultSkyBackground must be either 'true' or 'false'"
                )
            logger.debug("use_default_sky_background: " + str(use_default_sky_background))
            #
            custom_sky_background = request_data["customSkyBackground"]  # dict
            logger.debug("custom_sky_background: " + str(custom_sky_background))
            geo_emission_params = request_data["geocoronalEmission"]  # list of dicts
            logger.debug("geo_emission_params: " + str(geo_emission_params))
            #
            if not use_default_sky_background:
                mags_per_sq_arcsec = {
                    band: float(custom_sky_background[band])
                    for band in custom_sky_background
                }
            else:
                mags_per_sq_arcsec = None
            logger.debug("inputted mags_per_sq_arcsec: " + str(mags_per_sq_arcsec))
            #
        except Exception as e:
            log_traceback(e)
            logger.error(
                "Inputs to initialize the `Background` object "
                + "do not match required inputs."
            )
            return bad_request(
                "Inputs to initialize the `Background` object "
                + "do not match required inputs."
            )
        #
        # Create and store `Background` object
        #
        BackgroundObj = Background(mags_per_sq_arcsec=mags_per_sq_arcsec)
        if (
            use_default_sky_background and DataHolder.TelescopeObj is not None
        ):  # will always have a TelescopeObj now
            mags_per_sq_arcsec = BackgroundObj.calc_mags_per_sq_arcsec(
                DataHolder.TelescopeObj
            )
        if geo_emission_params:  # non-empty list
            for item in geo_emission_params:  # item is a dictionary
                logger.debug("Adding geo_emission_params: " + str(item))
                flux = item["flux"].lower()
                try:
                    if (flux == "high") or (flux == "low"):
                        flux = flux
                    elif flux == "average":
                        flux = "avg"
                    else:
                        flux = float(flux)  # user inputted custom flux
                    wavelength = float(item["wavelength"]) * u.AA
                    linewidth = float(item["linewidth"]) * u.AA
                except Exception as e:
                    log_traceback(e)
                    logger.error(
                        "At least 1 geocoronal emission parameter in "
                        + str(item)
                        + " is not valid."
                    )
                    return bad_request(
                        "At least 1 geocoronal emission parameter in "
                        + str(item)
                        + " is not valid."
                    )
                BackgroundObj.add_geocoronal_emission(
                    flux=flux, wavelength=wavelength, linewidth=linewidth
                )
        logger.debug(
            "calculated mags_per_sq_arcsec (excl. geocoronal emission): "
            + str(mags_per_sq_arcsec)
        )
        DataHolder.BackgroundObj = BackgroundObj
        # if mags_per_sq_arcsec is None:
        #     # No user-inputted sky background & no telescope defined yet (won't happen since I disabled tabs)
        #     mags_per_sq_arcsec = {
        #         "uv": "Please set telescope parameters then re-save the background parameters to see this value",
        #         "u": "Please set telescope parameters then re-save the background parameters to see this value",
        #         "g": "Please set telescope parameters then re-save the background parameters to see this value",
        #     }
        # Only return the attributes that we want to show on the frontend
        return jsonify(
            magsPerSqArcsec=mags_per_sq_arcsec,  # dict of floats
            geoFlux=BackgroundObj.geo_flux,  # already floats (erg/s/cm^2/arcsec^2)
            geoWavelength=BackgroundObj.geo_wavelength,  # already floats (angstrom)
            geoLinewidth=BackgroundObj.geo_linewidth,  # already floats (angstrom)
        )
    except Exception as e:
        log_traceback(e)
        logger.error(
            "There was a problem initializing the `Background` object and "
            + "returning some of its attributes in a JSON format."
        )
        return server_error(
            "There was a problem initializing the `Background` object and "
            + "returning some of its attributes in a JSON format."
        )
