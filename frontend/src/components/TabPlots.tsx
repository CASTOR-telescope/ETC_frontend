/**
 * Modified example from <https://mui.com/components/tabs/#BasicTabs.tsx>
 *
 */

import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ResponsivePlot from "./ResponsivePlot";
import { Theme } from "@mui/material";
import { DarkModeTheme } from "./DarkModeTheme";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  // TODO: figure out dynamic height & refresh on update (because Tab highlight will be off)
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plot-tabpanel-${index}`}
      aria-labelledby={`plot-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: 3, backgroundColor: "background.default" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `plot-tab-${index}`,
    "aria-controls": `plot-tabpanel-${index}`,
  };
}

const themeBackgroundColor = (theme: Theme) => theme.palette.background.default;

export default function TabPlots() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ width: "100%" }}
      style={{
        flex: "1 1 100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <div> */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="plot tabs"
          centered
          TabIndicatorProps={{ style: { backgroundColor: "transparent" } }}
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
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
            title: "Some S/N Plot (bottom left/right? Top will be for aperture views)",
            font: { color: "white" },
            autosize: true,
            paper_bgcolor: themeBackgroundColor(DarkModeTheme),
            plot_bgcolor: themeBackgroundColor(DarkModeTheme),
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
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
    // </div>
  );
}
