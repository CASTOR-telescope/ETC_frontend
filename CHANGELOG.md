# Changelog

See [semantic versioning](https://semver.org/spec/v2.0.0.html) for the rationale behind
the version numbers.

<!-- ## [1.1.0](https://github.com/CASTOR-telescope/ETC_frontend/tree/v1.1.0) (2022-mm-dd)

- Also, we now only render the spectrum for wavelengths within the CASTOR passband
ranges. This should allow users to upload bigger spectra without hitting the session
storage limit. See the comments beginning
[here](https://github.com/CASTOR-telescope/ETC_frontend/issues/2#issuecomment-1125563805)
for more context/details. -->

## [1.1.0](https://github.com/CASTOR-telescope/ETC_frontend/tree/v1.1.0) (2023-11-13)
- Added UVMOS spectroscopy tab capable of simulating:
  - Source viewed on the detector
  - Source viewed through the slit
  - Flux (counts/second) spectra
- Added GRISM spectroscopy tab capable of simulating:
  - 2D Signal-Noise ratio (SNR) per resolution
  - 1D SNR per resolution
- Added Transit simulation tab capable of simulating:
  - Scene
  - Lightcurve


## [1.0.1](https://github.com/CASTOR-telescope/ETC_frontend/tree/v1.0.1) (2022-05-13)

- Added `git` to Dockerfile
- Reset custom spectrum value upon loading of Source form
- Fixed 500 error when uploading spectrum from a FITS file
  (PR [#3](https://github.com/CASTOR-telescope/ETC_frontend/pull/3))
- Fix typo in Photometry results tab (issue
  [#4](https://github.com/CASTOR-telescope/ETC_frontend/issues/4) fixed by PR
  [#5](https://github.com/CASTOR-telescope/ETC_frontend/pull/5))

## [1.0.0](https://github.com/CASTOR-telescope/ETC_frontend/tree/v1.0.0) (2022-05-11)

Initial release!
