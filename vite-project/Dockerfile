FROM node:latest

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npx", "serve", "-s","dist"]
