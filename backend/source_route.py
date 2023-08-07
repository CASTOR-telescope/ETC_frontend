"""
source_route.py

Wrapper for the Flask API interfacing with the castor_etc `Source` class.

---

        GNU General Public License v3 (GNU GPLv3)

(c) 2022.                            (c) 2022.
Government of Canada                 Gouvernement du Canada
National Research Council            Conseil national de recherches
Ottawa, Canada, K1A 0R6              Ottawa, Canada, K1A 0R6
All rights reserved                  Tous droits réservés

NRC disclaims any warranties,        Le CNRC dénie toute garantie
expressed, implied, or               énoncée, implicite ou légale,
statutory, of any kind with          de quelque nature que ce
respect to the software,             soit, concernant le logiciel,
including without limitation         y compris sans restriction
any warranty of merchantability      toute garantie de valeur
or fitness for a particular          marchande ou de pertinence
purpose. NRC shall not be            pour un usage particulier.
liable in any event for any          Le CNRC ne pourra en aucun cas
damages, whether direct or           être tenu responsable de tout
indirect, special or general,        dommage, direct ou indirect,
consequential or incidental,         particulier ou général,
arising from the use of the          accessoire ou fortuit, résultant
software. Neither the name           de l'utilisation du logiciel. Ni
of the National Research             le nom du Conseil National de
Council of Canada nor the            Recherches du Canada ni les noms
names of its contributors may        de ses  participants ne peuvent
be used to endorse or promote        être utilisés pour approuver ou
products derived from this           promouvoir les produits dérivés
software without specific prior      de ce logiciel sans autorisation
written permission.                  préalable et particulière
                                     par écrit.

This file is part of the             Ce fichier fait partie du projet
FORECASTOR ETC GUI project.          FORECASTOR ETC GUI.

FORECASTOR ETC GUI is free           FORECASTOR ETC GUI est un logiciel
software: you can redistribute       libre ; vous pouvez le redistribuer
it and/or modify it under the        ou le modifier suivant les termes
terms of the GNU General Public      de la "GNU General Public
License as published by the          License" telle que publiée
Free Software Foundation,            par la Free Software Foundation :
either version 3 of the              soit la version 3 de cette
License, or (at your option)         licence, soit (à votre gré)
any later version.                   toute version ultérieure.

FORECASTOR ETC GUI is distributed    FORECASTOR ETC GUI est distribué
in the hope that it will be          dans l'espoir qu'il vous
useful, but WITHOUT ANY WARRANTY;    sera utile, mais SANS AUCUNE
without even the implied warranty    GARANTIE : sans même la garantie
of MERCHANTABILITY or FITNESS FOR    implicite de COMMERCIALISABILITÉ
A PARTICULAR PURPOSE. See the        ni d'ADÉQUATION À UN OBJECTIF
GNU General Public License for       PARTICULIER. Consultez la Licence
more details.                        Générale Publique GNU pour plus
                                     de détails.

You should have received a copy      Vous devriez avoir reçu une copie
of the GNU General Public            de la Licence Générale Publique
License along with FORECASTOR        GNU avec FORECASTOR ETC GUI ; si
ETC GUI. If not, see                 ce n'est pas le cas, consultez :
<http://www.gnu.org/licenses/>.      <http://www.gnu.org/licenses/>.
"""

import json

import astropy.units as u
import numpy as np
import pandas as pd
from castor_etc.sources import ExtendedSource, GalaxySource, PointSource
from flask import jsonify, request

from utils import (
    DataHolder,
    app,
    bad_request,
    log_traceback,
    logger,
    save_file,
    server_error,
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
            # logger.debug("\nSource request.form " + str(request_form) + "\n")
            request_data = request_form.to_dict()
            # logger.debug("\nSource request.form.to_dict() " + str(request_data) + "\n")

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
                logger.debug(
                    f"custom_spectrum != '' ? (should be false) {custom_spectrum != ''}"
                )
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
        # Tells frontend to use log source weights (after submitting Photometry request)
        use_log_source_weights = False  # use linear color scale by default
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
            n = float(physical_parameters["sersic"])
            SourceObj = GalaxySource(
                r_eff=float(physical_parameters["rEff"]) * u.arcsec,
                n=n,
                axial_ratio=float(physical_parameters["axialRatio"]),
                rotation=float(physical_parameters["rotation"]),
            )
            if n > 1.5:  # threshold is kind of arbitrary
                use_log_source_weights = True
        else:
            logger.error(f"{source_type} is not a valid Source class")
            return bad_request(f"{source_type} is not a valid Source class")
        DataHolder.use_log_source_weights = use_log_source_weights
        #
        # Make spectrum
        #
        # Ensure wavelengths array is larger than passband response curve extent and is
        # high-resolution (for interpolation). Divide by redshift to ensure final
        # spectrum, if generating one, spans the full passband range.
        wavelengths = (np.arange(900.0, 12005.0, 10.0) / (1 + redshift)) * u.AA
        if custom_spectrum != "":
            # Save file here
            secure_filepath = save_file(custom_spectrum)
            if secure_filepath is None:
                logger.error("Could not save file!")
                return bad_request("Could not save file!")
            SourceObj.use_custom_spectrum(secure_filepath, wavelength_unit=u.AA)
        elif predefined_spectrum == "gaia":
            SourceObj.use_gaia_spectrum(
                ra = float(predefined_spectrum_parameters[predefined_spectrum]["ra"]) * u.deg,
                dec = float(predefined_spectrum_parameters[predefined_spectrum]["dec"]) * u.deg,
                srch_Gmax = float(predefined_spectrum_parameters[predefined_spectrum]["srchGmax"]),
                TelescopeObj = DataHolder.TelescopeObj
            )
        elif predefined_spectrum == "blackbody":
            SourceObj.generate_bb(
                T=float(predefined_spectrum_parameters[predefined_spectrum]["temp"])
                * u.K,
                wavelengths=wavelengths,
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
        elif predefined_spectrum == "emissionLine":
            center = float(predefined_spectrum_parameters[predefined_spectrum]["center"])
            fwhm = float(predefined_spectrum_parameters[predefined_spectrum]["fwhm"])
            shape = predefined_spectrum_parameters[predefined_spectrum]["shape"]
            # Ensure wavelengths array encclose the emission line
            if shape == "gaussian":
                min_buffer = 3 * fwhm
            elif shape == "lorentzian":
                min_buffer = 10 * fwhm
            else:
                logger.error(
                    f"{shape} is not a valid emission line shape for spectrum generation"
                )
            min_wavelength = center - min_buffer
            max_wavelength = center + min_buffer
            if min_wavelength >= wavelengths[0].value:
                min_wavelength = wavelengths[0].value
            elif min_wavelength <= 0:
                min_wavelength = 1 if center > 2 else 0.5 * center
            if max_wavelength <= wavelengths[-1].value:
                max_wavelength = wavelengths[-1].value
            logger.debug(
                "Generating single emission line spectrum with limits (A): "
                + f" {min_wavelength}, {max_wavelength}"
            )
            SourceObj.generate_emission_line(
                center=center * u.AA,
                fwhm=fwhm * u.AA,
                peak=float(predefined_spectrum_parameters[predefined_spectrum]["peak"]),
                shape=shape,
                limits=[min_wavelength, max_wavelength] * u.AA,
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
            logger.debug(
                f"Renormalizing spectrum before (possibly) adding spectral lines"
            )
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
            logger.debug(f"Renormalizing spectrum after (possibly) adding spectral lines")
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
        # (may have NaNs/infs, e.g., user chose a single emission line spectrum)
        #
        source_mags = SourceObj.get_AB_mag(TelescopeObj=DataHolder.TelescopeObj)
        source_mags = (
            pd.DataFrame(source_mags, index=[0]).iloc[0].to_json(orient="values")
        )
        logger.debug("Source AB magnitudes in telescope passbands: " + str(source_mags))
        total_mag = SourceObj.get_AB_mag()
        total_mag = total_mag if np.isfinite(total_mag) else None
        logger.debug("Source total AB magnitude: " + str(total_mag))
        #
        # Store `Source` object
        #
        DataHolder.SourceObj = SourceObj
        #
        #

        # Only return the attributes that we want to show on the frontend
        return jsonify(
            wavelengths=SourceObj.wavelengths.to(u.AA).value.tolist(),  # x-values
            spectrum=list((np.float64(SourceObj.spectrum))),  # y-values, spectrum has to have dtype=float64 to be serializable, float32 is not json serianizable.
            sourceMags=source_mags,  # dict of floats
            totalMag=total_mag,  # float
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
