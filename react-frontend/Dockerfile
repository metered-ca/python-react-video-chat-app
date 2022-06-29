# syntax=docker/dockerfile:1
FROM node:14.19
ENV NODE_ENV=production
ENV API_LOCATION="http://localhost:5000"
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD [ "npm", "run", "start" ]
EXPOSE 3000/tcp