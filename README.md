Bricklink webservice
--
This node.js server is a simple tool to use the authentication for the Bricklink API.

###Setup
You can either run using node.js or docker.

- #####Nodejs
    Fill in the `.env` file with the correct credentials
    
    e.g.: `CONSUMER_KEY="99B44795D4C168E795D4C168E795D700"`
    
    And start the server by running `nmp install;npm start`
    
- #####Docker
    ```bash
   docker run -dp 3000:3000 snakehead/bricklink-webservice -e "TOKEN_VALUE=YOUR_TOKEN_VALUE" -e "TOKEN_SECRET=YOUR_TOKEN_SECRET" -e "CONSUMER_SECRET=YOUR_CONSUMER_SECRET" -e "CONSUMER_KEY=YOUR_CONSUMER_KEY"
    ```
