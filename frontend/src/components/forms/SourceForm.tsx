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
  InputLabel,
  Link,
  MenuItem,
  Popper,
  Radio,
  RadioGroup,
  Select,
  Switch,
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
import { fstat } from "fs";

import { SourceType, SpectrumOptions } from "./SpectrumOptions";

type SourceSelectTypeFieldProps = {
  label: string;
  prevFormValues: Object;
  setIsChanged: (value: boolean) => void;
  required?: boolean;
} & FieldAttributes<{}>;

const SourceSelectTypeField: React.FC<SourceSelectTypeFieldProps> = ({
  label,
  prevFormValues,
  setIsChanged,
  required = true,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error || meta.touched ? meta.error : "";

  useGetIfFormChanged(setIsChanged, prevFormValues);

  return (
    <FormControl sx={{ marginTop: 1, marginBottom: 2 }}>
      <InputLabel required={required}>{label}</InputLabel>
      <Field
        type="select"
        as={Select}
        // helperText={errorText} // React & Material-UI bug. Don't really need this here
        error={!!errorText}
        required={required}
        label={label}
        variant="outlined"
        style={{ minWidth: "7rem" }}
        {...field}
      >
        <MenuItem value={SourceType.Point}>Point Source</MenuItem>
        <MenuItem value={SourceType.Extended}>Extended Source</MenuItem>
        <MenuItem value={SourceType.Galaxy}>Galaxy</MenuItem>
      </Field>
    </FormControl>
  );
};

type SpectrumFieldsProps = {
  values: { [value: string]: any }; // any object props
  handleChange: (event: React.ChangeEvent<{}>) => void;
} & FieldAttributes<{}>;

const SpectrumFields: React.FC<SpectrumFieldsProps> = ({
  values,
  handleChange,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error || meta.touched ? meta.error : "";

  // const SpectrumAutocompletePopper = (popperProps: any) => {
  //   // https://stackoverflow.com/a/63583835
  //   return (
  //     <Popper
  //       {...popperProps}
  //       style={{
  //         width: "fit-content",
  //       }}
  //       placement="bottom-start"
  //     />
  //   );
  // };

  // TODO: clear Autocomplete field when values.sourceType changes

  const options = SpectrumOptions.map((option) => {
    const isAllowed =
      values.sourceType === option.sourceType || option.sourceType === "general";
    const groupName = option.sourceType.toUpperCase();
    const displayName =
      option.sourceType === SourceType.Point
        ? option.spectralName + " - (ID: " + option.spectralValue.toUpperCase() + ")"
        : option.spectralName === ""
        ? "(None)"
        : option.spectralName;
    const sortName = groupName + displayName;
    // option.sourceType === "general" ? " " : option.sourceType.toUpperCase();
    // const firstLetter = option.spectralName[0].toUpperCase();
    return {
      isAllowed: isAllowed,
      groupName: groupName,
      displayName: displayName,
      sortName: sortName,
      ...option,
    };
  });

  // Holy smokes... Handling default values and the autocomplete clear button is such a
  // pain... Default value solution based on <https://stackoverflow.com/a/66424008>

  // Object representing empty Autocomplete option (the option whose spectralValue === "")
  const EMPTY_OPTION = {
    displayName: "(None)",
    groupName: "GENERAL",
    isAllowed: true,
    sortName: "GENERAL(None)",
    sourceType: "general",
    spectralName: "",
    spectralValue: "",
  };
  // Default Autocomplete values
  const [displaySpectralValue, setDisplaySpectralValue] = React.useState(
    EMPTY_OPTION.displayName
  );
  const [myInputObj, setMyInputObj] = React.useState(EMPTY_OPTION);

  // Load previous value if available
  useEffect(() => {
    for (let option of options) {
      if (values.predefinedSpectrum === option.spectralValue) {
        // console.log(option);
        setDisplaySpectralValue(option.spectralValue);
        setMyInputObj(option);
      }
      // (To print out EMPTY_OPTION object...)
      // if ("" === option.spectralValue) {
      //   console.log("empty option", option);
      // }
    }
  }, []);

  // TODO: add upload spectrum button functionality

  return (
    <FormControl component="fieldset" variant="standard" fullWidth={true}>
      <FormLabel component="legend" required={true} sx={{ fontSize: 18 }} filled={true}>
        Spectrum
      </FormLabel>
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Choose or upload a spectrum for the source.
      </FormHelperText>
      <FormGroup>
        <Grid container spacing={2} columns={12}>
          <Grid item xs={4}>
            <CommonTextField
              name="redshift"
              placeholder={"Default: 0"}
              label="Redshift"
              required={true}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth={true}>
              <Autocomplete
                // PopperComponent={SpectrumAutocompletePopper}
                fullWidth={true}
                value={myInputObj}
                inputValue={displaySpectralValue}
                onChange={(event, value: any) =>
                  // <https://stackoverflow.com/a/59217951>
                  {
                    // <https://stackoverflow.com/a/69497782>
                    if (value === null) {
                      setMyInputObj(EMPTY_OPTION); // empty option
                      setFieldValue("predefinedSpectrum", "");
                    } else {
                      setMyInputObj(value);
                      setFieldValue("predefinedSpectrum", value.spectralValue);
                    }
                  }
                }
                onInputChange={(event, newInputString) =>
                  setDisplaySpectralValue(newInputString)
                }
                options={options.sort((a, b) => a.sortName.localeCompare(b.sortName))}
                groupBy={(option) => option.groupName}
                getOptionLabel={(option) => option.displayName}
                getOptionDisabled={(option) => !option.isAllowed}
                isOptionEqualToValue={(option, value) =>
                  // <https://stackoverflow.com/a/65347275>
                  option.spectralValue === value.spectralValue
                }
                renderInput={(params) => (
                  <Box
                  // style={{
                  //   minHeight: "1.5rem",
                  //   alignItems: "left",
                  //   alignContent: "left",
                  // }}
                  >
                    <TextField
                      {...params}
                      name="predefinedSpectrum"
                      label="Predefined Spectra"
                      onChange={handleChange}
                      required={true}
                      fullWidth={true}
                      InputLabelProps={{ shrink: true }} // keep label on top
                      // helperText={
                      //   isError
                      //     ? "Flux must be one of the predetermined values or a number > 0." // manually copy error message from Yup validation
                      //     : ""
                      // }
                      // error={isError}
                    />
                  </Box>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Button
              size="large"
              variant="contained"
              style={{
                marginTop: 0,
                marginBottom: 0,
                marginRight: 0,
                marginLeft: 0,
                padding: 0,
                fontSize: 18,
              }}
              sx={{ width: "100%", height: "77.5%" }}
              disabled={values.predefinedSpectrum !== ""}
            >
              Upload Spectrum
            </Button>
          </Grid>
        </Grid>
      </FormGroup>
      {(values.predefinedSpectrum === "blackbody" ||
        values.predefinedSpectrum === "power-law") && (
        <Typography
          sx={{
            fontSize: "large",
            fontWeight: "normal",
            marginBottom: 2,
            textAlign: "center",
          }}
        >
          (Configuration options coming later...)
        </Typography>
      )}
    </FormControl>
  );
};

type PhysicalParametersGroupProps = {
  values: { [value: string]: any }; // any object props
  handleChange: (event: React.ChangeEvent<{}>) => void;
} & FieldAttributes<{}>;

const PhysicalParametersGroup: React.FC<PhysicalParametersGroupProps> = ({
  values,
  handleChange,
  ...props // any object props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<{}>(props);
  const isError = meta.error ? true : false;
  // const errorText = meta.error || meta.touched ? meta.error : "";

  // TODO: add button to auto-calculate eccentricity for galaxies based on semimajor and semiminor axes
  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend" required={true} sx={{ fontSize: 18 }} filled={true}>
        Physical Parameters
      </FormLabel>
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 2,
          textAlign: "center",
          width: "25vw",
        }}
      >
        Specify the source's physical properties.
      </FormHelperText>
      {
        (() => {
          switch (values["sourceType"]) {
            case SourceType.Point:
              return (
                <Typography
                  sx={{
                    fontSize: "large",
                    fontWeight: "normal",
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  (POINT SOURCE PHYSICAL PARAMETERS COMING SOON!)
                </Typography>
              );
            case SourceType.Extended:
              return (
                <Typography
                  sx={{
                    fontSize: "large",
                    fontWeight: "normal",
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  (EXTENDED SOURCE PHYSICAL PARAMETERS COMING SOON!)
                </Typography>
              );
            case SourceType.Galaxy:
              return (
                <FormGroup>
                  <CommonTextField
                    name="physicalParameters.galaxy.angleA"
                    value={values.physicalParameters.galaxy.angleA}
                    placeholder=""
                    label="Semimajor Axis Angular Size (arcsec)"
                  />
                  <CommonTextField
                    name="physicalParameters.galaxy.angleB"
                    value={values.physicalParameters.galaxy.angleB}
                    placeholder=""
                    label="Semiminor Axis Angular Size (arcsec)"
                  />
                  <CommonTextField
                    name="physicalParameters.galaxy.sersic"
                    value={values.physicalParameters.galaxy.sersic}
                    placeholder={"Common values: 1 (exponential), 4 (de Vaucouleurs)"}
                    label="Sérsic Index"
                  />
                  <CommonTextField
                    name="physicalParameters.galaxy.rEff"
                    value={values.physicalParameters.galaxy.rEff}
                    placeholder=""
                    label="Effective Radius (arcsec)"
                  />
                  <CommonTextField
                    name="physicalParameters.galaxy.e"
                    value={values.physicalParameters.galaxy.e}
                    placeholder=""
                    label="Eccentricity"
                  />
                  <CommonTextField
                    name="physicalParameters.galaxy.angle"
                    value={values.physicalParameters.galaxy.angle}
                    placeholder={"Default: 0"}
                    label="CCW Angle from x-Axis (deg)"
                  />
                </FormGroup>
              );
            default:
              return <Typography>Something went wrong...</Typography>;
          }
        })() // calling anonymous arrow function to render it
      }
    </FormControl>
  );
};

type SpectralLinesGroupProps = {
  values: { [value: string]: any }; // any object props
  handleChange: (event: React.ChangeEvent<{}>) => void;
} & FieldAttributes<{}>;

const SpectralLinesGroup: React.FC<SpectralLinesGroupProps> = ({
  values,
  handleChange,
  ...props // any object props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<{}>(props);
  const isError = meta.error ? true : false;
  // const errorText = meta.error || meta.touched ? meta.error : "";

  return (
    <FormControl component="fieldset" variant="standard" fullWidth={true}>
      <FormLabel component="legend" required={false} sx={{ fontSize: 18 }} filled={true}>
        Spectral Lines
      </FormLabel>
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        (Emission and absorption lines coming soon!)
      </FormHelperText>
    </FormControl>
  );

  // return (
  //   // <FieldArray name="geocoronalEmission">
  //   <FieldArray {...field}>
  //     {(arrayHelpers) => (
  //       <div>
  //         <Button
  //           size="large"
  //           variant="contained"
  //           onClick={() =>
  //             arrayHelpers.push({
  //               flux: "Average",
  //               wavelength: "2471",
  //               linewidth: "0.023",
  //               id: "" + Math.random(),
  //             })
  //           }
  //           sx={{ marginBottom: 1 }}
  //         >
  //           Add Spectral Lines
  //         </Button>
  //         {values.geocoronalEmission.map((geoLine: any, index: number) => {
  //           return (
  //             <div
  //               key={geoLine.id}
  //               style={{
  //                 display: "flex",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //               }}
  //             >
  //               <Grid container justifyContent="center" alignItems="top">
  //                 <Autocomplete
  //                   // https://stackoverflow.com/a/59217951
  //                   freeSolo
  //                   sx={{ marginTop: 2, marginBottom: 0, width: "35%" }}
  //                   onChange={(event, value) =>
  //                     setFieldValue(`geocoronalEmission.${index}.flux`, value)
  //                   }
  //                   options={["High", "Average", "Low"].map((flux: string) => flux)}
  //                   value={values.geocoronalEmission[index].flux}
  //                   renderInput={(params) => (
  //                     <Box style={{ minHeight: "1.5rem" }}>
  //                       <TextField
  //                         {...params}
  //                         name={`geocoronalEmission.${index}.flux`}
  //                         placeholder="Example: 1.5e-15"
  //                         label="Flux (erg/s/cm² per sq. arcsec)"
  //                         onChange={handleChange}
  //                         required={true}
  //                         helperText={
  //                           isError
  //                             ? "Flux must be one of the predetermined values or a number > 0." // manually copy error message from Yup validation
  //                             : ""
  //                         }
  //                         error={isError}
  //                       />
  //                     </Box>
  //                   )}
  //                 />
  //                 <Grid item>
  //                   <Button
  //                     style={{
  //                       marginTop: "1rem",
  //                       marginBottom: 0,
  //                       marginRight: 0,
  //                       marginLeft: 0,
  //                       padding: 0,
  //                       fontSize: 30,
  //                     }}
  //                     variant="outlined"
  //                     size="large"
  //                     onClick={() => arrayHelpers.remove(index)}
  //                   >
  //                     ×
  //                   </Button>
  //                 </Grid>
  //               </Grid>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     )}
  //   </FieldArray>
  // );
};

enum NormMethods {
  PassbandMag = "passbandMag",
  PassbandFlam = "passbandFlam",
  LuminosityDist = "luminosityDist",
  None = "",
}

type NormMethodGroupProps = {
  values: { [value: string]: any }; // any object props
} & FieldAttributes<{}>;

const NormMethodGroup: React.FC<NormMethodGroupProps> = ({
  values,
  ...props // any object props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField<{}>(props);

  return (
    <FormControl component="fieldset" variant="standard" fullWidth={true}>
      <FormLabel component="legend" required={true} sx={{ fontSize: 18 }} filled={true}>
        Normalization
      </FormLabel>
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Renormalize the source spectrum to some...
      </FormHelperText>
      <RadioGroup
        name={field.name}
        value={values.normMethod}
        // Need to set onChange manually in this case
        // See <https://levelup.gitconnected.com/create-a-controlled-radio-group-in-react-formik-material-ui-and-typescript-7ed314081a0e>
        onChange={(event) => {
          setFieldValue("normMethod", event.currentTarget.value);
        }}
        sx={{ marginBottom: 2 }}
      >
        <FormControlLabel
          value={NormMethods.PassbandMag}
          control={<Radio />}
          label="AB Magnitude in a passband"
        />
        <FormControlLabel
          value={NormMethods.PassbandFlam}
          control={<Radio />}
          label="Average flux density (erg/s/cm²/A) in a passband"
        />
        <FormControlLabel
          value={NormMethods.LuminosityDist}
          control={<Radio />}
          label="Total (bolometric) luminosity and distance"
        />
        <FormControlLabel
          value={NormMethods.None}
          control={<Radio />}
          label="Do not renormalize"
        />
      </RadioGroup>
      {
        (() => {
          switch (values["normMethod"]) {
            case NormMethods.PassbandMag:
              return (
                <FormHelperText
                  sx={{
                    fontSize: "medium",
                    fontWeight: "normal",
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  (PASSBAND MAGNITUDE NORMALIZATION COMING SOON!)
                </FormHelperText>
              );
            case NormMethods.PassbandFlam:
              return (
                <FormHelperText
                  sx={{
                    fontSize: "medium",
                    fontWeight: "normal",
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  (PASSBAND FLUX NORMALIZATION COMING SOON!)
                </FormHelperText>
              );
            case NormMethods.LuminosityDist:
              return (
                <FormGroup>
                  <CommonTextField
                    name={`normParams.${NormMethods.LuminosityDist}.luminosity`}
                    value={`normParams.${NormMethods.LuminosityDist}.luminosity`}
                    placeholder="Example: 1.4e10"
                    label="Bolometric Luminosity (solar luminosities)"
                  />
                  <CommonTextField
                    name={`normParams.${NormMethods.LuminosityDist}.dist`}
                    value={`normParams.${NormMethods.LuminosityDist}.dist`}
                    placeholder=""
                    label="Distance to Source (kpc)"
                  />
                </FormGroup>
              );
            default:
              // No normalization (i.e., NormMethods.None)
              return <div />;
          }
        })() // calling anonymous arrow function to render it
      }
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 0,
          textAlign: "center",
        }}
      >
        Apply normalization before or after adding spectral lines?
      </FormHelperText>
      <Grid
        component="label"
        container
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Grid item>Before</Grid>
        {/* <Grid item>Renormalize before adding spectral lines</Grid> */}
        <Grid item>
          <Switch
            checked={values.isNormAfterSpectralLines}
            onChange={(event) =>
              setFieldValue("isNormAfterSpectralLines", !values.isNormAfterSpectralLines)
            }
            value={true}
            disabled={values.normMethod === NormMethods.None}
          />
        </Grid>
        <Grid item>After</Grid>
        {/* <Grid item>Renormalize after adding spectral lines</Grid> */}
      </Grid>
    </FormControl>
  );
};

type AlertIfTelescopeParamsChangedProps = {
  isSourceSyncTelescope: boolean;
};

const AlertIfTelescopeParamsChanged: React.FC<AlertIfTelescopeParamsChangedProps> = ({
  isSourceSyncTelescope,
}) => {
  if (sessionStorage.getItem("sourceForm") !== null && !isSourceSyncTelescope) {
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
            The telescope parameters have been updated and the source AB magnitudes in
            each passband may be incorrect. Please save the source parameters again.
          </Typography>
        </Alert>
      </Box>
    );
  } else {
    return <div />;
  }
};

const sourceValidationSchema = Yup.object({
  sourceType: Yup.string()
    .required("A source type is required")
    .oneOf(Object.values(SourceType)),
  // .oneOf(["point", "extended", "galaxy"]),
  redshift: Yup.number()
    .required("Redshift is a required field")
    .typeError("Redshift must be a non-negative number")
    .min(0, "Redshift must be a non-negative number"),
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
  // FIXME: `when()` does not seem to work at all...
  predefinedSpectrum: Yup.string()
    .required("A predefined spectrum is required")
    .min(0, "A predefined spectrum is required"),
  // predefinedSpectrum: Yup.string().when("customSpectrum", {
  //   is: "",
  //   then: Yup.string().required("A predefined spectrum is required").min(0),
  //   otherwise: Yup.string().notRequired(),
  // }), // spectrum options. N.B. different validation per source
  customSpectrum: Yup.string().when("predefinedSpectrum", {
    is: "",
    then: Yup.string()
      .required("Custom spectrum required when no predefined spectrum is selected")
      .min(1, "Custom spectrum must be at least 1 character"),
    otherwise: Yup.string().notRequired(),
  }),

  // spectralLines:

  // FIXME: Nested object validation with `when()` does not work. See <https://github.com/jquense/yup/issues/735>
  physicalParameters: Yup.object({
    // point: {},
    // extended: {},
    galaxy: Yup.object({
      angleA: Yup.number()
        .typeError("Semimajor axis must be a number > 0")
        .positive("Semimajor axis must be a number > 0"),
      // .when()...
      angleB: Yup.number()
        .typeError("Semiminor axis must be a number > 0")
        .positive("Semiminor axis must be a number > 0"),
      // .when()...
      sersic: Yup.number()
        // .required("Sérsic index is a required field")
        .typeError("Sérsic index must be a number > 0")
        .positive("Sérsic index must be a number > 0")
        .when("sourceType", {
          is: SourceType.Galaxy,
          then: (sourceValidationSchema) => sourceValidationSchema.required(),
          otherwise: (sourceValidationSchema) => sourceValidationSchema.notRequired(),
        }),
      rEff: Yup.number()
        // .required("Effective radius is a required field")
        .typeError("Effective radius must be a number > 0")
        .positive("Effective radius must be a number > 0")
        .when("sourceType", {
          is: SourceType.Galaxy,
          then: (sourceValidationSchema) => sourceValidationSchema.required(),
          otherwise: (sourceValidationSchema) => sourceValidationSchema.notRequired(),
        }),
      e: Yup.number()
        // .required("Eccentricity is a required field")
        .typeError("Eccentricity must be a number between [0, 1]")
        .min(0, "Eccentricity must be a number between [0, 1]")
        .max(1, "Eccentricity must be a number between [0, 1]")
        .when("sourceType", {
          is: SourceType.Galaxy,
          then: (sourceValidationSchema) => sourceValidationSchema.required(),
          otherwise: (sourceValidationSchema) => sourceValidationSchema.notRequired(),
        }),
      angle: Yup.number()
        // .required("Angle is a required field")
        .typeError("Angle must be a number")
        .when("sourceType", {
          is: SourceType.Galaxy,
          then: (sourceValidationSchema) => sourceValidationSchema.required(),
          otherwise: (sourceValidationSchema) => sourceValidationSchema.notRequired(),
        }),
    }),

    normParams: Yup.object({
      // passbandMag: {},
      // passbandFlam: {},
      luminosityDist: Yup.object({
        luminosity: Yup.number()
          .typeError("Luminosity must be a number > 0")
          .positive("Luminosity must be a number > 0"),
        // .when()...
        dist: Yup.number()
          .typeError("Distance must be a number > 0")
          .positive("Distance must be a number > 0"),
        // .when()...
      }),
    }),

    isNormAfterSpectralLines: Yup.boolean(),
  }),
});

type SourceFormProps = {
  // isTelescopeUpdated: boolean;
  isSourceSyncTelescope: boolean;
  setIsSourceSyncTelescope: (value: boolean) => void;
  incrNumTelescopeSaved: () => void;
} & CommonFormProps;

const SourceForm: React.FC<SourceFormProps> = ({
  setIsSavedAndUnsubmitted,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,
  isError,
  setIsError,
  errorMessage,
  setErrorMessage,
  isSourceSyncTelescope,
  setIsSourceSyncTelescope,
  incrNumTelescopeSaved,
}) => {
  // Save user form inputs between tab switches
  const FORM_SESSION = "sourceForm"; // key for sessionStorage (user inputs)
  const FORM_PARAMS = "sourceParams"; // key for sessionStorage (API results)
  let myInitialValues: FormikValues;
  if (sessionStorage.getItem(FORM_SESSION) === null) {
    myInitialValues = {
      sourceType: SourceType.Point, // point, extended, or galaxy
      redshift: "0",
      predefinedSpectrum: "", // spectrum options. N.B. different validation per source
      customSpectrum: "",
      spectralLines: [
        {
          flux: "",
          wavelength: "",
          linewidth: "",
          type: "emission",
          id: "" + Math.random(),
        },
      ],
      physicalParameters: {
        point: {},
        extended: {},
        galaxy: { angleA: "", angleB: "", sersic: "", rEff: "", e: "", angle: "0" },
      },
      normMethod: NormMethods.PassbandMag,
      normParams: {
        // Have to manually write out the `NormMethods` enum keys
        passbandMag: {},
        passbandFlam: {},
        luminosityDist: { luminosity: "", dist: "" },
        // No need if no normalization (i.e., normMethod === "")
      },
      isNormAfterSpectralLines: true,
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
      <Typography variant="h5">Specify the source properties below.</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        The properties below should describe the <i>intrinsic</i> properties of the
        source. Also, this tab is very limited in functionality at the moment. For more
        advanced configurations, please use the Python{" "}
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

            // // ! Move to async call after
            // setIsSavedAndUnsubmitted(true);
            // setPrevFormValues(data);
            // setIsChanged(false);
            // sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));
            // setIsSourceSyncTelescope(true);
            // setSubmitting(false);

            // Make async call
            const response = await axios
              .put(API_URL + "source", data)
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
                setIsSourceSyncTelescope(true);
                incrNumTelescopeSaved();
              })
              .catch((error) => {
                console.log(error);
                setIsError(true);
                setErrorMessage(error.message);
              })
              .finally(() => setSubmitting(false));
          } // end async function
        } // end onSubmit
        // FIXME: validation bug... isValid is changing to false after initial submit.. & greying out submit button until tab change
        validateOnChange={true}
        validationSchema={sourceValidationSchema}
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
              isSourceSyncTelescope={isSourceSyncTelescope}
            />
            <SourceSelectTypeField
              name="sourceType"
              setIsChanged={setIsChanged}
              prevFormValues={prevFormValues}
              label="Source Type"
            />
            <br />
            <SpectrumFields
              name="spectrumFieldsThisNameIsNotActuallyUsed"
              values={values}
              handleChange={handleChange}
            />
            <br />
            <PhysicalParametersGroup
              name="physicalParameters" // REVIEW: make sure this name is correct when adding feature
              values={values}
              handleChange={handleChange}
            />
            <br />
            <SpectralLinesGroup
              name="spectralLines" // REVIEW: make sure this name is correct when adding feature
              values={values}
              handleChange={handleChange}
            />
            <br />
            <NormMethodGroup
              name="normMethod" // REVIEW: make sure this name is correct when adding feature
              values={values}
            />
            <br />
            <SaveButton isSubmitting={isSubmitting} isValid={isValid} />
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
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

export default SourceForm;
