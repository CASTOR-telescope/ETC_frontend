"""
connector.py

Flask REST API for interfacing with the frontend GUI.

Helpful links:
- What is an endpoint in Flask (incl. `url_for()`): <https://stackoverflow.com/a/19262349>
- How to get different parts of a URL: <https://stackoverflow.com/a/15975041>
- TODO: Returning API errors as JSON: <https://flask.palletsprojects.com/en/2.1.x/errorhandling/#returning-api-errors-as-json>

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

from flask import abort, request, send_from_directory

from utils import app, cors, bad_route, logger
from telescope_route import put_telescope_json
from background_route import put_background_json
from source_route import put_source_json
from photometry_route import put_photometry_json
from uvmos_route import put_uvmos_json
from transit_route import put_transit_json

if __name__ != "__main__":
    logger.debug("Assuming app is configured for gunicorn in Docker container.")

    @app.route("/")
    def index():
        """
        Serve the index.html file when client requests the static url (e.g.,
        <http://localhost:5000/>).
        """
        logger.info(f"Serving index.html because client requested {app.static_url_path}/")
        return app.send_static_file("index.html")


# N.B. only use GET requests for default path
# See <https://flask.palletsprojects.com/en/2.0.x/api/#url-route-registrations>
@app.route("/", defaults={"path": ""})
@app.route("/<string:path>", methods=["GET", "PUT"])  # needed to redirect everything else
@app.route("/<path:path>", methods=["GET", "PUT"])
def redirect(path):
    """
    Redirects request to the appropriate function based on the path. This is required
    because CANFAR URLs change with each session.

    Parameters
    ----------
      path :: str
        The request path. For example, if the URL displayed in the browser is
        `https://ws-uv.canfar.net/castor/<sessionID>/foo`, the path is
        `castor/<sessionID>/foo`.
    """

    logger.info(f"Parsing request for /{path}")
    logger.info("URL of request: " + str(request.url))

    if re.search(r"\btelescope\b", path) is not None:  # match whole word
        logger.info("Redirecting request to /telescope")
        if request.method != "PUT":
            abort(405)
        return put_telescope_json()

    if re.search(r"\bbackground\b", path) is not None:  # match whole word
        logger.info("Redirecting request to /background")
        if request.method != "PUT":
            abort(405)
        return put_background_json()

    if re.search(r"\bsource\b", path) is not None:  # match whole word
        logger.info("Redirecting request to /source")
        if request.method != "PUT":
            abort(405)
        return put_source_json()

    elif re.search(r"\bphotometry\b", path) is not None:  # match whole word
        logger.info(request.method)
        if request.method != "PUT":
            abort(405)
        return put_photometry_json()
    
    elif re.search(r"\buvmos\b", path) is not None:  # match whole word
        logger.info(request.method)
        if request.method != "PUT":
            abort(405)
        return put_uvmos_json()
    
    elif re.search(r"\btransit\b", path) is not None:  # match whole word
        logger.info(request.method)
        if request.method != "PUT":
            abort(405)
        return put_transit_json()

    elif re.search(r"\bmanifest.json\b", path) is not None:  # match whole word
        logger.info("Serving manifest.json")
        if request.method != "GET":
            abort(405)
        return app.send_static_file("manifest.json")

    elif re.search(r"\bfavicon.ico\b", path) is not None:  # match whole word
        logger.info("Serving favicon.ico")
        if request.method != "GET":
            abort(405)
        return app.send_static_file("favicon.ico")

    elif re.search(r"\brobots.txt\b", path) is not None:  # match whole word
        logger.info("Serving robots.txt")
        if request.method != "GET":
            abort(405)
        return app.send_static_file("robots.txt")

    else:
        filename = re.search(r"[^/?]*\.(?:gif|png|jpeg|jpg|ico|js|css)$", path)
        if app.static_folder is not None and filename is not None:
            if request.method != "GET":
                abort(405)
            logger.debug(f"Serving some image/js/css at /{path}")
            return send_from_directory(app.static_folder, filename.group())

        else:
            logger.error(f"Bad route: route=/{path}")
            return bad_route(path)


if __name__ == "__main__":
    # i.e., not running via gunicorn
    cors.init_app(app)
    app.run(port=5000, debug=True)
