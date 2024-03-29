# Remember to build the react project and paste the build -> public folder.
# To build the current dockerfile:  docker build . -t any-name
# To run created image: docker run -d --name=any-run-name -p 5000:5000 any-image-name
# Use Node 18 alpine as parent image
FROM node:18-alpine

# Change the working directory on the Docker image to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the /app directory
COPY package*.json ./

# Install dependencies
RUN npm set strict-ssl false
RUN npm ci

# Copy the rest of project files into this image
COPY . .

RUN mkdir -p ./uploads/images

# Expose application port
EXPOSE 5000

# Start the application
CMD npm start