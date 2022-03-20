import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, AlertTitle, Snackbar, TextField } from "@mui/material";
import { Field, FieldAttributes, useField, useFormikContext } from "formik";
import { isEqual } from "lodash";
import React, { useEffect } from "react";

export type CommonFormProps = {
  setIsSavedAndUnsubmitted: (value: boolean) => void;
  setIsChanged: (value: boolean) => void;
  prevFormValues: Object;
  setPrevFormValues: (value: Object) => void;
  isError: boolean;
  setIsError: (value: boolean) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
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
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export const useGetIfFormChanged = (
  setIsChanged: (value: boolean) => void,
  prevFormValues: Object
) => {
  const { values } = useFormikContext();

  // const compareValues = useCallback(() => {
  //   if (isEqual(values, prevFormValues)) {
  //     setIsChanged(false);
  //     console.log("unchanged values: ", values);
  //     console.log("prevFormValues values: ", prevFormValues);
  //   } else {
  //     setIsChanged(true);
  //     console.log("changed values: ", values);
  //     console.log("prevFormValues values: ", prevFormValues);
  //   }
  // }, [values]);

  useEffect(() => {
    // compareValues();
    if (isEqual(values, prevFormValues)) {
      setIsChanged(false);
      // console.log("unchanged values: ", values);
      // console.log("prevFormValues values: ", prevFormValues);
    } else {
      setIsChanged(true);
      // console.log("changed values: ", values);
      // console.log("prevFormValues values: ", prevFormValues);
    }
    console.log("in useGetIfFormChanged", values);
  }, [values]);
};

export type CommonTextFieldProps = {
  placeholder: string;
  label: string;
  required?: boolean;
  // values: Object;
  prevFormValues: Object;
  setIsChanged: (value: boolean) => void;
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
      fullWidth
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
