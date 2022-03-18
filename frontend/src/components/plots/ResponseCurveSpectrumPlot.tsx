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
  if (sessionStorage.getItem("telescopeParams") !== null) {
    // setIsNewTelescopeSaved(false);
    // Update to proper sessionStorage key after
    const plotData = JSON.parse(`${sessionStorage.getItem("telescopeParams")}`)[
      "fullPassbandCurves"
    ];
    console.log("updating ResponseCurveSpectrumPlot");
    return (
      <ResponsivePlot
        // React re-renders the plot when any state, prop, or parent component changes
        divId={`passband-source-spectrum-plot-${numTelescopeSaved}`}
        data={[
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
          },
          {
            x: [1000, 3000, 10000],
            y: [25, 40, 35],
            mode: "lines",
            line: { color: "white" },
            name: "Source Spectrum",
            yaxis: "y2",
            // line: { width: 1 },
          },
          // Just to check if updating properly
          {
            x: [3500],
            y: [
              JSON.parse(`${sessionStorage.getItem("telescopeParams")}`)[
                "mirrorDiameter"
              ] / 3,
            ],
            name: "1/3 mirrorDiameter (for debug)",
            mode: "markers",
            marker: { color: "red", size: 18 },
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
          },
          yaxis: {
            showgrid: true,
            gridcolor: "grey",
            title: "Passband Reponse",
          },
          yaxis2: {
            title: "erg s⁻¹ cm⁻² Å⁻¹",
            overlaying: "y",
            side: "right",
          },
          margin: {
            // l: 12,
            // r: 12,
            // b: 12,
            t: 12,
            // pad: 4,
          },
          showlegend: true,
          // Put legend on top left
          legend: {
            x: 0,
            xanchor: "left",
            y: 1,
          },
        }}
        useResizeHandler={true}
        // style={{ width: "100%", height: "100%" }}
        config={{
          displaylogo: false,
          toImageButtonOptions: { filename: "response_and_spectrum" },
          // Allow users to edit chart
          showEditInChartStudio: true,
          plotlyServerURL: "https://chart-studio.plotly.com",
        }}
      />
    );
  } else {
    // } else if (sessionStorage.getItem("telescopeParams") === null) {
    return (
      // Maybe put CASTOR logo here!
      <div>Please save Telescope parameters first (I'll prettify this message later)</div>
    );
  }
};

export default ResponseCurveSpectrumPlot;
