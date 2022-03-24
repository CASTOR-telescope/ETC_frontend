import { Formik, Form, FormikValues } from "formik";
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Link,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import { useEffect } from "react";

import {
  CommonTextFieldWithTracker,
  CommonFormProps,
  AlertError,
  CommonTextField,
  SaveButton,
} from "../CommonFormElements";
import { API_URL } from "../../service/env";

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
});

type TelescopeFormProps = {
  incrNumTelescopeSaved: () => void;
  // setIsTelescopeUpdated: (value: boolean) => void;
  setIsBackgroundSyncTelescope: (value: boolean) => void;
  setIsSourceSyncTelescope: (value: boolean) => void;
} & CommonFormProps;

/**
 * Tab for setting Telescope parameters
 *
 */
const TelescopeForm: React.FC<TelescopeFormProps> = ({
  setIsSavedAndUnsubmitted,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,
  incrNumTelescopeSaved,
  isError,
  setIsError,
  errorMessage,
  setErrorMessage,
  // isTelescopeUpdated, // don't need this
  // setIsTelescopeUpdated,
  setIsBackgroundSyncTelescope,
  setIsSourceSyncTelescope,
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
      darkCurrent: "0.01", // electron/s per pixel
      readNoise: "2.0", // electron/s per pixel
      redleakThresholds: { uv: "3880", u: "4730", g: "5660" }, // angstrom
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
      <Typography variant="h5">Input parameters for the telescope below.</Typography>
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
      </Typography>
      <Formik
        initialValues={myInitialValues}
        onSubmit={
          async (data, { setSubmitting }) => {
            setSubmitting(true);

            // Make async call
            const response = await axios
              .put(API_URL + "telescope", data)
              .then((response) => response.data)
              .then((response) =>
                sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response))
              )
              .then(() => {
                setIsSavedAndUnsubmitted(true);
                setPrevFormValues(data);
                setIsChanged(false);
                sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));
                incrNumTelescopeSaved();
                if (
                  sessionStorage.getItem("backgroundForm") !== null &&
                  JSON.parse(`${sessionStorage.getItem("backgroundForm")}`)[
                    "useDefaultSkyBackground"
                  ].toLowerCase() === "true"
                ) {
                  setIsBackgroundSyncTelescope(false);
                }
                setIsSourceSyncTelescope(false);
              })
              .catch((error) => {
                console.log(error);
                setIsError(true);
                setErrorMessage(error.message);
              })
              .finally(() => setSubmitting(false));
          } // end async function
        } // end onSubmit
        validateOnChange={true}
        validationSchema={telescopeValidationSchema}
        validateOnMount={true}
      >
        {({
          values,
          // errors,
          // touched,
          // handleChange,
          // handleBlur,
          // handleSubmit,
          isSubmitting,
          isValid,
        }) => (
          <Form>
            <CommonTextFieldWithTracker
              name="fwhm"
              value={values.fwhm} // Allow both initial value + placeholder text
              placeholder={"Default: 0.15"}
              label="FWHM of PSF (arcsec)"
              // values={values}
              prevFormValues={prevFormValues}
              setIsChanged={setIsChanged}
            />
            <CommonTextField
              name="pxScale"
              value={values.pxScale}
              placeholder={"Default: 0.1"}
              label="Pixel Scale (arcsec per pixel)"
              // values={values}
              // prevFormValues={prevFormValues}
              // setIsChanged={setIsChanged}
            />
            <CommonTextField
              name="mirrorDiameter"
              value={values.mirrorDiameter}
              placeholder={"Default: 100"}
              label="Mirror Diameter (cm)"
              // values={values}
              // prevFormValues={prevFormValues}
              // setIsChanged={setIsChanged}
            />
            <CommonTextField
              name="darkCurrent"
              value={values.darkCurrent}
              placeholder={"Default: 0.01"}
              label="Dark Current (electron/s per pixel)"
              // values={values}
              // prevFormValues={prevFormValues}
              // setIsChanged={setIsChanged}
            />
            <CommonTextField
              name="readNoise"
              value={values.readNoise}
              placeholder={"Default: 2.0"}
              label="Read Noise (electron/s per pixel)"
              // values={values}
              // prevFormValues={prevFormValues}
              // setIsChanged={setIsChanged}
            />
            <FormControl component="fieldset" variant="standard">
              <FormLabel
                component="legend"
                required={true}
                sx={{ fontSize: 18 }}
                filled={true}
              >
                Redleak Thresholds
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
                  placeholder={"Default: 3880"}
                  label="UV-Band (angstrom)"
                  // values={values}
                  // prevFormValues={prevFormValues}
                  // setIsChanged={setIsChanged}
                />
                <CommonTextField
                  name="redleakThresholds.u"
                  value={values.redleakThresholds.u}
                  placeholder={"Default: 4730"}
                  label="u-Band (angstrom)"
                  // values={values}
                  // prevFormValues={prevFormValues}
                  // setIsChanged={setIsChanged}
                />
                <CommonTextField
                  name="redleakThresholds.g"
                  value={values.redleakThresholds.g}
                  placeholder={"Default: 5660"}
                  label="g-Band (angstrom)"
                  // values={values}
                  // prevFormValues={prevFormValues}
                  // setIsChanged={setIsChanged}
                />
              </FormGroup>
            </FormControl>
            <br />
            <SaveButton isSubmitting={isSubmitting} isValid={isValid} />
            <AlertError
              isError={isError}
              setIsError={setIsError}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TelescopeForm;
