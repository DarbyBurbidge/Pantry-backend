FROM node:latest as development

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run tsc

FROM node:latest as production

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]