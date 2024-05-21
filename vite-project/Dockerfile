FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps
RUN apt update && apt install python3

COPY . .

RUN npm run build
RUN cd ./dist

EXPOSE 3000

CMD ["python", "-m", "http.server","3000"]
