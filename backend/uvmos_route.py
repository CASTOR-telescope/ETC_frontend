"""
uvmos_route.py

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

import astropy.units as u
from castor_etc.uvmos_spectroscopy import UVMOS_Spectroscopy
from flask import jsonify, request

from utils import DataHolder, app, bad_request, server_error, logger, log_traceback

import pandas as pd
import numpy as np


@app.route("/uvmos", methods=["PUT"])
def put_uvmos_json():
    """
    Create a 'UVMOS Spectroscopy' object from the JSON request

    ...

    TODO: docstring
    """
    try:
        #
        # Check inputs
        #
        try:
            #Get all the dictonaries.
            request_data = request.get_json()
            logger.info("UVMOS request_data: " + str(request_data))
            extraction_box = request_data["extractionBox"]
            logger.debug("extraction_box: " + str(extraction_box))
            slit = request_data["slit"]
            logger.debug("slit: " + str(slit))
            spectral_range = request_data["spectralRange"]
            logger.debug("spectral_range: " + str(spectral_range))
            snr_input = request_data["snrInput"]
            logger.debug("snr_input: " + str(snr_input))

        except Exception as e:
            log_traceback(e)
            logger.error(
                "Inputs to initialize the `UVMOS Spectroscopy` object " 
                + "do not match required inputs."
            )

            return bad_request(
                "Inputs to initialize the `UVMOS Spectroscopy` object "
                + "do not match required inputs."
            )
        
        try:
            UVMOSObj = UVMOS_Spectroscopy(
                DataHolder.TelescopeObj, DataHolder.SourceObj,
                DataHolder.BackgroundObj
            )
        except Exception as e:
            log_traceback(e)
            logger.error(
                "Sever could not initialize the `UVMOS Spectroscopy` object from server-side "
                + "stored data. Probably missing `Telescope`, `Source`, "
                + "and/or `Background` object"
            )

            return server_error(
                "Sever could not initialize the `UVMOS Spectroscopy` object from server-side "
                + "stored data. Probably missing `Telescope`, `Source`, "
                + "and/or `Background` object"
            )
        
        #
        # Do uvmos spectroscopy
        #

        #
        # 1. Spectral Range
        #

        UVMOSObj.min_wave = (float(spectral_range['minwavelength']) * u.nm).to(u.AA)

        UVMOSObj.max_wave = (float(spectral_range['maxwavelength']) * u.nm).to(u.AA)

        #
        # 2. Slit spectroscopy
        #
        
        UVMOSObj.specify_slit(slit_width = float(slit['width']) * u.arcsec, slit_height = float(slit['length']) * u.arcsec)

        #
        # 3. Extraction box, parameters are type 'int' in uvmos_spectroscopy.py
        extraction_width = float(extraction_box['width']) #converting from string to a float
        extraction_height_lowerlim = float(extraction_box['heightLowerLim']) #converting from a string to a float
        pixel_scale = DataHolder.TelescopeObj.px_scale.value 
        

        # If units are pixels, then we need to convert the floating point digit into an integer.
        if extraction_box['units'] == 'pixel':
            if extraction_box['heightUpperLim'] == '':
                    UVMOSObj.calc_source_CASTORSpectrum(extraction_width = int(extraction_width), extraction_lowerlim = int(extraction_height_lowerlim))

                    UVMOSObj.calc_background_CASTORSpectrum(extraction_width = int(extraction_width), extraction_lowerlim = int(extraction_height_lowerlim))

            else:
                    extraction_height_upperlim = int(extraction_box['heightUpperLim'])
                    UVMOSObj.calc_source_CASTORSpectrum(extraction_width = int(extraction_width), extraction_lowerlim = int(extraction_height_lowerlim), extraction_upperlim = extraction_height_upperlim)

                    UVMOSObj.calc_background_CASTORSpectrum(extraction_width = int(extraction_width), extraction_lowerlim = int(extraction_height_lowerlim),extraction_upperlim = extraction_height_upperlim)
        # When units are arcsec, first we need to divide by the pixel scale to convert units to pixel, then round them to the nearest 1 digit, i.e., 0.6/0.1 = 0.5999999999999 and int(0.6/0.1) = 5, which is not correct, so after rounding, we convert the result into an int() type.
        else:
            extraction_width = int(np.round(extraction_width/pixel_scale,0)) #pixel
            extraction_height_lowerlim = int(np.round(extraction_height_lowerlim/pixel_scale,0)) #pixel
            if extraction_box['heightUpperLim'] == '':
                    UVMOSObj.calc_source_CASTORSpectrum(extraction_width = extraction_width, extraction_lowerlim = extraction_height_lowerlim)

                    UVMOSObj.calc_background_CASTORSpectrum(extraction_width = extraction_width, extraction_lowerlim = extraction_height_lowerlim)

            else:
                    extraction_height_upperlim = int(np.round(float(extraction_box['heightUpperLim'])/pixel_scale,0)) 
                    UVMOSObj.calc_source_CASTORSpectrum(extraction_width = extraction_width, extraction_lowerlim = extraction_height_lowerlim, extraction_upperlim = extraction_height_upperlim)

                    UVMOSObj.calc_background_CASTORSpectrum(extraction_width = extraction_width, extraction_lowerlim = extraction_height_lowerlim,extraction_upperlim = extraction_height_upperlim)
        #
        # 4. SNR calculations
        #
        wave = (float(snr_input["wavelength"]) * u.nm)
        if snr_input["val_type"] == "snr":
                snr = float(snr_input["val"])
                snr_result = UVMOSObj.calc_t_from_snr(snr = snr, wave = wave.to(u.AA))

        elif snr_input["val_type"] == "t":
             t = float(snr_input["val"]) # seconds
             snr_result = UVMOSObj.calc_snr_from_t(t = t, wave = wave.to(u.AA))

        else:
             logger.error(
                  f"The given uvmos spectroscopy target value type, {snr_input['val_type']}, "
                  + "is not valid and must be either 'snr' or 't'. " 
             )

             return bad_request(
                  f"The given uvmos spectroscopy target value type, {snr_input['val_type']}, "
                  + "is not valid and must be either 'snr' or 't'. " 
             )

        slit_width_pix = UVMOSObj.slit_width_pix
        slit_height_pix = UVMOSObj.slit_height_pix

        slit_width = UVMOSObj.slit_width.value
        slit_height = UVMOSObj.slit_height.value

        source_detector = pd.DataFrame(UVMOSObj.show_slit_image(wave=wave.value)[0]).to_json(
             orient="values"
        )
        
        DataHolder.UVMOSObj = UVMOSObj
 
        return ( jsonify(
             snrResults = snr_result.item(), # SNR calculation above returns a 0 dimensional array.
             spectrum = {
                  "waves": UVMOSObj.waves_CASTORSpectrum,
                  "source_response": UVMOSObj.source_CASTORSpectrum,
                  "background_response": UVMOSObj.background_CASTORSpectrum.tolist(),
                  "extracted_numpixs": UVMOSObj.source_extracted_numpixs
             },
             sourcePixelWeight = {
                  "source_detector": source_detector,
                  "centerPix": UVMOSObj.show_slit_image(wave=wave.value)[1],
             },
             slitWidthPixel = slit_width_pix,
             slitHeightPixel = slit_height_pix,
             showSlit = {
                "slitWidth": slit_width,
                "slitHeight": slit_height,
                "FWHM": UVMOSObj.FWHM.value,
             },
        )
        )
    
        
    except Exception as e:
        log_traceback(e)
        logger.error(
            "There was a problem initializing the `UVMOS Spectroscopy` object and "
            + "returning some of its attribute in a JSON format"
        )

        return server_error(
            "There was a problem initializing the `UVMOS Spectroscopy` object and "
            + "returning some of its attributes in a JSON format."
        )

