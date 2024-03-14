<h1>BackEnd-MernCourse</h1>

Project developed for the MERN-Udemy course.

Clone the FE project: https://github.com/MernCourse/Frontend
You can just head to the FE project and follow the build instructions.

Copy the contents of the **_build_** folder and paste those to the BE project **_public_** folder.

To build the project locally:
 
  **npm run dev**

To build and run the project on a Docker container:

 - **Dockerfile**: is meant to be used in a cloud-hosted environment.
 - Note: for the cloud container, remember to copy the environment vars named in the nodemon file.
 - **localDockerfile**: is meant to be used in a local docker container.
To build the localDockerfile:
 - To build the current dockerfile:
 - **docker build . -f localDockerFile -t any-name**
 - To run created image:
 - **docker run -d --name=any-run-name -p 5000:5000 any-image-name**
