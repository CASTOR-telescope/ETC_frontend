"""
source_route.py

Wrapper for the Flask API interfacing with the castor_etc Source class.

Isaac Cheng - 2022
"""

import json

import astropy.units as u
import numpy as np
from castor_etc.sources import ExtendedSource, GalaxySource, PointSource
from flask import jsonify, request

from utils import (
    DataHolder,
    app,
    bad_request,
    log_traceback,
    logger,
    server_error,
    save_file,
)


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
    try:
        #
        # Check inputs
        #
        try:
            logger.debug("request content_type" + request.content_type)
            request_form = request.form
            logger.info("\nSource request.form " + str(request_form) + "\n")
            request_data = request_form.to_dict()
            logger.info("\nSource request.form.to_dict() " + str(request_data) + "\n")

            source_type = request_data["sourceType"].strip("\"'").strip("'\"")
            logger.debug("source_type: " + str(source_type))

            redshift = float(
                request_data["redshift"].strip("\"'").strip("'\"")
            )  # remove excess quotes
            logger.debug("redshift: " + str(redshift))

            predefined_spectrum = (
                request_data["predefinedSpectrum"].strip("\"'").strip("'\"")
            )
            logger.debug("predefined_spectrum: " + str(predefined_spectrum))

            predefined_spectrum_parameters = json.loads(
                request_data["predefinedSpectrumParameters"]
            )  # dict of dicts
            logger.debug(
                "predefined_spectrum_parameters " + str(predefined_spectrum_parameters)
            )

            try:
                custom_spectrum = request_data["customSpectrum"]  # will be ""
                logger.debug(f"custom_spectrum == ''? {custom_spectrum == ''}")
            except KeyError:
                custom_spectrum = request.files["customSpectrum"]
                logger.debug("custom_spectrum file" + str(custom_spectrum))

            physical_parameters = json.loads(request_data["physicalParameters"])[
                source_type
            ]  # dict (originally dict of dicts)
            logger.debug("physical_parameters " + str(physical_parameters))

            spectral_lines = json.loads(request_data["spectralLines"])  # list of dicts
            logger.debug("spectral_lines " + str(spectral_lines))

            norm_method = request_data["normMethod"].strip("\"'").strip("'\"")  # string
            logger.debug("norm_method " + str(norm_method))

            norm_params = None
            if norm_method != "":
                norm_params = json.loads(request_data["normParams"])[
                    norm_method
                ]  # dict (originally dict of dicts)
            logger.debug("norm_params " + str(norm_params))

            is_norm_after_spectral_lines = json.loads(
                request_data["isNormAfterSpectralLines"]
            )  # bool
            logger.debug(
                "is_norm_after_spectral_lines " + str(is_norm_after_spectral_lines)
            )
        except Exception as e:
            log_traceback(e)
            logger.error(
                "Inputs to initialize the `Source` object "
                + "do not match required inputs."
            )
            return bad_request(
                "Inputs to initialize the `Source` object do not match required inputs."
            )
        #
        # Create the `Source` object
        #
        source_type = source_type.lower()
        #
        if source_type == "point":
            SourceObj = PointSource()
        elif source_type == "extended":
            if physical_parameters["profile"] == "uniform":
                SourceObj = ExtendedSource(
                    angle_a=float(physical_parameters["angleA"]) * u.arcsec,
                    angle_b=float(physical_parameters["angleB"]) * u.arcsec,
                    rotation=float(physical_parameters["rotation"]),
                    profile=physical_parameters["profile"],
                    exponential_scale_lengths=None,
                )
            elif physical_parameters["profile"] == "exponential":
                SourceObj = ExtendedSource(
                    angle_a=float(physical_parameters["angleA"]) * u.arcsec,
                    angle_b=float(physical_parameters["angleB"]) * u.arcsec,
                    rotation=float(physical_parameters["rotation"]),
                    profile=physical_parameters["profile"],
                    exponential_scale_lengths=[
                        float(physical_parameters["exponentialScaleLengthA"]),
                        float(physical_parameters["exponentialScaleLengthB"]),
                    ]
                    * u.arcsec,
                )
            else:
                logger.error(
                    f"{physical_parameters['profile']} is not a valid ExtendedSource profile"
                )
                return bad_request(
                    f"{physical_parameters['profile']} is not a valid ExtendedSource profile"
                )
        elif source_type == "galaxy":
            SourceObj = GalaxySource(
                r_eff=float(physical_parameters["rEff"]) * u.arcsec,
                n=float(physical_parameters["sersic"]),
                angle_a=float(physical_parameters["angleA"]) * u.arcsec,
                angle_b=float(physical_parameters["angleB"]) * u.arcsec,
                rotation=float(physical_parameters["rotation"]),
            )
        else:
            logger.error(f"{source_type} is not a valid Source class")
            return bad_request(f"{source_type} is not a valid Source class")
        #
        # Make spectrum
        #
        wavelengths = np.arange(1000.0, 12005.0, 10.0) * u.AA
        if custom_spectrum != "":
            # Save file here
            secure_filepath = save_file(custom_spectrum)
            if secure_filepath is None:
                logger.error("Could not save file!")
                return bad_request("Could not save file!")
            SourceObj.use_custom_spectrum(secure_filepath, wavelength_unit=u.AA)
            SourceObj.show_spectrum()
        elif predefined_spectrum == "blackbody":
            SourceObj.generate_bb(
                T=float(predefined_spectrum_parameters[predefined_spectrum]["temp"])
                * u.K,
                radius=float(
                    predefined_spectrum_parameters[predefined_spectrum]["radius"]
                ),
                dist=float(predefined_spectrum_parameters[predefined_spectrum]["dist"])
                * u.kpc,
            )
        elif predefined_spectrum == "powerLaw":
            SourceObj.generate_power_law(
                ref_wavelength=float(
                    predefined_spectrum_parameters[predefined_spectrum]["refWavelength"]
                )
                * u.AA,
                wavelengths=wavelengths,
                exponent=float(
                    predefined_spectrum_parameters[predefined_spectrum]["exponent"]
                ),
            )
        elif predefined_spectrum == "uniform":
            SourceObj.generate_uniform(
                wavelengths=wavelengths,
                value=float(
                    predefined_spectrum_parameters[predefined_spectrum]["spectrumValue"]
                ),
                unit=predefined_spectrum_parameters[predefined_spectrum]["unit"],
            )
        elif predefined_spectrum == "elliptical" or predefined_spectrum == "spiral":
            SourceObj.use_galaxy_spectrum(gal_type=predefined_spectrum)
        else:
            try:
                # Assume it is a pickles spectrum
                SourceObj.use_pickles_spectrum(spectral_class=predefined_spectrum)
            except Exception as e:
                log_traceback(e)
                logger.error(f"{predefined_spectrum} is not a valid spectrum")
                return bad_request(f"{predefined_spectrum} is not a valid spectrum")
        SourceObj.redshift_wavelengths(redshift)
        #
        # Potentially renormalize the spectrum before adding spectral lines
        #
        norm_method = norm_method.lower()
        if norm_method != "" and not is_norm_after_spectral_lines:
            logger.debug(f"Renormalizing spectrum before adding spectral lines")
            if norm_method == "passbandmag":
                SourceObj.norm_to_AB_mag(
                    ab_mag=float(norm_params["abMag"]),
                    passband=norm_params["passband"],
                    TelescopeObj=DataHolder.TelescopeObj,
                )
            elif norm_method == "totalmag":
                SourceObj.norm_to_AB_mag(
                    ab_mag=float(norm_params), passband=None, TelescopeObj=None
                )
            elif norm_method == "luminositydist":
                SourceObj.norm_luminosity_dist(
                    luminosity=float(norm_params["luminosity"]),  # solar luminosities
                    dist=float(norm_params["dist"]) * u.kpc,
                )
            else:
                logger.error(f"{norm_method} is not a valid renormalization")
                return bad_request(f"{norm_method} is not a valid renormalization")
        #
        # Add spectral lines
        #
        if spectral_lines:  # non-empty list of dicts
            logger.debug("Adding spectral lines")
            for line in spectral_lines:
                if line["type"] == "emission":
                    SourceObj.add_emission_line(
                        center=float(line["center"]) * u.AA,
                        fwhm=float(line["fwhm"]) * u.AA,
                        peak=float(line["peak"]),
                        shape=line["shape"],
                        abs_peak=False,
                    )
                elif line["type"] == "absorption":
                    SourceObj.add_absorption_line(
                        center=float(line["center"]) * u.AA,
                        fwhm=float(line["fwhm"]) * u.AA,
                        dip=float(line["peak"]),
                        shape=line["shape"],
                        abs_dip=False,
                    )
                else:
                    logger.error(f"{line['type']} is not a valid spectral line type")
                    return bad_request(
                        f"{line['type']} is not a valid spectral line type"
                    )
        #
        # Potentially renormalize the spectrum after adding spectral lines
        #
        if norm_method != "" and is_norm_after_spectral_lines:
            logger.debug(f"Renormalizing spectrum after adding spectral lines")
            if norm_method == "passbandmag":
                SourceObj.norm_to_AB_mag(
                    ab_mag=float(norm_params["abMag"]),
                    passband=norm_params["passband"],
                    TelescopeObj=DataHolder.TelescopeObj,
                )
            elif norm_method == "totalmag":
                SourceObj.norm_to_AB_mag(
                    ab_mag=float(norm_params), passband=None, TelescopeObj=None
                )
            elif norm_method == "luminositydist":
                SourceObj.norm_luminosity_dist(
                    luminosity=float(norm_params["luminosity"]),  # solar luminosities
                    dist=float(norm_params["dist"]) * u.kpc,
                )
            else:
                logger.error(f"{norm_method} is not a valid renormalization")
                return bad_request(f"{norm_method} is not a valid renormalization")
        #
        # Get source magnitude in each passband
        #
        source_mags = SourceObj.get_AB_mag(TelescopeObj=DataHolder.TelescopeObj)
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
    except Exception as e:
        log_traceback(e)
        logger.error(
            "There was a problem initializing the `Source` object and "
            + "returning some of its attributes in a JSON format."
        )
        return server_error(
            "There was a problem initializing the `Source` object and "
            + "returning some of its attributes in a JSON format."
        )
