"""
telescope_route.py

Wrapper for the Flask API interfacing with the castor_etc Telescope class.

Isaac Cheng - 2022
"""

import re

import astropy.units as u
from castor_etc.photometry import Photometry
from castor_etc.sources import PointSource
from flask import jsonify, request

from utils import DataHolder, app, bad_request, server_error, logger, log_traceback

import pandas as pd
import numpy as np


@app.route("/photometry", methods=["PUT"])
def put_photometry_json():
    """
    Create a `Photometry` object from the JSON request

    ...

    TODO: docstring

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
      PhotometryObj :: `Photometry` object
        The `Photometry` object created from the given kwargs.

    Returns
    -------
      telescope_json :: Flask JSON response
        Some attributes (i.e., passband_limits, mirror_diameter, phot_zpts,
        passband_pivots, fwhm, px_scale, dark_current, read_noise, redleak_thresholds) of
        the `Photometry` object as a JSON response.
    """
    try:
        #
        # Check inputs
        #
        try:
            # Convert all inputs to floats
            request_data = request.get_json()
            logger.info("Photometry request_data: " + str(request_data))
            reddening = float(request_data["reddening"])
            logger.debug("reddening: " + str(reddening))
            aper_shape = request_data["aperShape"].lower()
            logger.debug("aper_shape: " + str(aper_shape))
            aper_params_input = request_data["aperParams"]  # dict of dicts
            logger.debug("aper_params_input: " + str(aper_params_input))
            phot_input = request_data["photInput"]  # dict
            logger.debug("phot_input: " + str(phot_input))
            #
            aper_params = dict.fromkeys(aper_params_input[aper_shape])
            for key, val in aper_params_input[aper_shape].items():
                try:
                    print("key", key, "val", val)
                    parsed_val = float(val)
                    if key != "rotation" and key != "factor":
                        parsed_val *= u.arcsec
                except Exception:
                    # Extract numbers from string (for center)
                    parsed_val = [
                        float(num) for num in re.findall(r"-?\d+\.?\d*", val)
                    ] * u.arcsec
                aper_params[key] = parsed_val
            logger.debug("aper_params: " + str(aper_params))

        except Exception as e:
            log_traceback(e)
            logger.error(
                "Inputs to initialize the `Photometry` object "
                + "do not match required inputs."
            )
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
        except Exception as e:
            log_traceback(e)
            logger.error(
                "Server could not initialize the `Photometry` object from server-side "
                + "stored data. Probably missing `Telescope`, `Source`, "
                + "and/or `Background` object"
            )
            return server_error(
                "Server could not initialize the `Photometry` object from server-side "
                + "stored data. Probably missing `Telescope`, `Source`, "
                + "and/or `Background` object"
            )
        #
        # Specify aperture
        #
        if aper_shape == "optimal":
            if not isinstance(DataHolder.SourceObj, PointSource):
                logger.error(
                    "`Source` object is not a `PointSource` object and "
                    + "cannot use an optimal aperture."
                )
                return bad_request(
                    "`Source` object is not a `PointSource` object and "
                    + "cannot use an optimal aperture."
                )
            PhotometryObj.use_optimal_aperture(**aper_params)
        elif aper_shape == "elliptical":
            PhotometryObj.use_elliptical_aperture(**aper_params)
        elif aper_shape == "rectangular":
            PhotometryObj.use_rectangular_aperture(**aper_params)
        else:
            logger.error(f"{aper_shape} is not a valid aperture shape.")
            return bad_request(f"{aper_shape} is not a valid aperture shape.")
        #
        # Do photometry
        #
        if phot_input["val_type"] == "snr":
            phot_results = PhotometryObj.calc_snr_or_t(
                snr=float(phot_input["val"]), reddening=reddening
            )
        elif phot_input["val_type"] == "t":
            phot_results = PhotometryObj.calc_snr_or_t(
                t=float(phot_input["val"]), reddening=reddening
            )
        else:
            logger.error(
                f"The given photometry target value type, {phot_input['val_type']}, "
                + "is not valid and must be either 'snr' or 't'."
            )
            return bad_request(
                f"The given photometry target value type, {phot_input['val_type']}, "
                + "is not valid and must be either 'snr' or 't'."
            )
        #
        # Calculate redleak fractions
        #
        redleak_fracs = PhotometryObj.calc_redleak_frac()
        DataHolder.PhotometryObj = PhotometryObj
        #
        # Get encircled energy.
        # Note that `None` will be set to `null` in the JSON response.
        #
        encircled_energy = PhotometryObj._encircled_energy  # `None` if not PointSource
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
            encircledEnergy=encircled_energy,
            redleakFracs=redleak_fracs,
            aperMask=aper_mask,
            sourceWeights=source_weights,
            aperExtent=PhotometryObj._aper_extent,  # already a list
        )
    except Exception as e:
        log_traceback(e)
        logger.error(
            "There was a problem initializing the `Photometry` object and "
            + "returning some of its attributes in a JSON format."
        )
        return server_error(
            "There was a problem initializing the `Photometry` object and "
            + "returning some of its attributes in a JSON format."
        )
