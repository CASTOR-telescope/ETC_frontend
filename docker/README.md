
# Docker Setup

Brief walkthrough on how to _locally_ prepare the `castor etc GUI` in a Docker
container.

## Build Instructions

To build the project _locally_ (i.e., not on [CANFAR](https://www.canfar.net/en/)), do the
following:

1. Download the git repo:

   ```bash
   git clone https://github.com/CASTOR-telescope/ETC_frontend.git
   ```

2. Ensure you have [Docker](https://docs.docker.com/get-started/) installed and running in the background.

3. After cloning the ETC_frontend repository, you will need to download these [stellar models](https://kona.ubishops.ca/jsikora/poet_stellar_models.tar.gz) into a directory. 

4. Modify the variable `stellar_model_dir` in the `use_gaia_spectrum()` in [source_route.py](../backend/source_route.py): 

   ```bash
      SourceObj.use_gaia_spectrum(
      stellar_model_dir = "/usr/local/lib/python3.9/site-packages/castor_etc/data/transit_data/stellar_models"
      )

   ```

5. Similarly, modify the variable `stellar_model_dir` in the `Observation` class in [transit_route.py](../backend/transit_route.py):

      ```bash
      TransitObj = Observation(
                               stellar_model_dir = "/usr/local/lib/python3.9/site-packages/castor_etc/data/transit_data/stellar_models"
      )

   ```

6. Finally, modify the variable `STELLAR_MODEL_DIR` in the [build.sh](./build.sh) script and set it to the directory containing the        stellar models on your local machine. Build the image by setting the `RUN` variable to true and then pass `./build.sh` command from the repository-level directory.

7. Access the CASTOR ETC GUI instance via localhost port 5000.

8. Once you're done using the GUI, close the window and run the following commands:

   ```bash
   docker ps # This will help you find the CONTAINER ID corresponding to the running instance of castor_etc_gui_v<VERSION> Docker image
   docker stop <CONTAINER ID> # Stops the container
   docker rm <CONTAINER ID> # Removes the container
   docker images # Once you have stopped and removed the container, find the IMAGE ID of the castor_etc_gui_v<VERSION> Docker image
   docker image rm <IMAGE ID> # Removes the Docker image
   ```

   where `<VERSION>` is some string like `23.11.13.1359`. You can also check the version
   number by looking at the last line of the output from `./build.sh`, which should say
   something like "DONE! Access the castor_etc_gui_v23.11.13.1421 instance via localhost port 5000.".

Please reach out if you have any questions about this, either through email
([isaac.cheng.ca@gmail.com](mailto:isaac.cheng.ca@gmail.com)) or the [discussions
page](https://github.com/CASTOR-telescope/ETC/discussions). You can also ping me on Slack
or even set up an online video/audio call! Larger issues or feature requests can be posted
and tracked via the [issues page](https://github.com/CASTOR-telescope/ETC/issues).

