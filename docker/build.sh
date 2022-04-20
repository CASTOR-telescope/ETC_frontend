#!/bin/bash
# Build script for the CASTOR exposure time calculator grpahical user interface
echo "Building CASTOR ETC GUI..."
#
# Set some parameters
#
VERSION=$(date +%y.%m.%d.%H%M)
# (following line from <https://stackoverflow.com/a/246128>)
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# (following line from <https://stackoverflow.com/a/8426110>)
REPO_DIR="$(dirname "$SCRIPT_DIR")"
#
# Load custom parameters
#
source ${SCRIPT_DIR}/Docker_env
CACHEBUST_BACKEND=${1:-1}
CACHEBUST_CASTOR=${2:-1}
CACHEBUST_FRONTEND=${3:-1}
RUN=${4:-false}
#
# Build the project
#
cd ${REPO_DIR}  # necessary so Docker can access other folders within the repo
docker build --build-arg CACHEBUST_BACKEND=${CACHEBUST_BACKEND} \
        --build-arg CACHEBUST_CASTOR=${CACHEBUST_CASTOR} \
        --build-arg CACHEBUST_FRONTEND=${CACHEBUST_FRONTEND} \
        -t castor_etc_gui:${VERSION} \
        -f docker/Dockerfile .
#
echo "Finishing building castor_etc_gui:${VERSION}"
#
# Run the project
#
if [[ ${RUN} = true ]]; then
    echo "Now running castor_etc_gui_v${VERSION}..."
    # https://docs.docker.com/config/containers/container-networking/#published-ports
    docker run --interactive \
            --tty \
            --publish 5000:5000 \
            --name castor_etc_gui_v${VERSION} \
            -d castor_etc_gui:${VERSION}
    #
    docker logs castor_etc_gui_v${VERSION}
    #
    echo "DONE! Access the castor_etc_gui_v${VERSION} instance via localhost port 5000."
else
    echo "DONE! The castor_etc_gui_v${VERSION} has been built."
fi

