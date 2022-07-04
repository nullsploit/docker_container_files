# Docker Container Filemanager/editor


### Step 1 - Create docker pipe to container

 - Create docker pipe directory `mkdir /docker_pipe/pipe`
 - Change pipe permission `sudo chmod -R 777 /docker_pipe/pipe`
 - Create docker pip `sudo mkfifo /docker_pipe/pipe/docker`
 - Create the pipe listener, create a file called `exec_dockerpipe.sh`
    - Add this to the file `while true; do eval "$(cat /docker_pipe/pipe/docker)"; done`
 - Make the file executable `sudo chmod +x exec_dockerpipe.sh`
 - Add the pipe listener to cron `crontab -e`
    - Add this to the file `@reboot /path/to/exec_dockerpipe.sh` (replace 'path/to/exec' with the actual path)

### Step 2 - Share a directory for temp files

 - Create directory `sudo mkdir -p /docker_container_files/tmp`
 - Change directory permission `sudo chmod -R 777 /docker_container_files/tmp`

### Step 3 - Create the image

 - Build the container `docker build --no-cache -t  docker_container_files:latest .`

<hr>

### That's it, now run the container

 ```Dockerfile
 docker run --name=docker_container_files -d -it -p 8000:8000 -v /docker_container_files/tmp:/docker_container_files/tmp -v /var/run/docker.sock:/var/run/docker.sock -v /docker_pipe/pipe/docker:/docker/pipe docker_container_files:latest```