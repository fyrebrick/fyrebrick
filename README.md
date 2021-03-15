![Profile edit page](public/images/logo.svg)

# Fyrebrick
 A bricklink store manager. 
 
    - great orderpicking
    - quickly add new items
    - investigate your inventory for mistakes
    - quick search by remarks and update items

## Development and maintance.

The Fyrebrick project is created for a private client.

Therefore any maintance and/or development is going to be tailored to that client's need.

Any contribution is appreciated but, in order for the application to suit your needs better, its easier to fork the repository and change everything you want in your own fork.


## Issues

As said in the above section the Fyrebrick project is not created for a wide variety of clients with a wide variety of needs. 

You can create issues for fixes/bugs or features. I will try my best to create/fix them. But if the features are too far from the needs of the client I'm creating this project for, I will have to decline those features.

## Fyrebrick system includes:

 - [Fyrebrick](https://github.com/fyrebrick/fyrebrick) ([Docker](https://hub.docker.com/r/snakehead007/fyrebrick))
  The main frontend and backend.
 - [Fyrebrick-updater](https://github.com/fyrebrick/fyrebrick-updater) ([Docker](https://hub.docker.com/r/snakehead007/fyrebrick-updater))
  Process to automatically update all information from Bricklink
 - [Fyrebrick-updater-api](https://github.com/fyrebrick/fyrebrick-updater-api) ([Docker](https://hub.docker.com/r/snakehead007/fyrebrick-updater-api))
   The process to automatically update all information but has an external api.
 - [bricklink-plus api (package for bricklink)](https://github.com/fyrebrick/bricklink-plus) ([npm](https://www.npmjs.com/package/bricklink-plus))
  Package to easily handle Bricklink requests.
 - [fyrebrick-classification-scraper](https://github.com/fyrebrick/fyrebrick-classification-scraper)
  Scraper for lego images over the the most popular Lego sites.
 - [fyrebrick-classification-api](https://github.com/fyrebrick/fyrebrick-classification-api)
  Api with AI to classify a specific lego image.

## Run locally

 - install `docker-compose`
 - run the docker-compose.yml file via command: `docker-compose up`
 
 Fyrebrick located at [localhost:3000](http://localhost:3000)

 Mongo express is located at [localhost:8081](http://localhost:8081)
  - you will need to unblock yourself manually after logging in for the first time.

## Build from source

Clone the following repositories: 
 - [Fyrebrick](https://github.com/fyrebrick/fyrebrick)
 - [Fyrebrick-updater](https://github.com/fyrebrick/fyrebrick-updater)
 - [Fyrebrick-scraper](https://github.com/fyrebrick/fyrebrick-scraper)

Create for each repo a valid `.env` file.

Pull and run a `mongo` container or have one running.

Also pull and run a `redis` container or have one running.

Start each repository with `npm start` or `yarn start`

