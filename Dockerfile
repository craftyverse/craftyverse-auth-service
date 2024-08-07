FROM node:18-alpine

WORKDIR /usr/app

# Step 3: Copy the temporary .npmrc file to the container
COPY  .npmrc ./

COPY package.json .

RUN npm install

RUN rm -f .npmrc

COPY . .

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "run", "dev:local"]