import {
  Formik,
  Field,
  Form,
  useField,
  FieldAttributes,
  useFormikContext,
  FormikValues,
} from "formik";
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Link,
  Typography,
  Alert,
  AlertTitle,
  Box,
  Paper,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Select,
  makeStyles,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "../../service/env";
import { useEffect, useState } from "react";
import { themeYellowColor } from "../DarkModeTheme";
import { SourceType } from "./SpectrumOptions";

import {
  AlertError,
  CommonFormProps,
  CommonTextField,
  useGetIfFormChanged,
  // CommonTextFieldWithTracker,
  // CommonTextField
} from "../CommonFormElements";
import React from "react";

type AlertIfSavedButNotSubmittedProps = {
  isSavedAndUnsubmitted: boolean;
};

/**
 * Generate an info alert when the user has saved, but unsubmitted, parameters. Note that
 * if you need to do this for a spectroscopy tab, you may need to declare new states
 * (e.g., one for isTelescopeParamsSavedPhotometry, and one for
 * isTelescopeParamsSavedSpectroscopy).
 *
 * @param isSavedAndUnsubmitted - true if the user has saved, but unsubmitted, parameters
 *
 * @returns `<Alert />` if any of the tabs have been saved, but not submitted
 *
 */
const AlertIfSavedButNotSubmitted: React.FC<AlertIfSavedButNotSubmittedProps> = ({
  isSavedAndUnsubmitted,
}) => {
  // Alert user if any of the tabs have been saved, but not submitted
  if (isSavedAndUnsubmitted) {
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
            Some parameters are saved but not submitted. The photometry calculations and
            the simulated images may not correspond to the parameters below. Please submit
            this form to update the results.
          </Typography>
        </Alert>
      </Box>
    );
  } else {
    return <div />;
  }
};

enum Apertures {
  Optimal = "optimal",
  Elliptical = "elliptical",
  Rectangular = "rectangular",
}

type ApertureGroupProps = {
  values: { [value: string]: any }; // any object props
  prevFormValues: Object;
  setIsChanged: (value: boolean) => void;
  isPointSource: boolean;
} & FieldAttributes<{}>;

const ApertureGroup: React.FC<ApertureGroupProps> = ({
  values,
  prevFormValues,
  setIsChanged,
  isPointSource,
  ...props // any object props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField<{}>(props);

  useGetIfFormChanged(setIsChanged, prevFormValues);

  return (
    <FormControl component="fieldset" variant="standard" fullWidth={true}>
      <FormLabel component="legend" required={true} sx={{ fontSize: 18 }} filled={true}>
        Photometry Aperture
      </FormLabel>
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Choose the type of aperture to use and specify and its properties.
      </FormHelperText>
      <RadioGroup
        name={"aperShape"}
        value={values.aperShape}
        // Need to set onChange manually in this case
        // See <https://levelup.gitconnected.com/create-a-controlled-radio-group-in-react-formik-material-ui-and-typescript-7ed314081a0e>
        onChange={(event) => {
          setFieldValue("aperShape", event.currentTarget.value);
        }}
        sx={{ marginBottom: 2 }}
      >
        <FormControlLabel
          value={Apertures.Optimal}
          control={<Radio />}
          label="Optimal aperture (point sources only)"
          disabled={!isPointSource}
        />
        <FormControlLabel
          value={Apertures.Elliptical}
          control={<Radio />}
          label="Elliptical aperture"
        />
        <FormControlLabel
          value={Apertures.Rectangular}
          control={<Radio />}
          label="Rectangular aperture"
        />
      </RadioGroup>
      {
        (() => {
          switch (values["aperShape"]) {
            case Apertures.Optimal:
              return (
                <FormHelperText
                  sx={{
                    fontSize: "medium",
                    fontWeight: "normal",
                    marginTop: -2,
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  (OPTIMAL APERTURE COMING SOON!)
                </FormHelperText>
              );
            case Apertures.Elliptical:
              return (
                <FormGroup>
                  <CommonTextField
                    name={`aperParams.${Apertures.Elliptical}.a`}
                    value={`aperParams.${Apertures.Elliptical}.a`}
                    placeholder=""
                    label="Semimajor axis (arcsec)"
                  />
                  <CommonTextField
                    name={`aperParams.${Apertures.Elliptical}.b`}
                    value={`aperParams.${Apertures.Elliptical}.b`}
                    placeholder=""
                    label="Semiminor axis (arcsec)"
                  />
                  <CommonTextField
                    name={`aperParams.${Apertures.Elliptical}.center`}
                    value={`aperParams.${Apertures.Elliptical}.center`}
                    placeholder="Default: [0, 0]"
                    label="Center of Aperture Relative to the Source (arcsec)"
                  />
                  <CommonTextField
                    name={`aperParams.${Apertures.Elliptical}.rotation`}
                    value={`aperParams.${Apertures.Elliptical}.rotation`}
                    placeholder="Default: 0"
                    label="CCW Rotation of the Aperture (deg)"
                  />
                </FormGroup>
              );
            case Apertures.Rectangular:
              return (
                <FormHelperText
                  sx={{
                    fontSize: "medium",
                    fontWeight: "normal",
                    marginTop: -2,
                    marginBottom: 2,
                    textAlign: "center",
                  }}
                >
                  (RECTANGULAR APERTURE COMING SOON!)
                </FormHelperText>
              );
            default:
              // No normalization (i.e., NormMethods.None)
              return <div />;
          }
        })() // calling anonymous arrow function to render it
      }
    </FormControl>
  );
};

type ExtinctionCoeffGroupProps = {
  values: { [value: string]: any }; // any object props
  // prevFormValues: Object;
  // setIsChanged: (value: boolean) => void;
} & FieldAttributes<{}>;

const ExtinctionCoeffGroup: React.FC<ExtinctionCoeffGroupProps> = ({
  values,
  // prevFormValues,
  // setIsChanged,
  ...props // any object props
}) => {
  // const { setFieldValue } = useFormikContext();
  // const [field] = useField<{}>(props);

  // useGetIfFormChanged(setIsChanged, prevFormValues);

  return (
    // <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <FormControl
      component="fieldset"
      variant="standard"
      sx={{
        marginTop: 0,
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
        Specify the extinction coefficients in each telescope band.
      </FormHelperText>
      <FormGroup>
        <Grid container spacing={2} columns={12}>
          <Grid item xs={4}>
            <CommonTextField
              name="extinctionCoeffs.uv"
              value={values.extinctionCoeffs.uv}
              placeholder={"Default: 0"}
              label="UV-Band (AB mag)"
              required={true}
              // prevFormValues={prevFormValues}
              // setIsChanged={setIsChanged}
            />
          </Grid>
          <Grid item xs={4}>
            <CommonTextField
              name="extinctionCoeffs.u"
              value={values.extinctionCoeffs.u}
              placeholder={"Default: 0"}
              label="u-Band (AB mag)"
              required={true}
            />
          </Grid>
          <Grid item xs={4}>
            <CommonTextField
              name="extinctionCoeffs.g"
              value={values.extinctionCoeffs.g}
              placeholder={"Default: 0"}
              label="g-Band (AB mag)"
              required={true}
            />
          </Grid>
        </Grid>
      </FormGroup>
    </FormControl>
  );
};

/**
 * Displays the saved parameters
 */
const DisplayParams = () => {
  const DisplayTelescopeParams = () => {
    // Don't need this if statement
    if (sessionStorage.getItem("telescopeParams") !== null) {
      // Just for now. Replace with nice formatting later
      // return <pre>{sessionStorage.getItem("telescopeParams")}</pre>;

      // Filler example from <https://mui.com/components/tables/>
      function createData(
        name: string,
        calories: number,
        fat: number,
        carbs: number,
        protein: number
      ) {
        return { name, calories, fat, carbs, protein };
      }

      const rows = [
        createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
        createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
        createData("Eclair", 262, 16.0, 24, 6.0),
        createData("Cupcake", 305, 3.7, 67, 4.3),
        createData("Gingerbread", 356, 16.0, 49, 3.9),
      ];

      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      return <div></div>;
    }
  };
  return (
    <div>
      <DisplayTelescopeParams />
    </div>
  );
};

const DisplayResults: React.FC = () => {
  const photParams = JSON.parse(`${sessionStorage.getItem("photometryParams")}`);
  const photForm = JSON.parse(`${sessionStorage.getItem("photometryForm")}`);

  const tableCellFontSize = 17;
  const tableHeadFontSize = 18;

  if (
    sessionStorage.getItem("photometryParams") !== null &&
    sessionStorage.getItem("photometryForm") !== null
  ) {
    return (
      <div>
        <Typography variant="h5" color="secondary" style={{ marginBottom: 12 }}>
          Photometry Results
        </Typography>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <TableContainer component={Paper} sx={{ minWidth: 500, width: "85%" }}>
            <Table
              sx={{ minWidth: 400, justifyContent: "center" }}
              aria-label="photometry-results-table"
            >
              <TableHead style={{ width: "100%" }}>
                <TableRow>
                  <TableCell sx={{ fontSize: tableHeadFontSize }} align="left">
                    Passband
                  </TableCell>
                  <TableCell sx={{ fontSize: tableHeadFontSize }} align="right">
                    S/N&nbsp;Ratio
                  </TableCell>
                  <TableCell sx={{ fontSize: tableHeadFontSize }} align="right">
                    Integration&nbsp;Time&nbsp;(s)
                  </TableCell>
                  {/* <TableCell align="right">Redleak&nbsp;Fraction</TableCell> */}
                </TableRow>
              </TableHead>
              {(() =>
                photForm["photInput"].val_type === "snr" ? (
                  // Render same SNR in column
                  <TableBody style={{ width: "100%" }}>
                    <TableRow
                      key={"uv"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontSize: tableCellFontSize }}
                      >
                        UV
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photForm["photInput"].val}
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photParams["photResults"].uv}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"u"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontSize: tableCellFontSize }}
                      >
                        u
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photForm["photInput"].val}
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photParams["photResults"].u}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"g"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontSize: tableCellFontSize }}
                      >
                        u
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photForm["photInput"].val}
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photParams["photResults"].g}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  // Render same time in column
                  <TableBody style={{ width: "100%" }}>
                    <TableRow
                      key={"uv"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontSize: tableCellFontSize }}
                      >
                        UV
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photParams["photResults"].uv}
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photForm["photInput"].val}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"u"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontSize: tableCellFontSize }}
                      >
                        u
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photParams["photResults"].u}
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photForm["photInput"].val}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      key={"g"}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontSize: tableCellFontSize }}
                      >
                        g
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photParams["photResults"].g}
                      </TableCell>
                      <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                        {photForm["photInput"].val}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))()}
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

const photometryValidationSchema = Yup.object({});

type PhotometryFormProps = {
  isSavedAndUnsubmitted: boolean;
  setIsSavedAndUnsubmitted: (value: boolean) => void;
  incrNumPhotometrySubmit: () => void;
} & CommonFormProps;

const PhotometryForm: React.FC<PhotometryFormProps> = ({
  isSavedAndUnsubmitted,
  setIsSavedAndUnsubmitted,
  incrNumPhotometrySubmit,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,
  isError,
  setIsError,
  errorMessage,
  setErrorMessage,
}) => {
  // Save user form inputs between tab switches
  const FORM_SESSION = "photometryForm"; // key for sessionStorage (user inputs)
  const FORM_PARAMS = "photometryParams"; // key for sessionStorage (API results)

  let myInitialValues: FormikValues;
  let isPointSource: boolean;

  if (sessionStorage.getItem(FORM_SESSION) === null) {
    let initialAperShape: string;
    if (
      JSON.parse(`${sessionStorage.getItem("sourceForm")}`)["sourceType"] ===
      SourceType.Point
    ) {
      initialAperShape = Apertures.Optimal;
      isPointSource = true;
    } else {
      initialAperShape = Apertures.Elliptical;
      isPointSource = false;
    }

    myInitialValues = {
      extinctionCoeffs: { uv: "0", u: "0", g: "0" }, // AB mags
      aperShape: initialAperShape,
      aperParams: {
        optimal: {},
        elliptical: { a: "", b: "", center: "[0, 0]", rotation: "0" },
        rectangular: {},
      },
      photInput: { val: "", val_type: "snr" },
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
      <Typography variant="h5">Make a photometry calculation below.</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        Note that we do <b>not</b> support local concurrent ETC GUI sessions. If you have
        saved or submitted a request from another ETC instance,{" "}
        <i>your photometry results will be incorrect </i>! (Some other limitations
        here...) Please use the Python{" "}
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
        onSubmit={async (data, { setSubmitting }) => {
          setSubmitting(true);
          console.log(data);

          // Set state to indicate that the parameters have been submitted
          // ! Remove and put in promise later
          // setIsSavedAndUnsubmitted(false);

          // Make async call
          const response = await axios
            .put(API_URL + "photometry", data)
            .then((response) => response.data)
            .then((response) =>
              sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response))
            )
            .then(() => {
              // Set state to indicate that the parameters have been submitted
              setIsSavedAndUnsubmitted(false);
              setPrevFormValues(data);
              setIsChanged(false);
              incrNumPhotometrySubmit();
              sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));
              setSubmitting(false);
            })
            .catch((error) => {
              console.log(error);
              setIsError(true);
              setErrorMessage(error.message);
            })
            .finally(() => setSubmitting(false));
          setSubmitting(false); // ! REMOVE AFTER
        }}
        // TODO: validation schema!
        validateOnChange={true}
        validationSchema={photometryValidationSchema}
        validateOnMount={true}
      >
        {({
          values,
          // errors,
          // touched,
          // handleChange,
          // handleBlur,
          // handleSubmit,
          setFieldValue,
          isSubmitting,
          isValid,
          setStatus,
        }) => (
          <Form>
            <ApertureGroup
              name="apertureGroupThisNameIsNotUsed"
              values={values}
              prevFormValues={prevFormValues}
              setIsChanged={setIsChanged}
              isPointSource={isPointSource}
            />
            {/* <br />
            <ExtinctionCoeffGroup
              name="extinctionCoeffGroupThisNameIsNotUsed"
              values={values}
            /> */}
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
                Enter the desired signal-to-noise (S/N) ratio or integration time. If
                given a S/N ratio, the ETC will calculate the integration time required to
                reach this value in each passband. If given an integration time, the ETC
                will calculate the S/N ratio reached in each passband after the inputted
                number of seconds.
              </FormHelperText>
              <FormGroup>
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={8}>
                    <CommonTextField
                      label="Target Value"
                      placeholder=""
                      name="photInput.val"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Select
                      name="photInput.val_type"
                      type="select"
                      // size="large"
                      variant="outlined"
                      style={{
                        marginTop: 0,
                        marginBottom: 0,
                        marginRight: 0,
                        marginLeft: 0,
                        padding: 0,
                        fontSize: 18,
                      }}
                      onChange={(event: any) =>
                        setFieldValue("photInput.val_type", event.target.value)
                      }
                      value={values.photInput.val_type}
                      sx={{ width: "100%", height: "77.5%" }}
                    >
                      <MenuItem value="snr">S/N Ratio</MenuItem>
                      <MenuItem value="t">Time (s)</MenuItem>
                    </Select>
                    {/* <Field
                      name="val_type"
                      type="select"
                      as={Select}
                      label="Value Type"
                      // size="large"
                      // variant="contained"
                      style={{
                        marginTop: 0,
                        marginBottom: 0,
                        marginRight: 0,
                        marginLeft: 0,
                        padding: 0,
                        fontSize: 18,
                      }}
                      // onChange={(event: any, value: any) => {
                      //   console.log(value);
                      //   {
                      //     if (value === null) {
                      //       setFieldValue("val_type", "");
                      //     } else {
                      //       setFieldValue("val_type", value);
                      //     }
                      //   }
                      // }}
                      // value={value}
                      sx={{ width: "100%", height: "77.5%" }}
                    >
                      <MenuItem value="snr">S/N Ratio</MenuItem>
                      <MenuItem value="t">Time (s)</MenuItem>
                    </Field> */}
                  </Grid>
                </Grid>
              </FormGroup>
            </FormControl>
            <AlertIfSavedButNotSubmitted isSavedAndUnsubmitted={isSavedAndUnsubmitted} />
            <LoadingButton
              type="submit"
              disabled={isSubmitting || !isValid}
              // sx={{ color: themeSecondaryLightColor }}
              size="large"
              variant="contained"
              style={{
                width: "25%",
                fontSize: 24,
                margin: 16,
                backgroundColor: themeYellowColor,
              }}
              loading={isSubmitting}
              loadingIndicator="Submitting..."
            >
              Submit
            </LoadingButton>
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
      <DisplayResults />
      {/* <pre>
        {JSON.stringify(JSON.parse(`${sessionStorage.getItem(FORM_PARAMS)}`), null, 2)}
      </pre> */}
      {/* <DisplayParams /> */}
    </div>
  );
};

export default PhotometryForm;
