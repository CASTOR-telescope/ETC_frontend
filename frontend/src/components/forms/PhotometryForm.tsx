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
} from "@mui/material";
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
        }}
      >
        <Alert severity="info" style={{ width: "50%" }}>
          <AlertTitle>Info</AlertTitle>
          <Typography>
            Some parameters are saved but not submitted. The results and plots may not
            match the parameters below. Please submit the form to update the results.
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
      return <pre>{sessionStorage.getItem("telescopeParams")}</pre>;
    } else {
      return <div />;
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
            <Button
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
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
      <AlertIfSavedButNotSubmitted isSavedAndUnsubmitted={isSavedAndUnsubmitted} />
      ;
      <DisplayParams />
    </div>
  );
};

export default PhotometryForm;
