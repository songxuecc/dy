ROOT_DIR="$( cd "$( dirname "$BASH_SOURCE[0]" )"/.. && pwd )"
DOCKER_DIR=$ROOT_DIR/docker
CONTAINER_NAME_PREFIX="hhgj-"
DOCKER_REGISTRY="docker.taofengcai.com"
DOCKER_REGISTRY_USERNAME="topfruit"
DOCKER_REGISTRY_PASSWORD="topFruit@1q2w3e"

echo $DOCKER_DIR

if [[ $(uname) == "Linux" ]]; then
    if [[ -z "$DOCKERHOSTIP" ]]; then
        DOCKERHOSTIP=$(ip addr | awk '/inet/ && /docker0/{sub(/\/.*$/,"",$2); print $2}')
    fi
    if [[ -z "$DOCKER_HOST" ]]; then
        DOCKER_HOST="tcp://$DOCKERHOSTIP:4243"
    fi
    USE_DOCKER_NATIVE=1
else
    USE_DOCKER_NATIVE=1
    if [[ -n "$USE_DOCKER_NATIVE" ]]; then
        echo "Proudly using native docker for Mac"
        DOCKER_ENGINE="docker-native"
        DOCKERHOSTIP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2 | head -n1)
    elif hash docker-machine >/dev/null 2>&1; then
       # in case docker-machine is not running, this shouldn't fail
       DOCKERHOSTIP=$(docker-machine ip default 2>/dev/null || true)
       USE_DOCKER_NATIVE=
    elif docker ps >/dev/null 2>&1; then
       USE_DOCKER_NATIVE=1
       DOCKERHOSTIP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2 | head -n1)
    else
        echo "ERROR: docker-machine not installed"
        exit 2;
    fi
fi

DOCKER_TERM=""
if [[ -t 1 ]]; then
    DOCKER_TERM="-t"
fi

function waitjobs {
    FAILED_JOBS=0
    for job in `jobs -p`; do
        wait $job || let "FAILED_JOBS+=1"
    done

    if [ "$FAILED_JOBS" != "0" ]; then
        echo "[ERROR] $FAILED_JOBS jobs failed."
        exit 1
    fi
}

createVolumeDir() {
    mkdir -p "$1"
    chmod -R 777 "$1"
}

function initDir {
    createVolumeDir ${1}
    destDir=${1}
    cd $destDir
    dir=(logs logs/crontab logs/nginx)

    for k in ${dir[@]};
    do
        if [ ! -d "$destDir/$k" ]; then
            mkdir $destDir/$k
            chmod -R 777 $destDir/$k
        fi
    done

}


