/**
 * Modified example from <https://mui.com/components/tabs/#BasicTabs.tsx>
 *
 */

import React, { useEffect, useRef } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import TelescopeForm from "./forms/TelescopeForm";
import PhotometryForm from "./forms/PhotometryForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            padding: 3,
            backgroundColor: "background.default",
          }}
        >
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `form-tab-${index}`,
    "aria-controls": `form-tabpanel-${index}`,
  };
}

// ------------------------------------------------------------------------------------ //

export default function TabForms() {
  const [value, setValue] = React.useState(0);
  // For tracking successful form submission between components
  // If any tab is saved but not submitted, an info message will appear on Photometry tab
  const [isSavedAndUnsubmitted, setIsSavedAndUnsubmitted] = React.useState(false);
  // For tracking changed & unsaved forms
  const [isChanged, setIsChanged] = React.useState(false);
  const [prevFormValues, setPrevFormValues] = React.useState({});

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // if (newValue !== value && !isSavedAndUnsubmitted) {
    if (newValue !== value && isChanged) {
      const isLeaving = window.confirm(
        "You have unsaved changes. Are you sure you want to change tabs?"
      );
      if (isLeaving) {
        setValue(newValue);
        setIsChanged(false);
      }
    } else {
      setValue(newValue);
      setIsChanged(false);
    }
  };

  // const [isTelescopeParamsEntered, setIsTelescopeParamsEntered] = React.useState(false);
  // if (window.sessionStorage.getItem("telescopeParams")) {
  //   setIsTelescopeParamsEntered(true);
  // }

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
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="form tabs"
          variant="scrollable"
          scrollButtons="auto"
          // centered  // Doesn't work. Need to set Box display, justifyContent, and width
          TabIndicatorProps={{ style: { backgroundColor: "transparent" } }}
        >
          <Tab label="Telescope Parameters" {...a11yProps(0)} />
          <Tab label="Background Parameters" {...a11yProps(1)} />
          <Tab label="Source Parameters" {...a11yProps(2)} />
          <Tab label="Photometry" {...a11yProps(3)} />
          {/* <Tab label="Spectroscopy" {...a11yProps(4)} /> */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TelescopeForm
          setIsSavedAndUnsubmitted={setIsSavedAndUnsubmitted}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        {/* Item Four. Also include the parameters that were used to generate the results. */}
        <PhotometryForm
          isSavedAndUnsubmitted={isSavedAndUnsubmitted}
          setIsSavedAndUnsubmitted={setIsSavedAndUnsubmitted}
        />
        {/* Show results just for debugging */}
        {/* {if (isTelescopeParamsSaved) {<pre>{window.sessionStorage.getItem("telescopeParams")}</pre>}} */}
        {/* <pre>{window.sessionStorage.getItem("telescopeParams")}</pre> */}
        {/* {
        if (window.sessionStorage.getItem("telescopeParams"))
          <pre>
            {JSON.stringify(
              JSON.parse(window.sessionStorage.getItem("telescopeParams")),
              undefined,
              2
            ).replace(/\\/g, "")}
          </pre>
        } */}
      </TabPanel>
      {/* <TabPanel value={value} index={4}>
        Spectroscopy capability is not implemented yet.
      </TabPanel> */}
    </Box>
  );
}
