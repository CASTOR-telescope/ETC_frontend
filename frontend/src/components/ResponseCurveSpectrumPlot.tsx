import { themeBackgroundColor } from "./DarkModeTheme";
import ResponsivePlot from "./ResponsivePlot";

const ResponseCurveSpectrumPlot = () => {
  return (
    <ResponsivePlot
      divId="passband-source-spectrum-plot"
      data={[
        {
          x: [1, 4, 9, 16, 25],
          y: [1, 2, 3, 4, 5],
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "PaleGreen" },
        },
      ]}
      layout={{
        title: "Passband Response Curves + Source Spectrum",
        font: { color: "white" },
        autosize: true,
        paper_bgcolor: themeBackgroundColor,
        plot_bgcolor: themeBackgroundColor,
        xaxis: {
          showgrid: true,
          gridcolor: "grey",
          title: "Integration Time (s)",
        },
        yaxis: {
          showgrid: true,
          gridcolor: "grey",
          title: "Signal-to-Noise Ratio",
        },
      }}
      useResizeHandler={true}
      // style={{ width: "100%", height: "100%" }}
      config={{ displaylogo: false }}
    />
  );
};

export default ResponseCurveSpectrumPlot;
