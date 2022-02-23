FROM node:14

WORKDIR /var/www

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 3002

CMD ["npm", "run", "server"] 