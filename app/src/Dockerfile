FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

# Bundle app source
COPY . /src

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules

# Install app dependencies
RUN cd /src; npm install

EXPOSE  8080
CMD ["node", "/src/app.js"]