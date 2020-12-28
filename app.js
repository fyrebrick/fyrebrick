require('dotenv').config();
require("./src/helpers/constants/vars");
const express = require('express');
const database = require('./src/configuration/database');
const framework = require('./src/configuration/framework');
const app = express();
const {logger} = require("fyrebrick-helper").helpers;
const route = require('./src/routes/routes');
const requestLogging = require('./src/middleware/logging').requests;

database.start();
framework.start(app);
app.use('/',requestLogging,route);