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

import { FormControl, FormGroup, FormHelperText, FormLabel, Grid, Link, MenuItem, Select, Typography } from "@mui/material";
import { Formik, Form, FormikValues } from "formik";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "env";
import { AlertError, AlertIfSavedButNotSubmitted, AlertSuccessfulRequest, CommonFormProps, CommonTextField, CommonTextFieldWithTracker } from "components/CommonFormElements";

import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    themeYellowColor,
    themeYellowColorDark,
    themeDisabledButtonColor,
  } from "../DarkModeTheme";

import localForage from "localforage";

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


const transitValidationSchema = Yup.object({
    bandpass: Yup.object({
        bandpass_id: Yup.string()
        .required()
        .oneOf(Object.values(["uv","u","g"]))
    }),
    exposureParameters: Yup.object({
        exptime: Yup.number()
        .typeError("Exposure time must be a number > 0")
        .positive("Exposure time must be a number > 0"),
        nstack: Yup.number()
        .integer("Number of stacks must an integer number")
        .typeError("Number of stacks must be a number > 0")
        .positive("Number of stacks must be a number > 0"),
        tstart: Yup.number()
        .typeError("Light curve start time must be a number >= 0")
        .min(0, "Light curve start time must be a number >= 0"),
        tend: Yup.number()
        .typeError("Light curve end time must be a number > 0")
        .positive("Light curve end time must be a number > 0"),
    }),
    planetModelParameters: Yup.object({
        rprs: Yup.number()
        .typeError("Planet-star radius ratio must be a number > 0")
        .positive("Planet-star radius ratio must be a number > 0"),
        p: Yup.number()
        .typeError("Orbital period must be a number > 0")
        .positive("Orbital period must be a number > 0"),
        t0: Yup.number()
        .typeError("Zero epoch must be a number >= 0")
        .min(0, "Zero epoch must be a number >= 0"),
        b: Yup.number()
        .typeError("b must be a number > 0")
        .positive("b must be a number > 0"),
        ars: Yup.number()
        .typeError("aRs must be a number > 0")
        .positive("aRs must be a number > 0"),
    }),

})

type TransitFormProps = {
    setIsTransitSavedAndUnsubmitted: (value: boolean) => void;
    isTransitSavedAndUnsubmitted: boolean;
    setIsTelescopeSyncTransit: (value: boolean) => void;
    setIsBackgroundSyncTransit: (value: boolean) => void;
    setIsSourceSyncTransit: (value: boolean) => void;
    incrNumTransitSubmit: () => void,
    numTransitSubmit: number,
} & CommonFormProps;

const TransitForm: React.FC<TransitFormProps> = ({
    isTransitSavedAndUnsubmitted,
    setIsTransitSavedAndUnsubmitted,
    setIsChanged,
    prevFormValues,
    setPrevFormValues,
    isError,
    setIsError,
    isSent,
    setIsSent,
    errorMessage,
    setErrorMessage,
    incrNumTransitSubmit,
    numTransitSubmit,
    setIsTelescopeSyncTransit,
    setIsBackgroundSyncTransit,
    setIsSourceSyncTransit,
}) => {
    // Save user form inputs between tab switches
    const FORM_SESSION = "transitForm"; // key for sessionStorage (user inputs)

    // When possible, please use sessionStorage as it is much faster than localForage.
    const FORM_PARAMS = "transitParams"; // key for localForage (API results)

    let myInitialValues: FormikValues;
    if (sessionStorage.getItem(FORM_SESSION) === null) {
        myInitialValues = {
            targetParameters:{
                // ra,dec,srch_Gmax values are decided in the source tab and are only displayed in the transit tab
                ra:`${JSON.parse(sessionStorage.getItem("sourceForm")!)["predefinedSpectrumParameters"]["gaia"]["ra"]}`,
                dec:`${JSON.parse(sessionStorage.getItem("sourceForm")!)["predefinedSpectrumParameters"]["gaia"]["dec"]}`,
                srch_Gmax:`${JSON.parse(sessionStorage.getItem("sourceForm")!)["predefinedSpectrumParameters"]["gaia"]["srchGmax"]}`,
            },
            bandpass:{
                bandpass_id:"uv"
            },
            exposureParameters:{
                exptime: "",
                nstack: "",
                tstart: "",
                tend: ""
            },
            planetModelParameters:{
                rprs: "",
                p: "",
                t0: "",
                b: "",
                ars: ""
            }
        };
    } else {
        myInitialValues = JSON.parse(`${sessionStorage.getItem(FORM_SESSION)}`);
        // Need to manually change these values.
        myInitialValues.targetParameters.ra = `${JSON.parse(sessionStorage.getItem("sourceForm")!)["predefinedSpectrumParameters"]["gaia"]["ra"]}`
        myInitialValues.targetParameters.dec = `${JSON.parse(sessionStorage.getItem("sourceForm")!)["predefinedSpectrumParameters"]["gaia"]["dec"]}`
        myInitialValues.targetParameters.srch_Gmax = `${JSON.parse(sessionStorage.getItem("sourceForm")!)["predefinedSpectrumParameters"]["gaia"]["srchGmax"]}`
    }
    // Only run this on mount
    useEffect(()=> {
        setIsChanged(false);
        setPrevFormValues(myInitialValues);
    }, []);

    // To remove transitParams after window is closed or refreshed
    window.onbeforeunload = () => {
        localForage.removeItem(FORM_PARAMS)
    } 

    return (
        <div>
            <Typography variant="h5">Make a Transit calculation below.</Typography>
            <Typography variant="body1" style={{ marginBottom: 16 }}>
                The Forecastor ETC GUI is an open source project. Questions, suggestions, and contributions to our {""}
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
                        await axios.put(API_URL + "transit",data).then((response) => response.data).then((response) => {
                            localForage.setItem(FORM_PARAMS, JSON.stringify(response));
                            sessionStorage.setItem((FORM_SESSION
                                ),JSON.stringify(data));
                        }).then(()=> {
                            setIsSent(true)
                            setIsTransitSavedAndUnsubmitted(false); 
                            setPrevFormValues(false);
                            setIsChanged(false);
                            incrNumTransitSubmit();
                            setSubmitting(false)
                            setIsTelescopeSyncTransit(true);
                            setIsBackgroundSyncTransit(true);
                            setIsSourceSyncTransit(true);
                        }).catch((error) => {
                            console.log(error);
                            setIsError(true);
                            setErrorMessage(error.message);
                        }).finally(() => setSubmitting(false));
                        setSubmitting(false)
                    }
                }
                validateOnChange={true}
                validationSchema={transitValidationSchema}
                validateOnMount={true}
                >
                    {({ values, setFieldValue, isSubmitting, isValid }) => (
                        <Form>
                            <AlertIfSavedButNotSubmitted
                            name = {'Transit'}
                            isSavedAndUnsubmitted={isTransitSavedAndUnsubmitted}
                            numSubmit={numTransitSubmit}
                            />
                            <FormControl component="fieldset"
                            variant="standard">
                                <FormLabel
                                required={true}
                                component="legend"
                                sx = {{fontSize: 18}}
                                filled={true}>
                                    Target Parameters
                                </FormLabel>
                                <FormHelperText
                                sx={{
                                    fontSize: "medium",
                                    fontWeight: "normal",
                                    marginBottom: 2,
                                    textAlign: "center",
                                }} >
                                    Right ascension and declination of the target with maximum Gaia G magnitude for Gaia catalog query.
                                </FormHelperText>
                                <FormGroup>
                                    <CommonTextField
                                    name="targetParameters.ra"
                                    placeholder={""}
                                    label="Right Ascension (degree)"
                                    disabled={true}
                                    />
                                    <CommonTextField
                                    name="targetParameters.dec"
                                    placeholder={""}
                                    label="Declination (degree)"
                                    disabled={true}
                                    />
                                    <CommonTextField
                                    name="targetParameters.srch_Gmax"
                                    placeholder={""}
                                    label="Maximum Gaia G magnitude"
                                    disabled={true}
                                    />
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
                                sx ={{fontSize: 18}}
                                filled={true}>
                                    CASTOR Bandpass
                                </FormLabel>
                                <FormHelperText
                                sx={{
                                    fontSize: "medium",
                                    fontWeight: "normal",
                                    marginBottom: 2,
                                    textAlign: "center",
                                }} >
                                    
                                </FormHelperText>
                                <FormGroup>
                                    <Grid container spacing={1} columns={1}>
                                        <Grid item xs={4}>
                                <Select
                                name="bandpass.bandpass_id"
                                type="select"
                                variant="outlined"
                                style={{ fontSize: 18 }}
                                onChange={(event: any) => 
                                    setFieldValue("bandpass.bandpass_id", event.target.value)
                                }
                                value={values.bandpass.bandpass_id}
                                sx={{
                                    width: "100%",
                                    height: "3.55rem",
                                }}
                                >
                                    <MenuItem value="uv">uv</MenuItem>
                                    <MenuItem value="u">u</MenuItem>
                                    <MenuItem value="g">g</MenuItem>
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
                                    Expsoure Parameters
                                </FormLabel>
                                <FormHelperText
                                sx={{
                                    fontSize: "medium",
                                    fontWeight: "normal",
                                    marginBottom: 2,
                                    textAlign: "center",
                                }} >
                                    Specify the exposure parameters to simulate planet transit.
                                </FormHelperText>
                                <FormGroup>
                                    <CommonTextFieldWithTracker
                                    name="exposureParameters.exptime"
                                    value={values.exposureParameters.exptime}
                                    placeholder={"Example: 60"}
                                    label="Exposure time (second)"
                                    prevFormValues={prevFormValues}
                                    setIsChanged={setIsChanged}
                                    required={true}
                                    />
                                    <CommonTextField
                                    name="exposureParameters.nstack"
                                    value={values.exposureParameters.nstack}
                                    placeholder={"Example: 10"}
                                    label="Number of stacks"
                                    required={true}
                                    />
                                    <CommonTextField
                                    name="exposureParameters.tstart"
                                    value={values.exposureParameters.tstart}
                                    placeholder={"Example: 0"}
                                    label="Light curve start time (day)"
                                    required={true}
                                    />
                                    <CommonTextField
                                    name="exposureParameters.tend"
                                    value={values.exposureParameters.tend}
                                    placeholder={"Example: 6.0/24.0"}
                                    label="Light curve end time (day)"
                                    required={true}
                                    />
                                </FormGroup>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl component="fieldset"
                            variant="standard">
                                <FormLabel
                                required={true}
                                component="legend"
                                sx = {{fontSize: 18}}
                                filled={true}>
                                    Planet Model Parameters
                                </FormLabel>
                                <FormHelperText
                                sx={{
                                    fontSize: "medium",
                                    fontWeight: "normal",
                                    marginBottom: 2,
                                    textAlign: "center",
                                }} >
                                    Specify the planet model parameters to simulate transit.
                                </FormHelperText>
                                <FormGroup>
                                    <CommonTextFieldWithTracker
                                    name="planetModelParameters.rprs"
                                    value={values.planetModelParameters.rprs}
                                    placeholder={"0.022"}
                                    label="Planet-star radius ratio"
                                    prevFormValues={prevFormValues}
                                    setIsChanged={setIsChanged}
                                    required={true}
                                    />
                                    <CommonTextField
                                    name="planetModelParameters.p"
                                    value={values.planetModelParameters.p}
                                    placeholder={"2.64388"}
                                    label="Obital Period (unit)"
                                    required={true}
                                    />
                                    <CommonTextField
                                    name="planetModelParameters.t0"
                                    value={values.planetModelParameters.t0}
                                    placeholder={"0.07"}
                                    label="Zero epoch (unit)"
                                    required={true}
                                    />
                                    <CommonTextField
                                    name="planetModelParameters.b"
                                    value={values.planetModelParameters.b}
                                    placeholder={"0.7"}
                                    label="Impact Parameter"
                                    required={true}
                                    />
                                    <CommonTextField
                                    name="planetModelParameters.ars"
                                    value={values.planetModelParameters.ars}
                                    placeholder={"13.73"}
                                    label="Semimajor axis-stellar radius ratio"
                                    required={true}
                                    />
                                </FormGroup>
                            </FormControl>
                            <br />
                            <br />
                            <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
                            {isSubmitting && <h2>Calculating...</h2>}
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
}

export default TransitForm;