FROM node:carbon-alpine

COPY package.json /app/package.json
RUN npm install

COPY . /app

WORKDIR app
EXPOSE 8080
ENTRYPOINT ["npm", "start"]