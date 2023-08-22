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
import { Formik, Form, FormikValues,useFormikContext } from "formik";
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  Typography,
  MenuItem,
  Select,
  Paper,
  FormControlLabel,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import * as Yup from "yup";
import axios from "axios";
import { useEffect } from "react";
import {
  themeYellowColor,
  themeYellowColorDark,
  themeDisabledButtonColor,
} from "../DarkModeTheme";
import {
  AlertIfSavedButNotSubmitted,
  CommonFormProps,
  AlertError,
  AlertSuccessfulRequest,
  CommonTextField,
  CommonTextFieldWithTracker,
} from "../CommonFormElements";
import { API_URL } from "../../env";

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

  const grismValidationSchema = Yup.object({
    grismChannel: Yup.string()
    .required()
    .oneOf(Object.values(["uv","u"]))

  })

  type GrismFormProps = {
    setIsGrismSavedAndUnsubmitted: (value: boolean) => void;
    isGrismSavedAndUnsubmitted: boolean;
    setIsTelescopeSyncGrism: (value: boolean) => void;
    setIsBackgroundSyncGrism: (value: boolean) => void;
    setIsSourceSyncGrism: (value: boolean) => void;
    incrNumGrismSubmit: () => void,
    numGrismSubmit: number,
  } & CommonFormProps;

  const GrismForm: React.FC<GrismFormProps> = ({
    isGrismSavedAndUnsubmitted,
    setIsGrismSavedAndUnsubmitted,
    setIsChanged,
    prevFormValues,
    setPrevFormValues,  
    isError,
    setIsError,
    isSent,
    setIsSent,
    errorMessage,
    setErrorMessage,
    incrNumGrismSubmit,
    numGrismSubmit,
    setIsTelescopeSyncGrism,
    setIsBackgroundSyncGrism,
    setIsSourceSyncGrism,
  }) => {

    // Save user form inputs between tab switches
    const FORM_SESSION = "grismForm"; //key for sessionStorage (user inputs)

    const FORM_PARAMS = "grismParams"; // key for sessionStorage (API results)
    
    let myInitialValues: FormikValues;
    if (sessionStorage.getItem(FORM_SESSION) === null) {
        myInitialValues = {
            grismChannel: "uv",
            exposureTime: 1000
        };
    } else {
        myInitialValues = JSON.parse(`${sessionStorage.getItem(FORM_SESSION)}`);
    }
    // Only run this on mount
    useEffect(()=> {
        setIsChanged(false);
        setPrevFormValues(myInitialValues)
    }, []);

    return (
        <div>
            <Typography variant="h5"> Make a Grism spectroscopy calculation below.</Typography>
            <Typography variant="body1" style={{ marginBottom: 16}}>
                Note that currently grism calculations are only available for <b>
                    sersic galaxy sources. 
                    </b>
            <br/>
            <br/>
                The FORECASTOR ETC GUI is an open source project. Questions, suggestions, and contributions to our {""}
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
                onSubmit={
                    async (data, { setSubmitting }) => {
                      setSubmitting(true);
                      // Make async call
                      await axios
                        .put(API_URL + "grism", data)
                        .then((response) => response.data)
                        .then((response) => {
                          sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response));
                          sessionStorage.setItem((FORM_SESSION),JSON.stringify(data));
                    })
                        .then(() => {
                          setIsSent(true)
                          setIsGrismSavedAndUnsubmitted(false);
                          setPrevFormValues(data);
                          setIsChanged(false);
                          incrNumGrismSubmit(); 
                          setSubmitting(false)
                          setIsTelescopeSyncGrism(true);
                          setIsBackgroundSyncGrism(true);
                          setIsSourceSyncGrism(true);
                        })
                        .catch((error) => {
                          console.log(error);
                          setIsError(true);
                          setErrorMessage(error.message);
                        })
                        .finally(() => setSubmitting(false));
                        setSubmitting(false)
                    } // end async function
                  } // end onSubmit
                  validateOnChange={true}
                  validationSchema={grismValidationSchema}
                  validateOnMount={true}
            >
                {({ values, setFieldValue ,isSubmitting, isValid}) => (
                    <Form>
                        <AlertIfSavedButNotSubmitted
                        name = {'Grism'}
                        isSavedAndUnsubmitted={isGrismSavedAndUnsubmitted}
                        numSubmit={numGrismSubmit}
                        />
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel
                        required={true}
                        component="legend"
                        sx = {{fontSize: 18}}
                        filled={true}>
                            Grism Channel
                        </FormLabel>
                        <FormHelperText
                        sx={{
                            fontSize: "medium",
                            fontWeight: "normal",
                            marginBottom: 2,
                            textAlign: "center",
                        }}>
                            Disperse the source spectrum with the appropriate grism channel.
                        </FormHelperText>
                        <FormGroup>
                                    <Grid container spacing={1} columns={1}>
                                        <Grid item xs={4}>
                                <Select
                                name="grismChannel"
                                type="select"
                                variant="outlined"
                                style={{ fontSize: 18 }}
                                onChange={(event: any) => 
                                    setFieldValue("grismChannel", event.target.value)
                                }
                                value={values.grismChannel}
                                sx={{
                                    width: "100%",
                                    height: "3.55rem",
                                }}
                                >
                                    <MenuItem value="uv">uv</MenuItem>
                                    <MenuItem value="u">u</MenuItem>
                                </Select>
                                    </Grid>
                                    </Grid>
                                    </FormGroup>
                    </FormControl>
                    <br />
                    <br />
                    <br />
                    <FormControl component="fieldset"
                            variant="standard">
                                <FormLabel
                                required={true}
                                component="legend"
                                sx = {{fontSize: 18}}
                                filled={true}>
                                    Exposure Parameter
                                </FormLabel>
                                <FormHelperText
                                sx={{
                                    fontSize: "medium",
                                    fontWeight: "normal",
                                    marginBottom: 2,
                                    textAlign: "center",
                                }} >
                                    Observe source for specified amount of time.
                                </FormHelperText>
                                <FormGroup>
                                <CommonTextFieldWithTracker
                                    name="exposureTime"
                                    value={values.exposureTime}
                                    placeholder={"Example: 1000"}
                                    label="Exposure time (second)"
                                    prevFormValues={prevFormValues}
                                    setIsChanged={setIsChanged}
                                    required={true}
                                    />
                                  
                                </FormGroup>
                            </FormControl>

                    <br />
                    <br />
                    <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
                    <br />
                    <br />
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
                
        </div>
    )
  };

  export default GrismForm;