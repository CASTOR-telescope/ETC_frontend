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

type Show2DSnrResolutionPlotProps = {
    numGrismSubmit: number;
}

const Show2DSnrResolutionPlot: React.FC<Show2DSnrResolutionPlotProps> = ({numGrismSubmit}) => {
    if (sessionStorage.getItem("grismParams") !== null) {
        let grismParams = JSON.parse(`${sessionStorage.getItem("grismParams")}`);

        let grism2d = JSON.parse(grismParams["grism2d"])

        return (
            <ResponsivePlot
            // React re-renders the plot when any state, prop, or parent component changes
            divId = {`source-2D-SNR-resolution-plot-${numGrismSubmit}`}
            data={[
              {
                z: grism2d,
                type: "heatmap",
                colorscale: "Viridis",
                colorbar: {
                  title:{
                    text: "SNR",
                    side: "right",
                    font: {size: 14}
                  }
              }
            },
            ]}
            layout={{
                title: "(2D SNR per resolution)",
                font: {color: "white", size: 14},
                autosize: true,
                paper_bgcolor: themeBackgroundColor,
                plot_bgcolor: themeBackgroundColor,
                xaxis: {
                    showgrid: true,
                    gridcolor: "grey",
                    title: "Pixels (Dispersion direction)",
                },
                yaxis: {
                    showgrid: true,
                    gridcolor: "grey",
                    title: "Pixels (Spatial direction)",
                    rangemode: "tozero",
                },
                margin: {t: 60},
                showlegend: true,
            }}
            useResizeHandler={true}
            config={{
                displaylogo: false,
                toImageButtonOptions: {filename:
                "grism_2d_SNR_per_resolution"
                },
                // Allow users to edit chart
                showEditInChartStudio: true,
                plotlyServerURL: "https://chart-studio.plotly.com",
            }}
            />
        )
    } else {
        return (
        // Initial startup plot
      <ResponsivePlot
      // React re-renders the plot when any state, prop, or parent component changes
      divId={`source-2D-SNR-resolution-plot-${numGrismSubmit}`}
      data={[]}
      layout={{
        title: "(Source 2 Dimension Signal-Noise-Ratio on the detector)",
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
            text: "Please submit a Grism Spectroscopy<br />calculation first",
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
        )
    }

}


export default Show2DSnrResolutionPlot;