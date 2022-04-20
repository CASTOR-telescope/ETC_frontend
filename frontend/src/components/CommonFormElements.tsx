import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, AlertTitle, Box, Snackbar, TextField, Typography } from "@mui/material";
import { Field, FieldAttributes, useField, useFormikContext } from "formik";
import { isEqual } from "lodash";
import React, { useEffect } from "react";

export type CommonFormProps = {
  // isSavedAndUnsubmitted?: boolean;
  setIsSavedAndUnsubmitted: (value: boolean) => void;
  setIsChanged: (value: boolean) => void;
  prevFormValues: Object;
  setPrevFormValues: (value: Object) => void;
  isError: boolean;
  setIsError: (value: boolean) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
  // isTelescopeUpdated?: boolean;
  // setIsTelescopeUpdated?: (value: boolean) => void;
  // isBackgroundSyncTelescope?: boolean;
  // setIsBackgroundSyncTelescope?: (value: boolean) => void;
  // isSourceSyncTelescope?: boolean;
  // setIsSourceSyncTelescope?: (value: boolean) => void;
};

/**
 * Show a toast message when the form has trouble saving/submitting (i.e., client/server
 * error). This should be wrapped in a `<Form>` component from formik.
 */
export const AlertError: React.FC<{
  isError: boolean;
  setIsError: (value: boolean) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
}> = ({ isError, setIsError, errorMessage, setErrorMessage }) => {
  return (
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
        {errorMessage} <br />
        Please check the session logs for more details
      </Alert>
    </Snackbar>
  );
};

export const AlertIfFormSavedButPhotometryNotSubmitted: React.FC<{
  isFormSyncPhotometry: boolean;
  numPhotometrySubmit: number;
}> = ({ isFormSyncPhotometry, numPhotometrySubmit }) => {
  if (!isFormSyncPhotometry && numPhotometrySubmit > 0) {
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
            Parameters have been updated but a new Photometry request has not been
            submitted. The photometry calculations and the simulated images may not
            correspond to the parameters shown.
          </Typography>
          <Typography>
            Submit a new Photometry request to update the images and results.
          </Typography>
        </Alert>
      </Box>
    );
  } else {
    return <div />;
  }
};

export const useGetIfFormChanged = (
  setIsChanged: (value: boolean) => void,
  prevFormValues: Object
) => {
  const { values } = useFormikContext();

  useEffect(() => {
    // compareValues();
    if (isEqual(values, prevFormValues)) {
      setIsChanged(false);
    } else {
      setIsChanged(true);
    }
  }, [values]);
};

export type CommonTextFieldProps = {
  placeholder: string;
  label: string;
  fullWidth?: boolean;
  required?: boolean;
} & FieldAttributes<{}>;

/**
 * Should be called within a <Form> </Form> component. Should also pass in:
 *
 * @param name
 * @param value
 *
 * @returns <Field />
 */
export const CommonTextField: React.FC<CommonTextFieldProps> = ({
  placeholder,
  label,
  required = true,
  fullWidth = true,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error || meta.touched ? meta.error : "";

  return (
    <Field
      // key={props.name}
      placeholder={placeholder}
      label={label}
      // Consistent props
      as={TextField}
      type="input"
      fullWidth={fullWidth}
      required={required}
      sx={{ marginTop: "auto", marginBottom: 2 }}
      helperText={errorText}
      error={!!errorText} // True if errorText is non-empty
      {...field}
      // handleChange={useCallback(() => {}, []);
    />
  );
};

export type CommonTextFieldWithTrackerProps = {
  placeholder: string;
  label: string;
  required?: boolean;
  // values: Object;
  fullWidth?: boolean;
  prevFormValues: Object;
  setIsChanged: (value: boolean) => void;
} & FieldAttributes<{}>;

/**
 * CommonTextField but with a tracker for unsaved changes.
 *
 * @param name
 * @param value
 *
 * @returns <Field />
 */
export const CommonTextFieldWithTracker: React.FC<CommonTextFieldWithTrackerProps> = ({
  placeholder,
  label,
  required = true,
  fullWidth = true,
  // values,
  prevFormValues,
  setIsChanged,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error || meta.touched ? meta.error : "";

  // const { values } = useFormikContext();

  // // const compareValues = useCallback(() => {
  // //   if (isEqual(values, prevFormValues)) {
  // //     setIsChanged(false);
  // //     console.log("unchanged values: ", values);
  // //     console.log("prevFormValues values: ", prevFormValues);
  // //   } else {
  // //     setIsChanged(true);
  // //     console.log("changed values: ", values);
  // //     console.log("prevFormValues values: ", prevFormValues);
  // //   }
  // // }, [values]);

  // useEffect(() => {
  //   // compareValues();
  //   if (isEqual(values, prevFormValues)) {
  //     setIsChanged(false);
  //     // console.log("unchanged values: ", values);
  //     // console.log("prevFormValues values: ", prevFormValues);
  //   } else {
  //     setIsChanged(true);
  //     // console.log("changed values: ", values);
  //     // console.log("prevFormValues values: ", prevFormValues);
  //   }
  //   console.log(values);
  // }, [values]);

  useGetIfFormChanged(setIsChanged, prevFormValues);

  return (
    <Field
      // key={props.name}
      placeholder={placeholder}
      label={label}
      // Consistent props
      as={TextField}
      type="input"
      fullWidth={fullWidth}
      required={required}
      sx={{ marginTop: "auto", marginBottom: 2 }}
      helperText={errorText}
      error={!!errorText} // True if errorText is non-empty
      {...field}
      // handleChange={useCallback(() => {}, []);
    />
  );
};

export const SaveButton: React.FC<{ isSubmitting: boolean; isValid: boolean }> = ({
  isSubmitting,
  isValid,
}) => {
  // console.log("isValid?", isValid);
  return (
    <LoadingButton
      type="submit"
      disabled={isSubmitting || !isValid}
      color="secondary"
      size="large"
      variant="contained"
      style={{ width: "25%", fontSize: 24, margin: 16 }}
      loading={isSubmitting}
      loadingIndicator="Saving..."
    >
      Save
    </LoadingButton>
  );
};
