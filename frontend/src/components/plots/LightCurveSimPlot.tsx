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

import { useEffect, useState } from "react";
import { themeBackgroundColor } from "../DarkModeTheme";
import ResponsivePlot from "../ResponsivePlot";
import localforage from "localforage";

type LightCurveSimPlotProps = {
    numTransitSubmit: number;
};

const LightCurveSimPlot: React.FC<LightCurveSimPlotProps> = ({
    numTransitSubmit,
}) => {

    const data = [];

    const [plotData, setPlotData] = useState<{light_curve: {
      x_sim_castor: number[],
      y_sim_castor: number[],
      y_error: number[],
      x_transit_model: number[],
      y_transit_model: number[],
      xlim: number[]
    }}>({
    light_curve: {
        x_sim_castor : [],
        y_sim_castor : [],
        y_error: [],
        x_transit_model: [],
        y_transit_model: [],
        xlim: []
    }
    });

    useEffect(()=>{
        localforage.getItem("transitParams").then((res: any) => {
            setPlotData(JSON.parse(res))
        })
    }, [numTransitSubmit])

  if (plotData !== null) {

    let x_sim_castor = plotData.light_curve.x_sim_castor
    let y_sim_castor = plotData.light_curve.y_sim_castor
    let y_error = plotData.light_curve.y_error
    let xlim = plotData.light_curve.xlim
    let x_transit_model = plotData.light_curve.x_transit_model
    let y_transit_model = plotData.light_curve.y_transit_model
    
    data.push(
        {
            x: x_sim_castor,
            y: y_sim_castor,
            error_y: {
                type: 'data',
                array: y_error,
                visible: true,
                thickness: 1.5,
                width: 3
            },
            name: "Simulated CASTOR",
            type: 'scatter',
            mode: 'markers',
            marker: {
                size: 5,
                symbol: 'circle',
                line: {
                    width: 1
                }
            }
        },
        {
            x: x_transit_model,
            y: y_transit_model,
            mode: 'lines',
            name: "Transit Model"
        }
    )
    return (
      <ResponsivePlot
      divId={`simulated-lightcurve-${numTransitSubmit}`}
      data={data}
      layout={{
        title: "Simulated Lightcurve",
        font: { color: "white", size: 14},
        autosize: true,
        paper_bgcolor: themeBackgroundColor,
        plot_bgcolor: themeBackgroundColor,
        xaxis: {
          title: "t-t0 (day)",
          range: [xlim[0], xlim[1]],
          zeroline: false,
          ticks: 'inside',
          mirror: 'ticks',
          ticklen: 6,
          tickcolor: 'white',
          minor: {
            ticks: "inside",
            ticklen: 3,
          },
          showline: true,
        },
        yaxis: { 
          title: "Normalized Flux (ppt)",
          range: [Math.min.apply(null,y_transit_model) - 0.1 ,Math.max.apply(null,y_transit_model) + 0.2],
          zeroline: false,
          ticks: 'inside',
          mirror: 'ticks',
          ticklen: 6,
          showgrid: false,
          tickcolor: "white",
          minor: {
            ticks: "inside",
            ticklen: 3,
          },
          showline: true,
        },
        margin: { t: 60 },
        showlegend: true,
        legend: {
          x: 0.01,
          xanchor: "left",
          y: 1.1,
          font: {
            size: 10
          }
        },
      }}
      useResizeHandler={true}
      config={{
        displaylogo: false,
        toImageButtonOptions: {filname: "simulated_lightcurve"},
        showEditInChartStudio: true,
        plotlyServerURL: "https://chart-studio.plotly.com"
      }}
      />
    );
  } else {
    return (
      // Initial startup plot
      <ResponsivePlot
        // React re-renders the plot when any state, prop, or parent component changes
        divId={`simulated-lightcurve-${numTransitSubmit}`}
        data={[
          {
            x: [],
            y: [],
            marker: { color: "transparent", size: 0 },
            yaxis: "y",
          }
        ]}
        layout={{
          title: "(Generated Simulated Lightcurve)",
          font: { color: "white", size: 14 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            showgrid: false,
            title: "t - t0 ([d])",
            ticks: 'inside',
            mirror: 'ticks',
            showline: true,
            zeroline: false,
          },
          yaxis: {
            showgrid: false,
            title: "Normalized Flux [ppt]",
            ticks: 'inside',
            mirror: 'ticks',
            showline: true,
            zeroline: false,
          },
          margin: { r: 26 },
          showlegend: false,
          annotations: [
            {
              text: "Please save Transit parameters first",
              xref: "paper",
              yref: "paper",
              showarrow: false,
              font: {
                size: 28,
              },
            },
          ],
        }}
        useResizeHandler={true}
        config={{
          displaylogo: false,
          // modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d"],
          toImageButtonOptions: { filename: "simulated_light_curve" },
          // Allow users to edit chart
          showEditInChartStudio: true,
          plotlyServerURL: "https://chart-studio.plotly.com",
        }}
      />
    );
  }
};

export default LightCurveSimPlot;
