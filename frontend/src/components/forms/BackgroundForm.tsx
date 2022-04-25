import {
  Formik,
  Form,
  FormikValues,
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

import {
  AlertIfFormSavedButPhotometryNotSubmitted,
  useGetIfFormChanged,
  CommonFormProps,
  AlertError,
  CommonTextField,
  SaveButton,
} from "../CommonFormElements";
import { API_URL } from "../../env";
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
                    placeholder={"Example: 26.08"}
                    label="UV-Band (AB mag per sq. arcsec)"
                    required={true}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CommonTextField
                    name="customSkyBackground.u"
                    placeholder={"Example: 23.74"}
                    label="u-Band (AB mag per sq. arcsec)"
                    required={true}
                  />
                </Grid>
                <Grid item xs={4}>
                  <CommonTextField
                    name="customSkyBackground.g"
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

type GeocoronalAutocompleteFieldProps = {
  index: number;
  fullWidth?: boolean;
  required?: boolean;
} & GeocoronalEmissionGroupProps;

const GeocoronalAutocompleteField: React.FC<GeocoronalAutocompleteFieldProps> = ({
  index,
  values,
  handleChange,
  required = true,
  fullWidth = true,
}) => {
  const { setFieldValue } = useFormikContext();
  // For manual validation
  const [isError, setIsError] = React.useState(false);
  const RegEx = new RegExp(
    /(^[+]?([1-9][0-9]*(?:[.][0-9]*)?|0*.0*[1-9][0-9]*)((?:[eE][+-]?[0-9]+[.]?[0-9]+)?|(?:[eE][+-]?[0-9]+)?)$)|(^(high|average|low)$)/i
  );

  return (
    <Autocomplete
      // https://stackoverflow.com/a/59217951
      freeSolo
      onChange={(event, value) => {
        setIsError(!RegEx.test(value));
        setFieldValue(`geocoronalEmission.${index}.flux`, value);
      }}
      fullWidth={fullWidth}
      options={["High", "Average", "Low"].map((flux: string) => flux)}
      value={values.geocoronalEmission[index].flux}
      renderInput={(params) => (
        <Box>
          <TextField
            {...params}
            fullWidth={fullWidth}
            name={`geocoronalEmission.${index}.flux`}
            placeholder="Example: 1.5e-15"
            label="Flux (erg/s/cm² per sq. arcsec)"
            InputLabelProps={{ shrink: true }} // keep label on top
            onChange={(event: React.ChangeEvent<{}>) => {
              let geoFluxValue = (event.currentTarget as any).value;
              setIsError(!RegEx.test(geoFluxValue));
              setFieldValue(`geocoronalEmission.${index}.flux`, geoFluxValue);
              handleChange(event);
            }}
            required={required}
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
  );
};

const GeocoronalEmissionGroup: React.FC<GeocoronalEmissionGroupProps> = ({
  values,
  handleChange,
  ...props // any object props
}) => {
  const [field] = useField<{}>(props);

  return (
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
          <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <FormControl
              component="fieldset"
              variant="standard"
              sx={{
                marginTop: 1,
                marginBottom: 2,
                maxWidth: "85%",
                justifyContent: "center",
              }}
              fullWidth={true}
              color="secondary"
            >
              {values.geocoronalEmission.map((geoLine: any, index: number) => {
                return (
                  <div
                    key={geoLine.id}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 16,
                    }}
                  >
                    <Grid
                      container
                      spacing={1}
                      columns={20}
                      justifyContent="center"
                      alignItems="top"
                    >
                      <Grid
                        item
                        xs={6}
                        style={{
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      >
                        <CommonTextField
                          name={`geocoronalEmission.${index}.wavelength`}
                          value={`geocoronalEmission.${index}.wavelength`}
                          placeholder={"Default: 2471"}
                          label="Central Wavelength (Å)"
                          required={true}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        style={{
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      >
                        <CommonTextField
                          name={`geocoronalEmission.${index}.linewidth`}
                          value={`geocoronalEmission.${index}.linewidth`}
                          placeholder={"Default: 0.023"}
                          label="FWHM (Å)"
                          required={true}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        style={{
                          marginTop: 0,
                          marginBottom: 0,
                        }}
                      >
                        <GeocoronalAutocompleteField
                          name="geocoronalEmissionFluxThisNameIsNotActuallyUsed"
                          index={index}
                          values={values}
                          handleChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={2} sx={{ marginTop: 0, marginBottom: 0 }}>
                        <Button
                          style={{
                            marginBottom: 16,
                            marginLeft: 0,
                            padding: 0,
                            fontSize: 31,
                          }}
                          variant="outlined"
                          size="large"
                          fullWidth={true}
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          ×
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                );
              })}
            </FormControl>
          </div>
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
          <Alert severity="info" style={{ width: "75%" }}>
            <AlertTitle>Info</AlertTitle>
            <Typography>
              The Telescope parameters have been updated and the sky background magnitudes
              in each passband may be incorrect. Please save the Background parameters
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
            // /(^[+]?([1-9][0-9]*(?:[\.][0-9]*)?|0*\.0*[1-9][0-9]*)((?:[eE][+-]?[0-9]+[\.]?[0-9]+)?|(?:[eE][+-]?[0-9]+)?)$)|(^(high|average|low)$)/i.test(
            /(^[+]?([1-9][0-9]*(?:[.][0-9]*)?|0*\.0*[1-9][0-9]*)((?:[eE][+-]?[0-9]+[.]?[0-9]+)?|(?:[eE][+-]?[0-9]+)?)$)|(^(high|average|low)$)/i.test(
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
  isBackgroundSyncTelescope: boolean;
  setIsBackgroundSyncTelescope: (value: boolean) => void;
  numPhotometrySubmit: number;
  isBackgroundSyncPhotometry: boolean;
  setIsBackgroundSyncPhotometry: (value: boolean) => void;
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
  numPhotometrySubmit,
  isBackgroundSyncPhotometry,
  setIsBackgroundSyncPhotometry,
}) => {
  // Save user form inputs between tab switches
  const FORM_SESSION = "backgroundForm"; // key for sessionStorage (user inputs)
  const FORM_PARAMS = "backgroundParams"; // key for sessionStorage (API results)
  let myInitialValues: FormikValues;
  if (sessionStorage.getItem(FORM_SESSION) === null) {
    myInitialValues = {
      useDefaultSkyBackground: "true",
      customSkyBackground: { uv: "", u: "", g: "" }, // AB mag per arcsec^2
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
  React.useEffect(() => {
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
      <AlertIfFormSavedButPhotometryNotSubmitted
        isFormSyncPhotometry={isBackgroundSyncPhotometry}
        numPhotometrySubmit={numPhotometrySubmit}
      />
      <Formik
        initialValues={myInitialValues}
        onSubmit={
          async (data, { setSubmitting }) => {
            setSubmitting(true);

            // Make async call
            await axios
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
                if (sessionStorage.getItem("photometryForm") !== null) {
                  setIsBackgroundSyncPhotometry(false);
                }
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
        {({ values, handleChange, isSubmitting, isValid }) => (
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
            <FormControl component="fieldset" variant="standard" fullWidth={true}>
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
                The predefined surface brightness values for "High", "Average", and "Low"
                geocoronal emission are 3.0×10⁻¹⁵, 1.5×10⁻¹⁵, and 7.5×10⁻¹⁷ erg/s/cm² per
                sq. arcsec, respectively. These three values are based on the O[II]
                2471&#8239;Å emission line that has a linewidth of 0.023&#8239;Å.
              </FormHelperText>
              <GeocoronalEmissionGroup
                name="geocoronalEmission"
                values={values}
                handleChange={handleChange}
              />
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
