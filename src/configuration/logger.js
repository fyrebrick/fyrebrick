const { createLogger, format, transports,addColors } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const custom = {
    levels: {
      debug:5,
      redis:4,
      info:3,
      warn:2,
      error:1,
      fatal:0
    },
    colors: {
      debug: 'italic blue',
      redis: 'gray',
      info: 'green',
      warn: 'yellow',
      error: 'red',
      fatal: 'bold red'
    }
  };
const logger = createLogger({
    levels:custom.levels,
    format: combine(
      timestamp(),
      format.colorize(),
      format.json(),
      myFormat
    ),
    transports: [
      new transports.Console({level:'debug'}),
      new transports.File({ filename: '../../logs/combined.log' })]
  });

addColors({
    debug: 'italic blue',
    redis: 'gray',
    info: 'green',
    warn: 'yellow',
    error: 'red',
    fatal: 'bold red'
  });

module.exports = 
{
    logger
};