# node/docker best practices:  https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
FROM node:10

# folder where the project code is going to live
WORKDIR /usr/src/app

# copy files/folders needed for deployment
COPY index.js index.js
COPY package-lock.json package-lock.json
COPY package.json package.json
COPY json.proto json.proto

# git proxy needed because during npm install the dependency gautamsi/node-ntlm-client uses git
# RUN git config --global http.proxy http://webproxy.us164.corpintra.net:8080/

# populate the node_modules dependencies folder (note: npm install must be done in the same type of environment the app is run in)
RUN npm install --proxy http://webproxy.us164.corpintra.net:8080/ --https-proxy http://webproxy.us164.corpintra.net:8080/


# command to start the nuxt server
CMD ["node", "./index.js"]

