"""
telescope_route.py

Wrapper for the Flask API interfacing with the castor_etc `Telescope` class.

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
