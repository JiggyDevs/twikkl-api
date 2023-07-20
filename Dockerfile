FROM node:16-alpine as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --legacy-peer-deps --force
COPY . ./
RUN npm run build

FROM node:16-alpine as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./dist
# COPY --from=ts-compiler /usr/app/fonts ./fonts
RUN npm install --legacy-peer-deps --force --only=production
EXPOSE 8800
CMD ["node", "./dist/main"]