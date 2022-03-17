import React, { useState, useEffect } from "react";
// import FileUpload from "./components/FileUpload";
import SplitPane from "react-split-pane-v2"; // REVIEW: Don't use react-split-pane at all?
// import Plotly from "plotly.js";
// import Plot from "react-plotly.js";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { API_URL } from "service/env";
// import logo from "./logo423.webp";
import "./App.css";
import { Button } from "./components/Button";
import "./components/react-tabs.css";
// import debounce from "./service/debounce";
import ResponsivePlot from "./components/ResponsivePlot";
import Photometry from "./service/Photometry";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import { DarkModeTheme } from "./components/DarkModeTheme";
import { Box, Container, CssBaseline } from "@mui/material";
import { ResizableBox } from "react-resizable";
import "./components/react-resizable.css";
import "./components/react-grid-layout.css";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
// const ResponsiveGridLayout = WidthProvider(Responsive);

import TabPlots from "./components/TabPlots";
import TabForms from "./components/TabForms";
// import ApiService from "./service/ApiService";
import Paper from "@mui/material/Paper";

// const myLogo: string = process.env.PUBLIC_URL + "/logo423.webp";

// FIXME: fix react-tabs sizing when .App height:100vh. Alternatively, fix .App min-height:100vh

function App() {
  // Set Material UI theme
  const theme = useTheme();

  console.log(window.location);
  console.log("api_url", API_URL);

  // const layouts = [
  //   { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
  //   { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
  //   { i: "c", x: 4, y: 0, w: 1, h: 2 },
  // ];
  // return (
  //   // <GridLayout className="layout" cols={12} width={1900} autoSize={true}>
  //   //   <div key="a" data-grid={{ x: 0, y: 0, w: 6, h: 2, static: false }}>
  //   //     a
  //   //   </div>
  //   //   {/* <div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 }}>
  //   //     b
  //   //   </div> */}
  //   //   <div key="b" data-grid={{ x: 6, y: 0, w: 6, h: 2 }}>
  //   //     <Box
  //   //       sx={{ border: 1 }}
  //   //       display="flex"
  //   //       height="100vh"
  //   //       // overflow="auto"
  //   //       // bgcolor="background.paper"
  //   //       // width="100vw"
  //   //       // component="span"
  //   //       // sx={{ p: 2, border: "1px dashed grey" }}
  //   //     >
  //   //       hidsfjksdnfffffffffffffffffffffffffffffffffffffffffffffwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
  //   //     </Box>
  //   //   </div>
  //   // </GridLayout>
  //   <ResponsiveGridLayout
  //     className="layout"
  //     layouts={layouts}
  //     breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
  //     cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
  //   >
  //     <div key="1">1</div>
  //     <div key="2">2</div>
  //     <div key="3">3</div>
  //   </ResponsiveGridLayout>
  // );

  // return (
  //   // <div>
  //   //   <ResizableBox
  //   //     width={200}
  //   //     height={200}
  //   //     minConstraints={[100, 100]}
  //   //     maxConstraints={[300, 300]}
  //   //     axis="x"
  //   //     resizeHandles={["e"]}
  //   //   >
  //   //     <div style={{ backgroundColor: "blue", width: "100%", height: "100%" }}>
  //   //       <Box
  //   //       // bgcolor="background.paper"
  //   //       // width="100vw"
  //   //       // component="span"
  //   //       // sx={{ p: 2, border: "1px dashed grey" }}
  //   //       >
  //   //         hidsfjksdnfffffffffffffffffffffffffffffffffffffffffffffwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
  //   //       </Box>
  //   //     </div>
  //   //     {/* <Box
  //   //       sx={{
  //   //         bgcolor: "background.paper",
  //   //         boxShadow: 1,
  //   //         borderRadius: 2,
  //   //         p: 2,
  //   //         minWidth: 300,
  //   //       }}
  //   //     >
  //   //       <Box sx={{ color: "text.secondary" }}>Sessions</Box>
  //   //       <Box sx={{ color: "text.primary", fontSize: 34, fontWeight: "medium" }}>
  //   //         98.3 K
  //   //       </Box>
  //   //       <Box
  //   //         sx={{
  //   //           color: "success.dark",
  //   //           display: "inline",
  //   //           fontWeight: "bold",
  //   //           mx: 0.5,
  //   //           fontSize: 14,
  //   //         }}
  //   //       >
  //   //         +18.77%
  //   //       </Box>
  //   //       <Box sx={{ color: "text.secondary", display: "inline", fontSize: 14 }}>
  //   //         vs. last week
  //   //       </Box>
  //   //     </Box> */}
  //   //     {/* <div style={{ backgroundColor: "green", width: "100%", height: "100%" }}>123</div> */}
  //   //   </ResizableBox>
  //   // </div>

  //   // <div>
  //   //   <Box
  //   //     bgcolor="background.paper"
  //   //     width="100vw"
  //   //     component="span"
  //   //     sx={{ p: 2, border: "1px dashed grey" }}
  //   //   >
  //   //     hidsfjksdnfffffffffffffffffffffffffffffffffffffffffffffwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
  //   //   </Box>
  //   // </div>

  //   <div className="App">
  //     <header className="App-header">
  //       <div
  //         style={{
  //           position: "relative",
  //           width: "100%",
  //           // height: "100vh",
  //           height: "100%",
  //         }}
  //       >
  //         <SplitPane split="vertical" defaultSize="100%" primary="second">
  //           {/* <div className="Split-row"> */}
  //           {/* <div style={{ width: "50%" }}> */}
  //           {/* <img src={myLogo} className="App-logo" alt="logo" />
  //           <p>
  //             Edit <code>src/App.tsx</code> and save to reload.
  //           </p>
  //           <a
  //             className="App-link"
  //             href="https://reactjs.org"
  //             target="_blank"
  //             rel="noopener noreferrer"
  //           >
  //             Learn React
  //           </a>

  //           <Button>Normal</Button>
  //           <Button isPrimary>Primary</Button> */}
  //           {/* </div> */}

  //           <SplitPane.Pane initialSize="50%">
  //             <div id="myButtons">
  //               <Photometry />
  //               <br />
  //               <Button>Normal</Button>
  //               <br />
  //               <Button isPrimary>Primary</Button>
  //             </div>
  //           </SplitPane.Pane>

  //           <>
  //             <SplitPane split="horizontal" defaultSize="100%" primary="first">
  //               <Tabs>
  //                 <TabList>
  //                   <Tab>Graph 1</Tab>
  //                   <Tab>Graph 2</Tab>
  //                 </TabList>

  //                 <TabPanel>
  //                   <ResponsivePlot
  //                     divId="upperGraph"
  //                     data={[
  //                       {
  //                         x: [1, 4, 9, 16, 25],
  //                         y: [1, 2, 3, 4, 5],
  //                         type: "scatter",
  //                         mode: "lines+markers",
  //                         marker: { color: "PaleGreen" },
  //                       },
  //                     ]}
  //                     layout={{
  //                       title:
  //                         "Some S/N Plot (bottom left/right? Top will be for aperture views)",
  //                       font: { color: "white" },
  //                       autosize: true,
  //                       paper_bgcolor: "#282c34",
  //                       plot_bgcolor: "#282c34",
  //                       xaxis: {
  //                         showgrid: true,
  //                         gridcolor: "grey",
  //                         title: "Integration Time (s)",
  //                       },
  //                       yaxis: {
  //                         showgrid: true,
  //                         gridcolor: "grey",
  //                         title: "Signal-to-Noise Ratio",
  //                       },
  //                     }}
  //                     useResizeHandler={true}
  //                     // style={{ width: "100%", height: "100%" }}
  //                     config={{ displaylogo: false }}
  //                   />
  //                 </TabPanel>
  //                 <TabPanel>
  //                   <ResponsivePlot
  //                     divId="upperGraph"
  //                     data={[
  //                       {
  //                         x: [1, 2, 3],
  //                         y: [2, 6, 3],
  //                         type: "scatter",
  //                         mode: "lines+markers",
  //                         marker: { color: "red" },
  //                       },
  //                       { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
  //                     ]}
  //                     layout={{
  //                       title: "A Fancy Plot",
  //                       autosize: true,
  //                     }}
  //                     useResizeHandler={true}
  //                     // style={{ width: "100%", height: "100%" }}
  //                     config={{ displaylogo: false }}
  //                   />
  //                 </TabPanel>
  //               </Tabs>

  //               <ResponsivePlot
  //                 divId="lowerGraph"
  //                 data={[
  //                   {
  //                     x: [1, 2, 3],
  //                     y: [2, 6, 3],
  //                     type: "scatter",
  //                     mode: "lines+markers",
  //                     marker: { color: "red" },
  //                   },
  //                   { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
  //                 ]}
  //                 layout={{
  //                   title: "A Fancy Plot",
  //                   autosize: true,
  //                 }}
  //                 useResizeHandler={true}
  //                 // style={{ width: "100%", height: "100%" }}
  //                 config={{ displaylogo: false }}
  //               />
  //             </SplitPane>
  //           </>
  //         </SplitPane>
  //       </div>
  //     </header>
  //   </div>
  // );
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
            <SplitPane.Pane initialSize="50%">
              {/* <div id="myButtons">
                <Photometry />
                <br />
                <Button>Normal</Button>
                <br />
                <Button isPrimary>Primary</Button>
              </div> */}
              <TabForms />
            </SplitPane.Pane>

            <div>
              <SplitPane split="horizontal" defaultSize="50%" primary="first">
                <TabPlots />
                <TabPlots />
              </SplitPane>
            </div>
          </SplitPane>
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
