Bricklink webservice
--
This node.js server is a simple tool to use the authentication for the Bricklink API. Login using your Google account (ensures security) and your Bricklink API keys

To view what our hosted database keeps, look below at Database.  We use no analytics, only session cookies. Still in progress.  (the hosted website does not have a service policy nor a privacy policy yet.)
### How to use
You can use the api by making a request on `http://[hostname]/api/[api_call]` , all request types are premitted 

Requests on `http://[hostname]/[..]` will give you an overview in html/bootstrap. some function have already been added. (orders, inventory,search inventory, search status)

### Setup
You can either run using node.js or docker.

- ##### Nodejs
    Rename the `.env.bak` file to `.env`.
    
    Fill in the `.env` file with the correct credentials (GOOGLE_CLIENT_SECRET,GOOGLE_CLIENT_ID and a SESSION_SECRET).
    
    This means you need create a project on [apis.google.com](https://console.developers.google.com/apis/)
    
    e.g.: `CONSUMER_KEY="99B44795D4C168E795D4C168E795D700"`
    
    And start the server by running `nmp install;npm start`
    
### Database
Our hosted database only keeps:
##### User:
* GoogleId
* Google-email
* name 
* your Bricklink keys
##### Orders:
* Order id's 
* Item id's (in the order)
