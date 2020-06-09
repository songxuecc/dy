#!/bin/bash
DIR="$( cd "$( dirname "$BASH_SOURCE[0]" )" && pwd )"
source "$DIR/common.sh"
OUTPUTDIR=$DOCKER_DIR/_build
initDir $OUTPUTDIR

removeDockerContainers() {
    echo "Removing all docker containers:"
    for i in "$CONTAINER_NAME_PREFIX"nginx-fe; do
        docker ps -a --filter=name=$i
        if [[ $(docker ps -aq --filter=name=$i) != "" ]]; then
            docker rm -f -v $(docker ps -aq --filter=name=$i)
        fi
    done
    echo "All the dev containers have been removed"
}

pullDockerImages() {
    echo "Pulling images needed"

    docker pull $DOCKER_REGISTRY/fc-nginx &
    waitjobs
}

dockerImageExists() {
    [[ $(docker images -q "$1") != "" ]]
}

dockerContainerExists() {
    if [[ $(docker ps -q --filter=name="^/$1$") != "" ]]; then
        echo "Found running container $1"
        docker unpause "$1" >/dev/null 2>&1 || true
        return 0
    else
        echo "Container $1 does not exist or running"
        if [[ $(docker ps -aq --filter=name="^/$1$") != "" ]]; then
            echo "Found dead container $1, trying to cleanup"
            docker rm -v "$1" >/dev/null || true
        fi
        return 1
    fi
}

checkAllDockerImageExists() {
    if dockerImageExists $DOCKER_REGISTRY/fc-nginx
    then
        echo "All images exists, skip pulling."
    else
        docker login -u "$DOCKER_REGISTRY_USERNAME" -p "$DOCKER_REGISTRY_PASSWORD" $DOCKER_REGISTRY
        pullDockerImages
    fi
}

startDockerContainers() {
    echo "Starting docker containers"

    if ! dockerContainerExists "$CONTAINER_NAME_PREFIX"nginx-fe; then
        docker run --restart=always --name "$CONTAINER_NAME_PREFIX"nginx-fe -p 9080:80 -p 9443:443\
          --add-host hhgj-fe-host:$DOCKERHOSTIP  \
          -v $DOCKER_DIR/conf/nginx/nginx_dev.conf:/etc/nginx/nginx.conf  \
          -v $DOCKER_DIR/conf/nginx/ssl:/etc/nginx/ssl  \
          -v $ROOT_DIR/static:/usr/src/myapp/static  \
          -v $OUTPUTDIR/logs/nginx:/var/log/nginx/ \
          -v $ROOT_DIR:/var/www/html/hhgj-fe \
          -d $DOCKER_REGISTRY/fc-nginx
    fi
}

CMD=${1:-start}

checkAllDockerImageExists

case "$CMD" in
    restart)
        removeDockerContainers || true
        checkAllDockerImageExists
        startDockerContainers
    ;;
    start)
        startDockerContainers
    ;;
    shutdown)
        removeDockerContainers || true
    ;;
    pull)
        pullDockerImages
    ;;
    *)
    echo $"Usage: $0 {start|restart|shutdown|pull}"
    exit 1
esac