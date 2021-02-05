FROM node:14

WORKDIR /st_equivalencias

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8876

CMD npm start