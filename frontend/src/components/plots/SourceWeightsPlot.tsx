import { themeBackgroundColor } from "../DarkModeTheme";
import ResponsivePlot from "../ResponsivePlot";

/**
 * Returns the minimum number above zero in a 1D array.
 */
const getMinAboveZero = (arr: number[]): number => {
  return Math.min(...arr.filter(Number));
};
const getMaxAboveZero = (arr: number[]): number => {
  return Math.max(...arr.filter(Number));
};

type SourceWeightsPlotProps = {
  numPhotometrySubmit: number;
};

const SourceWeightsPlot: React.FC<SourceWeightsPlotProps> = ({ numPhotometrySubmit }) => {
  if (sessionStorage.getItem("photometryParams") !== null) {
    // Update to proper sessionStorage key after
    let photometryParams = JSON.parse(`${sessionStorage.getItem("photometryParams")}`);
    let sourceWeights = JSON.parse(photometryParams["sourceWeights"]); // need to parse twice...
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
                text: "Flux Relative to Source Center (incl. fractional pixels)",
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
          margin: { t: 40 }, // if no title
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
          title: "(Relative Source Flux in Aperture)",
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
