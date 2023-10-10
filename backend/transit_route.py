"""
transit_route.py

Wrapper for the Flask API interfacing with the castor_etc `Observation` class.

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
from castor_etc.transit import Observation

from flask import jsonify, request
import pandas as pd
import numpy as np

from utils import DataHolder, app, bad_request, server_error, logger, log_traceback

import zlib, json, base64


@app.route("/transit", methods=["PUT"])
def put_transit_json():
    """
    Create a 'transit' object from the JSON request

    ...

    TODO: docstring
    """
    try:
    
        #
        # Check inputs
        #
        try:
            #Get all the dictionaries
            request_data = request.get_json()
            logger.info("Transit request_data: " + str(request_data))
            bandpass = request_data["bandpass"]
            logger.debug("bandpass: " + str(bandpass))
            exposure_parameters = request_data["exposureParameters"]
            logger.debug("exposure_parameters: " + str(exposure_parameters))
            planet_model_parameters = request_data["planetModelParameters"]
            logger.debug("planet_model_parameters: " + str(planet_model_parameters))
        
        except Exception as e:
            log_traceback(e)
            logger.error(
                "Inputs to initialize the 'transit' object "
                + "do not match required inputs"
            )

            return bad_request(
                "Inputs to initialize the 'Transit' object "
                + "do not match required inputs."
            )
        
        try:
            TransitObj = Observation(
                DataHolder.TelescopeObj, DataHolder.SourceObj, DataHolder.BackgroundObj, stellar_model_dir = "/arc/projects/CASTOR/stellar_models"
            )
        except Exception as e:
            log_traceback(e)
            logger.error(
                "Server could not initialize the 'Transit' object from server-side "
                + "stored data. Probably missing `Telescope`, `Source`, "
                + "and/or `Background` object"
            )

            return server_error(
                "Server could not initialize the 'Transit' object from server-side "
                + "stored data. Probably missing `Telescope`, `Source`, "
                + "and/or `Background` object"
            )
        
        #
        # Transit
        #

        #
        # 1. Specify CASTOR bandpass
        #

        TransitObj.specify_bandpass(passband_name=str(bandpass['bandpass_id']))

        #
        # 2. Simulation and Plotting
        #

        TransitObj.scene_sim()

        # From plot_fov function in transit.py
        if ( ('gs_i' in TransitObj.gaia.keys()) == False ) & hasattr(TransitObj,'gs_criteria'):
                    TransitObj.id_guide_stars()

        _f = TransitObj.gaia['scene'] - np.min(TransitObj.gaia['scene']) + 1

        _f = base64.b64encode(zlib.compress(bytes(json.dumps(_f.tolist()),"utf-8"))).decode("ascii")


        # print('Initial size=',len(_f.encode("utf-8"))/(10**6),'Mb') #25.18 Mb in size!

        # _size = base64.b64encode(zlib.compress(bytes(_f, "utf-8"))).decode("ascii")
        # print('Compressed size=',len(_size.encode("utf-8"))/(10**6),'Mb') #10.36 Mb in size!

        xlim = int(DataHolder.TelescopeObj.transit_ccd_dim[0]/2) + TransitObj.xout * 0.7 * np.array([-1.0,1.0])
        # ylim = int(DataHolder.TelescopeObj.transit_ccd_dim[1]/2) + TransitObj.yout * 0.7 * np.array([-1.0,1.0])

        #
        # 3. Stimulate light curve & inject a transit model
        #

        exptime = float(exposure_parameters['exptime']) * u.second
        nstack = int(exposure_parameters['nstack'])
        tstart = float(exposure_parameters['tstart']) * u.d
        tend = float(exposure_parameters['tend']) * u.d

        TransitObj.specify_exposure_parameters(exptime=exptime,nstack=nstack, tstart=tstart, tend=tend)

        rprs = float(planet_model_parameters['rprs'])
        p = float(planet_model_parameters['p'])
        t0 = float(planet_model_parameters['t0'])
        b = float(planet_model_parameters['b'])
        ars = float(planet_model_parameters['ars'])


        TransitObj.specify_pl_model(RpRs = [rprs], P=[p], t0=[t0], b=[b],aRs=[ars])

        TransitObj.lc_sim()

        # plot_lc
        exp_time = -1

        t_offset = -(TransitObj.lc_t[-1] - TransitObj.lc_t[0]) / 2.
        t_scale = 1.
        y_offset = -1.0
        y_scale = 1.e3

        x_sim_castor = (TransitObj.lc_t + t_offset) * t_scale

        y_sim_castor = (TransitObj.lc_fl[:,0] + y_offset) * y_scale

        y_error = TransitObj.lc_err[:,0] * y_scale

        _t_grid = np.linspace(TransitObj.lc_t[0],TransitObj.lc_t[-1],1000)
        pl_lc = TransitObj.calc_pl_model(t_grid=_t_grid,exp_time=exp_time) + 1.

        xlim = np.array([TransitObj.lc_t[0], TransitObj.lc_t[-1]])
        xlim += t_offset
        xlim *= t_scale
        xlim += 0.5 * t_scale * (TransitObj.lc_t[1] - TransitObj.lc_t[0]) * np.array([-1.0, 1.0])

        x_transit_model = (_t_grid + t_offset) * t_scale

        y_transit_model = (pl_lc + y_offset) * y_scale

        # Store Transit object
        DataHolder.TransitObj = TransitObj

        return jsonify(
            gaia = {
                "ra": list(DataHolder.SourceObj.gaia['ra']),
                "dec": list(DataHolder.SourceObj.gaia['dec']),
                "x": list(DataHolder.SourceObj.gaia['x']),
                "y": list(DataHolder.SourceObj.gaia['y']),
                "gs_i": list(np.float64(TransitObj.gaia['gs_i'])),
                "_f": _f
            },
            # scene_sim = {
            #     "rotation_array": rotation_array,
            #     "grid_x_array": grid_x_array,
            #     "grid_y_array": grid_y_array,
            #     "coord_str_array": coord_str_array
            # },
            ccd_dim = TransitObj.ccd_dim,
            xout = TransitObj.xout,
            yout = TransitObj.yout,
            # result_g_ra = result_g_ra,
            # result_g_dec = result_g_dec,
            light_curve = {
                "x_sim_castor": list(x_sim_castor),
                "y_sim_castor": list(y_sim_castor),
                "y_error": list(y_error),
                "xlim": list(xlim),
                "x_transit_model": list(x_transit_model),
                "y_transit_model": list(y_transit_model),
            }
        )
        

    except Exception as e:
        log_traceback(e)
        logger.error(
            "There was a problem initializing the `Transit ` object and "
            + "returning some of its attribute in a JSON format"
        )

        return server_error(
            "There was a problem initializing the `Transit ` object and "
            + "returning some of its attributes in a JSON format."
        )