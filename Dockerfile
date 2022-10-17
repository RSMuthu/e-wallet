FROM node:16-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# installation for production
RUN npm install --production

# Bundle app source
COPY . .

FROM node:16-alpine AS app

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .

EXPOSE 3000
CMD [ "node", "./bin/www" ]
