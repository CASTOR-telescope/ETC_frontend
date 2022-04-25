import "./App.css";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import { DarkModeTheme } from "./components/DarkModeTheme";
import { Container, CssBaseline } from "@mui/material";
import "./components/react-resizable.css";

import TabForms from "./components/TabForms";

import { Allotment } from "allotment";
import "allotment/dist/style.css";
// import "./components/allotment.css";

import ResponseCurveSpectrumPlot from "./components/plots/ResponseCurveSpectrumPlot";
import { useState } from "react";
import SourceWeightsPlot from "./components/plots/SourceWeightsPlot";
import AperMaskPlot from "./components/plots/AperMaskPlot";

function App() {
  // Set Material UI theme
  useTheme();

  // To update the ResponseCurveSpectrumPlot once new Telescope or Source parameters are
  // successfully returned from the server
  const [numTelescopeOrSourceSaved, setNumTelescopeOrSourceSaved] = useState(0);
  const incrNumTelescopeOrSourceSaved = () => {
    setNumTelescopeOrSourceSaved(numTelescopeOrSourceSaved + 1);
  };

  // To update image plots on each new Photometry submission and to track whether a
  // Photometry request has ever been submitted
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
                  incrNumTelescopeOrSourceSaved={incrNumTelescopeOrSourceSaved}
                  incrNumPhotometrySubmit={incrNumPhotometrySubmit}
                  numPhotometrySubmit={numPhotometrySubmit}
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
                  <ResponseCurveSpectrumPlot
                    numTelescopeOrSourceSaved={numTelescopeOrSourceSaved}
                  />
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
