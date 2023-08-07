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

import { Formik, Form, FormikValues } from "formik";
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import { useEffect } from "react";

import {
  AlertIfFormSavedButNotSubmitted,
  CommonTextFieldWithTracker,
  CommonFormProps,
  AlertError,
  AlertSuccessfulRequest,
  CommonTextField,
  SaveButton,
} from "../CommonFormElements";
import { API_URL } from "../../env";

import Button from "@mui/material/Button";

const telescopeValidationSchema = Yup.object({
  fwhm: Yup.number()
    .required("FWHM is a required field")
    .typeError("FWHM must be a number > 0")
    .positive("FWHM must be a number > 0"),
  pxScale: Yup.number()
    .required("Pixel scale is a required field")
    .typeError("Pixel scale must be a number > 0")
    .positive("Pixel scale must be a number > 0"),
  mirrorDiameter: Yup.number()
    .required("Mirror diameter is a required field")
    .typeError("Mirror diameter must be a number > 0")
    .positive("Mirror diameter must be a number > 0"),
  darkCurrent: Yup.number()
    .required("Dark current is a required field")
    .typeError("Dark current must be a number > 0")
    .positive("Dark current must be a number > 0"),
  readNoise: Yup.number()
    .required("Read noise is a required field")
    .typeError("Read noise must be a number > 0")
    .positive("Read noise must be a number > 0"),
  redleakThresholds: Yup.object({
    uv: Yup.number()
      .required("Redleak threshold is a required field")
      .typeError("Redleak threshold must be a number > 0")
      .positive("Redleak threshold must be a number > 0"),
    u: Yup.number()
      .required("Redleak threshold is a required field")
      .typeError("Redleak threshold must be a number > 0")
      .positive("Redleak threshold must be a number > 0"),
    g: Yup.number()
      .required("Redleak threshold is a required field")
      .typeError("Redleak threshold must be a number > 0")
      .positive("Redleak threshold must be a number > 0"),
  }),
  extinctionCoeffs: Yup.object({
    uv: Yup.number()
      .required("Extinction coefficients is a required field")
      .typeError("Extinction coefficients must be a number > 0")
      .positive("Extinction coefficients must be a number > 0"),
    u: Yup.number()
      .required("Extinction coefficients is a required field")
      .typeError("Extinction coefficients must be a number > 0")
      .positive("Extinction coefficients must be a number > 0"),
    g: Yup.number()
      .required("Extinction coefficients is a required field")
      .typeError("Extinction coefficients must be a number > 0")
      .positive("Extinction coefficients must be a number > 0"),
  }),
});

type TelescopeFormProps = {
  setIsPhotometrySavedAndUnsubmitted: (value: boolean) => void;
  setIsUVMOSSavedAndUnsubmitted: (value: boolean) => void;
  setIsTransitSavedAndUnsubmitted: (value: boolean) => void;
  incrNumTelescopeOrSourceSaved: () => void;
  // setIsTelescopeUpdated: (value: boolean) => void;
  setIsBackgroundSyncTelescope: (value: boolean) => void;
  setIsSourceSyncTelescope: (value: boolean) => void;
  numPhotometrySubmit: number;
  numUVMOSSubmit: number;
  numTransitSubmit: number;
  isTelescopeSyncPhotometry: boolean;
  setIsTelescopeSyncPhotometry: (value: boolean) => void;
  isTelescopeSyncUVMOS: boolean;
  setIsTelescopeSyncUVMOS: (value: boolean) => void;
  isTelescopeSyncTransit: boolean;
  setIsTelescopeSyncTransit: (value: boolean) => void;
  // incrNumPhotometrySubmit: () => void;
  isChanged: boolean;
} & CommonFormProps;

/**
 * Tab for setting Telescope parameters
 *
 */
const TelescopeForm: React.FC<TelescopeFormProps> = ({
  setIsPhotometrySavedAndUnsubmitted,
  setIsUVMOSSavedAndUnsubmitted,
  setIsTransitSavedAndUnsubmitted,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,
  incrNumTelescopeOrSourceSaved,
  isError,
  setIsError,
  isSent,
  setIsSent,
  errorMessage,
  setErrorMessage,
  // isTelescopeUpdated, // don't need this
  // setIsTelescopeUpdated,
  setIsBackgroundSyncTelescope,
  setIsSourceSyncTelescope,
  numPhotometrySubmit,
  isTelescopeSyncPhotometry,
  setIsTelescopeSyncPhotometry,
  numUVMOSSubmit,
  isTelescopeSyncUVMOS,
  setIsTelescopeSyncUVMOS,
  numTransitSubmit,
  isTelescopeSyncTransit,
  setIsTelescopeSyncTransit,
  // incrNumPhotometrySubmit,
  isChanged,
}) => {
  // Save user form inputs between tab switches
  const FORM_SESSION = "telescopeForm"; // key for sessionStorage (user inputs)
  const FORM_PARAMS = "telescopeParams"; // key for sessionStorage (API results)
  let myInitialValues: FormikValues;
  if (sessionStorage.getItem(FORM_SESSION) === null) {
    myInitialValues = {
      fwhm: "0.15", // arcsec
      pxScale: "0.1", // arcsec per pixel
      mirrorDiameter: "100", // cm
      darkCurrent: "1e-4", // electron/s per pixel
      readNoise: "2.0", // electron/s per pixel
      redleakThresholds: { uv: "3010", u: "4160", g: "5600" }, // angstrom
      extinctionCoeffs: { uv: 7.06, u: 4.35, g: 3.31 },
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
      <Button variant="outlined" style={{textTransform: "none", fontSize: 16}}>
      ETC v1.1.1</Button>
      <Typography variant="h5" style={{marginTop: 15}}>
        Input parameters for the telescope below.
        </Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        The telescope passband limits, passband response, pivot wavelengths, photometric
        zeropoints are currently not customizable here. Please use the Python{" "}
        <Link
          href="https://github.com/CASTOR-telescope/ETC"
          // Open link in new tab
          rel="noopener noreferrer"
          target="_blank"
        >
          <code>castor_etc</code>
        </Link>{" "}
        package instead.
        <br />
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
        repository are all welcome.
      </Typography>
      <AlertIfFormSavedButNotSubmitted
      parameters={
        [
      {
        name: 'Photometry',
        isFormSync:isTelescopeSyncPhotometry,
        numSubmit:numPhotometrySubmit
      },
      {
        name: 'UVMOS',
        isFormSync:isTelescopeSyncUVMOS,
        numSubmit:numUVMOSSubmit
      },
      {
        name: 'Transit',
        isFormSync:isTelescopeSyncTransit,
        numSubmit:numTransitSubmit
      },
      ]}
      />
      <Formik
        initialValues={myInitialValues}
        onSubmit={
          async (data, { setSubmitting }) => {
            setSubmitting(true);

            // Make async call
            await axios
              .put(API_URL + "telescope", data)
              .then((response) => response.data)
              .then((response) =>
                sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response))
              )
              .then(() => {
                setIsSent(true)
                setIsPhotometrySavedAndUnsubmitted(true);
                setIsUVMOSSavedAndUnsubmitted(true);
                setIsTransitSavedAndUnsubmitted(true);
                setPrevFormValues(data);
                setIsChanged(false);
                sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));
                incrNumTelescopeOrSourceSaved();
                if (
                  sessionStorage.getItem("backgroundForm") === null ||
                  (sessionStorage.getItem("backgroundForm") !== null &&
                    JSON.parse(`${sessionStorage.getItem("backgroundForm")}`)[
                      "useDefaultSkyBackground"
                    ].toLowerCase() === "true")
                ) {
                  setIsBackgroundSyncTelescope(false);
                }
                setIsSourceSyncTelescope(false);
                if (sessionStorage.getItem("photometryForm") !== null) {
                  setIsTelescopeSyncPhotometry(false);
                }
                if (sessionStorage.getItem("uvmosForm") !== null) {
                  setIsTelescopeSyncUVMOS(false);
                }
                if (sessionStorage.getItem("transitForm") !== null) {
                  setIsTelescopeSyncTransit(false);
                }

                // // Resubmit Photometry form to update images and calculations (doesn't
                // // work in current state)
                // if (sessionStorage.getItem("photometryForm") !== null) {
                //   axios
                //     .put(
                //       API_URL + "photometry",
                //       JSON.parse(`${sessionStorage.getItem("photometryForm")}`)
                //     )
                //     .then((phot_response) => phot_response.data)
                //     .then((phot_response) =>
                //       sessionStorage.setItem(
                //         "photometryParams",
                //         JSON.stringify(phot_response)
                //       )
                //     );
                //   incrNumPhotometrySubmit();

                //   // const _ = async () => {
                //   //   await axios
                //   //     .put(
                //   //       API_URL + "photometry",
                //   //       JSON.parse(`${sessionStorage.getItem("photometryForm")}`)
                //   //     )
                //   //     .then((phot_response) => phot_response.data)
                //   //     .then((phot_response) => {
                //   //       sessionStorage.setItem(
                //   //         "photometryParams",
                //   //         JSON.stringify(phot_response)
                //   //       );
                //   //       incrNumPhotometrySubmit();
                //   //     });
                //   // };
                // }
              })
              .catch((error) => {
                console.log(error);
                setIsError(true);
                setErrorMessage(error.message);
              })
              .finally(() => setSubmitting(false));

            // // Resubmit Photometry form to update images and calculations (doesn't work)
            // if (sessionStorage.getItem("photometryForm") !== null) {
            //   // axios
            //   //   .put(
            //   //     API_URL + "photometry",
            //   //     JSON.parse(`${sessionStorage.getItem("photometryForm")}`)
            //   //   )
            //   //   .then((phot_response) => phot_response.data)
            //   //   .then((phot_response) =>
            //   //     sessionStorage.setItem(
            //   //       "photometryParams",
            //   //       JSON.stringify(phot_response)
            //   //     )
            //   //   );
            //   // incrNumPhotometrySubmit();

            //   const _ = async () => {
            //     await axios
            //       .put(
            //         API_URL + "photometry",
            //         JSON.parse(`${sessionStorage.getItem("photometryForm")}`)
            //       )
            //       .then((phot_response) => phot_response.data)
            //       .then((phot_response) => {
            //         sessionStorage.setItem(
            //           "photometryParams",
            //           JSON.stringify(phot_response)
            //         );
            //         incrNumPhotometrySubmit();
            //       });
            //   };
            // }
          } // end async function
        } // end onSubmit
        validateOnChange={true}
        validationSchema={telescopeValidationSchema}
        validateOnMount={true}
      >
        {({ values, isSubmitting, isValid }) => (
          <Form>
            <CommonTextFieldWithTracker
              name="fwhm"
              value={values.fwhm} // Allow both initial value + placeholder text
              placeholder={"Default: 0.15"}
              label="FWHM of PSF (arcsec)"
              prevFormValues={prevFormValues}
              setIsChanged={setIsChanged}
            />
            <CommonTextField
              name="pxScale"
              value={values.pxScale}
              placeholder={"Default: 0.1"}
              label="Pixel Scale (arcsec per pixel)"
            />
            <CommonTextField
              name="mirrorDiameter"
              value={values.mirrorDiameter}
              placeholder={"Default: 100"}
              label="Mirror Diameter (cm)"
            />
            <CommonTextField
              name="darkCurrent"
              value={values.darkCurrent}
              placeholder={"Default: 1e-4"}
              label="Dark Current (electron/s per pixel)"
            />
            <CommonTextField
              name="readNoise"
              value={values.readNoise}
              placeholder={"Default: 2.0"}
              label="Read Noise (electron/s per pixel)"
            />
            <FormControl component="fieldset" variant="standard">
              <FormLabel
                component="legend"
                required={true}
                sx={{ fontSize: 18 }}
                filled={true}
              >
                Red Leak Thresholds
              </FormLabel>
              <FormHelperText
                sx={{
                  fontSize: "medium",
                  fontWeight: "normal",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                Flux from the source that is longward of this wavelength will be
                considered red leak in that passband.
              </FormHelperText>
              <FormGroup>
                <CommonTextField
                  name="redleakThresholds.uv"
                  value={values.redleakThresholds.uv}
                  placeholder={"Default: 3010"}
                  label="UV-Band (angstrom)"
                />
                <CommonTextField
                  name="redleakThresholds.u"
                  value={values.redleakThresholds.u}
                  placeholder={"Default: 4160"}
                  label="u-Band (angstrom)"
                />
                <CommonTextField
                  name="redleakThresholds.g"
                  value={values.redleakThresholds.g}
                  placeholder={"Default: 5600"}
                  label="g-Band (angstrom)"
                />
              </FormGroup>
            </FormControl>
            <br />
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <FormControl
                component="fieldset"
                variant="standard"
                sx={{
                  width: "85%",
                  justifyContent: "center",
                }}
                fullWidth={false}
                color="secondary"
              >
                <FormLabel
                  component="legend"
                  required={true}
                  sx={{
                    fontSize: 18,
                    // fontWeight: "bold",
                  }}
                  filled={true}
                >
                  Extinction Coefficients
                </FormLabel>
                <FormHelperText
                  sx={{
                    fontSize: "medium",
                    fontWeight: "normal",
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  These are the <i>R&nbsp;&#8239;≡&nbsp;A&#8239;/&#8239;E(B-V)</i> values
                  in each of the telescope passbands.
                </FormHelperText>
                <FormGroup>
                  <Grid container spacing={2} columns={12}>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="extinctionCoeffs.uv"
                        value={values.extinctionCoeffs.uv}
                        placeholder={"Example: 7.06"}
                        label="UV-Band"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="extinctionCoeffs.u"
                        value={values.extinctionCoeffs.u}
                        placeholder={"Example: 4.35"}
                        label="u-Band"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="extinctionCoeffs.g"
                        value={values.extinctionCoeffs.g}
                        placeholder={"Example: 3.31"}
                        label="g-Band"
                        required={true}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </div>
            <br />
            <SaveButton isSubmitting={isSubmitting} isValid={isValid} />
            <AlertError
              isError={isError}
              setIsError={setIsError}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
            <AlertSuccessfulRequest
            type={"Saved"}
            isSent={isSent}
            setIsSent={setIsSent}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TelescopeForm;
