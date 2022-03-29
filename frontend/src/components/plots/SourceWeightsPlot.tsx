import { themeBackgroundColor } from "../DarkModeTheme";
import ResponsivePlot from "../ResponsivePlot";

type SourceWeightsPlotProps = {
  numPhotometrySubmit: number;
};

const SourceWeightsPlot: React.FC<SourceWeightsPlotProps> = ({ numPhotometrySubmit }) => {
  // Re-render plot (more robust this way because it persists across refreshes, unlike
  // numTelescopeSaved > 0)
  const data = [];
  if (sessionStorage.getItem("photometryParams") !== null) {
    // Update to proper sessionStorage key after
    let photometryParams = JSON.parse(`${sessionStorage.getItem("photometryParams")}`);
    let sourceWeights = JSON.parse(photometryParams["sourceWeights"]); // need to parse twice...
    let extent = photometryParams["aperExtent"]; // [xmin, xmax, ymin, ymax]
    let effNpix = photometryParams["effNpix"];
    console.log("updating SourceWeightsPlot");
    let plotLengths = [sourceWeights.length, sourceWeights[0].length];
    return (
      <ResponsivePlot
        // React re-renders the plot when any state, prop, or parent component changes
        divId={`source-weights-plot-${numPhotometrySubmit}`}
        data={[
          {
            z: sourceWeights,
            type: "heatmap",
            colorscale: "Electric",
            colorbar: {
              title: {
                text: "Flux Relative to Source Center",
                side: "right",
                font: { size: 14 },
              },
            },
            x0: extent[0],
            dx: (extent[1] - extent[0]) / plotLengths[1],
            y0: extent[2],
            dy: (extent[3] - extent[2]) / plotLengths[0],
            transpose: false,
          },
        ]}
        layout={{
          // title: {
          //   text: "Effective No. of Pixels: " + Math.round(100 * effNpix) / 100,
          //   font: { size: 18 },
          // },
          font: { color: "white", size: 14 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            showgrid: true,
            title: "<i>x</i> (arcsec)",
            type: "linear",
            autorange: false,
            range: [extent[0], extent[1]],
          },
          yaxis: {
            showgrid: true,
            title: "<i>y</i> (arcsec)",
            type: "linear",
            autorange: false,
            range: [extent[2], extent[3]],
          },
          margin: { t: 40 }, // if no title
          // pad: { t: 0, b: 0, l: 0, r: 0 },
          // margin: { t: 20, b: 20, l: 20, r: 20 },

          // layout: {
          //   autorange: false,
          // },
          // yaxis2: {
          //   title: "Source Flux Density (erg s⁻¹ cm⁻² Å⁻¹)",
          //   showgrid: false,
          //   gridcolor: "grey",
          //   overlaying: "y",
          //   side: "right",
          //   visible: true,
          //   exponentformat: "power",
          //   automargin: true,
          //   rangemode: "tozero",
          // },
          // margin: { t: 60 },
          // showlegend: true,
          // // Put legend on top left
          // legend: {
          //   x: 0,
          //   xanchor: "left",
          //   y: 1,
          // },
        }}
        useResizeHandler={true}
        config={{
          displaylogo: false,
          modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d"],
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
        data={
          [
            // {
            //   x: [],
            //   y: [],
            //   marker: { color: "transparent", size: 0 },
            //   yaxis: "y",
            // },
            // {
            //   x: [],
            //   y: [],
            //   marker: { color: "transparent", size: 0 },
            //   yaxis: "y2",
            // },
          ]
        }
        layout={{
          title: "(Relative Source Flux in Aperture)",
          font: { color: "white", size: 14 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            showgrid: true,
            title: "<i>x</i> (arcsec)",
            type: "linear",
            autorange: false,
            range: [-1, 1],
          },
          yaxis: {
            showgrid: true,
            title: "<i>y</i> (arcsec)",
            type: "linear",
            autorange: false,
            range: [-1, 1],
          },
          margin: { r: 30 },
          // xaxis: {
          //   showgrid: true,
          //   gridcolor: "grey",
          //   title: "Wavelength (Å)",
          //   range: [1000, 6000],
          //   visible: true,
          // },
          // yaxis: {
          //   showgrid: true,
          //   gridcolor: "grey",
          //   title: "Passband Reponse",
          //   range: [0, 1],
          //   visible: true,
          //   rangemode: "tozero",
          // },
          // yaxis2: {
          //   title: "Source Flux Density (erg s⁻¹ cm⁻² Å⁻¹)",
          //   showgrid: false,
          //   gridcolor: "grey",
          //   overlaying: "y",
          //   side: "right",
          //   // range: [0, 1e-15],
          //   visible: true,
          //   exponentformat: "power",
          //   automargin: true,
          //   rangemode: "tozero",
          // },
          // margin: { t: 26 },
          // showlegend: false,
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
          modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d"],
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
