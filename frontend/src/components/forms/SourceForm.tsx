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

import {
  Formik,
  Form,
  FormikValues,
  Field,
  useField,
  FieldAttributes,
  useFormikContext,
  FieldArray,
} from "formik";
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  InputLabel,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";

import {
  AlertIfFormSavedButNotSubmitted,
  useGetIfFormChanged,
  CommonFormProps,
  AlertError,
  AlertSuccessfulRequest,
  CommonTextField,
  SaveButton,
} from "../CommonFormElements";
import { API_URL } from "../../env";
import React from "react";

import { SourceType, SpectrumOptions } from "./SpectrumOptions";

type SourceSelectTypeFieldProps = {
  label: string;
  prevFormValues: Object;
  setIsChanged: (value: boolean) => void;
  handleChange: (event: React.ChangeEvent<{}>) => void;
  incrNumSourceTypeChanged: () => void;
  setCustomSpectrumKey: (value: number) => void;
  required?: boolean;
} & FieldAttributes<{}>;

const SourceSelectTypeField: React.FC<SourceSelectTypeFieldProps> = ({
  label,
  prevFormValues,
  setIsChanged,
  handleChange,
  incrNumSourceTypeChanged,
  setCustomSpectrumKey,
  required = true,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);
  const { onChange, ...fieldNoOnChange } = field;
  const errorText = meta.error || meta.touched ? meta.error : "";

  useGetIfFormChanged(setIsChanged, prevFormValues);

  return (
    <FormControl sx={{ marginTop: 1, marginBottom: 2 }}>
      <InputLabel required={required}>{label}</InputLabel>
      <Field
        type="select"
        as={Select}
        // helperText={errorText} // React & Material-UI bug. Don't really need this here
        error={!!errorText}
        required={required}
        label={label}
        variant="outlined"
        style={{ minWidth: "7rem" }}
        onChange={(e: React.ChangeEvent<any>) => {
          // Clear predefined spectrum
          incrNumSourceTypeChanged(); // To let React know that source type has changed
          // // Don't need to clear any custom spectrum if just changing source type
          // setFieldValue("customSpectrum", "");
          // // Clear customSpectrum file name
          // setCustomSpectrumKey(Date.now());
          return handleChange(e);
        }}
        {...fieldNoOnChange}
      >
        <MenuItem value={SourceType.Point}>Point Source</MenuItem>
        <MenuItem value={SourceType.Extended}>Extended Source</MenuItem>
        <MenuItem value={SourceType.Galaxy}>Galaxy</MenuItem>
      </Field>
    </FormControl>
  );
};

type SpectrumFieldsProps = {
  values: { [value: string]: any }; // any object props
  handleChange: (event: React.ChangeEvent<{}>) => void;
  numSourceTypeChanged: number;
  customSpectrumKey: number;
  setCustomSpectrumKey: (value: number) => void;
  isInitialRender: boolean;
  setIsInitialRender: (value: boolean) => void;
} & FieldAttributes<{}>;

const SpectrumFields: React.FC<SpectrumFieldsProps> = ({
  values,
  handleChange,
  numSourceTypeChanged,
  customSpectrumKey,
  setCustomSpectrumKey,
  isInitialRender,
  setIsInitialRender,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [, meta] = useField<{}>(props);
  const errorText = meta.error || meta.touched ? meta.error : "";

  const options = SpectrumOptions.map((option) => {
    const isAllowed =
      values.sourceType === option.sourceType || option.sourceType === "general";
    const groupName = option.sourceType.toUpperCase();
    const displayName =
      option.sourceType === SourceType.Point
        ? option.spectralName + " - (ID: " + option.spectralValue.toUpperCase() + ")"
        : option.spectralName === ""
        ? "(None)"
        : option.spectralName;
    const sortName = groupName + displayName;
    return {
      isAllowed: isAllowed,
      groupName: groupName,
      displayName: displayName,
      sortName: sortName,
      ...option,
    };
  });

  // Holy smokes... Handling default values and the autocomplete clear button is such a
  // pain... Default value solution based on <https://stackoverflow.com/a/66424008>

  // Object representing empty Autocomplete option (the option whose spectralValue === "")
  const EMPTY_OPTION = {
    displayName: "(None)",
    groupName: "GENERAL",
    isAllowed: true,
    sortName: "GENERAL(None)",
    sourceType: "general",
    spectralName: "",
    spectralValue: "",
  };
  // Default Autocomplete values
  const [displaySpectralValue, setDisplaySpectralValue] = React.useState(
    EMPTY_OPTION.displayName
  );
  const [myInputObj, setMyInputObj] = React.useState(EMPTY_OPTION);

  // Load previous value if available
  React.useEffect(() => {
    for (let option of options) {
      if (values.predefinedSpectrum === option.spectralValue) {
        setDisplaySpectralValue(option.spectralValue);
        setMyInputObj(option);
      }
      // (To print out EMPTY_OPTION object...)
      // if ("" === option.spectralValue) {
      //   console.log("empty option", option);
      // }
    }
  }, []);

  // To clear predefined spectra field when changing source types
  React.useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    } else {
      setMyInputObj(EMPTY_OPTION);
      setFieldValue("predefinedSpectrum", "");
    }
  }, [numSourceTypeChanged]);

  return (
    <FormControl component="fieldset" variant="standard" fullWidth={true}>
      <FormLabel component="legend" required={true} sx={{ fontSize: 18 }} filled={true}>
        Spectrum
      </FormLabel>
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        From the 'Predefined Spectra' dropdown menu, choose a spectrum for the source. For point sources, one can either search the keyword 'gaia' and specify the target parameters or choose an appropriate spectral class. 
        
        <b>
        Transit simulation feature is only available with the former choice.
        </b>
        
        <br />
        If uploading your own spectrum, it
        must be in ASCII or FITS format.
        <br />
        If the file is in ASCII format (.txt or .dat file extension), the first column
        should contain the wavelengths in angstrom and the second column should contain
        the spectrum in erg/s/cm²/Å, with the 2 columns separated by a constant number of
        spaces. Lines starting with a hash (#) will be ignored.
        <br />
        If the file is in FITS format (.fit or .fits file extention), the first field
        (index 0) should contain the wavelengths in angstrom and the second field (index
        1) should contain the spectrum in erg/s/cm²/Å.
      </FormHelperText>
      <FormGroup>
        <Grid container spacing={2} columns={12}>
          <Grid item xs={4}>
            <CommonTextField
              name="redshift"
              placeholder={"Default: 0"}
              label="Redshift"
              required={true}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth={true}>
              <Autocomplete
                fullWidth={true}
                value={myInputObj}
                inputValue={displaySpectralValue}
                onChange={(event, value: any) =>
                  // <https://stackoverflow.com/a/59217951>
                  {
                    // <https://stackoverflow.com/a/69497782>
                    if (value === null || typeof value === "undefined") {
                      setMyInputObj(EMPTY_OPTION); // empty option
                      setFieldValue("predefinedSpectrum", "");
                    } else {
                      setMyInputObj(value);
                      setFieldValue("predefinedSpectrum", value.spectralValue);
                      if (value.spectralValue === "gaia"){
                        setFieldValue("normMethod", NormMethods.None)
                      }
                    }
                    setFieldValue("customSpectrum", "");
                    // Clear customSpectrum file name
                    setCustomSpectrumKey(Date.now());
                  }
                }
                onInputChange={(event, newInputString) =>
                  setDisplaySpectralValue(newInputString)
                }
                options={options.sort((a, b) => a.sortName.localeCompare(b.sortName))}
                groupBy={(option) => option.groupName}
                getOptionLabel={(option) => option.displayName}
                // getOptionLabel={(option) => {
                //   // console.log("getOptionLabel", option);
                //   return typeof option.displayName === "string" ? option.displayName : "";
                // }}
                getOptionDisabled={(option) => !option.isAllowed}
                isOptionEqualToValue={(option, value) =>
                  // <https://stackoverflow.com/a/65347275>
                  option.spectralValue === value.spectralValue
                }
                renderInput={(params) => (
                  <Box>
                    <TextField
                      {...params}
                      name="predefinedSpectrum"
                      label="Predefined Spectra"
                      onChange={handleChange}
                      required={true}
                      fullWidth={true}
                      InputLabelProps={{ shrink: true }} // keep label on top
                    />
                  </Box>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Input
              // https://www.youtube.com/watch?v=EUIRvQbkf0Y
              type="file"
              name="customSpectrum"
              inputComponent="input"
              inputProps={{
                accept: ".fit, .fits, .txt, .dat",
                key: customSpectrumKey,
              }}
              onChange={(event) => {
                // https://stackoverflow.com/a/54487081
                const target = event.target as HTMLInputElement;
                const file: File = (target.files as FileList)[0]; // avoids null typecheck
                // Clear any custom spectrum
                setFieldValue("customSpectrum", file);
              }}
              size="medium"
              style={{
                marginTop: 0,
                marginBottom: 0,
                marginRight: 0,
                marginLeft: 0,
                padding: 0,
                fontSize: 18,
              }}
              sx={{ width: "100%", height: "77.5%" }}
              disabled={values.predefinedSpectrum !== ""}
              // TODO: theme file upload button while preserving filename display!
            />
            {/* <Button
              size="large"
              variant="contained"
              style={{
                marginTop: 0,
                marginBottom: 0,
                marginRight: 0,
                marginLeft: 0,
                padding: 0,
                fontSize: 18,
              }}
              sx={{ width: "100%", height: "77.5%" }}
              disabled={values.predefinedSpectrum !== ""}
            >
              Upload Spectrum
            </Button> */}
          </Grid>
        </Grid>
      </FormGroup>
      {
        (() => {
          switch (values["predefinedSpectrum"]) {
            case "blackbody":
              return (
                <FormGroup>
                  <FormHelperText
                    sx={{
                      fontSize: "medium",
                      fontWeight: "normal",
                      marginBottom: 2,
                      textAlign: "center",
                    }}
                  >
                    Generate a blackbody spectrum of a given temperature and normalize its
                    spectral radiance to match an object of the specified radius and
                    distance. Note that renormalization of this spectrum can be done
                    below.
                  </FormHelperText>
                  <Grid container spacing={2} columns={12}>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.blackbody.temp"
                        value={values.predefinedSpectrumParameters.blackbody.temp}
                        placeholder={"Example: 5500"}
                        label="Blackbody Temperature (K)"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.blackbody.radius"
                        value={values.predefinedSpectrumParameters.blackbody.radius}
                        placeholder={"Example: 1"}
                        label="Radius (solar radii)"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.blackbody.dist"
                        value={values.predefinedSpectrumParameters.blackbody.dist}
                        placeholder={"Example: 1"}
                        label="Distance (kpc)"
                        required={true}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              );
            case "gaia":
              return (
                <FormGroup>
                  <FormHelperText
                    sx={{
                      fontSize: "medium",
                      fontWeight: "normal",
                      marginBottom: 2,
                      textAlign: "center",
                    }}
                  >
                    Please specify right ascension, declination, and threshold Gaia G magnitude to query the Gaia database for potential sources. From all the identified candidate stars, the brightest one will be chosen as the point source. <b>Note that the spectrum would come normalized.
                      </b> 
                  </FormHelperText>
                  <Grid container spacing={2} columns={12}>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.gaia.ra"
                        value={values.predefinedSpectrumParameters.gaia.ra}
                        placeholder={"Example: 311.2897"}
                        label="Right Ascension (Degree)"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.gaia.dec"
                        value={values.predefinedSpectrumParameters.gaia.dec}
                        placeholder={"Example: -31.34089"}
                        label="Declination (Degree)"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.gaia.srchGmax"
                        value={values.predefinedSpectrumParameters.gaia.srchGmax}
                        placeholder={"Example: 21"}
                        label="Threshold Gaia G magnitude"
                        required={true}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              );
            case "powerLaw":
              return (
                <FormGroup>
                  <FormHelperText
                    sx={{
                      fontSize: "medium",
                      fontWeight: "normal",
                      marginBottom: 2,
                      textAlign: "center",
                    }}
                  >
                    Generate a power-law spectrum with a specified exponent. The power-law
                    spectrum will have a flux density of 1 at the reference wavelength.
                  </FormHelperText>
                  <Grid
                    container
                    spacing={2}
                    columns={12}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={5}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.powerLaw.refWavelength"
                        value={values.predefinedSpectrumParameters.powerLaw.refWavelength}
                        placeholder={"Example: 3500"}
                        label="Reference Wavelength (angstrom)"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.powerLaw.exponent"
                        value={values.predefinedSpectrumParameters.powerLaw.exponent}
                        placeholder={"Example: 2"}
                        label="Exponent"
                        required={true}
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              );
            case "uniform":
              return (
                <FormGroup>
                  <FormHelperText
                    sx={{
                      fontSize: "medium",
                      fontWeight: "normal",
                      marginBottom: 2,
                      textAlign: "center",
                    }}
                  >
                    Generate a uniform (flat) spectrum in the chosen unit. The displayed
                    spectrum will always be in units of erg/s/cm²/Å. Note that a flat
                    spectrum in units of either AB magnitude or erg/s/cm²/Hz will not be
                    flat in erg/s/cm²/Å.
                  </FormHelperText>
                  <Grid
                    container
                    spacing={2}
                    columns={12}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={5}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.uniform.spectrumValue"
                        value={values.predefinedSpectrumParameters.uniform.spectrumValue}
                        placeholder={"Example: 1e-19"}
                        label="Value in the Specified Unit"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={2} style={{ marginTop: -15 }}>
                      <FormControl>
                        <InputLabel required={true}>Unit</InputLabel>
                        <Field
                          name="predefinedSpectrumParameters.uniform.unit"
                          type="select"
                          as={Select}
                          error={!!errorText}
                          required={true}
                          label="Unit"
                          variant="standard"
                          style={{ minWidth: "9.5rem" }}
                        >
                          <MenuItem value={"flam"}>erg/s/cm²/Å</MenuItem>
                          <MenuItem value={"fnu"}>erg/s/cm²/Hz</MenuItem>
                          <MenuItem value={"ABmag"}>AB Magnitude</MenuItem>
                          <MenuItem value={"STmag"}>ST Magnitude</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                  </Grid>
                </FormGroup>
              );
            case "emissionLine":
              return (
                <FormGroup>
                  <FormHelperText
                    sx={{
                      fontSize: "medium",
                      fontWeight: "normal",
                      marginBottom: 2,
                      textAlign: "center",
                    }}
                  >
                    Generate a spectrum representing a single emission line.
                  </FormHelperText>
                  <Grid container spacing={2} columns={14}>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.emissionLine.center"
                        value={values.predefinedSpectrumParameters.emissionLine.center}
                        placeholder={"Example: 5007"}
                        label="Central Wavelength (Å)"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.emissionLine.fwhm"
                        value={values.predefinedSpectrumParameters.emissionLine.fwhm}
                        placeholder={"Example: 10"}
                        label="FWHM (Å)"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CommonTextField
                        name="predefinedSpectrumParameters.emissionLine.peak"
                        value={values.predefinedSpectrumParameters.emissionLine.peak}
                        placeholder={"Example: 1e-18"}
                        label="Flux density at peak (erg/s/cm²/Å)"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={2} style={{ marginTop: 0 }}>
                      <FormControl>
                        <InputLabel required={true}>Line Shape</InputLabel>
                        <Field
                          name="predefinedSpectrumParameters.emissionLine.shape"
                          type="select"
                          as={Select}
                          error={!!errorText}
                          required={true}
                          label="Line Shape"
                          variant="standard"
                          style={{ minWidth: "7.5rem" }}
                        >
                          <MenuItem value={"gaussian"}>Gaussian</MenuItem>
                          <MenuItem value={"lorentzian"}>Lorentzian</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                  </Grid>
                </FormGroup>
              );
            default:
              return <div />;
          }
        })() // calling anonymous arrow function to render it
      }
    </FormControl>
  );
};

type PhysicalParametersGroupProps = {
  values: { [value: string]: any }; // any object props
  handleChange: (event: React.ChangeEvent<{}>) => void;
} & FieldAttributes<{}>;

const PhysicalParametersGroup: React.FC<PhysicalParametersGroupProps> = ({
  values,
  handleChange,
  ...props // any object props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField<{}>(props);

  const WIDTH = "40vw";

  if (values.sourceType !== SourceType.Point) {
    return (
      <div>
        <FormControl component="fieldset" variant="standard">
          <FormLabel
            component="legend"
            required={true}
            sx={{ fontSize: 18 }}
            filled={true}
          >
            Physical Parameters
          </FormLabel>
          <FormHelperText
            sx={{
              fontSize: "medium",
              fontWeight: "normal",
              marginBottom: 2,
              textAlign: "center",
              width: WIDTH,
            }}
          >
            Specify the source's physical properties.
          </FormHelperText>
          {
            (() => {
              switch (values["sourceType"]) {
                case SourceType.Point:
                  return (
                    <FormHelperText
                      sx={{
                        fontSize: "medium",
                        fontWeight: "normal",
                        marginBottom: 2,
                        textAlign: "center",
                      }}
                    >
                      Something went wrong. You should not be seeing the point source
                      physical parameters...
                    </FormHelperText>
                  );
                case SourceType.Extended:
                  return (
                    <FormGroup>
                      <CommonTextField
                        name="physicalParameters.extended.angleA"
                        value={values.physicalParameters.extended.angleA}
                        placeholder=""
                        label="Semimajor Axis Angular Size (arcsec)"
                      />
                      <CommonTextField
                        name="physicalParameters.extended.angleB"
                        value={values.physicalParameters.extended.angleB}
                        placeholder=""
                        label="Semiminor Axis Angular Size (arcsec)"
                      />
                      <CommonTextField
                        name="physicalParameters.extended.rotation"
                        value={values.physicalParameters.extended.rotation}
                        placeholder={"Default: 0"}
                        label="CCW Rotation from x-Axis (deg)"
                      />
                      <RadioGroup
                        name={field.name}
                        value={values.physicalParameters.extended.profile}
                        // Need to set onChange manually in this case
                        // See <https://levelup.gitconnected.com/create-a-controlled-radio-group-in-react-formik-material-ui-and-typescript-7ed314081a0e>
                        onChange={(event) => {
                          setFieldValue(
                            "physicalParameters.extended.profile",
                            event.currentTarget.value
                          );
                        }}
                        sx={{ marginBottom: 2 }}
                      >
                        <FormControlLabel
                          value="uniform"
                          control={<Radio />}
                          label="Uniform surface brightness within source boundaries"
                        />
                        <FormControlLabel
                          value="exponential"
                          control={<Radio />}
                          label="Exponentially-decaying surface brightness"
                        />
                      </RadioGroup>
                      {
                        (() => {
                          switch (values["physicalParameters"]["extended"]["profile"]) {
                            case "uniform":
                              return (
                                <FormHelperText
                                  sx={{
                                    fontSize: "medium",
                                    fontWeight: "normal",
                                    marginTop: -2,
                                    marginBottom: 2,
                                    textAlign: "center",
                                    width: WIDTH,
                                  }}
                                >
                                  The uniform surface brightness will be calculated from
                                  the selected spectrum (including any spectral lines and
                                  renormalizations) and the source's physical dimensions
                                  (i.e., semimajor and semiminor axes).
                                </FormHelperText>
                              );
                            case "exponential":
                              return (
                                <div>
                                  <FormHelperText
                                    sx={{
                                      fontSize: "medium",
                                      fontWeight: "normal",
                                      marginTop: -2,
                                      marginBottom: 2,
                                      textAlign: "center",
                                      width: WIDTH,
                                    }}
                                  >
                                    This option means that the surface brightness at the
                                    elliptical level curve defined by the scale lengths
                                    below will be a factor of <i>e</i>&nbsp; less than the
                                    surface brightness at the center of the source. The
                                    surface brightness at the center of the source is
                                    calculated from the selected spectrum (including any
                                    spectral lines and renormalizations) and the source's
                                    physical dimensions (i.e., semimajor and semiminor
                                    axes).
                                  </FormHelperText>
                                  <FormGroup>
                                    <CommonTextField
                                      name={`physicalParameters.extended.exponentialScaleLengthA`}
                                      value={
                                        values.physicalParameters.extended
                                          .exponentialScaleLengthA
                                      }
                                      placeholder="Example: 2.0"
                                      label="Scale Length Along Semimajor Axis (arcsec)"
                                    />
                                    <CommonTextField
                                      name={`physicalParameters.extended.exponentialScaleLengthB`}
                                      value={
                                        values.physicalParameters.extended
                                          .exponentialScaleLengthB
                                      }
                                      placeholder="Example: 2.0"
                                      label="Scale Length Along Semiminor Axis (arcsec)"
                                    />
                                  </FormGroup>
                                </div>
                              );
                            default:
                              return (
                                <FormHelperText
                                  sx={{
                                    fontSize: "medium",
                                    fontWeight: "normal",
                                    marginBottom: 2,
                                    textAlign: "center",
                                  }}
                                >
                                  Something went wrong...
                                </FormHelperText>
                              );
                          }
                        })() // calling anonymous arrow function to render it
                      }
                    </FormGroup>
                  );
                case SourceType.Galaxy:
                  return (
                    <FormGroup>
                      <FormHelperText
                        sx={{
                          fontSize: "medium",
                          fontWeight: "normal",
                          marginTop: -2,
                          marginBottom: 2,
                          textAlign: "center",
                          width: WIDTH,
                        }}
                      >
                        The surface brightness at the center of the source is calculated
                        from the selected spectrum (including any spectral lines and
                        renormalizations) and the source's physical dimensions (i.e., the
                        galaxy's semimajor and semiminor axes, which are calculated using
                        the effective radius and axial ratio).
                      </FormHelperText>
                      <CommonTextField
                        name="physicalParameters.galaxy.sersic"
                        value={values.physicalParameters.galaxy.sersic}
                        placeholder={"Common values: 1 (exponential), 4 (de Vaucouleurs)"}
                        label="Sérsic Index"
                      />
                      <CommonTextField
                        name="physicalParameters.galaxy.rEff"
                        value={values.physicalParameters.galaxy.rEff}
                        placeholder=""
                        label="Effective Radius (arcsec)"
                      />
                      <CommonTextField
                        name="physicalParameters.galaxy.axialRatio"
                        value={values.physicalParameters.galaxy.axialRatio}
                        placeholder="The ratio of the semiminor axis (b) to the semimajor axis (a)"
                        label="Axial Ratio"
                      />
                      <CommonTextField
                        name="physicalParameters.galaxy.rotation"
                        value={values.physicalParameters.galaxy.rotation}
                        placeholder={"Default: 0"}
                        label="CCW Rotation from x-Axis (deg)"
                      />
                    </FormGroup>
                  );
                default:
                  return <Typography>Something went wrong...</Typography>;
              }
            })() // calling anonymous arrow function to render it
          }
        </FormControl>
        <br />
      </div>
    );
  } else {
    return <div />;
  }
};

type SpectralLinesGroupProps = {
  values: { [value: string]: any }; // any object props
  handleChange: (event: React.ChangeEvent<{}>) => void;
} & FieldAttributes<{}>;

const SpectralLinesGroup: React.FC<SpectralLinesGroupProps> = ({
  values,
  handleChange,
  ...props // any object props
}) => {
  const [field] = useField<{}>(props);

  return (
    <FieldArray {...field}>
      {(arrayHelpers) => (
        <FormControl
          component="fieldset"
          variant="standard"
          fullWidth={true}
          style={{
            alignContent: "center",
            justifyContent: "center",
            display: "flex",
            marginBottom: -12,
          }}
        >
          <FormLabel component="legend" required={false} sx={{ fontSize: 18 }}>
            Spectral Lines
          </FormLabel>
          <FormHelperText
            sx={{
              fontSize: "medium",
              fontWeight: "normal",
              textAlign: "center",
            }}
          >
            Add emission or absorption lines to the spectrum. The spectral line peaks and
            dips will be added on top of the continuum and in the order below.
          </FormHelperText>
          <Grid container columns={12} alignItems="center" justifyContent="center">
            <Grid item xs={3}>
              <Button
                size="large"
                variant="contained"
                onClick={() =>
                  arrayHelpers.push({
                    center: "",
                    fwhm: "",
                    peak: "",
                    shape: "gaussian",
                    type: "emission",
                    id: "" + Math.random(),
                  })
                }
                sx={{
                  marginTop: 1,
                  marginBottom: 1,
                  minWidth: "13rem",
                  alignContent: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
                fullWidth={true}
              >
                Add Spectral Line
              </Button>
            </Grid>
          </Grid>
          {values.spectralLines.map((spectralLine: any, index: number) => {
            return (
              <div
                key={spectralLine.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: -12,
                }}
              >
                <Grid
                  container
                  spacing={1}
                  columns={25}
                  justifyContent="center"
                  alignItems="top"
                >
                  <Grid item xs={5} sx={{ marginTop: 2, marginBottom: 0 }}>
                    <CommonTextField
                      name={`spectralLines.${index}.center`}
                      value={`spectralLines.${index}.center`}
                      placeholder={"Example: 4861"}
                      label="Central Wavelength (Å)"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={5} sx={{ marginTop: 2, marginBottom: 0 }}>
                    <CommonTextField
                      name={`spectralLines.${index}.fwhm`}
                      value={`spectralLines.${index}.fwhm`}
                      placeholder={"Example: 4"}
                      label="FWHM (Å)"
                      // label="Full-Width at Half-Maximum (Å)"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={5} sx={{ marginTop: 2, marginBottom: 0 }}>
                    <CommonTextField
                      name={`spectralLines.${index}.peak`}
                      value={`spectralLines.${index}.peak`}
                      placeholder={"Example: 1e-18"}
                      label="Peak/Dip (erg/s/cm²/Å)"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ marginTop: 2, marginBottom: 0 }}>
                    <FormControl fullWidth={true}>
                      <InputLabel required={true}>Spectral Line Type</InputLabel>
                      <Field
                        name={`spectralLines.${index}.type`}
                        type="select"
                        as={Select}
                        required={true}
                        label="Spectral Line Type"
                        variant="outlined"
                        // sx={{ minWidth: "10rem" }}
                      >
                        <MenuItem value="emission">Emission</MenuItem>
                        <MenuItem value="absorption">Absorption</MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sx={{ marginTop: 2, marginBottom: 0 }}>
                    <FormControl fullWidth={true}>
                      <InputLabel required={true}>Spectral Line Shape</InputLabel>
                      <Field
                        name={`spectralLines.${index}.shape`}
                        type="select"
                        as={Select}
                        required={true}
                        label="Spectral Line Shape"
                        variant="outlined"
                        // sx={{ minWidth: "10rem" }}
                      >
                        <MenuItem value="gaussian">Gaussian</MenuItem>
                        <MenuItem value="lorentzian">Lorentzian</MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      style={{
                        marginTop: "1rem",
                        marginBottom: 0,
                        marginRight: 0,
                        marginLeft: 0,
                        padding: 0,
                        fontSize: 31,
                      }}
                      variant="outlined"
                      size="large"
                      fullWidth={true}
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      ×
                    </Button>
                  </Grid>
                </Grid>
              </div>
            );
          })}
        </FormControl>
      )}
    </FieldArray>
  );
};

enum NormMethods {
  PassbandMag = "passbandMag",
  TotalMag = "totalMag",
  LuminosityDist = "luminosityDist",
  None = "",
}

type NormMethodGroupProps = {
  values: { [value: string]: any }; // any object props
} & FieldAttributes<{}>;

const NormMethodGroup: React.FC<NormMethodGroupProps> = ({
  values,
  ...props // any object props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error || meta.touched ? meta.error : "";

  return (
    <FormControl component="fieldset" variant="standard" fullWidth={true}>
      <FormLabel component="legend" required={true} sx={{ fontSize: 18 }} filled={true}>
        Renormalization
      </FormLabel>
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Renormalize the source spectrum to some...
      </FormHelperText>
      <RadioGroup
        name={field.name}
        value={values.normMethod}
        // Need to set onChange manually in this case
        // See <https://levelup.gitconnected.com/create-a-controlled-radio-group-in-react-formik-material-ui-and-typescript-7ed314081a0e>
        onChange={(event) => {
          setFieldValue("normMethod", event.currentTarget.value);
        }}
        sx={{ marginBottom: 2 }}
        >
        <FormControlLabel
          value={NormMethods.PassbandMag}
          control={<Radio />}
          disabled={values.predefinedSpectrum === "gaia" || false}
          label="AB magnitude in a passband"
        />
        <FormControlLabel
          value={NormMethods.TotalMag}
          control={<Radio />}
          disabled={values.predefinedSpectrum === "gaia" || false}
          label="Total (bolometric) AB magnitude"
        />
        <FormControlLabel
          value={NormMethods.LuminosityDist}
          control={<Radio />}
          disabled={values.predefinedSpectrum === "gaia" || false}
          label="Total (bolometric) luminosity and distance"
        />
        <FormControlLabel
          value={NormMethods.None}
          control={<Radio />}
          label="Do not renormalize"
        />
      </RadioGroup>
      {
        (() => {
          switch (values["normMethod"]) {
            case NormMethods.PassbandMag:
              return (
                <FormGroup>
                  <FormHelperText
                    sx={{
                      fontSize: "medium",
                      fontWeight: "normal",
                      marginTop: -2,
                      marginBottom: 2,
                      textAlign: "center",
                    }}
                  >
                    <b>Important:</b> Only renormalize within the passband(s) containing
                    non-zero flux, otherwise the calculation will fail!
                  </FormHelperText>
                  <Grid
                    container
                    spacing={2}
                    columns={12}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={6}>
                      <CommonTextField
                        name={`normParams.${NormMethods.PassbandMag}.abMag`}
                        value={`normParams.${NormMethods.PassbandMag}.abMag`}
                        placeholder={"Example: 24.5"}
                        label="Passband AB Magnitude"
                        required={true}
                      />
                    </Grid>
                    <Grid item xs={1} style={{ marginTop: -15 }}>
                      <FormControl>
                        <InputLabel required={true}>Passband</InputLabel>
                        <Field
                          name={`normParams.${NormMethods.PassbandMag}.passband`}
                          type="select"
                          as={Select}
                          error={!!errorText}
                          required={true}
                          label="Passband"
                          variant="standard"
                          style={{ minWidth: "7rem" }}
                        >
                          <MenuItem value={"uv"}>UV-Band</MenuItem>
                          <MenuItem value={"u"}>u-Band</MenuItem>
                          <MenuItem value={"g"}>g-Band</MenuItem>
                        </Field>
                      </FormControl>
                    </Grid>
                  </Grid>
                </FormGroup>
              );
            case NormMethods.TotalMag:
              return (
                <FormControl>
                  <FormHelperText
                    sx={{
                      fontSize: "medium",
                      fontWeight: "normal",
                      marginTop: -2,
                      marginBottom: 2,
                      textAlign: "center",
                    }}
                  >
                    The bolometric magnitude calculation assumes a perfect (unity)
                    passband response.
                    <br />
                    <b>Warning:</b> If the chosen spectrum does not vanish at the edges,
                    then the bolometric magnitude will depend on the length of the
                    spectrum! This is because the area under the curve does not converge!{" "}
                    <br />
                    <b>
                      You should not use this renormalization with a uniform spectrum!
                    </b>
                  </FormHelperText>
                  <Grid
                    container
                    spacing={2}
                    columns={12}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={6}>
                      <CommonTextField
                        name={`normParams.${NormMethods.TotalMag}`}
                        value={`normParams.${NormMethods.TotalMag}`}
                        placeholder={"Example: 23.14"}
                        label="Bolometric AB Magnitude"
                        required={true}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              );
            case NormMethods.LuminosityDist:
              return (
                <Grid
                  container
                  spacing={2}
                  columns={12}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={6}>
                    <CommonTextField
                      name={`normParams.${NormMethods.LuminosityDist}.luminosity`}
                      value={`normParams.${NormMethods.LuminosityDist}.luminosity`}
                      placeholder="Example: 1.4e10"
                      label="Bolometric Luminosity (solar luminosities)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CommonTextField
                      name={`normParams.${NormMethods.LuminosityDist}.dist`}
                      value={`normParams.${NormMethods.LuminosityDist}.dist`}
                      placeholder=""
                      label="Distance to Source (kpc)"
                    />
                  </Grid>
                </Grid>
              );
            default:
              // No normalization (i.e., NormMethods.None)
              return <div />;
          }
        })() // calling anonymous arrow function to render it
      }
      <FormHelperText
        sx={{
          fontSize: "medium",
          fontWeight: "normal",
          marginBottom: 0,
          textAlign: "center",
        }}
      >
        Apply normalization before or after adding spectral lines?
      </FormHelperText>
      <Grid
        component="label"
        container
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Grid item>Before</Grid>
        <Grid item>
          <Switch
            checked={values.isNormAfterSpectralLines}
            onChange={(event) =>
              setFieldValue("isNormAfterSpectralLines", !values.isNormAfterSpectralLines)
            }
            value={true}
            disabled={values.normMethod === NormMethods.None}
          />
        </Grid>
        <Grid item>After</Grid>
      </Grid>
    </FormControl>
  );
};

type AlertIfTelescopeParamsChangedProps = {
  isSourceSyncTelescope: boolean;
};

const AlertIfTelescopeParamsChanged: React.FC<AlertIfTelescopeParamsChangedProps> = ({
  isSourceSyncTelescope,
}) => {
  if (sessionStorage.getItem("sourceForm") !== null && !isSourceSyncTelescope) {
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
            The Telescope parameters have been updated and the source AB magnitudes in
            each passband may be incorrect. Please save the Source parameters again.
          </Typography>
        </Alert>
      </Box>
    );
  } else {
    return <div />;
  }
};

const sourceValidationSchema = Yup.object({
  sourceType: Yup.string()
    .required("A source type is required")
    .oneOf(Object.values(SourceType)),

  redshift: Yup.number()
    .required("Redshift is a required field")
    .typeError("Redshift must be a non-negative number")
    .min(0, "Redshift must be a non-negative number"),

  // FIXME: `when()` does not seem to work at all...
  // FIXME: when validating predefinedSpectrum, validation fails on first Save because of TextField??
  // No? See "isValid is false although all fields are valid (STILL OPEN!)": <https://github.com/jaredpalmer/formik/issues/1116>

  // predefinedSpectrum: Yup.string().test(
  //   "predefinedSpectrumTest",
  //   "A predefined spectrum is required",
  //   (value: any) => {
  //     console.log("predefinedSpectrum value", value);
  //     // return (
  //     //   (typeof value === "string" && value.length > 0) || typeof value === "undefined"
  //     // );
  //     return typeof value === "string" && value.length > 0;
  //   }
  // ),
  // predefinedSpectrum: Yup.string()
  // .required("A predefined spectrum is required")
  // .min(1, "A predefined spectrum is required"),
  // predefinedSpectrum: Yup.string().when("customSpectrum", {
  //   is: "",
  //   then: Yup.string().required("A predefined spectrum is required").min(0),
  //   otherwise: Yup.string().notRequired(),
  // }), // spectrum options. N.B. different validation per source

  // NOTE: cannot have both predefinedSpectrum and customSpectrum validation at the same
  // time because of some circular dependency issue according to Yup...

  predefinedSpectrum: Yup.string().when("customSpectrum", {
    is: "",
    then: Yup.string()
      .required("Predefined spectrum required when no custom spectrum is provided")
      .min(1, "Predefined spectrum must be at least 1 character"),
    otherwise: Yup.string().notRequired(),
  }),

  // customSpectrum: Yup.string().when("predefinedSpectrum", {
  //   is: "",
  //   then: Yup.string()
  //     .required("Custom spectrum required when no predefined spectrum is selected")
  //     .min(1, "Custom spectrum must be at least 1 character"),
  //   otherwise: Yup.string().notRequired(),
  // }),

  // TODO: when uniform spectrum unit is "flam" or "fnu", spectrumValue must be > 0.
  predefinedSpectrumParameters: Yup.object({
    gaia: Yup.object({
      ra: Yup.number()
      .typeError("Right Ascension must be a number"),
      dec: Yup.number()
      .typeError("Declination must be a number"),
      srchGmax: Yup.number()
      .typeError("Threshold Gaia G magnitude must be a number > 0")
      .positive("Threshold Gaia G magnitude must be a number > 0"),
    }),
    blackbody: Yup.object({
      temp: Yup.number()
        .typeError("Temperature must be a number > 0")
        .positive("Temperature must be a number > 0"),
      radius: Yup.number()
        .typeError("Radius must be a number > 0")
        .positive("Radius must be a number > 0"),
      dist: Yup.number()
        .typeError("Distance must be a number > 0")
        .positive("Distance must be a number > 0"),
    }),
    powerLaw: Yup.object({
      refWavelength: Yup.number()
        .typeError("Reference wavelength must be a number > 0")
        .positive("Reference wavelength must be a number > 0"),
      exponent: Yup.number().typeError("Exponent must be a number"),
    }),
    uniform: Yup.object({
      spectrumValue: Yup.number().typeError("Spectrum value must be a number"),
      unit: Yup.string().oneOf(["flam", "fnu", "ABmag", "STmag"]),
    }),
    emissionLine: Yup.object({
      center: Yup.number()
        .typeError("Central wavelength must be a number > 0")
        .positive("Central wavelength must be a number > 0"),
      fwhm: Yup.number()
        .typeError("FWHM must be a number > 0")
        .positive("FWHM must be a number > 0"),
      peak: Yup.number()
        .typeError("Flux density must be a number > 0")
        .positive("Flux density must be a number > 0"),
      shape: Yup.string().oneOf(["gaussian", "lorentzian"]),
    }),
  }),

  // FIXME: Nested object validation with `when()` does not work. See <https://github.com/jquense/yup/issues/735>
  physicalParameters: Yup.object({
    point: Yup.object({}),
    extended: Yup.object({
      angleA: Yup.number()
        .typeError("Semimajor axis must be a number > 0")
        .positive("Semimajor axis must be a number > 0"),
      angleB: Yup.number()
        .typeError("Semiminor axis must be a number > 0")
        .positive("Semiminor axis must be a number > 0"),
      rotation: Yup.number().typeError("Rotation angle must be a number"),
      profile: Yup.string().oneOf(["uniform", "exponential"]),
      exponentialScaleLengthA: Yup.number()
        .typeError("Scale length must be a number > 0")
        .positive("Scale length must be a number > 0"),
      exponentialScaleLengthB: Yup.number()
        .typeError("Scale length must be a number > 0")
        .positive("Scale length must be a number > 0"),
    }),
    galaxy: Yup.object({
      sersic: Yup.number()
        // .required("Sérsic index is a required field")
        .typeError("Sérsic index must be a number > 0")
        .positive("Sérsic index must be a number > 0")
        .when("sourceType", {
          is: SourceType.Galaxy,
          then: (sourceValidationSchema) => sourceValidationSchema.required(),
          otherwise: (sourceValidationSchema) => sourceValidationSchema.notRequired(),
        }),
      rEff: Yup.number()
        // .required("Effective radius is a required field")
        .typeError("Effective radius must be a number > 0")
        .positive("Effective radius must be a number > 0")
        .when("sourceType", {
          is: SourceType.Galaxy,
          then: (sourceValidationSchema) => sourceValidationSchema.required(),
          otherwise: (sourceValidationSchema) => sourceValidationSchema.notRequired(),
        }),
      rotation: Yup.number()
        // .required("Rotation angle is a required field")
        .typeError("Rotation angle must be a number"),
      // .when("sourceType", {
      //   is: SourceType.Galaxy,
      //   then: (sourceValidationSchema) => sourceValidationSchema.required(),
      //   otherwise: (sourceValidationSchema) => sourceValidationSchema.notRequired(),
      // }),
      axialRatio: Yup.number()
        .typeError("Axial ratio must be a number between (0, 1]")
        .positive("Axial ratio must be a number between (0, 1]")
        .max(1, "Axial ratio must be a number between (0, 1]"),
    }),
  }),

  spectralLines: Yup.array().of(
    Yup.object({
      center: Yup.number()
        .typeError("Central wavelength must be a number > 0")
        .positive("Central wavelength must be a number > 0"),
      fwhm: Yup.number()
        .typeError("FWHM must be a number > 0")
        .positive("FWHM must be a number > 0"),
      peak: Yup.number()
        .typeError("Flux density must be a number > 0")
        .positive("Flux density must be a number > 0"),
      shape: Yup.string().oneOf(["gaussian", "lorentzian"]),
      type: Yup.string().oneOf(["emission", "absorption"]),
      id: Yup.number().required(),
    })
  ),

  normMethod: Yup.string().oneOf(Object.values(NormMethods)),

  normParams: Yup.object({
    passbandMag: Yup.object({
      abMag: Yup.number().typeError("Passband AB magnitude must be a number"),
      passband: Yup.string().oneOf(["uv", "u", "g"]),
    }),
    totalMag: Yup.number().typeError("Bolometric AB magnitude must be a number"),
    luminosityDist: Yup.object({
      luminosity: Yup.number()
        .typeError("Luminosity must be a number > 0")
        .positive("Luminosity must be a number > 0"),
      dist: Yup.number()
        .typeError("Distance must be a number > 0")
        .positive("Distance must be a number > 0"),
    }),
  }),

  isNormAfterSpectralLines: Yup.boolean().required(),
});

type SourceFormProps = {
  isSourceSyncTelescope: boolean;
  setIsSourceSyncTelescope: (value: boolean) => void;
  incrNumTelescopeOrSourceSaved: () => void;
  numPhotometrySubmit: number;
  numUVMOSSubmit: number;
  numTransitSubmit: number;
  numGrismSubmit: number;
  isSourceSyncPhotometry: boolean;
  isSourceSyncUVMOS: boolean;
  isSourceSyncTransit: boolean;
  isSourceSyncGrism: boolean;
  setIsSourceSyncPhotometry: (value: boolean) => void;
  setIsSourceSyncUVMOS: (value: boolean) => void;
  setIsSourceSyncTransit: (value: boolean) => void;
  setIsSourceSyncGrism: (value: boolean) => void;
  setIsPhotometrySavedAndUnsubmitted: (value: boolean) => void;
  setIsUVMOSSavedAndUnsubmitted: (value: boolean) => void;
  setIsTransitSavedAndUnsubmitted: (value: boolean) => void;
  setIsGrismSavedAndUnsubmitted: (value: boolean) => void;
} & CommonFormProps;

const SourceForm: React.FC<SourceFormProps> = ({
  setIsPhotometrySavedAndUnsubmitted,
  setIsUVMOSSavedAndUnsubmitted,
  setIsTransitSavedAndUnsubmitted,
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
  isSourceSyncTelescope,
  setIsSourceSyncTelescope,
  incrNumTelescopeOrSourceSaved,
  numPhotometrySubmit,
  numUVMOSSubmit,
  numTransitSubmit,
  numGrismSubmit,
  isSourceSyncPhotometry,
  setIsSourceSyncPhotometry,
  isSourceSyncUVMOS,
  setIsSourceSyncUVMOS,
  isSourceSyncTransit,
  setIsSourceSyncTransit,
  isSourceSyncGrism,
  setIsSourceSyncGrism,
}) => {
  // Save user form inputs between tab switches
  const FORM_SESSION = "sourceForm"; // key for sessionStorage (user inputs)
  const FORM_PARAMS = "sourceParams"; // key for sessionStorage (API results)
  let myInitialValues: FormikValues;
  if (sessionStorage.getItem(FORM_SESSION) === null) {
    myInitialValues = {
      sourceType: SourceType.Point, // point, extended, or galaxy
      redshift: "0",
      predefinedSpectrum: "", // spectrum options. N.B. different validation per source
      predefinedSpectrumParameters: {
        gaia : { ra: "", dec: "", srchGmax: "21" },
        blackbody: { temp: "", radius: "1", dist: "1" },
        powerLaw: { refWavelength: "", exponent: "" },
        uniform: { spectrumValue: "", unit: "flam" },
        emissionLine: { center: "", fwhm: "", peak: "", shape: "gaussian" },
      },
      customSpectrum: "",
      physicalParameters: {
        point: {}, // empty, but must have the "point" key
        extended: {
          angleA: "",
          angleB: "",
          rotation: "0",
          profile: "uniform",
          exponentialScaleLengthA: "",
          exponentialScaleLengthB: "",
        },
        galaxy: { sersic: "", rEff: "", axialRatio: "", rotation: "0" },
      },
      spectralLines: [
        {
          center: "",
          fwhm: "",
          peak: "",
          shape: "gaussian",
          type: "emission",
          id: "" + Math.random(),
        },
      ],
      normMethod: NormMethods.PassbandMag,
      normParams: {
        // Have to manually write out the `NormMethods` enum keys
        passbandMag: { abMag: "", passband: "uv" },
        totalMag: "",
        luminosityDist: { luminosity: "", dist: "" },
        // No need if no normalization (i.e., normMethod === "")
      },
      isNormAfterSpectralLines: false,
    };
  } else {
    myInitialValues = JSON.parse(`${sessionStorage.getItem(FORM_SESSION)}`);
  }
  // Only run this on mount
  React.useEffect(() => {
    setIsChanged(false);
    // Always reset custom spectrum field (see <https://stackoverflow.com/q/2862357> and
    // <https://stackoverflow.com/q/14867848>)\
    myInitialValues.customSpectrum = "";
    setPrevFormValues(myInitialValues);
  }, []);

  // To clear predefined spectra field when changing source types
  const [numSourceTypeChanged, setNumSourceTypeChanged] = React.useState(0);
  const incrNumSourceTypeChanged = () => {
    setNumSourceTypeChanged(numSourceTypeChanged + 1);
  };
  // Prevent clearing predefined spectra field on first load. My approach is similar to
  // <https://medium.com/swlh/prevent-useeffects-callback-firing-during-initial-render-the-armchair-critic-f71bc0e03536>
  // except not using useRef()
  const [isInitialRender, setIsInitialRender] = React.useState(true);

  // To clear custom spectrum file name (<https://stackoverflow.com/a/55495449>)
  const [customSpectrumKey, setCustomSpectrumKey] = React.useState(0);

  return (
    <div>
      <Typography variant="h5">Specify the source properties below.</Typography>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Form validation is still in development for this tab. Please ensure all inputs are
        valid prior to saving.
      </Typography>
      <Typography variant="body1" style={{ marginBottom: 16 }}>
        The properties below should describe the <i>intrinsic</i> properties of the
        source. For more advanced configurations, please use the Python{" "}
        <Link
          href="https://github.com/CASTOR-telescope/ETC"
          // Open link in new tab
          rel="noopener noreferrer"
          target="_blank"
        >
          <code>castor_etc</code>
        </Link>{" "}
        package instead.
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
      <AlertIfFormSavedButNotSubmitted
      parameters={
        [
      {
        name: 'Photometry',
        isFormSync:isSourceSyncPhotometry,
        numSubmit:numPhotometrySubmit
      },
      {
        name: 'UVMOS',
        isFormSync:isSourceSyncUVMOS,
        numSubmit:numUVMOSSubmit
      },
      {
        name: 'Transit',
        isFormSync:isSourceSyncTransit,
        numSubmit:numTransitSubmit
      },
      {
        name: 'Grism',
        isFormSync:isSourceSyncGrism,
        numSubmit:numGrismSubmit
      },
      ]}
      />
      <Formik
        initialValues={myInitialValues}
        onSubmit={
          async (data, { setSubmitting }) => {
            setSubmitting(true);

            // Must convert data to form-data type instead of JSON because of possible
            // file upload
            const formData = new FormData();
            for (const datum in data) {
              if (datum === "customSpectrum") {
                formData.append(`${datum}`, data[datum]);
              } else {
                formData.append(`${datum}`, JSON.stringify(data[datum]));
              }
            }

            // Make async call
            await axios
              .put(API_URL + "source", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
              .then((response) => response.data)
              .then((response) =>
                sessionStorage.setItem(FORM_PARAMS, JSON.stringify(response))
              )
              .then(() => {
                setIsSent(true)
                setIsPhotometrySavedAndUnsubmitted(true);
                setIsUVMOSSavedAndUnsubmitted(true);
                setIsTransitSavedAndUnsubmitted(true);
                setIsGrismSavedAndUnsubmitted(true);
                setPrevFormValues(data);
                setIsChanged(false);
                sessionStorage.setItem(FORM_SESSION, JSON.stringify(data));
                setIsSourceSyncTelescope(true);
                incrNumTelescopeOrSourceSaved();
                if (sessionStorage.getItem("photometryForm") !== null) {
                  setIsSourceSyncPhotometry(false);
                }
                if (sessionStorage.getItem("uvmosForm") !== null) {
                  setIsSourceSyncUVMOS(false);
                }
                if (sessionStorage.getItem("transitForm") !== null) {
                  setIsSourceSyncTransit(false);
                }
                if (sessionStorage.getItem("grismForm") !== null) {
                  setIsSourceSyncGrism(false);
                }
              })
              .catch((error) => {
                console.log(error);
                setIsError(true);
                setErrorMessage(error.message);
              })
              .finally(() => setSubmitting(false));
          } // end async function
        } // end onSubmit
        validateOnChange={true}
        validationSchema={sourceValidationSchema}
        validateOnMount={true}
      >
        {({ values, handleChange, isSubmitting, isValid }) => (
          <Form>
            <AlertIfTelescopeParamsChanged
              isSourceSyncTelescope={isSourceSyncTelescope}
            />
            <SourceSelectTypeField
              name="sourceType"
              setIsChanged={setIsChanged}
              prevFormValues={prevFormValues}
              label="Source Type"
              incrNumSourceTypeChanged={incrNumSourceTypeChanged}
              handleChange={handleChange}
              setCustomSpectrumKey={setCustomSpectrumKey}
            />
            <br />
            <SpectrumFields
              name="spectrumFieldsThisNameIsNotActuallyUsed"
              values={values}
              handleChange={handleChange}
              numSourceTypeChanged={numSourceTypeChanged}
              customSpectrumKey={customSpectrumKey}
              setCustomSpectrumKey={setCustomSpectrumKey}
              isInitialRender={isInitialRender}
              setIsInitialRender={setIsInitialRender}
            />
            <br />
            <PhysicalParametersGroup
              name="physicalParameters"
              values={values}
              handleChange={handleChange}
            />
            <SpectralLinesGroup
              name="spectralLines"
              values={values}
              handleChange={handleChange}
            />
            <br />
            <NormMethodGroup name="normMethod" values={values} />
            <br />
            {
              // Do manual validation here because of some weird circular dependency issue
              // with Yup & the "when" function...
              (values.customSpectrum === "" ||
                typeof values.customSpectrum === "undefined") &&
                values.predefinedSpectrum === "" &&
                (() => {
                  isValid = false;
                  return (
                    <Typography color="error" style={{ marginTop: 12 }}>
                      Please choose or upload a source spectrum.
                    </Typography>
                  );
                })() // calling anonymous arrow function to render it
            }
            <SaveButton isSubmitting={isSubmitting} isValid={isValid} />
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            <AlertSuccessfulRequest
            type={"Saved"}
            isSent={isSent}
            setIsSent={setIsSent}
            />
            <AlertError
              isError={isError}
              setIsError={setIsError}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SourceForm;
