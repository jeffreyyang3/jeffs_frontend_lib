FROM node:alpine
RUN apk add vim
WORKDIR "/app"
COPY ./package.json ./
RUN npm install -g webpack-dev-server webpack-cli webpack
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]