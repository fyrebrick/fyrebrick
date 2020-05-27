From node:12.16.3
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
ENV TokenValue="${TokenValue}"
ENV TokenSecret="${TokenSecret}"
ENV ConsumerSecret="${ConsumerSecret}"
ENV ConsumerKey="${ConsumerKey}"
ENV StoreName="${StoreName}"
ENV SellerName="${SellerName}"
CMD [ "npm", "start" ]
