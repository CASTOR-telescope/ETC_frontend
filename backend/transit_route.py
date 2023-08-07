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
                DataHolder.TelescopeObj, DataHolder.SourceObj, DataHolder.BackgroundObj
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
        # 1. Specifying CASTOR bandpass
        #

        TransitObj.specify_bandpass(passband_name=str(bandpass['bandpass_id']))

        #
        # 2. Simulation and Plotting
        #

        TransitObj.scene_sim()

        # From plot_fov function in transit.py
        if ( ('gs_i' in DataHolder.SourceObj.gaia.keys()) == False ) & hasattr(TransitObj,'gs_criteria'):
                    TransitObj.id_guide_stars()

        _f = DataHolder.SourceObj.gaia['scene'] - np.min(DataHolder.SourceObj.gaia['scene']) + 1

        _f = pd.DataFrame(_f).to_json(
            orient="values"
        )


        xlim = int(DataHolder.TelescopeObj.ccd_dim[0]/2) + TransitObj.xout * 0.7 * np.array([-1.0,1.0])
        ylim = int(DataHolder.TelescopeObj.ccd_dim[1]/2) + TransitObj.yout * 0.7 * np.array([-1.0,1.0])

        # Grid lines were plotted according to the POET's fov, i.e., 1 deg. Since, CASTOR's FoV is 204.5 arcseconds, these grid lines aren't visible. To reproduce grid results, change the fov parameter to 3600 arcseconds, i.e., 1 deg. The corresponding grid lines plotting in the GUI has also been commented out for the same reason.

        # The below commented lines are pasted from the plot_fov function in the transit.py file.

        # grid_ra = np.linspace( np.floor(np.min(DataHolder.SourceObj.gaia['ra']) - 0.5), 
        #                                             np.ceil(np.max(DataHolder.SourceObj.gaia['ra'] + 0.5)), 1000 )
        # grid_dec = np.linspace( np.floor(np.min(DataHolder.SourceObj.gaia['dec']) - 1.), 
        #                                 np.ceil(np.max(DataHolder.SourceObj.gaia['dec']) + 0.5), 1000 )

        # ra_lim = [np.floor(grid_ra[0]), np.ceil(grid_ra[-1])]
        # for del_ra in [0.5, 1.0, 5.0, 10.]:
        #     if (ra_lim[1] - ra_lim[0])/del_ra < 10:
        #         break

        # dec_lim = [np.floor(grid_dec[0]), np.ceil(grid_dec[-1])]
        # for del_dec in [0.5, 1.0, 5.0, 10.]:
        #     if (dec_lim[1] - dec_lim[0])/del_dec < 10:
        #         break

        # ra_fact = 1.
        # if (ra_lim[1] - ra_lim[0])/del_ra > 8:
        #     ra_fact = 2.
        # dec_fact = 1.
        # if (dec_lim[1] - dec_lim[0])/del_dec > 8:
        #     dec_fact = 2.

        # # Extend RA grid
        # ax_xy = np.array([ [xlim[0], ylim[0]], [xlim[1], ylim[0]], \
        #                 [xlim[1], ylim[1]], [xlim[0], ylim[1]] ])
        # ax_radec = DataHolder.SourceObj.gaia['wcs'].pixel_to_world(ax_xy[:,0],ax_xy[:,1])
        # if np.floor(np.min(ax_radec.ra.value)) < (grid_ra[0] - del_ra):
        #     grid_ra = np.hstack([ np.arange( np.floor(np.min(ax_radec.ra.value)), 
        #                                         grid_ra[0], del_ra ), grid_ra ])
        #     ra_lim[0] = grid_ra[0]
        # if np.ceil(np.max(ax_radec.ra.value)) < (grid_ra[0] + del_ra):
        #     grid_ra = np.hstack([ grid_ra, np.arange( grid_ra[-1], 
        #                                         np.ceil(np.max(ax_radec.ra.value)), 
        #                                             del_ra ) ])
        #     ra_lim[1] = grid_ra[-1]

        # if grid_ra[-1] < (ra_lim[1] + del_ra):
        #     grid_ra = np.hstack([ grid_ra, np.arange(grid_ra[-1],ra_lim[1]+3*del_ra) ])
        # if grid_dec[-1] < (dec_lim[1] + del_dec):
        #     grid_dec = np.hstack([ grid_dec, np.arange(grid_dec[-1],dec_lim[1]+del_dec) ])

        # array_g_ra = []

        # for _g_ra in np.arange( ra_lim[0], ra_lim[1] + 2*del_ra, del_ra ):
        #     grid_coord = SkyCoord(ra=_g_ra+np.zeros(len(grid_dec)), dec=grid_dec, 
        #                     unit=(u.degree, u.degree), frame='icrs')
        #     grid_x, grid_y = DataHolder.SourceObj.gaia['wcs'].world_to_pixel(grid_coord)
        #     array_g_ra.append(grid_x)
        #     array_g_ra.append(grid_y)
        
        # result_g_ra = np.vstack(array_g_ra)

        # result_g_ra = pd.DataFrame(result_g_ra).to_json(
        #     orient="values"
        # )
            
        # array_g_dec = []

        # for _g_dec in np.arange( dec_lim[0], dec_lim[1] + del_dec, del_dec ):
        #     grid_coord = SkyCoord(ra=grid_ra, dec=_g_dec+np.zeros(len(grid_ra)), 
        #                     unit=(u.degree, u.degree), frame='icrs')
        #     grid_x, grid_y = DataHolder.SourceObj.gaia['wcs'].world_to_pixel(grid_coord)
        #     array_g_dec.append(grid_x)
        #     array_g_dec.append(grid_y)

        # result_g_dec = np.vstack(array_g_dec)

        # result_g_dec = pd.DataFrame(result_g_dec).to_json(
        #     orient="values"
        # )

        # grid_x_array = []
        # grid_y_array = []
        # coord_str_array = []
        # rotation_array = []

        # for _g_ra in np.arange( ra_lim[0], ra_lim[1] + del_ra, ra_fact*del_ra ):
        #     for _g_dec in np.arange( dec_lim[0], dec_lim[1] + del_dec, dec_fact*del_dec ):
        #         grid_coord = SkyCoord(ra=_g_ra, dec=_g_dec, 
        #                             unit=(u.degree, u.degree), frame='icrs')
        #         grid_x, grid_y = DataHolder.SourceObj.gaia['wcs'].world_to_pixel(grid_coord)

        #         if (grid_x > xlim[0]) & (grid_x < (xlim[1] - 0.1*(xlim[1] - xlim[0]))) \
        #                 & (grid_y > (ylim[0] + 0.05*(ylim[1] - ylim[0]))) \
        #                 & (grid_y < ylim[1]):
        #             grid_coord = SkyCoord(ra=_g_ra+del_ra, dec=_g_dec, 
        #                                 unit=(u.degree, u.degree), frame='icrs')
        #             grid_x2, grid_y2 = DataHolder.SourceObj.gaia['wcs'].world_to_pixel(grid_coord)
        #             coord_str = '('
        #             if del_ra < 1:
        #                 coord_str += '{:.1f}'.format(_g_ra) + ','
        #             else:
        #                 coord_str += '{:.0f}'.format(_g_ra) + ','

        #             if del_dec < 1:
        #                 coord_str += '{:.1f}'.format(_g_dec) + ')'
        #             else:
        #                 coord_str += '{:.0f}'.format(_g_dec) + ')'

        #             rotation = (180./np.pi) * np.arctan( (grid_y2 - grid_y) / (grid_x2 - grid_x) ) 
                    
        #             rotation_array.append(rotation)
        #             grid_x_array.append(grid_x)
        #             grid_y_array.append(grid_y)
        #             coord_str_array.append(str(coord_str))

        # rotation_array = pd.DataFrame(rotation_array).to_json(
        #     orient="values"
        # )
        # grid_x_array = pd.DataFrame(grid_x_array).to_json(
        #     orient="values"
        # )
        # grid_y_array = pd.DataFrame(grid_y_array).to_json(
        #     orient="values"
        # )
        # coord_str_array = pd.DataFrame(coord_str_array).to_json(
        #     orient="values"
        # )

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
                "gs_i": list(np.float64(DataHolder.SourceObj.gaia['gs_i'])),
                "_f": _f,
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