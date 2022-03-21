import { API_URL } from "service/env";
// import logo from "./logo-fullsize.png";
import "./App.css";
import "./components/react-tabs.css";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import { DarkModeTheme } from "./components/DarkModeTheme";
import { Container, CssBaseline } from "@mui/material";
import "./components/react-resizable.css";
import "./components/react-grid-layout.css";

import TabForms from "./components/TabForms";
// import ApiService from "./service/ApiService";

import { Allotment } from "allotment";
import "allotment/dist/style.css";
// import "./components/allotment.css";

import ResponsivePlot from "./components/ResponsivePlot";
import ResponseCurveSpectrumPlot from "./components/plots/ResponseCurveSpectrumPlot";
import { useEffect, useState } from "react";
// import PanePlots from "./components/PanePlots";

// const myLogo: string = process.env.PUBLIC_URL + "/logo-fullsize.png";

// FIXME: fix react-tabs sizing when .App height:100vh. Alternatively, fix .App min-height:100vh

function App() {
  // Set Material UI theme
  useTheme();
  // const theme = useTheme();

  // console.log(window.location);
  // console.log("api_url", API_URL);

  // To update the ResponseCurveSpectrumPlot once new Telescope parameters are returned
  const [numTelescopeSaved, setNumTelescopeSaved] = useState(0);
  const incrNumTelescopeSaved = () => {
    setNumTelescopeSaved(numTelescopeSaved + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            position: "relative",
            width: "100%",
            // height: "100vh",
            height: "100%",
          }}
        >
          <Allotment defaultSizes={[50, 50]} minSize={0}>
            <div
              style={{
                // Allow the user to scroll overflowed content
                width: "100%",
                height: "100%",
                overflow: "auto",
              }}
            >
              <Allotment.Pane>
                <TabForms incrNumTelescopeSaved={incrNumTelescopeSaved} />
              </Allotment.Pane>
            </div>

            <Allotment.Pane>
              <Allotment vertical defaultSizes={[50, 50]} minSize={0}>
                <Allotment.Pane>
                  <Allotment defaultSizes={[50, 50]} minSize={0}>
                    <ResponsivePlot
                      divId="source-weights-plot"
                      data={[
                        {
                          x: [1, 2, 3],
                          y: [2, 6, 3],
                          type: "scatter",
                          mode: "lines+markers",
                          marker: { color: "red" },
                        },
                        { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
                      ]}
                      layout={{
                        title: "Source Pixel Weights",
                        font: { color: "white" },
                        autosize: true,
                        paper_bgcolor: "#282c34", // MUI background.default color
                        plot_bgcolor: "#282c34", // MUI background.default color
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
                    {/* <ResponsivePlot
                      divId="source-weights-plot"
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
                        title: "Source Weights",
                        font: { color: "white" },
                        autosize: true,
                        paper_bgcolor: "#282c34", // MUI background.default color
                        plot_bgcolor: "#282c34", // MUI background.default color
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
                    /> */}

                    <ResponsivePlot
                      divId="aper-weights-plot"
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
                        title: "Aperture Pixel Weights",
                        font: { color: "white" },
                        autosize: true,
                        paper_bgcolor: "#282c34", // MUI background.default color
                        plot_bgcolor: "#282c34", // MUI background.default color
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
                  </Allotment>
                </Allotment.Pane>
                <Allotment.Pane>
                  <ResponseCurveSpectrumPlot numTelescopeSaved={numTelescopeSaved} />
                </Allotment.Pane>
              </Allotment>
            </Allotment.Pane>
          </Allotment>
        </div>
      </header>
    </div>
  );
}

function DarkThemeApp() {
  return (
    <ThemeProvider theme={DarkModeTheme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <App />
      </Container>
    </ThemeProvider>
  );
}

export default DarkThemeApp;
