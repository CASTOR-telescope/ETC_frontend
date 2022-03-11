import React, { useEffect } from "react";
import { API_URL } from "service/env";
// import logo from "./logo423.webp";
import "./App.css";
import { Button } from "./components/Button";
// import FileUpload from "./components/FileUpload";
import SplitPane from "react-split-pane-v2"; // REVIEW: Don't use react-split-pane at all?
import Plotly from "plotly.js";
import Plot from "react-plotly.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./components/react-tabs.css";
import debounce from "./service/debounce";
import ResponsivePlot from "./components/ResponsivePlot";

// import ApiService from "./service/ApiService";

const myLogo: string = process.env.PUBLIC_URL + "/logo423.webp";

// FIXME: fix react-tabs sizing when .App height:100vh. Alternatively, fix .App min-height:100vh

function App() {
  console.log(window.location);
  console.log("api_url", API_URL);

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
          <SplitPane split="vertical" defaultSize="100%" primary="second">
            {/* <div className="Split-row"> */}
            {/* <div style={{ width: "50%" }}> */}
            {/* <img src={myLogo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>

            <Button>Normal</Button>
            <Button isPrimary>Primary</Button> */}
            {/* </div> */}

            <SplitPane.Pane initialSize="50%">
              <div id="myButtons">
                <Button>Normal</Button>
                <Button isPrimary>Primary</Button>
              </div>
            </SplitPane.Pane>

            <SplitPane
              split="horizontal"
              defaultSize="100%"
              primary="first"
              // FIXME: "webpack < 5 used to include polyfills for node.js core modules by default"
              // onChange={debounce((): void => {
              //   Plotly.Plots.resize("upperGraph");
              //   Plotly.Plots.resize("lowerGraph");
              // }, 250)}
              // FIXME: "webpack < 5 used to include polyfills for node.js core modules by default"
              //   onChange={debounce((): void => {
              //   Plotly.relayout("upperGraph", {
              //     width: window.innerWidth,
              //     height: window.innerHeight,
              //   });
              //   Plotly.relayout("lowerGraph", {
              //     width: window.innerWidth,
              //     height: window.innerHeight,
              //   });
              // }, 250)}
              // onChange={debounce(Plotly.Plots.resize(), 250)}
            >
              <Tabs>
                <TabList>
                  <Tab>Graph 1</Tab>
                  <Tab>Graph 2</Tab>
                </TabList>

                <TabPanel>
                  <ResponsivePlot
                    divId="upperGraph"
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
                      title:
                        "Some S/N Plot (bottom left/right? Top will be for aperture views)",
                      font: { color: "white" },
                      autosize: true,
                      paper_bgcolor: "#282c34",
                      plot_bgcolor: "#282c34",
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
                </TabPanel>
                <TabPanel>
                  <ResponsivePlot
                    divId="upperGraph"
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
                      title: "A Fancy Plot",
                      autosize: true,
                    }}
                    useResizeHandler={true}
                    // style={{ width: "100%", height: "100%" }}
                    config={{ displaylogo: false }}
                  />
                </TabPanel>
              </Tabs>

              <ResponsivePlot
                divId="lowerGraph"
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
                  title: "A Fancy Plot",
                  autosize: true,
                }}
                useResizeHandler={true}
                // style={{ width: "100%", height: "100%" }}
                config={{ displaylogo: false }}
              />
            </SplitPane>
          </SplitPane>
        </div>
      </header>
    </div>
  );
}

export default App;
