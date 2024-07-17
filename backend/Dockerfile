# Backend Dockerfile for development
FROM node:14

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

# Install nodemon globally
RUN npm install -g nodemon

EXPOSE 5001

CMD ["nodemon", "server.js"]