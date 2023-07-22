FROM node:16-alpine
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --legacy-peer-deps --force
COPY . ./
EXPOSE 8000
CMD [ "npm","start" ]