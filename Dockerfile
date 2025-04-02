# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the port your app will run on (3000 by default)
EXPOSE 8080

# Define the command to run the application
CMD ["npm", "start"]
