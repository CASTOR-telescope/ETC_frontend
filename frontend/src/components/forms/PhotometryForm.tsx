import {
  Formik,
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
  Select,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "../../env";
import { themeYellowColor, themeDisabledButtonColor } from "../DarkModeTheme";
import { SourceType } from "./SpectrumOptions";

import {
  AlertError,
  CommonFormProps,
  CommonTextField,
  useGetIfFormChanged,
} from "../CommonFormElements";
import React from "react";

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
        { "&:disabled": { backgroundColor: themeDisabledButtonColor } },
      ]}
      loading={isSubmitting}
      loadingIndicator="Submitting..."
    >
      Submit
    </LoadingButton>
  );
};

type AlertIfSavedButNotSubmittedProps = {
  isSavedAndUnsubmitted: boolean;
  numPhotometrySubmit: number;
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
  numPhotometrySubmit,
}) => {
  // Alert user if any of the tabs have been saved, but not submitted
  if (isSavedAndUnsubmitted && numPhotometrySubmit > 0) {
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
        <br />
        The optimal aperture for a point source is a circle centered on the source with a
        radius that maximizes the signal-to-noise ratio given any integration time. Note
        that an elliptical aperture's semimajor axis is along the <i>x</i>-axis and its
        semiminor axis is along the <i>y</i>-axis when the rotation angle is 0°.
        Similarly, a rectangular aperture's width is along the <i>x</i>-axis and its
        length is along the <i>y</i>-axis.
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
                <CommonTextField
                  name={`aperParams.${Apertures.Optimal}.factor`}
                  value={`aperParams.${Apertures.Optimal}.factor`}
                  placeholder="Default: 1.4"
                  label="Radius (multiple of the telescope's half-FWHM)"
                />
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
                    label="(x, y) Center of Aperture Relative to the Source (arcsec)"
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
                <FormGroup>
                  <CommonTextField
                    name={`aperParams.${Apertures.Rectangular}.width`}
                    value={`aperParams.${Apertures.Rectangular}.width`}
                    placeholder=""
                    label="Full Width (arcsec)"
                  />
                  <CommonTextField
                    name={`aperParams.${Apertures.Rectangular}.length`}
                    value={`aperParams.${Apertures.Rectangular}.length`}
                    placeholder=""
                    label="Full Length (arcsec)"
                  />
                  <CommonTextField
                    name={`aperParams.${Apertures.Rectangular}.center`}
                    value={`aperParams.${Apertures.Rectangular}.center`}
                    placeholder="Default: [0, 0]"
                    label="(x, y) Center of Aperture Relative to the Source (arcsec)"
                  />
                </FormGroup>
              );
            default:
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
                  SOMETHING WENT WRONG. YOU SHOULD NOT SEE THIS!
                </FormHelperText>
              );
          }
        })() // calling anonymous arrow function to render it
      }
      {isPointSource &&
        (values.aperShape === Apertures.Elliptical ||
          values.aperShape === Apertures.Rectangular) && (
          <FormHelperText
            sx={{
              fontSize: "medium",
              fontWeight: "normal",
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            Note that the point source's encircled energy within an elliptical or
            rectangular aperture is calculated using a Monte Carlo integration and is not
            an exact value.
          </FormHelperText>
        )}
    </FormControl>
  );
};

type ReddeningGroupProps = {
  values: { [value: string]: any }; // any object props
} & FieldAttributes<{}>;

const ReddeningGroup: React.FC<ReddeningGroupProps> = ({ values }) => {
  return (
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
        Reddening
      </FormLabel>
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Specify the <i>E(B-V)</i>&#8202; value for this telescope pointing.
      </FormHelperText>
      <CommonTextField
        name="reddening"
        value={values.reddening}
        placeholder={"Default: 0"}
        label="E(B-V)"
        required={true}
      />
    </FormControl>
  );
};

/**
 * Displays the saved parameters
 *
 * TODO: make this
 * Should at least have telescope passband limits, sky background AB magnitudes, and
 * source AB magnitudes
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

/**
 * Returns - [base, exp]
 */
const numToSci = (num: number) => {
  let [base, exp] = num
    .toExponential()
    .split("e")
    .map((item) => parseFloat(item));
  // return `${base}&#8239;×&#8239;10<sup>${exp}</sup>`;
  return [base, exp];
};

// TODO: make this MUCH more maintainable (will also reduce duplicate code)!
const DisplayResults: React.FC<{ numPhotometrySubmit: number }> = ({
  numPhotometrySubmit,
}) => {
  const photParams = JSON.parse(`${sessionStorage.getItem("photometryParams")}`);
  const photForm = JSON.parse(`${sessionStorage.getItem("photometryForm")}`);

  const tableCellFontSize = 17;
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

  // const redleakFracs = { uv: [], u: [], g: [] };
  // for (let band in photParams["redleakFracs"]) {
  //   redleakFracs[band].push(numToSci(photParams["redleakFracs"][band]));
  // }
  const redleakFracUv = numToSci(photParams["redleakFracs"]["uv"]);
  const redleakFracU = numToSci(photParams["redleakFracs"]["u"]);
  const redleakFracG = numToSci(photParams["redleakFracs"]["g"]);

  return (
    <div id={`display-results-${numPhotometrySubmit}`}>
      <Typography variant="h5" color="secondary" style={{ marginBottom: 12 }}>
        Photometry Results
      </Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        A passband's red leak is its electron count rate (i.e., electrons per second)
        caused by the portion of the source spectrum longward of the red leak threshold
        (specified in the Telescope tab). The red leak fraction in a passband is the ratio
        of that passband's red leak to the total passband response (in electrons per
        second) induced by the entire spectrum.
      </Typography>
      {photParams["encircledEnergy"] !== null && (
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
            <b>Point source encircled energy fraction:</b>{" "}
            {(100 * photParams["encircledEnergy"]).toFixed(2)}%
          </Typography>
          <br />
        </div>
      )}
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
          <b>Effective number of pixels in aperture:</b>{" "}
          {photParams["effNpix"].toFixed(2)}
        </Typography>
        <br />
      </div>
      <div style={divStyle}>
        <TableContainer component={Paper} sx={paperSx}>
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
                  Red&nbsp;Leak&nbsp;Fraction
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
                      {redleakFracUv[0].toFixed(2)}&#8239;×&#8239;10
                      <sup>{redleakFracUv[1]}</sup>
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photForm["photInput"].val}
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photParams["photResults"].uv.toFixed(2)}
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
                      {redleakFracU[0].toFixed(2)}&#8239;×&#8239;10
                      <sup>{redleakFracU[1]}</sup>
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photForm["photInput"].val}
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photParams["photResults"].u.toFixed(2)}
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
                      {redleakFracG[0].toFixed(2)}&#8239;×&#8239;10
                      <sup>{redleakFracG[1]}</sup>
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photForm["photInput"].val}
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photParams["photResults"].g.toFixed(2)}
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
                      {redleakFracUv[0].toFixed(2)}&#8239;×&#8239;10
                      <sup>{redleakFracUv[1]}</sup>
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photParams["photResults"].uv.toFixed(2)}
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
                      {redleakFracU[0].toFixed(2)}&#8239;×&#8239;10
                      <sup>{redleakFracU[1]}</sup>
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photParams["photResults"].u.toFixed(2)}
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
                      {redleakFracG[0].toFixed(2)}&#8239;×&#8239;10
                      <sup>{redleakFracG[1]}</sup>
                    </TableCell>
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photParams["photResults"].g.toFixed(2)}
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
};

const photometryValidationSchema = Yup.object({
  aperShape: Yup.string().oneOf(Object.values(Apertures)),
  reddening: Yup.number()
    .required("Reddening is a required field")
    .typeError("Reddening must be a non-negative number")
    .min(0, "Reddening must be a non-negative number"),

  // BUG: when() does not work with nested objects. Currently still an open issue in Yup
  aperParams: Yup.object({
    optimal: Yup.object().when("aperShape", {
      is: Apertures.Optimal,
      then: Yup.object({
        factor: Yup.number()
          .required("Radius is a required field")
          .typeError("Radius must be a number > 0")
          .positive("Radius must be a number > 0"),
      }),
      otherwise: Yup.object({
        factor: Yup.number()
          .typeError("Radius must be a number > 0")
          .positive("Radius must be a number > 0"),
      }),
    }),
    elliptical: Yup.object().when("aperShape", {
      is: Apertures.Optimal,
      then: Yup.object({
        a: Yup.number()
          .required("Semimajor axis is a required field")
          .typeError("Semimajor axis must be a number > 0")
          .positive("Semimajor axis must be a number > 0"),
        b: Yup.number()
          .required("Semiminor axis is a required field")
          .typeError("Semiminor axis must be a number > 0")
          .positive("Semiminor axis must be a number > 0"),
        // TODO: validation for center. Tuple only available in beta version
        // center: Yup.tuple([
        //   Yup.number()
        //     .required("Center is a required field")
        //     .typeError("Center must be a pair of numbers"),
        //   Yup.number()
        //     .required("Center is a required field")
        //     .typeError("Center must be a pair of numbers"),
        // ]),
        rotation: Yup.number()
          .required("Rotation angle is a required field")
          .typeError("Rotation angle must be a number"),
      }),
      otherwise: Yup.object({
        a: Yup.number()
          .notRequired()
          .typeError("Semimajor axis must be a number > 0")
          .positive("Semimajor axis must be a number > 0"),
        b: Yup.number()
          .notRequired()
          .typeError("Semiminor axis must be a number > 0")
          .positive("Semiminor axis must be a number > 0"),
        // center: Yup.tuple([...]).notRequired(),
        rotation: Yup.number().notRequired().typeError("Rotation angle must be a number"),
      }),
    }),
    rectangular: Yup.object().when("aperShape", {
      is: Apertures.Rectangular,
      then: Yup.object({
        width: Yup.number()
          .required("Width is a required field")
          .typeError("Width must be a number > 0")
          .positive("Width must be a number > 0"),
        length: Yup.number()
          .required("Length is a required field")
          .typeError("Length must be a number > 0")
          .positive("Length must be a number > 0"),
        // TODO: validation for center. Tuple only available in beta version
        // center: Yup.tuple([
        //   Yup.number()
        //     .required("Center is a required field")
        //     .typeError("Center must be a pair of numbers"),
        //   Yup.number()
        //     .required("Center is a required field")
        //     .typeError("Center must be a pair of numbers"),
        // ]),
      }),
      otherwise: Yup.object({
        width: Yup.number()
          .notRequired()
          .typeError("Width must be a number > 0")
          .positive("Width must be a number > 0"),
        length: Yup.number()
          .notRequired()
          .typeError("Length must be a number > 0")
          .positive("Length must be a number > 0"),
        // center: Yup.tuple([...]).notRequired(),
      }),
    }),
  }),
  photInput: Yup.object({
    val: Yup.number()
      // .required("Target value is a required field") // BUG: fails validation on 1st refresh?
      .typeError("Target value must be a number > 0")
      .positive("Target value must be a number > 0"),
    val_type: Yup.string()
      .required()
      .oneOf(Object.values(["snr", "t"])),
  }),
});

type PhotometryFormProps = {
  isSavedAndUnsubmitted: boolean;
  setIsSavedAndUnsubmitted: (value: boolean) => void;
  incrNumPhotometrySubmit: () => void;
  numPhotometrySubmit: number;
  setIsTelescopeSyncPhotometry: (value: boolean) => void;
  setIsBackgroundSyncPhotometry: (value: boolean) => void;
  setIsSourceSyncPhotometry: (value: boolean) => void;
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
  numPhotometrySubmit,
  setIsTelescopeSyncPhotometry,
  setIsBackgroundSyncPhotometry,
  setIsSourceSyncPhotometry,
}) => {
  // Save user form inputs between tab switches
  const FORM_SESSION = "photometryForm"; // key for sessionStorage (user inputs)
  const FORM_PARAMS = "photometryParams"; // key for sessionStorage (API results)

  let myInitialValues: FormikValues;
  let isPointSource: boolean;

  // TODO: think mroe carefully about how this form is initialized (e.g., previously point source but now no longer point source)
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
      reddening: "0", // E(B-V)
      aperShape: initialAperShape,
      aperParams: {
        optimal: { factor: "1.4" },
        elliptical: { a: "", b: "", center: "[0, 0]", rotation: "0" },
        rectangular: { width: "", length: "", center: "[0, 0]" },
      },
      photInput: { val: "", val_type: "snr" },
    };
  } else {
    myInitialValues = JSON.parse(`${sessionStorage.getItem(FORM_SESSION)}`);
    // Run check if optimal aperture allowed. I know this is duplicated code, can extract
    // into function later
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
    if (myInitialValues.aperShape === Apertures.Optimal && !isPointSource) {
      myInitialValues.aperShape = initialAperShape;
    }
  }
  // Only run this on mount
  React.useEffect(() => {
    setIsChanged(false);
    setPrevFormValues(myInitialValues);
  }, []);

  return (
    <div>
      <Typography variant="h5">Make a photometry calculation below.</Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        <b>
          Form validation is still in development for this tab. Please ensure all inputs
          are valid prior to saving.
        </b>
        <br />
        Note that we do <b>not</b> support local concurrent ETC GUI sessions. If you have
        saved or submitted a request from another ETC instance,{" "}
        <i>your photometry results will be incorrect </i>! For more flexibility, use the
        Python{" "}
        <Link
          href="https://github.com/CASTOR-telescope/ETC"
          // Open link in new tab
          rel="noopener noreferrer"
          target="_blank"
        >
          <code>castor_etc</code>
        </Link>{" "}
        package.
      </Typography>
      <Formik
        initialValues={myInitialValues}
        onSubmit={async (data, { setSubmitting }) => {
          setSubmitting(true);

          // Make async call
          await axios
            .put(API_URL + "photometry", data)
            .then((response) => response.data)
            .then((response) => {
              sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response));
              sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));
            })
            .then(() => {
              // Set state to indicate that the parameters have been submitted
              // MUST have this after BOTH sessionStorage.setItem() calls above
              setIsSavedAndUnsubmitted(false);
              setPrevFormValues(data);
              setIsChanged(false);
              incrNumPhotometrySubmit();
              setSubmitting(false);
              setIsTelescopeSyncPhotometry(true);
              setIsBackgroundSyncPhotometry(true);
              setIsSourceSyncPhotometry(true);
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
            <br />
            <ReddeningGroup name="ReddeningGroupThisNameIsNotUsed" values={values} />
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
                      style={{ fontSize: 18 }}
                      onChange={(event: any) =>
                        setFieldValue("photInput.val_type", event.target.value)
                      }
                      value={values.photInput.val_type}
                      sx={{
                        width: "100%",
                        height: "3.55rem",
                        // height: "77.5%"
                      }}
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
            <AlertIfSavedButNotSubmitted
              isSavedAndUnsubmitted={isSavedAndUnsubmitted}
              numPhotometrySubmit={numPhotometrySubmit}
            />
            <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
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
      {sessionStorage.getItem("photometryParams") !== null &&
      sessionStorage.getItem("photometryForm") !== null ? (
        <DisplayResults numPhotometrySubmit={numPhotometrySubmit} />
      ) : null}
      {/* <pre>
        {JSON.stringify(JSON.parse(`${sessionStorage.getItem(FORM_PARAMS)}`), null, 2)}
      </pre> */}
      {/* <DisplayParams /> */}
    </div>
  );
};

export default PhotometryForm;
