import {
  Formik,
  Form,
  FormikValues,
  Field,
  useField,
  FieldAttributes,
  useFormikContext,
  FieldArray,
} from "formik";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import {
  useGetIfFormChanged,
  CommonFormProps,
  AlertError,
  CommonTextField,
  SaveButton,
} from "../CommonFormElements";
import { API_URL } from "../../service/env";
import React from "react";

export type SkyBackgroundTextField = {
  placeholder: string;
  label: string;
  required?: boolean;
} & FieldAttributes<{}>;

const SkyBackgroundTextField: React.FC<SkyBackgroundTextField> = ({
  placeholder,
  label,
  required = true,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error || meta.touched ? meta.error : "";

  return (
    <Field
      placeholder={placeholder}
      label={label}
      // Consistent props
      as={TextField}
      type="input"
      fullWidth
      required={required}
      sx={{ marginTop: "auto", marginBottom: 2 }}
      helperText={errorText}
      error={!!errorText} // True if errorText is non-empty
      {...field}
    />
  );
};

type SkyBackgroundRadioGroupProps = {
  values: { [value: string]: any }; // any object props
  prevFormValues: Object;
  setIsChanged: (value: boolean) => void;
} & FieldAttributes<{}>;

const SkyBackgroundRadioGroup: React.FC<SkyBackgroundRadioGroupProps> = ({
  values,
  prevFormValues,
  setIsChanged,
  ...props // any object props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error || meta.touched ? meta.error : "";

  useGetIfFormChanged(setIsChanged, prevFormValues);

  return (
    <React.Fragment>
      <RadioGroup
        name={field.name}
        value={values.useDefaultSkyBackground}
        // Need to set onChange manually in this case
        // See <https://levelup.gitconnected.com/create-a-controlled-radio-group-in-react-formik-material-ui-and-typescript-7ed314081a0e>
        onChange={(event) => {
          setFieldValue("useDefaultSkyBackground", event.currentTarget.value);
        }}
        sx={{ marginBottom: 2 }}
      >
        <FormControlLabel
          value="true"
          control={<Radio />}
          label="Use default sky background (Earthshine & zodiacal light)"
        />
        <FormControlLabel
          value="false"
          control={<Radio />}
          label="Use custom sky background (Earthshine & zodiacal light)"
        />
      </RadioGroup>
      {values.useDefaultSkyBackground === "false" && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <FormControl
            component="fieldset"
            variant="standard"
            sx={{
              marginTop: -2,
              marginBottom: 2,
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
                fontSize: 17.5,
                // fontWeight: "bold",
              }}
              filled={true}
            >
              Average Sky Background Magnitudes
            </FormLabel>
            <FormHelperText
              sx={{
                fontSize: "medium",
                fontWeight: "normal",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              Please input the average sky background AB magnitude per square arcsecond in
              each passband.
            </FormHelperText>
            <FormGroup>
              <Grid container spacing={2} columns={12}>
                <Grid item xs={4}>
                  <SkyBackgroundTextField
                    name="customSkyBackground.uv"
                    // value={values.customSkyBackground.uv}
                    placeholder={"Example: 26.08"}
                    label="UV-Band (AB mag per sq. arcsec)"
                    required={true}
                    // prevFormValues={prevFormValues}
                    // setIsChanged={setIsChanged}
                  />
                </Grid>
                <Grid item xs={4}>
                  <SkyBackgroundTextField
                    name="customSkyBackground.u"
                    // value={values.customSkyBackground.u}
                    placeholder={"Example: 23.74"}
                    label="u-Band (AB mag per sq. arcsec)"
                    required={true}
                    // prevFormValues={prevFormValues}
                    // setIsChanged={setIsChanged}
                  />
                </Grid>
                <Grid item xs={4}>
                  <SkyBackgroundTextField
                    name="customSkyBackground.g"
                    // value={values.customSkyBackground.g}
                    placeholder={"Example: 22.60"}
                    label="g-Band (AB mag per sq. arcsec)"
                    required={true}
                    // prevFormValues={prevFormValues}
                    // setIsChanged={setIsChanged}
                  />
                </Grid>
              </Grid>
            </FormGroup>
          </FormControl>
        </div>
      )}
    </React.Fragment>
  );
};

const backgroundValidationSchema = Yup.object({
  useDefaultSkyBackground: Yup.boolean().required(
    "Either default or custom sky background must be selected"
  ),
  customSkyBackground: Yup.object().when("useDefaultSkyBackground", {
    is: false,
    then: Yup.object({
      uv: Yup.number()
        .required("Sky background is a required field")
        .typeError("Sky background must be a number"),
      u: Yup.number()
        .required("Sky background is a required field")
        .typeError("Sky background must be a number"),
      g: Yup.number()
        .required("Sky background is a required field")
        .typeError("Sky background must be a number"),
    }),
    otherwise: Yup.object({
      uv: Yup.number().notRequired().typeError("Sky background must be a number"),
      u: Yup.number().notRequired().typeError("Sky background must be a number"),
      g: Yup.number().notRequired().typeError("Sky background must be a number"),
    }),
  }),
  geocoronalEmission: Yup.array().of(
    Yup.object({
      // TODO: add proper validation for flux. Should match "high", "medium", or "low", or be a positive number
      flux: Yup.string().required("Flux is a required field"),
      // flux: Yup.string().lowercase().oneOf(["high", "average", "low"]).required(),
      // flux: Yup.lazy(
      //   (value) =>
      //     typeof value === "number"
      //       ? Yup.number()
      //           .required("Required field")
      //           .positive()
      //           .typeError("Required field")
      //       : Yup.string()
      //           .lowercase()
      //           .oneOf(["high", "average", "low"])
      //           .required()
      //           .typeError("Required field") // typeError is necessary here, otherwise we get a bad-looking yup error
      // ),
      // flux: Yup.number().transform((value, originalValue) => { return Yup.isType(value) ? value.})
      // number().required().typeError().,
      wavelength: Yup.number()
        .required("Wavelength is a required field")
        .typeError("Wavelength must be a number > 0")
        .positive("Wavelength must be a number > 0"),
      linewidth: Yup.number()
        .required("Linewidth is a required field")
        .typeError("Linewidth must be a number > 0")
        .positive("Linewidth must be a number > 0"),
      id: Yup.number().required(),
    })
  ),
});

const BackgroundForm: React.FC<CommonFormProps> = ({
  setIsSavedAndUnsubmitted,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,
  isError,
  setIsError,
  errorMessage,
  setErrorMessage,
}) => {
  // Save user form inputs between tab switches
  const FORM_SESSION = "backgroundForm"; // key for sessionStorage (user inputs)
  const FORM_PARAMS = "backgroundParams"; // key for sessionStorage (API results)
  let myInitialValues: FormikValues;
  if (sessionStorage.getItem(FORM_SESSION) === null) {
    myInitialValues = {
      useDefaultSkyBackground: "true",
      customSkyBackground: { uv: "", u: "", g: "" }, // AB mag per arcsec^2
      // customSkyBackground: { uv: "26.08", u: "23.74", g: "22.60" }, // AB mag per arcsec^2
      geocoronalEmission: [
        {
          flux: "Average",
          wavelength: "2471",
          linewidth: "0.023",
          id: "" + Math.random(),
        },
      ],
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
      <Typography variant="h5">Please characterize the sky background below.</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        Custom sky background spectra upload and non-uniform sky backgrounds are not yet
        available on this GUI. Please use the Python{" "}
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
            console.log(data);

            // ! Move to async call after
            setIsSavedAndUnsubmitted(true);
            setPrevFormValues(data);
            setIsChanged(false);
            sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));

            // // Make async call
            // const response = await axios
            //   .put(API_URL + "background", data)
            //   .then((response) => response.data)
            //   .then((response) =>
            //     sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response))
            //   )
            //   .then(() => {
            //     // TODO: remove console.log() when done testing
            //     console.log(sessionStorage.getItem(FORM_PARAMS));
            //     setIsSavedAndUnsubmitted(true);
            //     setPrevFormValues(data);
            //     setIsChanged(false);
            //     sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //     setIsError(true);
            //     // console.log(JSON.stringify(error));
            //     setErrorMessage(error.message);
            //   })
            //   .finally(() => setSubmitting(false));
          } // end async function
        } // end onSubmit
        // FIXME: should validate as typing without needing to press save first too...?
        validateOnChange={true}
        validationSchema={backgroundValidationSchema}
        validateOnMount={true}
      >
        {({
          values,
          // errors,
          // touched,
          handleChange,
          // handleBlur,
          // handleSubmit,
          isSubmitting,
          isValid,
          setFieldValue,
        }) => (
          <Form>
            <FormControl component="fieldset" variant="standard" fullWidth={true}>
              <FormLabel
                component="legend"
                required={true}
                sx={{ fontSize: 18 }}
                filled={true}
              >
                Average Sky Background
              </FormLabel>
              <FormHelperText
                sx={{
                  fontSize: "medium",
                  fontWeight: "normal",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                The default sky background is estimated using average Earthshine and
                zodiacal light spectra from HST (? VERIFY). If using a custom sky
                background, please specify the AB magnitude (TODO: insert link) per square
                arcsecond in each telescope band. These magnitudes should include both the
                Earthshine and zodiacal light components.
              </FormHelperText>
              <SkyBackgroundRadioGroup
                name="useDefaultSkyBackground"
                values={values}
                setIsChanged={setIsChanged}
                prevFormValues={prevFormValues}
              />
            </FormControl>
            <br />
            <FormControl component="fieldset" variant="standard">
              <FormLabel
                component="legend"
                required={false}
                sx={{ fontSize: 18 }}
                filled={true}
              >
                Geocoronal Emission Lines
              </FormLabel>
              <FormHelperText
                sx={{
                  fontSize: "medium",
                  fontWeight: "normal",
                  marginBottom: 2,
                  textAlign: "center",
                }}
              >
                Custom wavelength and linewidth for geocoronal emission is currently not
                supported on this GUI. This is one of the things I will add sooner rather
                than later. The predefined "High", "Average", and "Low" geocoronal
                emission lines are all centered at a wavelength of 2471 Å and have a
                linewidth of 0.023 Å. The "High", "Average", and "Low" fluxes are
                3.0×10⁻¹⁵, 1.5×10⁻¹⁵, and 7.5×10⁻¹⁷ erg/s/cm² per sq. arcsec,
                respectively.
              </FormHelperText>
              <FieldArray name="geocoronalEmission">
                {(arrayHelpers) => (
                  <div>
                    <Button
                      size="large"
                      variant="contained"
                      onClick={() =>
                        arrayHelpers.push({
                          flux: "Average",
                          wavelength: "2471",
                          linewidth: "0.023",
                          id: "" + Math.random(),
                        })
                      }
                      sx={{ marginBottom: 1 }}
                    >
                      Add Geocoronal Emission Line
                    </Button>
                    {values.geocoronalEmission.map((geoLine: any, index: number) => {
                      return (
                        <div
                          key={geoLine.id}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Grid container justifyContent="center" alignItems="center">
                            <Autocomplete
                              // https://stackoverflow.com/a/59217951
                              freeSolo
                              sx={{ marginTop: 2, width: "25%" }}
                              onChange={(event, value) =>
                                setFieldValue(`geocoronalEmission.${index}.flux`, value)
                              }
                              options={["High", "Average", "Low"].map(
                                (flux: string) => flux
                              )}
                              value={values.geocoronalEmission[index].flux}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name={`geocoronalEmission.${index}.flux`}
                                  placeholder="Example: 1.5e-15"
                                  label="Flux (erg/s/cm² per sq. arcsec)"
                                  onChange={handleChange}
                                  required={true}
                                />
                              )}
                            />
                            <Grid item alignItems="stretch" style={{ display: "flex" }}>
                              <Button
                                style={{
                                  marginTop: 16,
                                  marginBottom: 0,
                                  marginRight: 0,
                                  marginLeft: 0,
                                  padding: 0,
                                  fontSize: 30,
                                }}
                                variant="outlined"
                                size="large"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                ×
                              </Button>
                            </Grid>
                          </Grid>
                        </div>
                      );
                    })}
                  </div>
                )}
              </FieldArray>
            </FormControl>
            <br />
            <SaveButton isSubmitting={isSubmitting} isValid={isValid} />
            <pre>{JSON.stringify(values, null, 2)}</pre>
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

export default BackgroundForm;
