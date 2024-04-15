# Development stage
FROM node:18 AS development


ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]

# Production stage
FROM node:18 AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["npm", "start"]