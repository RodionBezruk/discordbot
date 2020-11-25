var winston = require('winston');
winston.emitErrs = true;
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './server.log',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: true,
            maxsize: 5242880, 
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
module.exports = logger;
