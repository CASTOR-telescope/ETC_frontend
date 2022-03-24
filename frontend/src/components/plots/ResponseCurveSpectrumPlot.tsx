import { themeBackgroundColor } from "../DarkModeTheme";
import ResponsivePlot from "../ResponsivePlot";

type ResponseCurveSpectrumPlotProps = {
  numTelescopeSaved: number;
};

const ResponseCurveSpectrumPlot: React.FC<ResponseCurveSpectrumPlotProps> = ({
  numTelescopeSaved,
}) => {
  // Re-render plot (more robust this way because it persists across refreshes, unlike
  // numTelescopeSaved > 0)
  const data = [];
  if (sessionStorage.getItem("telescopeParams") !== null) {
    // Update to proper sessionStorage key after
    let plotData = JSON.parse(`${sessionStorage.getItem("telescopeParams")}`)[
      "fullPassbandCurves"
    ];
    console.log("updating ResponseCurveSpectrumPlot telescopeParams");
    data.push(
      {
        x: plotData.uv.wavelength,
        y: plotData.uv.response,
        mode: "lines",
        line: { color: "magenta" }, // or "violet" or "fuchsia"
        name: "UV-Band",
      },
      {
        x: plotData.u.wavelength,
        y: plotData.u.response,
        mode: "lines",
        line: { color: "cyan" },
        name: "u-Band",
      },
      {
        x: plotData.g.wavelength,
        y: plotData.g.response,
        mode: "lines",
        line: { color: "palegreen" },
        name: "g-Band",
      }
    );
    // data.push({
    //   x: [1000, 3000, 10000],
    //   y: [25, 40, 35],
    //   mode: "lines",
    //   line: { color: "white" },
    //   name: "Source",
    //   yaxis: "y2",
    //   // line: { width: 1 },
    // });
    if (sessionStorage.getItem("sourceParams") !== null) {
      // Recall that telescopeParams must not be null to have sourceParams
      console.log("updating ResponseCurveSpectrumPlot sourceParams");
      let plotData = JSON.parse(`${sessionStorage.getItem("sourceParams")}`);
      data.push({
        x: plotData.wavelengths,
        y: plotData.spectrum,
        mode: "lines",
        line: { color: "white" },
        name: "Source",
        yaxis: "y2",
        // line: { width: 1 },
      });
    }
    console.log("ResponseCurveSpectrumPlot data", data);
    return (
      <ResponsivePlot
        // React re-renders the plot when any state, prop, or parent component changes
        divId={`passband-source-spectrum-plot-${numTelescopeSaved}`}
        data={data}
        layout={{
          // title: "Passband Response Curves & Source Spectrum",
          font: { color: "white", size: 14 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            showgrid: true,
            gridcolor: "grey",
            title: "Wavelength (Å)",
            range: [1000, 6000],
          },
          yaxis: {
            showgrid: true,
            gridcolor: "grey",
            title: "Passband Reponse",
            rangemode: "tozero",
          },
          yaxis2: {
            title: "Source Flux Density (erg s⁻¹ cm⁻² Å⁻¹)",
            showgrid: false,
            gridcolor: "grey",
            overlaying: "y",
            side: "right",
            visible: true,
            exponentformat: "power",
            automargin: true,
            rangemode: "tozero",
            range: [0, 9.5e-16], // REVIEW: remove after demo
          },
          margin: { t: 12 },
          showlegend: true,
          // Put legend on top left
          legend: {
            x: 0,
            xanchor: "left",
            y: 1,
          },
        }}
        useResizeHandler={true}
        config={{
          displaylogo: false,
          modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d"],
          toImageButtonOptions: { filename: "response_and_spectrum" },
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
        divId={`passband-source-spectrum-plot-${numTelescopeSaved}`}
        data={[
          {
            x: [],
            y: [],
            marker: { color: "transparent", size: 0 },
            yaxis: "y",
          },
          {
            x: [],
            y: [],
            marker: { color: "transparent", size: 0 },
            yaxis: "y2",
          },
        ]}
        layout={{
          // title: "Passband Response Curves & Source Spectrum",
          font: { color: "white", size: 14 },
          autosize: true,
          paper_bgcolor: themeBackgroundColor,
          plot_bgcolor: themeBackgroundColor,
          xaxis: {
            showgrid: true,
            gridcolor: "grey",
            title: "Wavelength (Å)",
            range: [1000, 6000],
            visible: true,
          },
          yaxis: {
            showgrid: true,
            gridcolor: "grey",
            title: "Passband Reponse",
            range: [0, 1],
            visible: true,
            rangemode: "tozero",
          },
          yaxis2: {
            title: "Source Flux Density (erg s⁻¹ cm⁻² Å⁻¹)",
            showgrid: false,
            gridcolor: "grey",
            overlaying: "y",
            side: "right",
            // range: [0, 1e-15], // REVIEW: remove after demo
            visible: true,
            exponentformat: "power",
            automargin: true,
            rangemode: "tozero",
          },
          margin: { t: 26 },
          showlegend: false,
          annotations: [
            {
              text: "Please save Telescope or Source parameters first",
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
          modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d"],
          toImageButtonOptions: { filename: "response_and_spectrum" },
          // Allow users to edit chart
          showEditInChartStudio: true,
          plotlyServerURL: "https://chart-studio.plotly.com",
        }}
      />
    );
  }
};

export default ResponseCurveSpectrumPlot;
