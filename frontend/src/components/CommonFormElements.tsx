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

import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, AlertTitle, Box, Snackbar, TextField, Typography } from "@mui/material";
import { Field, FieldAttributes, useField, useFormikContext } from "formik";
import { isEqual } from "lodash";
import React, { useEffect } from "react";

export type CommonFormProps = {
  setIsChanged: (value: boolean) => void;
  prevFormValues: Object;
  setPrevFormValues: (value: Object) => void;
  isError: boolean;
  setIsError: (value: boolean) => void;
  isSent: boolean;
  setIsSent: (value: boolean) => void;
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
        {errorMessage} <br />
        Please check the session logs for more details
      </Alert>
    </Snackbar>
  );
};

/**
 * Show a toast message when the form is successfully saved/submitted. This should be wrapped in a `<Form>` component from formik.
 */
export const AlertSuccessfulRequest: React.FC<{
  type: string;
  isSent: boolean;
  setIsSent: (value: boolean) => void;
}> = ({ type, isSent, setIsSent }) => {
  return (
    <Snackbar
      open={isSent}
      autoHideDuration={1000}
      onClose={() => {
        // Clear any previous errors
        setIsSent(false);
      }}
    >
      <Alert
        severity="success"
        onClose={() => {
          // Clear any previous errors
          setIsSent(false);
        }}
      >
        <AlertTitle>{type} successfully!</AlertTitle>
      </Alert>
    </Snackbar>
  );
};

type AlertIfSavedButNotSubmittedProps = {
  name: string;
  isSavedAndUnsubmitted: boolean;
  numSubmit: number;
};

/**
 * Generate an info alert when the user has saved, but unsubmitted, parameters.
 * 
 * @param name - Name of the form not submitted
 *
 * @param isSavedAndUnsubmitted - true if the user has saved, but unsubmitted, parameters
 *
 * @returns `<Alert />` if any of the tabs have been saved, but not submitted
 *
 */
export const AlertIfSavedButNotSubmitted: React.FC<AlertIfSavedButNotSubmittedProps> = ({
  name,
  isSavedAndUnsubmitted,
  numSubmit,
}) => {
  // Alert user if any of the tabs have been saved, but not submitted
  if (isSavedAndUnsubmitted && numSubmit > 0) {
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
            Some parameters are saved but not submitted. The {name} calculations and
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


/* Define a common AlertIfFormSavedBut{}NotSubmitted */

interface AlertIfFormSavedButNotSubmittedProps {
  parameters : {
    name: string;
    isFormSync: boolean;
    numSubmit: number;
  }[]
}

/* Handles if telescope, background and source parameters have been updated but Photometry/UVMOS/Transit has not been updated yet, Version 2. */
export const AlertIfFormSavedButNotSubmitted: React.FC<AlertIfFormSavedButNotSubmittedProps> = ({parameters}) => {
  return (
    <>
      {parameters.map((item,index)=>{
      if (!item.isFormSync && item.numSubmit > 0) {
    return (
      <Box
        sx={{
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginBottom: 2,
        }}

        key={index}
        >
        <Alert severity="info" style={{ width: "75%" }}>
          <AlertTitle>Info</AlertTitle>
          <Typography>
            Parameters have been updated but a new {item.name} request has not been
            submitted. The {item.name} calculations and the simulated images may not
            correspond to the parameters shown.
          </Typography>
          <Typography>
            Submit a new {item.name} request to update the images and results.
          </Typography>
        </Alert>
      </Box>
    );
  } else {
    return <div key={index}/>;
  }
    }
    
    )}
    </>
  )
};

/* Version 1 */
// export const AlertIfFormSavedButNotSubmitted: React.FC<{
//   name: string;
//   isFormSync: boolean;
//   numSubmit: number;
// }> = ({ name,isFormSync, numSubmit }) => {
//   if (!isFormSync && numSubmit > 0) {
//     return (
//       <Box
//         sx={{
//           backgroundColor: "transparent",
//           display: "flex",
//           justifyContent: "center",
//           width: "100%",
//           marginBottom: 2,
//         }}
//       >
//         <Alert severity="info" style={{ width: "75%" }}>
//           <AlertTitle>Info</AlertTitle>
//           <Typography>
//             Parameters have been updated but a new {name} request has not been
//             submitted. The {name} calculations and the simulated images may not
//             correspond to the parameters shown.
//           </Typography>
//           <Typography>
//             Submit a new {name} request to update the images and results.
//           </Typography>
//         </Alert>
//       </Box>
//     );
//   } else {
//     return <div />;
//   }
// };

export const useGetIfFormChanged = (
  setIsChanged: (value: boolean) => void,
  prevFormValues: Object
) => {
  const { values } = useFormikContext();

  useEffect(() => {
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
  disabled?: boolean;
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
  disabled= false,
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
      disabled={disabled}
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
