"""
photometry_route.py

Wrapper for the Flask API interfacing with the castor_etc `Photometry` class.

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

import re

import astropy.units as u
import numpy as np
import pandas as pd
from castor_etc.photometry import Photometry
from castor_etc.sources import PointSource
from flask import jsonify, request
from utils import DataHolder, app, bad_request, log_traceback, logger, server_error


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
            source_weights_passband = request_data["sourceWeightsPassband"].lower()
            logger.debug("source_weights_passband: " + str(source_weights_passband))
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
        # (some passband results may be NaN/inf because, e.g., user chose a single
        # emission line spectrum)
        for band in phot_results:
            if ~np.isfinite(phot_results[band]):
                phot_results[band] = None
            else:
                phot_results[band] = float(phot_results[band])
        logger.debug("phot_results: " + str(phot_results))
        #
        # Calculate redleak fractions
        #
        # (in case any redleak fractions are NaNs/infs)
        redleak_fracs = DataHolder.SourceObj.calc_redleak_frac(DataHolder.TelescopeObj)
        for band in redleak_fracs:
            if ~np.isfinite(redleak_fracs[band]):
                redleak_fracs[band] = None
            else:
                redleak_fracs[band] = float(redleak_fracs[band])
        logger.debug("redleak_fracs: " + str(redleak_fracs))
        #
        # Store Photometry object
        #
        DataHolder.PhotometryObj = PhotometryObj
        #
        # Get aperture's encircled energy in each passband
        # Note that `None` will be set to `null` in the JSON response.
        #
        encircled_energies = PhotometryObj._encircled_energies
        #
        # Convert 2D arrays to JSON, replace NaN with null, and only want the data array
        #
        aper_mask = pd.DataFrame(PhotometryObj._aper_mask).to_json(orient="values")
        source_weights = pd.DataFrame(
            PhotometryObj.source_weights[source_weights_passband]
        ).to_json(orient="values")
        # Only return the attributes that we want to show on the frontend
        return jsonify(
            photResults=phot_results,
            effNpix=PhotometryObj._eff_npix,
            encircledEnergies=encircled_energies,
            redleakFracs=redleak_fracs,
            aperMask=aper_mask,
            sourceWeights=source_weights,
            aperExtent=PhotometryObj._aper_extent,  # already a list
            useLogSourceWeights=DataHolder.use_log_source_weights,
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
