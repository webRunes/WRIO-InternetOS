This dockerfile contains base image for the Wrio-InternetOS backend services
All backend service images should be inherited from this image.

This image have automatic build setup at https://hub.docker.com/r/webrunes/wriobase/builds/

To use this image, add first line to the Dockerfile
```
FROM webrunes/wriobase:latest
```