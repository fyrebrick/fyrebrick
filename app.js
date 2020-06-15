const path = require('path');
require('dotenv').config(path.resolve(process.cwd(), '.env'));
const {load} = require('./src/loaders/index');
const express = require('express');
const apiRoutes = require('./src/routes/api');
const mainRoutes = require('./src/routes/index');
const settingsRoutes = require('./src/routes/settings');
const {checkSignIn} = require('./src/middlewares/index');
const app = express();
const start = async () => {
  if (!process.env.PORT) throw new Error(".env file not found, or wrong path");
  await load(app);
  console .log("[INFO]: Server started");
  app.use('/',mainRoutes);
  app.use('/settings',checkSignIn,settingsRoutes);
  app.use('/api',checkSignIn,apiRoutes);
};

start();
