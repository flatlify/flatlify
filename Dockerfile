FROM node:12

# Create app directory
ARG NPM_TOKEN
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .npmrc /app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /app

EXPOSE 3000
RUN git init
CMD ["npm", "run", "test:server"]