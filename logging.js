var config = require('config');
var winston = require('winston');
var logdna = require('logdna');
var ip = require('ip');
var os = require("os");
winston.emitErrs = true;
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
          level: 'silly',
          handleExceptions: true,
          humanReadableUnhandledException: true,
          json: false,
          colorize: true
        })
    ],
    handleExceptions: true,
    exitOnError: false
});
if (process.env.NODE_ENV == 'production') {
    logger.add(winston.transports.Logdna, {
        level: 'info',
        key: config.logdnaKey,
        ip: ip.address(),
        hostname: os.hostname(),
        app: 'services-discordbot'
    });
    logger.info('[logging] Started LogDNA winston transport.');
}
module.exports = logger;
