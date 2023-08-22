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
import { useEffect, useState } from "react";

import localForage from "localforage";

type SceneSimFoVPlotProps = {
  numTransitSubmit: number;
};

const SceneSimFoVPlot: React.FC<SceneSimFoVPlotProps> = ({
  numTransitSubmit,
}) => {
    const data = [];
    const annotations = [];

    const pako = require('pako')

    const [plotData, setPlotData] = useState<{ccd_dim: number[], gaia: {
        ra: number[],
        dec: number[],
        x: number[],
        y: number[]
        gs_i: number[],
        _f: string,
    }, xout: number, yout: number}>({
        ccd_dim: [],
        // scene_sim: {
        //     rotation_array: '[]',
        //     grid_x_array: '[]',
        //     grid_y_array: '[]',
        //     coord_str_array: '[]'
        // },
        gaia: {
            ra: [],
            dec: [],
            x: [],
            y: [],
            gs_i: [],
            _f: ''
        },
        xout: 0,
        yout: 0,
        // result_g_ra: '[]',
        // result_g_dec: '[]',
    });

    useEffect(() => {
        localForage.getItem("transitParams").then((res: any) => {
            setPlotData(JSON.parse(res))} )
    }, [numTransitSubmit])
    
    if (plotData !== null){
        
        let _f = plotData.gaia._f

        // compressed json response is decompressed in the frontend
        // https://stackoverflow.com/questions/72947222/ 
        if (_f){
            let compressedData = Uint8Array.from(window.atob(_f), (c) => c.charCodeAt(0));
            let decompressedData = pako.inflate(compressedData, {to: "string"});
            let jsonObject = JSON.parse(decompressedData)

            // Adding scene

            let ccd_dim = plotData.ccd_dim
            let xout = plotData.xout
            let yout = plotData.yout

            let extent = [ Math.floor(ccd_dim[0]/2) - xout/2, Math.floor(ccd_dim[0]/2) + xout/2, Math.floor(ccd_dim[1]/2) - yout/2 - 2, Math.floor(ccd_dim[1]/2) + yout/2 - 2 ]

            let plotLengths = jsonObject.length === 0 ? [1,1] : [jsonObject.length, jsonObject[0].length];
            let px_scale_x = (extent[1] - extent[0]) / plotLengths[1];
            let px_scale_y = (extent[3] - extent[2]) / plotLengths[0];

            data.push(
                 {
                z: jsonObject.map((row: number[]) =>
                row.map((value: number) => Math.log10(value))),
                type: "heatmap",
                x0: extent[0],
                dx: px_scale_x,
                y0: extent[2],
                dy: px_scale_y,
                colorscale: 'Cividis',
                showscale: false,
            }
            )
        }

        let ccd_dim = plotData.ccd_dim
        let xout = plotData.xout
        let yout = plotData.yout

        let xlim = [-1.0,1.0].map(function(x) {return Math.floor(ccd_dim[0]/2) + xout * 0.7 * x})
        let ylim = [-1.0,1.0].map(function(x) {return Math.floor(ccd_dim[1]/2) + yout * 0.7 * x})
        
        // Plot target
        let x = plotData.gaia.x
        let y = plotData.gaia.y

        
        // Plot FoV boundary
        let _x = [0, ccd_dim[0], ccd_dim[0], 0, 0]
        let _y = [0, 0, ccd_dim[1], ccd_dim[1], 0]
        
        // Plot guide stars
        let gs_i = plotData.gaia.gs_i

            data.push({
                x: gs_i.map(i => x[i]),
                y: gs_i.map(i => y[i]),
                type: 'scatter',
                mode: 'markers',
                marker: {
                    color: 'rgb(255,0,0)',
                    size: 10,
                    symbol: "square-open-dot",
                    line: {
                        width: 1,
                    }
                }
            })


        data.push(
            {
                x: [x[0]],
                y: [y[0]],
                type: 'scatter',
                mode: 'markers',
                marker: {
                    color: 'rgb(255,0,0)',
                    size: 10,
                    symbol: "circle-open-dot",
                    line: {
                        width: 1,
                    }
                }
            },
            {
                x: _x,
                y: _y,
                line: {
                    color: 'rgb(255,0,0)'
                }
            },
            )

        return (
        <ResponsivePlot
        divId={`transit-scene-simulation-${numTransitSubmit}`}
        data={data}
        layout={{
            title: "Scene Simulation",
            font: {color: "white", size: 14},
            autosize: true,
            margin: {
                l: 130,
                r: 130,
                b: 50,
                t: 50,
                pad: 0
            },
            paper_bgcolor: themeBackgroundColor,
            //plot_bgcolor: themeBackgroundColor,
            xaxis : {
                title: "x [pxl]",
                showgrid: false,
                zeroline: false,
                range: [xlim[0],xlim[1]],
                ticks: 'inside',
                mirror: 'ticks',
                ticklen: 6,
                showline: true,
                tickvals: [0,500,1000,1500,2000],
                minor: {
                    ticks: 'inside',
                    ticklen: 3,
                    tickcolor: 'black',
                    dtick: 100,
                  }
            },
            yaxis : {
                title: "y [pxl]",
                showgrid: false,
                range: [ylim[0],ylim[1]],
                zeroline: false,
                ticks: 'inside',
                mirror: 'ticks',
                showline: true,
                ticklen: 6,
                minor: {
                    ticks: 'inside',
                    ticklen: 3,
                    tickcolor: 'grey',
                  },
            },
            showlegend: false,
            //annotations: annotations
        }}
        useResizeHandler={true}
        config={{
            displaylogo: false,
            toImageButtonOptions: {filename:
            "scene_simulation"
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
            divId = {`Source-viewed-through-fov-${numTransitSubmit}`}
            data = {[
                {
                    x: [],
                    y: [],
                    marker: {color: "transparent", size: 0},
                    yaxis: "y",
                }
            ]}
            layout={{
                title: "(Scene Simulation)",
                font: {color: "white", size: 14},
                paper_bgcolor: themeBackgroundColor,
                plot_bgcolor: themeBackgroundColor,
                xaxis: {
                    showgrid: false,
                    title: "[pxl]",
                    autorange: true,
                    range: [-200,2224],
                    ticks: 'inside',
                    mirror: 'ticks',
                    showline: true,
                    zeroline: false,
                },
                yaxis: {
                    showgrid: false,
                    title: "[pxl]",
                    range: [-200,2224],
                    visible: true,
                    ticks: 'inside',
                    mirror: 'ticks',
                    showline: true,
                    zeroline: false,
                },
                showlegend: false,
                annotations: [
                    {
                        text: "Please submit a Transit <br /> calculation first",
                        xref: "paper",
                        yref: "paper",
                        showarrow: false,
                        font: {
                            size: 20,
                        }
                    }
                ]
            }}
            useResizeHandler={true}
            config={{
                displaylogo: false,
                toImageButtonOptions: {filename: "plot_fov"},
                showEditInChartStudio: true,
                plotlyServerURL: "https://chart-studio.plotly.com"
            }}
            />
        )
    }
}

export default SceneSimFoVPlot;


