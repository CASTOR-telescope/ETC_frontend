import "./App.css";
import "./components/react-tabs.css";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import { DarkModeTheme } from "./components/DarkModeTheme";
import { Container, CssBaseline } from "@mui/material";
import "./components/react-resizable.css";
import "./components/react-grid-layout.css";

import TabForms from "./components/TabForms";

import { Allotment } from "allotment";
import "allotment/dist/style.css";
// import "./components/allotment.css";

import ResponsivePlot from "./components/ResponsivePlot";
import ResponseCurveSpectrumPlot from "./components/plots/ResponseCurveSpectrumPlot";
import { useEffect, useState } from "react";
import SourceWeightsPlot from "./components/plots/SourceWeightsPlot";
import AperMaskPlot from "./components/plots/AperMaskPlot";
// import PanePlots from "./components/PanePlots";

function App() {
  // Set Material UI theme
  useTheme();
  // const theme = useTheme();

  // console.log(window.location);
  // console.log("api_url", API_URL);

  // To update the ResponseCurveSpectrumPlot once new Telescope parameters are returned
  // TODO: rename this to reflect source + telescope dependence
  const [numTelescopeSaved, setNumTelescopeSaved] = useState(0);
  const incrNumTelescopeSaved = () => {
    setNumTelescopeSaved(numTelescopeSaved + 1);
  };

  // To update image plots on each new Photometry submission
  const [numPhotometrySubmit, setNumPhotometrySubmit] = useState(0);
  const incrNumPhotometrySubmit = () => {
    setNumPhotometrySubmit(numPhotometrySubmit + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            position: "relative",
            width: "100%",
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
                <TabForms
                  incrNumTelescopeSaved={incrNumTelescopeSaved}
                  incrNumPhotometrySubmit={incrNumPhotometrySubmit}
                />
              </Allotment.Pane>
            </div>

            <Allotment.Pane>
              <Allotment vertical defaultSizes={[50, 50]} minSize={0}>
                <Allotment.Pane>
                  <Allotment defaultSizes={[50, 50]} minSize={0}>
                    <SourceWeightsPlot numPhotometrySubmit={numPhotometrySubmit} />
                    <AperMaskPlot numPhotometrySubmit={numPhotometrySubmit} />
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
