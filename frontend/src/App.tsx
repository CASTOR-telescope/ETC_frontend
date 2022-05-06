/**
 *         GNU General Public License v3 (GNU GPLv3)
 *
 * (c) 2022.                            (c) 2022.
 * Government of Canada                 Gouvernement du Canada
 * National Research Council            Conseil national de recherches
 * Ottawa, Canada, K1A 0R6              Ottawa, Canada, K1A 0R6
 * All rights reserved                  Tous droits réservés
 *
 * NRC disclaims any warranties,        Le CNRC dénie toute garantie
 * expressed, implied, or               énoncée, implicite ou légale,
 * statutory, of any kind with          de quelque nature que ce
 * respect to the software,             soit, concernant le logiciel,
 * including without limitation         y compris sans restriction
 * any warranty of merchantability      toute garantie de valeur
 * or fitness for a particular          marchande ou de pertinence
 * purpose. NRC shall not be            pour un usage particulier.
 * liable in any event for any          Le CNRC ne pourra en aucun cas
 * damages, whether direct or           être tenu responsable de tout
 * indirect, special or general,        dommage, direct ou indirect,
 * consequential or incidental,         particulier ou général,
 * arising from the use of the          accessoire ou fortuit, résultant
 * software. Neither the name           de l'utilisation du logiciel. Ni
 * of the National Research             le nom du Conseil National de
 * Council of Canada nor the            Recherches du Canada ni les noms
 * names of its contributors may        de ses  participants ne peuvent
 * be used to endorse or promote        être utilisés pour approuver ou
 * products derived from this           promouvoir les produits dérivés
 * software without specific prior      de ce logiciel sans autorisation
 * written permission.                  préalable et particulière
 *                                      par écrit.
 *
 * This file is part of the             Ce fichier fait partie du projet
 * FORECASTOR ETC GUI project.          FORECASTOR ETC GUI.
 *
 * FORECASTOR ETC GUI is free           FORECASTOR ETC GUI est un logiciel
 * software: you can redistribute       libre ; vous pouvez le redistribuer
 * it and/or modify it under the        ou le modifier suivant les termes
 * terms of the GNU General Public      de la "GNU General Public
 * License as published by the          License" telle que publiée
 * Free Software Foundation,            par la Free Software Foundation :
 * either version 3 of the              soit la version 3 de cette
 * License, or (at your option)         licence, soit (à votre gré)
 * any later version.                   toute version ultérieure.
 *
 * FORECASTOR ETC GUI is distributed    FORECASTOR ETC GUI est distribué
 * in the hope that it will be          dans l'espoir qu'il vous
 * useful, but WITHOUT ANY WARRANTY;    sera utile, mais SANS AUCUNE
 * without even the implied warranty    GARANTIE : sans même la garantie
 * of MERCHANTABILITY or FITNESS FOR    implicite de COMMERCIALISABILITÉ
 * A PARTICULAR PURPOSE. See the        ni d'ADÉQUATION À UN OBJECTIF
 * GNU General Public License for       PARTICULIER. Consultez la Licence
 * more details.                        Générale Publique GNU pour plus
 *                                      de détails.
 *
 * You should have received a copy      Vous devriez avoir reçu une copie
 * of the GNU General Public            de la Licence Générale Publique
 * License along with FORECASTOR        GNU avec FORECASTOR ETC GUI ; si
 * ETC GUI. If not, see                 ce n'est pas le cas, consultez :
 * <http://www.gnu.org/licenses/>.      <http://www.gnu.org/licenses/>.
 */

import "./App.css";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import { DarkModeTheme } from "./components/DarkModeTheme";
import { Container, CssBaseline } from "@mui/material";

import TabForms from "./components/TabForms";

import { Allotment } from "allotment";
import "allotment/dist/style.css";
// import "./components/allotment.css";

import ResponseCurveSpectrumPlot from "./components/plots/ResponseCurveSpectrumPlot";
import { useState } from "react";
import SourceWeightsPlot from "./components/plots/SourceWeightsPlot";
import AperMaskPlot from "./components/plots/AperMaskPlot";

function App() {
  // Set Material UI theme
  useTheme();

  // To update the ResponseCurveSpectrumPlot once new Telescope or Source parameters are
  // successfully returned from the server
  const [numTelescopeOrSourceSaved, setNumTelescopeOrSourceSaved] = useState(0);
  const incrNumTelescopeOrSourceSaved = () => {
    setNumTelescopeOrSourceSaved(numTelescopeOrSourceSaved + 1);
  };

  // To update image plots on each new Photometry submission and to track whether a
  // Photometry request has ever been submitted
  const [numPhotometrySubmit, setNumPhotometrySubmit] = useState(0);
  const incrNumPhotometrySubmit = () => {
    setNumPhotometrySubmit(numPhotometrySubmit + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Allotment defaultSizes={[50, 50]} minSize={0}>
            <div
              style={{
                // Allow the user to scroll overflowed content
                width: "100%",
                height: "100%",
                overflow: "auto",
              }}
            >
              <Allotment.Pane>
                <TabForms
                  incrNumTelescopeOrSourceSaved={incrNumTelescopeOrSourceSaved}
                  incrNumPhotometrySubmit={incrNumPhotometrySubmit}
                  numPhotometrySubmit={numPhotometrySubmit}
                />
              </Allotment.Pane>
            </div>

            <Allotment.Pane>
              <Allotment vertical defaultSizes={[50, 50]} minSize={0}>
                <Allotment.Pane>
                  <Allotment defaultSizes={[50, 50]} minSize={0}>
                    <SourceWeightsPlot numPhotometrySubmit={numPhotometrySubmit} />
                    <AperMaskPlot numPhotometrySubmit={numPhotometrySubmit} />
                  </Allotment>
                </Allotment.Pane>
                <Allotment.Pane>
                  <ResponseCurveSpectrumPlot
                    numTelescopeOrSourceSaved={numTelescopeOrSourceSaved}
                  />
                </Allotment.Pane>
              </Allotment>
            </Allotment.Pane>
          </Allotment>
        </div>
      </header>
    </div>
  );
}

function DarkThemeApp() {
  return (
    <ThemeProvider theme={DarkModeTheme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <App />
      </Container>
    </ThemeProvider>
  );
}

export default DarkThemeApp;
