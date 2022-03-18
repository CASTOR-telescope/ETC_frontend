import { Formik, Field, Form, useField, FieldAttributes } from "formik";
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
  Theme,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "../../service/env";
import { useState } from "react";
import { themeYellowColor } from "../DarkModeTheme";

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

/**
 * Displays the saved parameters
 */
const DisplayParams = () => {
  const DisplayTelescopeParams = () => {
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

type PhotometryFormProps = {
  isSavedAndUnsubmitted: boolean;
  setIsSavedAndUnsubmitted: (value: boolean) => void;
};

const PhotometryForm: React.FC<PhotometryFormProps> = ({
  isSavedAndUnsubmitted,
  setIsSavedAndUnsubmitted,
}) => {
  return (
    <div>
      <Formik
        initialValues={
          {
            // targetValueType: "snr",
            // Use text fields beside checkboxes for "S/N" and "Time (s)"
          }
        }
        onSubmit={async (data, { setSubmitting }) => {
          setSubmitting(true);

          // Set state to indicate that the parameters have been submitted
          // ! Remove and put in promise later
          setIsSavedAndUnsubmitted(false);

          // // Make async call
          // const response = await axios
          //   .put(API_URL + "telescope", data)
          //   .then((response) => response.data)
          //   .then((response) =>
          //     sessionStorage.setItem("telescopeParams", JSON.stringify(response))
          //   )
          //   .then(() => {
          //     // TODO: remove console.log() when done testing
          //     console.log(window.sessionStorage.getItem("telescopeParams"));
          //     // Set state to indicate that the parameters have been submitted
          //     setIsSavedAndUnsubmitted(false);
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //     // setIsError(true);
          //     // console.log(JSON.stringify(error));
          //     // setErrorMessage(error.message);
          //   })
          //   .finally(() => setSubmitting(false));
          setSubmitting(false); // ! REMOVE AFTER
        }}
        // validateOnChange={true}
        // validationSchema={photometryValidationSchema}
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
          setStatus,
        }) => (
          <Form>
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
          </Form>
        )}
      </Formik>
      <AlertIfSavedButNotSubmitted isSavedAndUnsubmitted={isSavedAndUnsubmitted} />
      <DisplayParams />
    </div>
  );
};

export default PhotometryForm;
