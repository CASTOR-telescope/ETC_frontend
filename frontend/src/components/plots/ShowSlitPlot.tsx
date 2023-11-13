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

import { themeBackgroundColor } from "components/DarkModeTheme";
import ResponsivePlot from "../ResponsivePlot";
import { linspace,meshgrid,gaussian2D } from "./Math";


type ShowSlitPlotProps = {
  numUVMOSSubmit: number;
};

const ShowSlitPlot: React.FC<ShowSlitPlotProps> = ({
  numUVMOSSubmit,
}) => {
    const data= [];
    const lenn = 10;
    if (sessionStorage.getItem("uvmosParams") !== null){
        let plotData = JSON.parse(`${sessionStorage.getItem("uvmosParams")}`)["showSlit"];
        let width = plotData["slitWidth"]
        let height = plotData["slitHeight"]
        let FWHM = plotData["FWHM"]

        //----------- Plot the slit
        let r = FWHM / 2
        let theta = linspace(0,2*Math.PI)
        var xFwhm = theta.map(function(theta) { return r*Math.cos(theta)})
        var yFwhm = theta.map(function(theta) { return r*Math.sin(theta)})

        //----------- Plot the slit
        let lenn = 10 //While plotting the slit, lenn is mulplied with either x axis or y axis, as done in the uvmos_spectroscopy.py 
        // file.
        var slitWidthArray = linspace(-width/2,width/2,lenn)
        var slitHeightArray = linspace(-height/2,height/2,lenn)

        //------------ Plot the entire light distribution

        let sigma = FWHM / (2*Math.sqrt(2*Math.log(2)))

        var nt = 500
        var xLight = linspace(-1,1,nt)
        var yLight = linspace(-1,1,nt)
        var XX = meshgrid(xLight,yLight)[0]
        var YY = meshgrid(xLight,yLight)[1]

        var ZZ = gaussian2D(XX,YY,sigma)

        //------------ Plot light that falls on the slit
        var nt = 600
        var xSlit = linspace(-width/2,width/2,nt)
        var ySlit = linspace(-height/2,height/2,nt)
        var XXSlit = meshgrid(xSlit,ySlit)[0]
        var YYSlit = meshgrid(xSlit,ySlit)[1]

        var ZZSlit = gaussian2D(XXSlit,YYSlit,sigma)


        data.push(  
            {
                x: xFwhm,
                y: yFwhm,
                mode: "lines",
                opacity: 0.5,
                line: {dash: 'dot', color: "black", width: 4},
                name: "FWHM"
            },
            {
              x: Array(slitHeightArray.length).fill((-width/2)),
              y: slitHeightArray,
              mode: "lines",
              line: {color: "red"},
              name: "Slit"
            },
            {
              x: Array(slitHeightArray.length).fill((width/2)),
              y: slitHeightArray,
              mode: "lines",
              line: {color: "red"},
              showlegend: false
            },
            {
              x: slitWidthArray,
              y: Array(slitWidthArray.length).fill((height/2)),
              mode: "lines",
              line: {color: "red"},
              showlegend: false
            },
            {
              x: slitWidthArray,
              y: Array(slitWidthArray.length).fill(-(height/2)),
              mode: "lines",
              line: {color: "red"},
              showlegend: false
            },
            {
              x: xLight,
              y: yLight,
              z: ZZ,
              type: 'heatmap',
              colorscale: 'greys',
            },
            {
              x: xSlit,
              y: ySlit,
              z: ZZSlit,
              type: 'heatmap',
              colorscale: 'Viridis',
              colorbar: {
                title: {
                  text: "Normalized Intensity",
                  side: "right",
                  font: { size: 14 },
                }
              }
            },
        )
    return (
        <ResponsivePlot
        divId={`Source-viewed-through-slit-plot-${numUVMOSSubmit}`}
        data={data}
        layout={{
            title: "(Source viewed through the slit)",
            font: {color: "white", size: 10},
            autosize: true,
            paper_bgcolor: themeBackgroundColor,
            plot_bgcolor: themeBackgroundColor,
            xaxis: {
                showgrid: false,
                title: "Arcseconds",
                autorange: true,
                //range: [-width - 0.25, width + 0.25], 
            },
            yaxis: {
                showgrid: false,
                title: "Arcseconds",
                autorange: true,
                //range: [-height - 0.25, height + 0.25],
                scaleanchor: "x",
            },
            margin: {t: 60},
            showlegend: true,
            legend: {
                font : {
                    color: "black"
                },
                bgcolor: 'rgba(0,0,0,0)',
                x: 0.1,
                xanchor: "left",
                y: 0.95,
                bordercolor: "Black",
                borderwidth: 2,
            }
        }}
        useResizeHandler={true}
        config={{
            displaylogo: false,
            toImageButtonOptions: {filename:
            "castor_spectrum"
            },
            // Allow users to edit chart
            showEditInChartStudio: true,
            plotlyServerURL: "https://chart-studio.plotly.com",
        }}
        />
    );

    } else {
        return (
            <ResponsivePlot
            divId = {`Source-viewed-through-slit-plot-${numUVMOSSubmit}`}
            data = {[
                {
                    x: [],
                    y: [],
                    marker: {color: "transparent", size: 0},
                    yaxis: "y",
                }
            ]}
            layout={{
                title: "(Source viewed through the slit)",
                font: {color: "white", size: 14},
                autosize: true,
                paper_bgcolor: themeBackgroundColor,
                plot_bgcolor: themeBackgroundColor,
                xaxis: {
                    showgrid: false,
                    title: "Arcseconds",
                    autorange: true,
                    range: [-0.5,0.5]
                },
                yaxis: {
                    showgrid: false,
                    title: "Arcseconds",
                    range: [-1,1],
                    visible: true,
                },
                margin: {r: 26},
                showlegend: false,
                annotations: [
                    {
                        text: "Please submit a UVMOS Spectroscopy <br /> calculation first",
                        xref: "paper",
                        yref: "paper",
                        showarrow: false,
                        font: {
                            size: 16,
                        }
                    }
                ]
            }}
            useResizeHandler={true}
            config={{
                displaylogo: false,
                toImageButtonOptions: {filename: "source_through_slit"},
                showEditInChartStudio: true,
                plotlyServerURL: "https://chart-studio.plotly.com"
            }}
            />
        )
    }
}

export default ShowSlitPlot;


