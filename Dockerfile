FROM node:lts-alpine3.14 as build

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git openssh python3 g++ gcc make

WORKDIR /app

COPY package*.json ./

RUN npm install -g --force npm@latest typescript@latest yarn@latest

# Install all dependencies including devDependencies
RUN yarn install

COPY . .

RUN yarn build

# Production stage
FROM node:lts-alpine3.14

WORKDIR /app

RUN apk update && \
    apk upgrade && \
    apk add --no-cache python3 g++ gcc make git

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN yarn install --production

# Copy built files and server
COPY --from=build /app/build ./build
COPY --from=build /app/server.js .
COPY --from=build /app/api-server.js .

# Create temp directory for compiler output
RUN mkdir -p /app/temp && chmod 777 /app/temp

# Use single port for simplicity
EXPOSE 3001

ENV NODE_ENV production
ENV PORT 3001

CMD ["yarn", "prod"]