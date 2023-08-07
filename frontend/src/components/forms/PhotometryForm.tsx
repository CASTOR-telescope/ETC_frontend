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

import { Formik, Form, FieldAttributes, useFormikContext, FormikValues } from "formik";
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
import {
  themeYellowColor,
  themeYellowColorDark,
  themeDisabledButtonColor,
} from "../DarkModeTheme";
import { SourceType } from "./SpectrumOptions";

import {
  AlertIfSavedButNotSubmitted,
  AlertError,
  CommonFormProps,
  CommonTextField,
  useGetIfFormChanged,
  AlertSuccessfulRequest,
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
 * Returns - [base, exp] if number < 1, else number (assuming not null).
 */
const numToSci = (
  num: number | null,
  checkCloseToZero = false,
  checkCloseToOne = false
) => {
  if (num === null) {
    return null;
  } else if (
    num > 1 ||
    (num < 1e-14 && checkCloseToZero) ||
    (Math.abs(num - 1) < 1e-14 && checkCloseToOne)
  ) {
    return num;
  } else {
    let [base, exp] = num
      .toExponential()
      .split("e")
      .map((item) => parseFloat(item));
    if (base.toFixed(2) === "10.00") {
      base = 1.0;
      exp += 1;
    }
    return [base, exp];
  }
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

  const resultCell = (result: number | number[] | null) => {
    if (result === null) {
      return (
        <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
          N/A
        </TableCell>
      );
    } else if (typeof result === "number") {
      return (
        <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
          {result.toFixed(2)}
        </TableCell>
      );
    } else {
      return (
        <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
          {result[0].toFixed(2)}&#8239;×&#8239;10
          <sup>{result[1]}</sup>
        </TableCell>
      );
    }
  };

  const redleakFracUv = numToSci(photParams["redleakFracs"]["uv"], true, true);
  const redleakFracU = numToSci(photParams["redleakFracs"]["u"], true, true);
  const redleakFracG = numToSci(photParams["redleakFracs"]["g"], true, true);

  const photResultsUv = numToSci(photParams["photResults"]["uv"], false, false);
  const photResultsU = numToSci(photParams["photResults"]["u"], false, false);
  const photResultsG = numToSci(photParams["photResults"]["g"], false, false);

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
                    {resultCell(redleakFracUv)}
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photForm["photInput"].val}
                    </TableCell>
                    {resultCell(photResultsUv)}
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
                    {resultCell(redleakFracU)}
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photForm["photInput"].val}
                    </TableCell>
                    {resultCell(photResultsU)}
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
                    {resultCell(redleakFracG)}
                    <TableCell sx={{ fontSize: tableCellFontSize }} align="right">
                      {photForm["photInput"].val}
                    </TableCell>
                    {resultCell(photResultsG)}
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
                    {resultCell(redleakFracUv)}
                    {resultCell(photResultsUv)}
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
                    {resultCell(redleakFracU)}
                    {resultCell(photResultsU)}
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
                    {resultCell(redleakFracG)}
                    {resultCell(photResultsG)}
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
  isPhotometrySavedAndUnsubmitted: boolean;
  setIsPhotometrySavedAndUnsubmitted: (value: boolean) => void;
  incrNumPhotometrySubmit: () => void;
  numPhotometrySubmit: number;
  setIsTelescopeSyncPhotometry: (value: boolean) => void;
  setIsBackgroundSyncPhotometry: (value: boolean) => void;
  setIsSourceSyncPhotometry: (value: boolean) => void;
} & CommonFormProps;

const PhotometryForm: React.FC<PhotometryFormProps> = ({
  isPhotometrySavedAndUnsubmitted,
  setIsPhotometrySavedAndUnsubmitted,
  incrNumPhotometrySubmit,
  setIsChanged,
  prevFormValues,
  setPrevFormValues,
  isError,
  setIsError,
  isSent,
  setIsSent,
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
        Note that we do <b>not</b> support concurrent ETC GUI sessions for the same user.
        If you have saved or submitted a request from another ETC instance (e.g., in
        another tab), then <i>your photometry results will be incorrect </i>! For more
        flexibility, use the Python{" "}
        <Link
          href="https://github.com/CASTOR-telescope/ETC"
          // Open link in new tab
          rel="noopener noreferrer"
          target="_blank"
        >
          <code>castor_etc</code>
        </Link>{" "}
        package.
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
              setIsSent(true)
              // Set state to indicate that the parameters have been submitted
              // MUST have this after BOTH sessionStorage.setItem() calls above
              setIsPhotometrySavedAndUnsubmitted(false);
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
        {({ values, setFieldValue, isSubmitting, isValid }) => (
          <Form>
            <AlertIfSavedButNotSubmitted
              name = {'Photometry'}
              isSavedAndUnsubmitted={isPhotometrySavedAndUnsubmitted}
              numSubmit={numPhotometrySubmit}
            />
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
                  </Grid>
                </Grid>
              </FormGroup>
            </FormControl>

            <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            <AlertError
              isError={isError}
              setIsError={setIsError}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
            <AlertSuccessfulRequest
            type={"Submitted"}
            isSent={isSent}
            setIsSent={setIsSent}
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
