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

type CastorSpectrumPlotProps = {
    numUVMOSSubmit: number;
};

const CastorSpectrumPlot: React.FC<CastorSpectrumPlotProps> = ({
    numUVMOSSubmit,
}) => {
    const data = [];
    if (sessionStorage.getItem("uvmosParams") !== null){
        let plotData = JSON.parse(`${sessionStorage.getItem("uvmosParams")}`)[
            "spectrum"
        ];
        data.push(
            {
                x: plotData.waves,
                y: plotData.source_response,
                mode: "lines",
                line: {color: "blue"},
                name: "Source Spectrum"
            },
            {
                x: plotData.waves,
                y: plotData.background_response,
                mode: "lines",
                line: {color: "orange"},
                name: "Background Spectrum"
            },
        )
    return (
        <ResponsivePlot
        divId={`CASTOR-spectra-plot-${numUVMOSSubmit}`}
        data={data}
        layout={{
            title: "(CASTOR Spectra)",
            font: {color: "white", size: 14},
            autosize: true,
            paper_bgcolor: themeBackgroundColor,
            plot_bgcolor: themeBackgroundColor,
            xaxis: {
                showgrid: true,
                gridcolor: "grey",
                title: "Wavelength (Å)",
            },
            yaxis: {
                showgrid: true,
                gridcolor: "grey",
                title: "Flux [counts / second ]",
                rangemode: "tozero",
            },
            margin: {t: 60},
            showlegend: true,
            legend: {
                x: 0,
                xanchor: "left",
                y: 1,
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
            divId = {`CASTOR-spectra-plot-${numUVMOSSubmit}`}
            data = {[
                {
                    x: [],
                    y: [],
                    marker: {color: "transparent", size: 0},
                    yaxis: "y",
                }
            ]}
            layout={{
                title: "(CASTOR Spectra)",
                font: {color: "white", size: 14},
                autosize: true,
                paper_bgcolor: themeBackgroundColor,
                plot_bgcolor: themeBackgroundColor,
                xaxis: {
                    showgrid: true,
                    gridcolor: "grey",
                    title: "Wavelength (Å)",
                },
                yaxis: {
                    showgrid: true,
                    gridcolor: "grey",
                    title: "Flux [counts / second ]",
                    range: [0,1],
                    visible: true,
                    rangemode: "tozero",
                    automargin: true,
                },
                margin: {r: 26},
                showlegend: false,
                annotations: [
                    {
                        text: "Please save UVMOS Spectroscopy parameters first",
                        xref: "paper",
                        yref: "paper",
                        showarrow: false,
                        font: {
                            size: 22,
                        }
                    }
                ]
            }}
            useResizeHandler={true}
            config={{
                displaylogo: false,
                toImageButtonOptions: {filename: "castor_spectrum"},
                showEditInChartStudio: true,
                plotlyServerURL: "https://chart-studio.plotly.com"
            }}
            />
        )
    }
}

export default CastorSpectrumPlot;

