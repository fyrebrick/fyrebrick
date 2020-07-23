const path = require('path');
require('dotenv').config(path.resolve(process.cwd(), '.env'));
const {load} = require('./src/loaders/index');
const express = require('express');
const apiRoutes = require('./src/routes/api');
const mainRoutes = require('./src/routes/index');
const settingsRoutes = require('./src/routes/settings');
const dbRoutes = require('./src/routes/db');
const statsRoutes = require('./src/routes/stats');
const {checkSignIn} = require('./src/middlewares/index');
const app = express();
const statsUpdater = require('./src/schedules/statsUpdater');
const start = async () => {
  if (!process.env.PORT) throw new Error(".env file not found, or wrong path");
  await load(app);
  console .log("[INFO]: Server started");
  app.use('/',mainRoutes);
  app.use('/settings',checkSignIn,settingsRoutes);
  app.use('/db',checkSignIn,dbRoutes)
  app.use('/api',checkSignIn,apiRoutes);
  app.use('/stats',checkSignIn,statsRoutes);
  statsUpdater.default();
};

start();
