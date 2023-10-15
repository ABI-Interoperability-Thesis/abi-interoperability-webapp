# BACKUP OF ORIGINAL DOCKERFILE FOR RUNNING SERVE
# # Use an official Node.js runtime as the base image
# FROM node:alpine

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install app dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Expose the port your app runs on
# EXPOSE 3000

# # Define the command to start your app
# CMD ["npm", "start"]

# NEW DOCKERFILE FOR RUNNING BUILT APP
# Stage 1
FROM node:alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#Stage 2
FROM nginx:1.25.2
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
