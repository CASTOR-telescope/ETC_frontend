"""
background_route.py

Wrapper for the Flask API interfacing with the castor_etc `Background` class.

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
