FROM node:6
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY  package*.json ./
RUN npm install
COPY . . 
EXPOSE 4200
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
CMD /wait && npm start 