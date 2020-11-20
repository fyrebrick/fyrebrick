const path = require('path');

require('dotenv').config(path.resolve(process.cwd(), '.env'));
const {load} = require('./src/loaders/index');
const express = require('express');
const rootRoutes = require('./src/routes');
const app = express();
const scheduler = require('./src/schedules');

const start = async () => {
  if (!process.env.PORT) throw new Error(".env file not found, or wrong path");
  await load(app);
  console .log("[INFO]: Server started"); 
  app.use('/',rootRoutes);
  scheduler.start();
};

start();
