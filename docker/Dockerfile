FROM ubuntu:15.04
MAINTAINER Michael Bilenko <denso.ffff@gmail.com>
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get update && apt-get install -y nodejs mc libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++ git  libkrb5-dev
RUN npm install -g http-server browserify gulp nodemon mocha
RUN mkdir -p /srv/www
RUN npm install -g babel@5.6.14
RUN npm install -g npm@3

