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
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import { useEffect } from "react";

import {
  useGetIfFormChanged,
  CommonFormProps,
  AlertError,
  CommonTextField,
  SaveButton,
} from "../CommonFormElements";
import { API_URL } from "../../service/env";
import React from "react";

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
  const [field] = useField<{}>(props);

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
                  <CommonTextField
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
                  <CommonTextField
                    name="customSkyBackground.u"
                    // value={values.customSkyBackground.u}
                    placeholder={"Example: 23.74"}
                    label="u-Band (AB mag per sq. arcsec)"
                    required={true}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CommonTextField
                    name="customSkyBackground.g"
                    // value={values.customSkyBackground.g}
                    placeholder={"Example: 22.60"}
                    label="g-Band (AB mag per sq. arcsec)"
                    required={true}
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

type GeocoronalEmissionGroupProps = {
  values: { [value: string]: any }; // any object props
  handleChange: (event: React.ChangeEvent<{}>) => void;
} & FieldAttributes<{}>;

const GeocoronalEmissionGroup: React.FC<GeocoronalEmissionGroupProps> = ({
  values,
  handleChange,
  ...props // any object props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<{}>(props);
  // TODO: figure out how to show error only that FieldArray TextField element...
  // TODO: figure out why sometimes error does not show on TextField (e.g., "Averaged"). Still won't save but error will not show until Save button is pressed
  const isError = meta.error ? true : false;
  // const errorText = meta.error || meta.touched ? meta.error : "";

  return (
    // <FieldArray name="geocoronalEmission">
    <FieldArray {...field}>
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
                <Grid container justifyContent="center" alignItems="top">
                  <Autocomplete
                    // https://stackoverflow.com/a/59217951
                    freeSolo
                    sx={{ marginTop: 2, marginBottom: 0, width: "35%" }}
                    onChange={(event, value) =>
                      setFieldValue(`geocoronalEmission.${index}.flux`, value)
                    }
                    options={["High", "Average", "Low"].map((flux: string) => flux)}
                    value={values.geocoronalEmission[index].flux}
                    renderInput={(params) => (
                      <Box style={{ minHeight: "1.5rem" }}>
                        <TextField
                          {...params}
                          name={`geocoronalEmission.${index}.flux`}
                          placeholder="Example: 1.5e-15"
                          label="Flux (erg/s/cm² per sq. arcsec)"
                          onChange={handleChange}
                          required={true}
                          helperText={
                            isError
                              ? "Flux must be one of the predetermined values or a number > 0." // manually copy error message from Yup validation
                              : ""
                          }
                          error={isError}
                        />
                      </Box>
                    )}
                  />
                  <Grid item>
                    <Button
                      style={{
                        marginTop: "1rem",
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
  );
};

type AlertIfTelescopeParamsChangedProps = {
  isBackgroundSyncTelescope: boolean;
};

const AlertIfTelescopeParamsChanged: React.FC<AlertIfTelescopeParamsChangedProps> = ({
  isBackgroundSyncTelescope,
}) => {
  if (sessionStorage.getItem("backgroundForm") !== null && !isBackgroundSyncTelescope) {
    if (
      JSON.parse(`${sessionStorage.getItem("backgroundForm")}`)[
        "useDefaultSkyBackground"
      ].toLowerCase() === "true"
    ) {
      return (
        <Box
          sx={{
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginBottom: 2,
          }}
        >
          <Alert severity="info" style={{ width: "50%" }}>
            <AlertTitle>Info</AlertTitle>
            <Typography>
              The telescope parameters have been updated and the sky background magnitudes
              in each passband may be incorrect. Please save the background parameters
              again.
            </Typography>
          </Alert>
        </Box>
      );
    } else {
      return <div />;
    }
  } else {
    return <div />;
  }
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
      // This validation took me so long to do! I hope you appreciate it...
      flux: Yup.string()
        .required("Flux is a required field")
        .test(
          "geocoronalInputs",
          "Flux must be one of the predetermined values or a number > 0.",
          (value: any) =>
            /(^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)((?:[eE][+-]?[0-9]+[\.]?[0-9]+)?|(?:[eE][+-]?[0-9]+)?)$)|(^(high|average|low)$)/i.test(
              value
            )
        ),
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

type BackgroundFormProps = {
  // isTelescopeUpdated: boolean;
  isBackgroundSyncTelescope: boolean;
  setIsBackgroundSyncTelescope: (value: boolean) => void;
} & CommonFormProps;

const BackgroundForm: React.FC<BackgroundFormProps> = ({
  setIsSavedAndUnsubmitted,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,
  isError,
  setIsError,
  errorMessage,
  setErrorMessage,
  isBackgroundSyncTelescope,
  setIsBackgroundSyncTelescope,
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
      <Typography variant="h5">Characterize the sky background below.</Typography>
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

            // Make async call
            const response = await axios
              .put(API_URL + "background", data)
              .then((response) => response.data)
              .then((response) =>
                sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response))
              )
              .then(() => {
                // TODO: remove console.log() when done testing
                setIsSavedAndUnsubmitted(true);
                setPrevFormValues(data);
                setIsChanged(false);
                sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));
                setIsBackgroundSyncTelescope(true);
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
        validationSchema={backgroundValidationSchema}
        validateOnMount={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          // handleBlur,
          // handleSubmit,
          isSubmitting,
          isValid,
        }) => (
          <Form>
            <AlertIfTelescopeParamsChanged
              isBackgroundSyncTelescope={isBackgroundSyncTelescope}
            />
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
                zodiacal light spectra from HST. If using a custom sky background, please
                specify the AB magnitude per square arcsecond in each telescope band.
                These magnitudes should include both the Earthshine and zodiacal light
                components.
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
              <GeocoronalEmissionGroup
                name="geocoronalEmission"
                values={values}
                handleChange={handleChange}
              />
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

export default BackgroundForm;
