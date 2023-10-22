# Stage 1 [Building the web application]
FROM node:alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG REACT_APP_ENV
ARG REACT_APP_MYSQL_SERVICE_ENDPOINT
ARG REACT_APP_MIRTH_SERVICE_ENDPOINT
ARG REACT_APP_RABBITMQ_SERVICE_ENDPOINT

ENV REACT_APP_ENV $REACT_APP_ENV
ENV REACT_APP_MYSQL_SERVICE_ENDPOINT $REACT_APP_MYSQL_SERVICE_ENDPOINT
ENV REACT_APP_MIRTH_SERVICE_ENDPOINT $REACT_APP_MIRTH_SERVICE_ENDPOINT
ENV REACT_APP_RABBITMQ_SERVICE_ENDPOINT $REACT_APP_RABBITMQ_SERVICE_ENDPOINT
RUN npm run build

#Stage 2 [Serving web app with nginx]
FROM nginx:1.25.2
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
