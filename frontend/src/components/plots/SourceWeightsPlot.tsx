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

import { themeBackgroundColor } from "../DarkModeTheme";
import ResponsivePlot from "../ResponsivePlot";

// /**
//  * Returns the minimum number above zero in a 1D array.
//  */
// const getMinAboveZero = (arr: number[]): number => {
//   return Math.min(...arr.filter(Number));
// };
// const getMaxAboveZero = (arr: number[]): number => {
//   return Math.max(...arr.filter(Number));
// };

type SourceWeightsPlotProps = {
  numPhotometrySubmit: number;
};

const SourceWeightsPlot: React.FC<SourceWeightsPlotProps> = ({ numPhotometrySubmit }) => {
  if (sessionStorage.getItem("photometryParams") !== null) {
    // Update to proper sessionStorage key after
    let photometryParams = JSON.parse(`${sessionStorage.getItem("photometryParams")}`);
    let sourceWeights = JSON.parse(photometryParams["sourceWeights"]); // need to JSON parse twice...
    let photometryForm = JSON.parse(`${sessionStorage.getItem("photometryForm")}`);
    let sourceWeightsPassband = photometryForm["sourceWeightsPassband"];
    let sourceWeightsPassbandText = "";
    if (sourceWeightsPassband === "noiseless") {
      sourceWeightsPassbandText = "Source Without PSF Convolution";
    } else if (sourceWeightsPassband === "uv") {
      sourceWeightsPassbandText = `Source In UV-Band`;
    } else {
      sourceWeightsPassbandText = `Source In ${sourceWeightsPassband}-Band`;
    }
    // let zauto = true;
    // let zmax = 0; // only relevant if zauto is false (i.e., for log color scale)
    // let zmin = 0; // only relevant if zauto is false (i.e., for log color scale)
    let tickprefix = "";
    if (photometryParams["useLogSourceWeights"]) {
      // zauto = false;
      // zmin = Math.log10(
      //   getMinAboveZero(sourceWeights.map((row: number[]) => getMinAboveZero(row)))
      // );
      // let zmaxNoLog = getMaxAboveZero(
      //   sourceWeights.map((row: number[]) => getMaxAboveZero(row))
      // );
      // if (Math.abs(1 - zmaxNoLog) > 3e-3) {
      //   // approximately 1
      //   zmax = Math.log10(zmaxNoLog);
      // }
      tickprefix = "1e";
      // Must do this after zmin/zmax
      sourceWeights = sourceWeights.map((row: number[]) =>
        row.map((value: number) => Math.log10(value))
      );
    }
    let extent = photometryParams["aperExtent"]; // [xmin, xmax, ymin, ymax]
    // let effNpix = photometryParams["effNpix"];
    let plotLengths = [sourceWeights.length, sourceWeights[0].length];
    let px_scale_x = (extent[1] - extent[0]) / plotLengths[1];
    let px_scale_y = (extent[3] - extent[2]) / plotLengths[0];
    return (
      <ResponsivePlot
        // React re-renders the plot when any state, prop, or parent component changes
        divId={`source-weights-plot-${numPhotometrySubmit}`}
        data={[
          {
            z: sourceWeights,
            // zauto: zauto,
            // zmin: zmin,
            // zmax: zmax,
            type: "heatmap",
            colorscale: "Electric",
            colorbar: {
              title: {
                text: "Percent of Source Flux Contained in Pixel",
                side: "right",
                font: { size: 14 },
              },
              tickprefix: tickprefix,
              // exponentformat: "power",
              // tickformat: "<sup>.2f</sup>",
            },
            x0: extent[0] + 0.5 * px_scale_x,
            dx: px_scale_x,
            y0: extent[2] + 0.5 * px_scale_y,
            dy: px_scale_y,
            transpose: false,
          },
        ]}
        layout={{
          title: {
            text: sourceWeightsPassbandText,
            font: { color: "white", size: 17.5 },
          },
          font: { color: "white", size: 14 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            showgrid: true,
            title: "<i>x</i> (arcsec)",
            type: "linear",
            autorange: true,
            range: [extent[0], extent[1]],
          },
          yaxis: {
            showgrid: true,
            title: "<i>y</i> (arcsec)",
            type: "linear",
            autorange: true,
            range: [extent[2], extent[3]],
            scaleanchor: "x",
          },
          margin: { t: 50 }, // if no title
        }}
        useResizeHandler={true}
        config={{
          displaylogo: false,
          // modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d"],
          toImageButtonOptions: { filename: "source_weights" },
          // Allow users to edit chart
          showEditInChartStudio: true,
          plotlyServerURL: "https://chart-studio.plotly.com",
        }}
      />
    );
  } else {
    return (
      // Initial startup plot
      <ResponsivePlot
        // React re-renders the plot when any state, prop, or parent component changes
        divId={`source-weights-plot-${numPhotometrySubmit}`}
        data={[]}
        layout={{
          title: "(Percent of Source Flux Contained in Pixel)",
          font: { color: "white", size: 14 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            showgrid: true,
            title: "<i>x</i> (arcsec)",
            type: "linear",
            autorange: true,
            range: [-1, 1],
          },
          yaxis: {
            showgrid: true,
            title: "<i>y</i> (arcsec)",
            type: "linear",
            autorange: true,
            range: [-1, 1],
          },
          margin: { r: 30 },
          annotations: [
            {
              text: "Please submit a Photometry<br />calculation first",
              xref: "paper",
              yref: "paper",
              showarrow: false,
              font: {
                size: 20,
              },
            },
          ],
        }}
        useResizeHandler={true}
        config={{
          displaylogo: false,
          // modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d"],
          toImageButtonOptions: { filename: "source_weights" },
          // Allow users to edit chart
          showEditInChartStudio: true,
          plotlyServerURL: "https://chart-studio.plotly.com",
        }}
      />
    );
  }
};

export default SourceWeightsPlot;
