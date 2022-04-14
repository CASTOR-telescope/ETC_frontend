"""
source_route.py

Wrapper for the Flask API interfacing with the castor_etc Source class.

Isaac Cheng - 2022
"""

import astropy.units as u
from castor_etc.sources import PointSource, ExtendedSource, Profiles
from flask import jsonify, request

from utils import app, DataHolder, bad_request


@app.route("/source", methods=["PUT"])
def put_source_json():
    """
    TODO: docstring

    Create a `Source` object from the JSON request and return some attributes of the
    object (i.e., wavelengths, spectrum, source_mags) of the `Source` object as a JSON
    response.

    Attributes (for `DataHolder` class)
    ----------
      SourceObj :: `Background` object
        The `Source` object created from the request parameters.

    Returns
    -------
      source_json :: Flask JSON response
        Some attributes (i.e., wavelengths, spectrum, source_mags) of the `Source` object
        as a JSON response.
    """
    # Flask will raise exception 500 if any code raises an error
    print("request_data:", request.get_json())
    try:
        #
        # Check inputs
        #
        try:
            # TODO: deal with lots of these parameters later!
            request_data = request.get_json()
            source_type = request_data["sourceType"].lower()
            redshift = float(request_data["redshift"])
            predefined_spectrum = request_data["predefinedSpectrum"].lower()
            custom_spectrum = request_data["customSpectrum"].lower()
            spectral_lines = request_data["spectralLines"]  # list of dicts
            physical_parameters = request_data["physicalParameters"]  # dict of dicts
            norm_method = request_data["normMethod"]  # string
            norm_params = request_data["normParams"]  # dict of dicts
            is_norm_after_spectral_lines = request_data[
                "isNormAfterSpectralLines"
            ]  # bool
            #
            physical_parameters = {
                param: float(value)
                for param, value in physical_parameters[source_type].items()
            }
            norm_params = {
                param: float(value) for param, value in norm_params[norm_method].items()
            }
        except Exception:
            return bad_request(
                "Inputs to initialize the `Source` object do not match required inputs."
            )
        #
        # Create the `Source` object
        #
        if source_type == "galaxy":
            Profile = Profiles.sersic(
                r_eff=physical_parameters["rEff"] * u.arcsec,
                n=physical_parameters["sersic"],
                e=physical_parameters["e"],
                angle=physical_parameters["angle"],
            )
            SourceObj = ExtendedSource(
                Profile,
                angle_a=physical_parameters["angleA"] * u.arcsec,
                angle_b=physical_parameters["angleB"] * u.arcsec,
            )
        else:
            raise ValueError("Other types not supported yet!")
        #
        # Make spectrum
        # TODO: add input checks
        #
        if predefined_spectrum == "elliptical" or predefined_spectrum == "spiral":
            SourceObj.use_galaxy_spectrum(gal_type=predefined_spectrum)
        else:
            raise ValueError("Not supported yet!")
        SourceObj.redshift_wavelengths(redshift)
        #
        # TODO: add spectral lines
        #
        #
        # Normalize spectrum (if is_norm_after_spectral_lines, normalize before...)
        #
        if norm_method.lower() == "luminositydist":
            SourceObj.norm_luminosity_dist(
                luminosity=norm_params["luminosity"],  # solar luminosities
                dist=norm_params["dist"] * u.kpc,
            )
        else:
            raise ValueError("Not supported yet!")
        #
        # Get source magnitude in each passband
        #
        # FIXME: remove get_avg_value() since it is incorrect!
        source_mags = SourceObj.get_avg_value(
            value_type="mag", TelescopeObj=DataHolder.TelescopeObj
        )
        #
        # Store `Source` object
        #
        DataHolder.SourceObj = SourceObj
        #
        #
        # Only return the attributes that we want to show on the frontend
        return jsonify(
            wavelengths=list(SourceObj.wavelengths.to(u.AA).value),  # x-values
            spectrum=list(SourceObj.spectrum),  # y-values
            sourceMags=source_mags,  # dict of floats
        )
    except Exception:
        return bad_request(
            "There was a problem initializing the `Source` object and "
            + "returning some of its attributes in a JSON format."
        )
