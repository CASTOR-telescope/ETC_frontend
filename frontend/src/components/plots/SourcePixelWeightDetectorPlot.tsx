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
import { arange } from "./Math";

type SourcePixelWeightDetectorPlotProps = {
  numUVMOSSubmit: number;
};

const SourcePixelWeightDetectorPlot: React.FC<SourcePixelWeightDetectorPlotProps> = ({ numUVMOSSubmit }) => {
  if (sessionStorage.getItem("uvmosParams") !== null) {
    // Update to proper sessionStorage key after
    let uvmosParams = JSON.parse(`${sessionStorage.getItem("uvmosParams")}`);
    let sourceDetector = JSON.parse(uvmosParams["sourcePixelWeight"]["source_detector"]); // need to parse twice...
    let center_pix = JSON.parse(uvmosParams["sourcePixelWeight"]["centerPix"])


    let slitHeightPix = uvmosParams["slitHeightPixel"]; // pixels

    let plotLengths = [sourceDetector.length, sourceDetector[0].length];
    let tot_xpixels = plotLengths[1]


    // Number of pixels on the side of the central pixel corresponding to the input wavelength.
    let num_side_pix = 3


      // ticks and their corresponding labels

    let xTicks = arange(-0.5,tot_xpixels,1)
    let yTicks = arange(-0.5,slitHeightPix,1)
    let xTicksLabels = arange(0,tot_xpixels + 1)
    let yTicksLabels = arange(0,slitHeightPix+1)


    return (
      <ResponsivePlot
        // React re-renders the plot when any state, prop, or parent component changes
        divId={`source-weights-plot-${numUVMOSSubmit}`}
        data={[
          {
            z: sourceDetector,
            type: "heatmap",
            colorscale: "Electric",
            colorbar: {
              title: {
                text: "Normalized Intensity",
                side: "right",
                font: { size: 14 },
              }
            },
            xgap: 1,
            ygap: 1,
          },
        ]}
        layout={{
          title: "(Source Viewed on the detector)",
          font: { color: "white", size: 10 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            tickvals: xTicks,
            ticktext: xTicksLabels,
            showgrid: false,
            title: "Pixel",
            type: "linear",
            autorange: false,
            range: [center_pix - 0.5 - num_side_pix, center_pix - 0.5 + num_side_pix],
          },
          yaxis: {
            tickvals: yTicks,
            ticktext: yTicksLabels,
            showgrid: false,
            title: "Pixel",
            type: "linear",
            autorange: true,
            range: [0, slitHeightPix],
          },
          margin: { t: 60 },
        }}
        useResizeHandler={true}
        config={{
          displaylogo: false,
          toImageButtonOptions: { filename: "source_pixel_weights" },
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
        divId={`source-pixel-weights-plot-${numUVMOSSubmit}`}
        data={[]}
        layout={{
          title: "(Source Viewed on the detector)",
          font: { color: "white", size: 11 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            showgrid: false,
            title: "Pixel",
            type: "linear",
            autorange: true,
            range: [0, 2],
          },
          yaxis: {
            showgrid: false,
            title: "Pixel",
            type: "linear",
            autorange: true,
            range: [0, 5],
          },
          margin: { r: 26 },
          annotations: [
            {
              text: "Please submit a UVMOS Spectroscopy<br />calculation first",
              xref: "paper",
              yref: "paper",
              showarrow: false,
              font: {
                size: 12,
              },
            },
          ],
        }}
        useResizeHandler={true}
        config={{
          displaylogo: false,
          toImageButtonOptions: { filename: "source_pix_weights" },
          // Allow users to edit chart
          showEditInChartStudio: true,
          plotlyServerURL: "https://chart-studio.plotly.com",
        }}
      />
    );
  }
};

export default SourcePixelWeightDetectorPlot;
