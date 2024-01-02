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
from castor_etc.grism import Grism
from flask import jsonify, request

from utils import DataHolder, app, bad_request, server_error, logger, log_traceback

import pandas as pd
import numpy as np

@app.route("/grism", methods=["PUT"])
def put_grism_json():
    """
    Create a 'Grism' object from the JSON request

    ...

    TODO: docstring
    """
    try:
        #
        # Check inputs
        #
        request_data = request.get_json()
        logger.info("Grism request_data: " + str(request_data))
        grism_channel = request_data["grismChannel"]
        logger.debug("grism_channel: " + str(grism_channel))
        exposure_time = request_data["exposureTime"]
        logger.debug("exposure_time " + str(exposure_time))

    except Exception as e:
        log_traceback(e)
        logger.error(
            "Inputs to initialize the `Grism` object "
            + "do not match required inputs."
        )

        return bad_request(
            "Inputs to initialize the `Grism` object "
            + "do not match required inputs."
        )
    
    try:
        GrismObj = Grism(
            DataHolder.TelescopeObj, DataHolder.SourceObj,DataHolder.BackgroundObj
        )
    
    except Exception as e:
        log_traceback(e)
        logger.error(
            "Server could not initialize the `Grism` object from server-side "
            + "stored data. Probably missing `Telescope`, `Source`, "
            + "and/or `Background` object" 
        )

        return server_error(
            "Server could not initialize the `Grism` object from server-side "
            + "stored data. Probably missing `Telescope`, `Source`, "
            + "and/or `Background` object"
        )
    
    #
    # Do Grism spectroscopy
    #

    #
    # 1. Specify the grism channel
    # 
    GrismObj.disperse(grism_channel=grism_channel,check=False) 

    #
    # 2. Specify the exposure time
    #
    GrismObj.expose(exposure_time=float(exposure_time))

    #
    # 3. Specify the noise parameters
    #
    Nread = 1
    Nbin = 1
    GrismObj.total_noise(Nreads=Nread, Nbin=Nbin)

    #
    # 4. 1D and 2D SNR per resolution
    #

    box_center = int((GrismObj.integrated_grism_box_count.shape[0]-1) / 2)
    half_source_size = int((GrismObj.source_image.shape[0]-1) / 2)

    grism_1d = np.sum(GrismObj.integrated_grism_box_count[box_center-half_source_size:box_center+half_source_size+1,:],
                  axis=0)
    grism_1d_x = np.arange(0,len(grism_1d), 1)

    sum_signal_1d = np.sum(GrismObj.integrated_grism_box_count[box_center-half_source_size:box_center+half_source_size+1,:], 
                            axis=0)
    quad_error_1d = np.sqrt(np.sum(GrismObj.grism_noise_total[box_center-half_source_size:box_center+half_source_size+1,:]**2, 
                                    axis=0))
    snr_1d = sum_signal_1d / quad_error_1d    

    grism_2d = GrismObj.integrated_grism_box_count/GrismObj.grism_noise_total

    grism_2d = pd.DataFrame(grism_2d).to_json(
        orient="values"
    )

    DataHolder.GrismObj = GrismObj

    return ( jsonify(
        grism2d = grism_2d,
        snr1d = snr_1d.tolist(),
        grism1dx = grism_1d_x.tolist()
    ))
    
