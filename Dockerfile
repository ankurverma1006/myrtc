# pull base image
FROM node:13.12.0-alpine

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /app

# install app dependencies
COPY package*.json ./
RUN npm install
# Copies everything over to Docker environment
COPY . ./

# start app
RUN npm run build

# install app dependencies
RUN npm install -g serve

# Uses port which is used by the actual application
EXPOSE 5000

#Serve Build
CMD [ "serve", "-s", "build" ]


