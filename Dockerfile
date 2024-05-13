FROM node:slim
WORKDIR /src
COPY . /src
RUN npm install
EXPOSE 3000
CMD nodemon app.js