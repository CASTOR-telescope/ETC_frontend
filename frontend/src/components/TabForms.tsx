/**
 * Modified example from <https://mui.com/components/tabs/#BasicTabs.tsx>
 *
 * ---
 *
 *         GNU General Public License v3 (GNU GPLv3)
 *
 * (c) 2022.                            (c) 2022.
 * Government of Canada                 Gouvernement du Canada
 * National Research Council            Conseil national de recherches
 * Ottawa, Canada, K1A 0R6              Ottawa, Canada, K1A 0R6
 * All rights reserved                  Tous droits réservés
 *
 * NRC disclaims any warranties,        Le CNRC dénie toute garantie
 * expressed, implied, or               énoncée, implicite ou légale,
 * statutory, of any kind with          de quelque nature que ce
 * respect to the software,             soit, concernant le logiciel,
 * including without limitation         y compris sans restriction
 * any warranty of merchantability      toute garantie de valeur
 * or fitness for a particular          marchande ou de pertinence
 * purpose. NRC shall not be            pour un usage particulier.
 * liable in any event for any          Le CNRC ne pourra en aucun cas
 * damages, whether direct or           être tenu responsable de tout
 * indirect, special or general,        dommage, direct ou indirect,
 * consequential or incidental,         particulier ou général,
 * arising from the use of the          accessoire ou fortuit, résultant
 * software. Neither the name           de l'utilisation du logiciel. Ni
 * of the National Research             le nom du Conseil National de
 * Council of Canada nor the            Recherches du Canada ni les noms
 * names of its contributors may        de ses  participants ne peuvent
 * be used to endorse or promote        être utilisés pour approuver ou
 * products derived from this           promouvoir les produits dérivés
 * software without specific prior      de ce logiciel sans autorisation
 * written permission.                  préalable et particulière
 *                                      par écrit.
 *
 * This file is part of the             Ce fichier fait partie du projet
 * FORECASTOR ETC GUI project.          FORECASTOR ETC GUI.
 *
 * FORECASTOR ETC GUI is free           FORECASTOR ETC GUI est un logiciel
 * software: you can redistribute       libre ; vous pouvez le redistribuer
 * it and/or modify it under the        ou le modifier suivant les termes
 * terms of the GNU General Public      de la "GNU General Public
 * License as published by the          License" telle que publiée
 * Free Software Foundation,            par la Free Software Foundation :
 * either version 3 of the              soit la version 3 de cette
 * License, or (at your option)         licence, soit (à votre gré)
 * any later version.                   toute version ultérieure.
 *
 * FORECASTOR ETC GUI is distributed    FORECASTOR ETC GUI est distribué
 * in the hope that it will be          dans l'espoir qu'il vous
 * useful, but WITHOUT ANY WARRANTY;    sera utile, mais SANS AUCUNE
 * without even the implied warranty    GARANTIE : sans même la garantie
 * of MERCHANTABILITY or FITNESS FOR    implicite de COMMERCIALISABILITÉ
 * A PARTICULAR PURPOSE. See the        ni d'ADÉQUATION À UN OBJECTIF
 * GNU General Public License for       PARTICULIER. Consultez la Licence
 * more details.                        Générale Publique GNU pour plus
 *                                      de détails.
 *
 * You should have received a copy      Vous devriez avoir reçu une copie
 * of the GNU General Public            de la Licence Générale Publique
 * License along with FORECASTOR        GNU avec FORECASTOR ETC GUI ; si
 * ETC GUI. If not, see                 ce n'est pas le cas, consultez :
 * <http://www.gnu.org/licenses/>.      <http://www.gnu.org/licenses/>.
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
import UVMOSForm from "./forms/UVMOSForm"
import TransitForm from "./forms/TransitForm";
import GrismForm from "./forms/GrismForm"
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
  value: number;
  setValue: (value: number) => void;
  incrNumTelescopeOrSourceSaved: () => void; 
  incrNumPhotometrySubmit: () => void;
  numPhotometrySubmit: number;
  incrNumUVMOSSubmit: () => void,
  numUVMOSSubmit: number,
  incrNumTransitSubmit: () => void,
  numTransitSubmit: number,
  incrNumGrismSubmit: () => void,
  numGrismSubmit: number,
};

/* Functional components */
const TabForms: React.FC<TabFormsProps> = ({
  value,
  setValue,
  incrNumTelescopeOrSourceSaved,
  incrNumPhotometrySubmit,
  numPhotometrySubmit,
  incrNumUVMOSSubmit,
  numUVMOSSubmit,
  incrNumTransitSubmit,
  numTransitSubmit,
  incrNumGrismSubmit,
  numGrismSubmit,
}) => {

  // For tracking errors on save/submit (i.e., network/request errors)
  const [isError, setIsError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // For tracking successfuly form submission on save/submit
  const [isSent, setIsSent] = React.useState(false);

  // For tracking successful form submission between components
  // If any tab is saved but not submitted, an info message will appear on the Photometry tab.
  const [isPhotometrySavedAndUnsubmitted, setIsPhotometrySavedAndUnsubmitted] = React.useState(false);

  // For tracking successful form submission between components
  // If any tab is saved but not submitted, an info message will appear on the UVMOS tab.
  const [isUVMOSSavedAndUnsubmitted, setIsUVMOSSavedAndUnsubmitted] = React.useState(false);

  // For tracking successful form submission between components
  // If any tab is saved but not submitted, an info message will appear on the Transit tab.
  const [isTransitSavedAndUnsubmitted, setIsTransitSavedAndUnsubmitted] = React.useState(false);

  // For tracking successful form submission between components
  // If any tab is saved but not submitted, an info message will appear on the Grism tab.
  const [isGrismSavedAndUnsubmitted, setIsGrismSavedAndUnsubmitted] = React.useState(false);

  // For tracking changed & unsaved forms
  const [isChanged, setIsChanged] = React.useState(false);
  const [prevFormValues, setPrevFormValues] = React.useState({});

  // For tracking Background & Source dependencies on Telescope
  // const [isTelescopeUpdated, setIsTelescopeUpdated] = React.useState(false);
  const [isBackgroundSyncTelescope, setIsBackgroundSyncTelescope] = React.useState(true);
  const [isSourceSyncTelescope, setIsSourceSyncTelescope] = React.useState(true);

  // For tracking Telescope, Background, & Source dependencies on Photometry
  const [isTelescopeSyncPhotometry, setIsTelescopeSyncPhotometry] = React.useState(true);
  const [isBackgroundSyncPhotometry, setIsBackgroundSyncPhotometry] =
    React.useState(true);
  const [isSourceSyncPhotometry, setIsSourceSyncPhotometry] = React.useState(true);

    // For tracking Telescope, Background, & Source dependencies on UVMOS
  const [isTelescopeSyncUVMOS, setIsTelescopeSyncUVMOS] = React.useState(true);
  const [isBackgroundSyncUVMOS, setIsBackgroundSyncUVMOS] =
      React.useState(true);
  const [isSourceSyncUVMOS, setIsSourceSyncUVMOS] = React.useState(true);

    // For tracking Telescope, Background, & Source dependencies on Transit
  const [isTelescopeSyncTransit, setIsTelescopeSyncTransit] = React.useState(true);
  const [isBackgroundSyncTransit, setIsBackgroundSyncTransit] =
      React.useState(true);
  const [isSourceSyncTransit, setIsSourceSyncTransit] = React.useState(true);

    // For tracking Telescope, Background, & Source dependencies on Grism
  const [isTelescopeSyncGrism, setIsTelescopeSyncGrism] = React.useState(true);
  const [isBackgroundSyncGrism, setIsBackgroundSyncGrism] =
      React.useState(true);
  const [isSourceSyncGrism, setIsSourceSyncGrism] = React.useState(true);

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
        // marginTop: "0.5em",  // doesn't look good
        // marginBottom: "0em", // doesn't seem to change anything
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
          // centered  // incompatible with variant="scrollable"
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
          <Tab label="UVMOS" {...TabProps(4)} 
          disabled={
              sessionStorage.getItem("telescopeParams") === null ||
              !isBackgroundSyncTelescope ||
              !isSourceSyncTelescope
            }/>
          <Tab label="Grism" {...TabProps(5)} 
          // <https://stackoverflow.com/questions/46915002>
          disabled={
              sessionStorage.getItem("telescopeParams") === null ||
              !isBackgroundSyncTelescope ||
              !isSourceSyncTelescope
            }/>
          <Tab label="Transit" {...TabProps(6)} 
          // <https://stackoverflow.com/questions/46915002>
          disabled={
              sessionStorage.getItem("telescopeParams") === null ||
              !isBackgroundSyncTelescope ||
              !isSourceSyncTelescope || sessionStorage.getItem("sourceForm") === null ? true : JSON.parse(sessionStorage.getItem("sourceForm")!)["predefinedSpectrum"] !== "gaia"
            }/>
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TelescopeForm
          setIsPhotometrySavedAndUnsubmitted={setIsPhotometrySavedAndUnsubmitted}
          setIsUVMOSSavedAndUnsubmitted={setIsUVMOSSavedAndUnsubmitted}
          setIsTransitSavedAndUnsubmitted={setIsTransitSavedAndUnsubmitted}
          setIsGrismSavedAndUnsubmitted={setIsGrismSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          incrNumTelescopeOrSourceSaved={incrNumTelescopeOrSourceSaved}
          isError={isError}
          setIsError={setIsError}
          isSent={isSent}
          setIsSent={setIsSent}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          // setIsTelescopeUpdated={setIsTelescopeUpdated}
          setIsBackgroundSyncTelescope={setIsBackgroundSyncTelescope}
          setIsSourceSyncTelescope={setIsSourceSyncTelescope}
          numPhotometrySubmit={numPhotometrySubmit}
          numUVMOSSubmit = {numUVMOSSubmit}
          numTransitSubmit = {numTransitSubmit}
          numGrismSubmit = {numGrismSubmit}
          isTelescopeSyncPhotometry={isTelescopeSyncPhotometry}
          setIsTelescopeSyncPhotometry={setIsTelescopeSyncPhotometry}
          isTelescopeSyncUVMOS={isTelescopeSyncUVMOS}
          setIsTelescopeSyncUVMOS={setIsTelescopeSyncUVMOS}
          isTelescopeSyncTransit={isTelescopeSyncTransit}
          setIsTelescopeSyncTransit={setIsTelescopeSyncTransit}
          isTelescopeSyncGrism={isTelescopeSyncGrism}
          setIsTelescopeSyncGrism={setIsTelescopeSyncGrism}
          // incrNumPhotometrySubmit={incrNumPhotometrySubmit}
          isChanged={isChanged}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BackgroundForm
          setIsPhotometrySavedAndUnsubmitted={setIsPhotometrySavedAndUnsubmitted}
          setIsUVMOSSavedAndUnsubmitted={setIsUVMOSSavedAndUnsubmitted}
          setIsTransitSavedAndUnsubmitted={setIsTransitSavedAndUnsubmitted}
          setIsGrismSavedAndUnsubmitted={setIsGrismSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          isSent={isSent}
          setIsSent={setIsSent}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isBackgroundSyncTelescope={isBackgroundSyncTelescope}
          setIsBackgroundSyncTelescope={setIsBackgroundSyncTelescope}
          numPhotometrySubmit={numPhotometrySubmit}
          numUVMOSSubmit={numUVMOSSubmit}
          numTransitSubmit={numTransitSubmit}
          numGrismSubmit={numGrismSubmit}
          isBackgroundSyncPhotometry={isBackgroundSyncPhotometry}
          setIsBackgroundSyncPhotometry={setIsBackgroundSyncPhotometry}
          isBackgroundSyncUVMOS={isBackgroundSyncUVMOS}
          setIsBackgroundSyncUVMOS={setIsBackgroundSyncUVMOS}
          isBackgroundSyncTransit={isBackgroundSyncTransit}
          setIsBackgroundSyncTransit={setIsBackgroundSyncTransit}
          isBackgroundSyncGrism={isBackgroundSyncGrism}
          setIsBackgroundSyncGrism={setIsBackgroundSyncGrism}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SourceForm
          setIsPhotometrySavedAndUnsubmitted={setIsPhotometrySavedAndUnsubmitted}
          setIsUVMOSSavedAndUnsubmitted={setIsUVMOSSavedAndUnsubmitted}
          setIsTransitSavedAndUnsubmitted={setIsTransitSavedAndUnsubmitted}
          setIsGrismSavedAndUnsubmitted={setIsGrismSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          isSent={isSent}
          setIsSent={setIsSent}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isSourceSyncTelescope={isSourceSyncTelescope}
          setIsSourceSyncTelescope={setIsSourceSyncTelescope}
          incrNumTelescopeOrSourceSaved={incrNumTelescopeOrSourceSaved}
          numPhotometrySubmit={numPhotometrySubmit}
          numUVMOSSubmit={numUVMOSSubmit}
          numTransitSubmit={numTransitSubmit}
          numGrismSubmit={numGrismSubmit}
          isSourceSyncPhotometry={isSourceSyncPhotometry}
          setIsSourceSyncPhotometry={setIsSourceSyncPhotometry}
          isSourceSyncUVMOS={isSourceSyncUVMOS}
          setIsSourceSyncUVMOS={setIsSourceSyncUVMOS}
          isSourceSyncTransit={isSourceSyncTransit}
          setIsSourceSyncTransit={setIsSourceSyncTransit}
          isSourceSyncGrism={isSourceSyncGrism}
          setIsSourceSyncGrism={setIsSourceSyncGrism}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PhotometryForm
          isPhotometrySavedAndUnsubmitted={isPhotometrySavedAndUnsubmitted}
          setIsPhotometrySavedAndUnsubmitted={setIsPhotometrySavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          isSent={isSent}
          setIsSent={setIsSent}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          numPhotometrySubmit={numPhotometrySubmit}
          incrNumPhotometrySubmit={incrNumPhotometrySubmit}
          setIsTelescopeSyncPhotometry={setIsTelescopeSyncPhotometry}
          setIsBackgroundSyncPhotometry={setIsBackgroundSyncPhotometry}
          setIsSourceSyncPhotometry={setIsSourceSyncPhotometry}
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
      <UVMOSForm
          isUVMOSSavedAndUnsubmitted={isUVMOSSavedAndUnsubmitted}
          setIsUVMOSSavedAndUnsubmitted={setIsUVMOSSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          isSent={isSent}
          setIsSent={setIsSent}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          incrNumUVMOSSubmit={incrNumUVMOSSubmit}
          numUVMOSSubmit={numUVMOSSubmit}
          setIsTelescopeSyncUVMOS={setIsTelescopeSyncUVMOS}
          setIsBackgroundSyncUVMOS={setIsBackgroundSyncUVMOS}
          setIsSourceSyncUVMOS={setIsSourceSyncUVMOS}
        />
      </TabPanel>
      <TabPanel value={value} index={5}>
      <GrismForm
          isGrismSavedAndUnsubmitted={isGrismSavedAndUnsubmitted}
          setIsGrismSavedAndUnsubmitted={setIsGrismSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          isSent={isSent}
          setIsSent={setIsSent}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          incrNumGrismSubmit={incrNumGrismSubmit}
          numGrismSubmit={numGrismSubmit}
          setIsTelescopeSyncGrism={setIsTelescopeSyncGrism}
          setIsBackgroundSyncGrism={setIsBackgroundSyncGrism}
          setIsSourceSyncGrism={setIsSourceSyncGrism}
        />
      </TabPanel>
      <TabPanel value={value} index={6}>
      <TransitForm
          isTransitSavedAndUnsubmitted={isTransitSavedAndUnsubmitted}
          setIsTransitSavedAndUnsubmitted={setIsTransitSavedAndUnsubmitted}
          setIsChanged={setIsChanged}
          prevFormValues={prevFormValues}
          setPrevFormValues={setPrevFormValues}
          isError={isError}
          setIsError={setIsError}
          isSent={isSent}
          setIsSent={setIsSent}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          incrNumTransitSubmit={incrNumTransitSubmit}
          numTransitSubmit={numTransitSubmit}
          setIsTelescopeSyncTransit={setIsTelescopeSyncTransit}
          setIsBackgroundSyncTransit={setIsBackgroundSyncTransit}
          setIsSourceSyncTransit={setIsSourceSyncTransit}
        />
      </TabPanel>
    </Box>
  );
};

export default TabForms;
