/**
 * Modified example from <https://mui.com/components/tabs/#BasicTabs.tsx>
 *
 */

import { Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React from "react";

import BackgroundForm from "./forms/BackgroundForm";
import PhotometryForm from "./forms/PhotometryForm";
import SourceForm from "./forms/SourceForm";
import TelescopeForm from "./forms/TelescopeForm";
import logo from "./logo-fullsize.png";

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

function TabProps(index: number) {
  return {
    id: `form-tab-${index}`,
    "aria-controls": `form-tabpanel-${index}`,
    sx: { fontSize: 17 },
  };
}

// ------------------------------------------------------------------------------------ //

type TabFormsProps = {
  incrNumTelescopeSaved: () => void;
  incrNumPhotometrySubmit: () => void;
  numPhotometrySubmit: number;
};

const TabForms: React.FC<TabFormsProps> = ({
  incrNumTelescopeSaved,
  incrNumPhotometrySubmit,
  numPhotometrySubmit,
}) => {
  // For tracking tabs
  const [value, setValue] = React.useState(0);

  // For tracking errors on save/submit (i.e., network/request errors)
  const [isError, setIsError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // For tracking successful form submission between components
  // If any tab is saved but not submitted, an info message will appear on Photometry tab
  const [isSavedAndUnsubmitted, setIsSavedAndUnsubmitted] = React.useState(false);

  // For tracking changed & unsaved forms
  const [isChanged, setIsChanged] = React.useState(false);
  const [prevFormValues, setPrevFormValues] = React.useState({});

  // For tracking Background & Source dependencies on Telescope
  // const [isTelescopeUpdated, setIsTelescopeUpdated] = React.useState(false);
  const [isBackgroundSyncTelescope, setIsBackgroundSyncTelescope] = React.useState(true);
  const [isSourceSyncTelescope, setIsSourceSyncTelescope] = React.useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // if (newValue !== value && !isSavedAndUnsubmitted) {
    if (newValue !== value && isChanged) {
      const isLeaving = window.confirm(
        "You have unsaved changes. Are you sure you want to change tabs? " +
          "Your changes will be lost."
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
        // For centering Tabs
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.default",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Avatar
          alt="logo"
          src={logo}
          sx={{ marginLeft: "0.5em", marginRight: "1em", marginTop: "0.2em" }}
        />
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="form tabs"
          variant="scrollable"
          scrollButtons="auto"
          centered
          // TabIndicatorProps={{ style: { backgroundColor: "transparent" } }} // hide underline
        >
          <Tab label="Telescope Parameters" {...TabProps(0)} />
          <Tab
            label="Background Parameters"
            {...TabProps(1)}
            disabled={sessionStorage.getItem("telescopeParams") === null}
          />
          <Tab
            label="Source Parameters"
            {...TabProps(2)}
            disabled={sessionStorage.getItem("telescopeParams") === null}
          />
          <Tab
            label="Photometry"
            {...TabProps(3)}
            disabled={
              sessionStorage.getItem("telescopeParams") === null ||
              !isBackgroundSyncTelescope ||
              !isSourceSyncTelescope
            }
          />
          {/* <Tab label="Spectroscopy" {...TabProps(4)} /> */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TelescopeForm
          setIsSavedAndUnsubmitted={setIsSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          incrNumTelescopeSaved={incrNumTelescopeSaved}
          isError={isError}
          setIsError={setIsError}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          // setIsTelescopeUpdated={setIsTelescopeUpdated}
          setIsBackgroundSyncTelescope={setIsBackgroundSyncTelescope}
          setIsSourceSyncTelescope={setIsSourceSyncTelescope}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BackgroundForm
          setIsSavedAndUnsubmitted={setIsSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isBackgroundSyncTelescope={isBackgroundSyncTelescope}
          setIsBackgroundSyncTelescope={setIsBackgroundSyncTelescope}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SourceForm
          setIsSavedAndUnsubmitted={setIsSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isSourceSyncTelescope={isSourceSyncTelescope}
          setIsSourceSyncTelescope={setIsSourceSyncTelescope}
          incrNumTelescopeSaved={incrNumTelescopeSaved}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PhotometryForm
          isSavedAndUnsubmitted={isSavedAndUnsubmitted}
          setIsSavedAndUnsubmitted={setIsSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          incrNumPhotometrySubmit={incrNumPhotometrySubmit}
          numPhotometrySubmit={numPhotometrySubmit}
        />
      </TabPanel>
      {/* <TabPanel value={value} index={4}>
        Spectroscopy capability is not implemented yet.
      </TabPanel> */}
    </Box>
  );
};

export default TabForms;
