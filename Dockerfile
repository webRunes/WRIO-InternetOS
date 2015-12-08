FROM ubuntu:15.04
MAINTAINER denso.ffff@gmail.com

RUN apt-get update && apt-get install -y nodejs npm mc libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++ git

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g http-server browserify gulp
RUN mkdir -p /srv/www

COPY package.json /srv/www/package.json
RUN cd /srv/www/ && npm install --unsafe-perm
COPY . /srv/www/

EXPOSE 3000
#RUN cd /srv/www/ && npm run build
CMD cd /srv/www/ && hs -p 3000 && npm run watchDOCKER