From node:12.16.3
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
ENV TOKEN_VALUE="${TOKEN_VALUE}"
ENV TOKEN_SECRET="${TOKEN_SECRET}"
ENV CONSUMER_SECRET="${CONSUMER_SECRET}"
ENV CONSUMER_KEY="${CONSUMER_KEY}"
CMD [ "npm", "start" ]
