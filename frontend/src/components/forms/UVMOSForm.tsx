/**
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

import { Formik, Form, FormikValues,useFormikContext } from "formik";
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  Typography,
  MenuItem,
  Select,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import * as Yup from "yup";
import axios from "axios";
import { useEffect } from "react";
import {
  themeYellowColor,
  themeYellowColorDark,
  themeDisabledButtonColor,
} from "../DarkModeTheme";
import {
  AlertIfSavedButNotSubmitted,
  CommonFormProps,
  AlertError,
  AlertSuccessfulRequest,
  CommonTextField,
  CommonTextFieldWithTracker,
} from "../CommonFormElements";
import { API_URL } from "../../env";

const SubmitButton: React.FC<{ isSubmitting: boolean; isValid: boolean }> = ({
  isSubmitting,
  isValid,
}) => {
  return (
    <LoadingButton
      type="submit"
      disabled={isSubmitting || !isValid}
      // sx={{ color: themeSecondaryLightColor }}
      size="large"
      variant="contained"
      style={{ width: "25%", fontSize: 24, margin: 16 }}
      sx={[
        { backgroundColor: themeYellowColor },
        { "&:hover": { backgroundColor: themeYellowColorDark } },
        { "&:disabled": { backgroundColor: themeDisabledButtonColor } },
      ]}
      loading={isSubmitting}
      loadingIndicator="Submitting..."
    >
      Submit
    </LoadingButton>
  );
};

enum Units {
  Arcsec = "arcsec",
  Pixel = "pixel",
}

const DisplayResults: React.FC<{ numUVMOSSubmit: number}> = ({
  numUVMOSSubmit,
}) => {
  const uvmosParams = JSON.parse(`${sessionStorage.getItem("uvmosParams")}`);
  const uvmosForm = JSON.parse(`${sessionStorage.getItem("uvmosForm")}`);

  const tableHeadFontSize = 18;

  const divStyle = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  };

  const paperSx = {
    minWidth: 500,
    width: "85%",
  };

  return (
    <div id={`display-results-${numUVMOSSubmit}`}>
    <Typography variant="h5" color="secondary" style={{ marginBottom: 12 }}>
      Spectroscopy Results
    </Typography>
    {uvmosForm["snrInput"].val_type === "snr" ? (
        <div style={divStyle}>
          <Typography
            component={Paper}
            sx={{
              fontSize: tableHeadFontSize,
              marginBottom: 1,
              padding: 1,
              ...paperSx,
            }}
          >
            <b>An exposure time of {(uvmosParams["snrResults"] !== 'NaN' ? uvmosParams["snrResults"].toExponential(2) : 'NaN')} seconds is required to reach a SNR of {(uvmosForm["snrInput"].val)} at a wavelength of {(10 * uvmosForm["snrInput"].wavelength)} angstroms.</b>
          </Typography>
          <br />
        </div>
      ) : (
        <div style={divStyle}>
          <Typography
            component={Paper}
            sx={{
              fontSize: tableHeadFontSize,
              marginBottom: 1,
              padding: 1,
              ...paperSx,
            }}
          >
            <b>After an exposure time of {(uvmosForm["snrInput"].val)} seconds a SNR of {(uvmosParams["snrResults"] !== 'NaN' ? uvmosParams["snrResults"].toFixed(3) : 'NaN')} is reached at a wavelength of {(10 * uvmosForm["snrInput"].wavelength)} angstroms.</b>
          </Typography>
          <br />
        </div>
      )
      }
    </div>
  )
}

const uvmosValidationSchema = Yup.object({
  spectralRange: Yup.object({
    minwavelength: Yup.number()
      .required("Minimum wavelength is a required field.")
      .typeError("Minimum wavelength must be a number > 0")
      .positive("Minimum wavelength must be a number > 0"),
    maxwavelength: Yup.number()
      .required("Maximum wavelength is a required field")
      .typeError("Maximum wavelength must be a number > 0")
      .positive("Maximum wavelength must be a number > 0"),
  }),
  slit: Yup.object({
    width: Yup.number()
      .required("Width is a required field.")
      .typeError("Slit width must be a number > 0")
      .positive("Slit width must be a number > 0"),
    length: Yup.number()
      .required("Length is a required field.")
      .typeError("Slit length must be a number > 0")
      .positive("Slit length must be a number > 0"),
  }),
  extractionBox: Yup.object({
    units: Yup.string().oneOf(Object.values(Units)),
    width: Yup.number()
      .required("Extraction box width is a required field")
      .typeError("Extraction box width must be a number > 0")
      .positive("Extraction box width must be a number > 0"),
    heightLowerLim: Yup.number()
      .required("Lower limit of Extraction box height is a required field. ")
      .typeError("Extraction box height lower limit must be a number > 0")
      .min(0, 'Extraction box height lower limit cannot be less than 0'),
    heightUpperLim: Yup.number()
      .notRequired()
      .typeError("Extraction box height upper limit must be a number > 0")
      .positive("Extraction box height upper limit must be a number > 0"),
  }),
  snrInput: Yup.object({
    val: Yup.number()
      // .required("Target value is a required field") // BUG: fails validation on 1st refresh?
      .typeError("Target value must be a number >= 0")
      .min(0),
    wavelength: Yup.number()
    // .required("Wavelength is a required field.")
    .typeError("Wavelength must be a number > 0")
    .positive("Wavelength must be a number > 0"),
    val_type: Yup.string()
      .required()
      .oneOf(Object.values(["snr", "t"])),
  }),
});

/* New parameters defined along and are an extension to CommonFormProps */
type UVMOSFormProps = {
  setIsUVMOSSavedAndUnsubmitted: (value: boolean) => void;
  isUVMOSSavedAndUnsubmitted: boolean;
  setIsTelescopeSyncUVMOS: (value: boolean) => void;
  setIsBackgroundSyncUVMOS: (value: boolean) => void;
  setIsSourceSyncUVMOS: (value: boolean) => void;
  incrNumUVMOSSubmit: () => void,
  numUVMOSSubmit: number,
} & CommonFormProps;

/**
 * These parameters include both the commonform props as well as the UVMOSForm props
 *
 */
const UVMOSForm: React.FC<UVMOSFormProps> = ({
  isUVMOSSavedAndUnsubmitted,
  setIsUVMOSSavedAndUnsubmitted,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,  
  isError,
  setIsError,
  isSent,
  setIsSent,
  errorMessage,
  setErrorMessage,
  incrNumUVMOSSubmit,
  numUVMOSSubmit,
  setIsTelescopeSyncUVMOS,
  setIsBackgroundSyncUVMOS,
  setIsSourceSyncUVMOS,
}) => {

  // Save user form inputs between tab switches
  const FORM_SESSION = "uvmosForm"; // key for sessionStorage (user inputs)
  const FORM_PARAMS = "uvmosParams"; // key for sessionStorage (API results)
  let myInitialValues: FormikValues;
  if (sessionStorage.getItem(FORM_SESSION) === null) {
    myInitialValues = {
      spectralRange:{
        minwavelength:"150" ,
        maxwavelength:"300"}, // nm
      slit:{
        width:"0.214", 
        length:"1"}, // arcsec
      extractionBox:{
        units: "pixel",
        width:"1",
        heightLowerLim:"0",
        heightUpperLim:""}, // pixels
      snrInput: {
          val: "",
          wavelength: "", // nm 
          val_type: "snr"}
    };
  } else {
    myInitialValues = JSON.parse(`${sessionStorage.getItem(FORM_SESSION)}`);
  }
  // Only run this on mount
  useEffect(() => {
    setIsChanged(false);
    setPrevFormValues(myInitialValues);
  }, []);


  return (
    <div>
      <Typography variant="h5">Make a uvmos spectroscopy calculation below.</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        The FORECASTOR ETC GUI is an open source project. Questions, suggestions, and
        contributions to our{" "}
        <Link
          href="https://github.com/CASTOR-telescope/ETC_frontend"
          // Open link in new tab
          rel="noopener noreferrer"
          target="_blank"
        >
          <code>GitHub</code>
        </Link>{" "}
        repository are all welcome. <b>Currently, for the UVMOS-ETC, only point sources are supported.</b>
      </Typography>
      <Formik
        initialValues={myInitialValues}
        onSubmit={
          async (data, { setSubmitting }) => {
            setSubmitting(true);
            // Make async call
            await axios
              .put(API_URL + "uvmos", data)
              .then((response) => response.data)
              .then((response) => {
                sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response));
                sessionStorage.setItem((FORM_SESSION),JSON.stringify(data));
          })
              .then(() => {
                setIsSent(true)
                setIsUVMOSSavedAndUnsubmitted(false);
                setPrevFormValues(data);
                setIsChanged(false);
                incrNumUVMOSSubmit(); 
                setSubmitting(false)
                setIsTelescopeSyncUVMOS(true);
                setIsBackgroundSyncUVMOS(true);
                setIsSourceSyncUVMOS(true);
              })
              .catch((error) => {
                console.log(error);
                setIsError(true);
                setErrorMessage(error.message);
              })
              .finally(() => setSubmitting(false));
              setSubmitting(false)
          } // end async function
        } // end onSubmit
        validateOnChange={true}
        validationSchema={uvmosValidationSchema}
        validateOnMount={true}
      >
        {({ values, setFieldValue, isSubmitting, isValid }) => (
          <Form>
            <AlertIfSavedButNotSubmitted
              name = {'UVMOS'}
              isSavedAndUnsubmitted={isUVMOSSavedAndUnsubmitted}
              numSubmit={numUVMOSSubmit}
            />
            <FormControl component="fieldset" variant="standard">
              <FormLabel
              required={true}
              component="legend"
              sx ={{fontSize: 18}}
              filled={true}>
                Spectral Range
              </FormLabel>
              <FormHelperText
              sx={{
                fontSize: "medium",
                fontWeight: "normal",
                marginBottom: 2,
                textAlign: "center",
              }} >
                Specify the minimum and maximum wavelengths for the spectral range.
              </FormHelperText>
              <FormGroup>
                <CommonTextFieldWithTracker
                name="spectralRange.minwavelength"
                value={values.spectralRange.minwavelength}
                placeholder={"Default: 150"}
                label="Minimum Wavelength (nm)"
                prevFormValues={prevFormValues}
                setIsChanged={setIsChanged}
                />
                <CommonTextField
                name="spectralRange.maxwavelength"
                value={values.spectralRange.maxwavelength}
                placeholder={"Default: 300"}
                label="Maximum Wavelength (nm)"
                />
              </FormGroup>
            </FormControl>
            <br />
            <br />
            <FormControl component="fieldset" variant="standard">
              <FormLabel
              required={true}
              component="legend"
              sx ={{fontSize: 18}}
              filled={true}>
                Slit Dimensions
              </FormLabel>
              <FormHelperText
              sx={{
                fontSize: "medium",
                fontWeight: "normal",
                marginBottom: 2,
                textAlign: "center",
              }} >
                Specify the width and length of the slit.
              </FormHelperText>
              <FormGroup>
                <CommonTextField
                name="slit.width"
                value={values.slit.width}
                placeholder={"Default: 0.214"}
                label="Width (arcsec)"
                />
                <CommonTextField
                name="slit.length"
                value={values.slit.length}
                placeholder={"Default: 1"}
                label="Length (arcsec)"
                />
              </FormGroup>
            </FormControl>
            <br />
            <br />
            <FormControl component="fieldset" variant="standard" 
            >
              <FormLabel
              required={true}
              component="legend"
              sx ={{fontSize: 18}}
              filled={true}>
                Extraction Box Dimensions
              </FormLabel>
              <FormHelperText
              sx={{
                fontSize: "medium",
                fontWeight: "normal",
                marginBottom: 2,
                textAlign: "center",
              }} >
                Specify the width and height of the extraction box. 
                <br/> (Choose the appropriate units).
              </FormHelperText>
              <RadioGroup
              defaultValue= "pixel"
              row
              name={"extractionBox.units"}
              value={values.extractionBox.units}
              // Need to set onChange manually in this case
              // See <https://levelup.gitconnected.com/create-a-controlled-radio-group-in-react-formik-material-ui-and-typescript-7ed314081a0e>
              onChange={(event) => {
                setFieldValue("extractionBox.units", event.currentTarget.value);
              }}
              sx={{ 
                marginBottom: 2,
                justifyContent: "center"
              }}
            >
              <FormControlLabel
                value={Units.Arcsec}
                control={<Radio />}
                label="Arcsec"
              />
              <FormControlLabel
                value={Units.Pixel}
                control={<Radio />}
                label="Pixel"
              />
            </RadioGroup>
              <FormGroup>
                <CommonTextField
                name="extractionBox.width"
                value={values.extractionBox.width}
                placeholder={"Default: 1"}
                label="Width"
                />
                <CommonTextField
                name="extractionBox.heightLowerLim"
                value={values.extractionBox.heightLowerLim}
                placeholder={"Default: 0"}
                label="Height Lower Limit"
                />
                <CommonTextField
                required={false}
                name="extractionBox.heightUpperLim"
                value={values.extractionBox.heightUpperLim}
                placeholder={"Default: Max"}
                label="Height Upper Limit"
                />
              </FormGroup>
            </FormControl>
            <br />
            <br />
            <FormControl
              component="fieldset"
              variant="standard"
              sx={{
                marginTop: 0,
                marginBottom: 2,
                width: "85%",
                justifyContent: "center",
              }}
              fullWidth={true}
              color="primary"
            >
              <FormLabel
                component="legend"
                required={true}
                sx={{
                  fontSize: 17.5,
                  // fontWeight: "bold",
                }}
                filled={true}
              >
                Target Exposure Value
              </FormLabel>
              <FormHelperText
                sx={{
                  fontSize: "medium",
                  fontWeight: "normal",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                Enter the desired signal-to-noise (S/N) ratio or integration time, as well as the wavelength. If
                given a S/N ratio, the ETC will calculate the integration time required to
                reach this value at the given wavelength. If given an integration time, the ETC
                will calculate the S/N ratio reached after the inputted
                number of seconds at the given wavelength.
              </FormHelperText>
              <FormGroup>
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={4}>
                    <CommonTextField
                      label="Target Value"
                      placeholder=""
                      name="snrInput.val"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <CommonTextField
                      label="Wavelength (nm)"
                      placeholder=""
                      name="snrInput.wavelength"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Select
                      name="snrInput.val_type"
                      type="select"
                      // size="large"
                      variant="outlined"
                      style={{ fontSize: 18 }}
                      onChange={(event: any) =>
                        setFieldValue("snrInput.val_type", event.target.value)
                      }
                      value={values.snrInput.val_type}
                      sx={{
                        width: "100%",
                        height: "3.55rem",
                        // height: "77.5%"
                      }}
                    >
                      <MenuItem value="snr">S/N Ratio</MenuItem>
                      <MenuItem value="t">Time (s)</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </FormGroup>
            </FormControl>
            <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
            <br />
            <br />
            <AlertError
              isError={isError}
              setIsError={setIsError}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
            <AlertSuccessfulRequest
              type = {"Submitted"}
              isSent={isSent}
              setIsSent={setIsSent}
            />
          </Form>
        )}
      </Formik>
      {sessionStorage.getItem("uvmosParams") !== null &&
      sessionStorage.getItem("uvmosForm") !== null ? (
        <DisplayResults numUVMOSSubmit={numUVMOSSubmit} />
      ) : null}
    </div>
  );
};

export default UVMOSForm;
