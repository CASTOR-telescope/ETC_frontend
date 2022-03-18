import { Formik, Field, Form, useField, FieldAttributes, useFormikContext } from "formik";
import {
  Button,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Link,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "../../service/env";
import { useCallback, useEffect, useState } from "react";
import usePrevious from "../usePrevious";
import { initial, isEqual } from "lodash";

type MyTextFieldProps = {
  placeholder: string;
  label: string;
  // values: Object;
  prevFormValues: Object;
  setIsChanged: (value: boolean) => void;
} & FieldAttributes<{}>;

/**
 * Should be called within a <Form> </Form> component. Should also pass in:
 *
 * @param name
 * @param value
 *
 * @returns <Field />
 */
const MyTextField: React.FC<MyTextFieldProps> = ({
  placeholder,
  label,
  // values,
  prevFormValues,
  setIsChanged,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  const { values } = useFormikContext();

  const compareValues = useCallback(() => {
    if (isEqual(values, prevFormValues)) {
      setIsChanged(false);
      console.log("unchanged values: ", values);
      console.log("prevFormValues values: ", prevFormValues);
    } else {
      setIsChanged(true);
      console.log("changed values: ", values);
      console.log("prevFormValues values: ", prevFormValues);
    }
  }, [values]);

  useEffect(() => {
    compareValues();
    // if (isEqual(values, prevFormValues)) {
    //   setIsChanged(false);
    //   console.log("unchanged values: ", values);
    //   console.log("prevFormValues values: ", prevFormValues);
    // } else {
    //   setIsChanged(true);
    //   console.log("changed values: ", values);
    //   console.log("prevFormValues values: ", prevFormValues);
    // }
    // console.log(values);
  }, [values]);

  return (
    <Field
      // key={props.name}
      placeholder={placeholder}
      label={label}
      // Consistent props
      as={TextField}
      type="input"
      fullWidth
      required={true}
      sx={{ marginTop: "auto", marginBottom: 2 }}
      helperText={errorText}
      error={!!errorText} // True if errorText is non-empty
      {...field}
      // handleChange={useCallback(() => {}, []);
    />
  );
};

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
  setIsSavedAndUnsubmitted: (value: boolean) => void;
  isChanged: boolean;
  setIsChanged: (value: boolean) => void;
  prevFormValues: Object; // object
  setPrevFormValues: (value: Object) => void; // set object
};

/**
 * Tab for setting Telescope parameters
 *
 */
const TelescopeForm: React.FC<TelescopeFormProps> = ({
  setIsSavedAndUnsubmitted,
  isChanged,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,
}) => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const myInitialValues = {
    fwhm: "0.15", // arcsec
    pxScale: "0.1", // arcsec per pixel
    mirrorDiameter: "100", // cm
    darkCurrent: "0.01", // electron/s per pixel
    readNoise: "2.0", // electron/s per pixel
    redleakThresholds: { uv: "3880", u: "4730", g: "5660" }, // angstrom
  };
  // Only run this on mount
  useEffect(() => {
    setIsChanged(false);
    setPrevFormValues(myInitialValues);
  }, []);

  // /**
  //  * Should be called within a <Form> </Form> component. Should also pass in:
  //  *
  //  * @param name
  //  * @param value
  //  *
  //  * @returns <Field />
  //  */
  // const MyTextField: React.FC<MyTextFieldProps> = ({
  //   placeholder,
  //   label,
  //   values,
  //   ...props
  // }) => {
  //   const [field, meta] = useField<{}>(props);
  //   const errorText = meta.error && meta.touched ? meta.error : "";

  //   // const compareValues = useCallback(() => {
  //   //   if (isEqual(values, prevFormValues)) {
  //   //     setIsChanged(false);
  //   //     console.log("unchanged values: ", values);
  //   //     console.log("prevFormValues values: ", prevFormValues);
  //   //   } else {
  //   //     setIsChanged(true);
  //   //     console.log("changed values: ", values);
  //   //     console.log("prevFormValues values: ", prevFormValues);
  //   //   }
  //   // }, [values]);

  //   useEffect(() => {
  //     // compareValues();
  //     if (isEqual(values, prevFormValues)) {
  //       setIsChanged(false);
  //       console.log("unchanged values: ", values);
  //       console.log("prevFormValues values: ", prevFormValues);
  //     } else {
  //       setIsChanged(true);
  //       console.log("changed values: ", values);
  //       console.log("prevFormValues values: ", prevFormValues);
  //     }
  //     console.log(values);
  //   }, [values]);

  //   return (
  //     <Field
  //       key={props.name}
  //       placeholder={placeholder}
  //       label={label}
  //       // Consistent props
  //       as={TextField}
  //       type="input"
  //       fullWidth
  //       required={true}
  //       sx={{ marginTop: "auto", marginBottom: 2 }}
  //       helperText={errorText}
  //       error={!!errorText} // True if errorText is non-empty
  //       {...field}
  //       // handleChange={useCallback(() => {}, []);
  //     />
  //   );
  // };

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

            // JUST LET PYTHON CONVERT TO FLOAT. TYPESCRIPT IS ANGRY
            // for (let key in data) {
            //   if (key !== "redleakThresholds") {
            //     data[key] = parseFloat(data[key]);
            //   } else {
            //     for (let band in data["redleakThresholds"]) {
            //       data["redleakThresholds"][band] = parseFloat(
            //         data["redleakThresholds"][band]
            //       );
            //     }
            //   }
            // }

            // if (window.sessionStorage.getItem("telescopeParams")) {window.sessionStorage.removeItem("telescopeParams")} ? Not necessary...

            // Make async call
            const response = await axios
              .put(API_URL + "telescope", data)
              .then((response) => response.data)
              .then((response) =>
                sessionStorage.setItem("telescopeParams", JSON.stringify(response))
              )
              .then(() => {
                // TODO: remove console.log() when done testing
                console.log(sessionStorage.getItem("telescopeParams"));
                setIsSavedAndUnsubmitted(true);
                setPrevFormValues(data);
                setIsChanged(false);
              })
              .catch((error) => {
                console.log(error);
                setIsError(true);
                // console.log(JSON.stringify(error));
                setErrorMessage(error.message);
              })
              .finally(() => setSubmitting(false));
          } // end async function
        } // end onSubmit
        // FIXME: should validate as typing without needing to press save first too...
        validateOnChange={true}
        validationSchema={telescopeValidationSchema}
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
            <MyTextField
              name="fwhm"
              value={values.fwhm} // Allow both initial value + placeholder text
              placeholder={"Default: 0.15"}
              label="FWHM of PSF (arcsec)"
              // values={values}
              prevFormValues={prevFormValues}
              setIsChanged={setIsChanged}
            />
            <MyTextField
              name="pxScale"
              value={values.pxScale}
              placeholder={"Default: 0.1"}
              label="Pixel Scale (arcsec per pixel)"
              // values={values}
              prevFormValues={prevFormValues}
              setIsChanged={setIsChanged}
            />
            <MyTextField
              name="mirrorDiameter"
              value={values.mirrorDiameter}
              placeholder={"Default: 100"}
              label="Mirror Diameter (cm)"
              // values={values}
              prevFormValues={prevFormValues}
              setIsChanged={setIsChanged}
            />
            <MyTextField
              name="darkCurrent"
              value={values.darkCurrent}
              placeholder={"Default: 0.01"}
              label="Dark Current (electron/s per pixel)"
              // values={values}
              prevFormValues={prevFormValues}
              setIsChanged={setIsChanged}
            />
            <MyTextField
              name="readNoise"
              value={values.readNoise}
              placeholder={"Default: 2.0"}
              label="Read Noise (electron/s per pixel)"
              // values={values}
              prevFormValues={prevFormValues}
              setIsChanged={setIsChanged}
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
                <MyTextField
                  name="redleakThresholds.uv"
                  value={values.redleakThresholds.uv}
                  placeholder={"Default: 3880"}
                  label="UV-band (angstrom)"
                  // values={values}
                  prevFormValues={prevFormValues}
                  setIsChanged={setIsChanged}
                />
                <MyTextField
                  name="redleakThresholds.u"
                  value={values.redleakThresholds.u}
                  placeholder={"Default: 4730"}
                  label="u-band (angstrom)"
                  // values={values}
                  prevFormValues={prevFormValues}
                  setIsChanged={setIsChanged}
                />
                <MyTextField
                  name="redleakThresholds.g"
                  value={values.redleakThresholds.g}
                  placeholder={"Default: 5660"}
                  label="g-band (angstrom)"
                  // values={values}
                  prevFormValues={prevFormValues}
                  setIsChanged={setIsChanged}
                />
              </FormGroup>
            </FormControl>
            <br />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              color="secondary"
              size="large"
              variant="contained"
              style={{ width: "25%", fontSize: 24, margin: 16 }}
            >
              Save
            </Button>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <Snackbar
              open={isError}
              autoHideDuration={6000}
              onClose={() => {
                // Clear any previous errors
                setIsError(false);
                setErrorMessage("");
              }}
            >
              <Alert
                severity="error"
                onClose={() => {
                  // Clear any previous errors
                  setIsError(false);
                  setErrorMessage("");
                }}
              >
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
              </Alert>
            </Snackbar>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TelescopeForm;
