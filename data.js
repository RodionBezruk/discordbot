var fs = require('fs');
var app = require('./app.js');
var logger = require('./logging.js');
function readWarnings() {
  fs.readFile('./data/discordWarnings.json', 'utf8', function (err, data) {
    if (err && err.code === 'ENOENT') { return; }
    if (err) { logger.error(err); }
    app.warnings = JSON.parse(data);
    logger.info('Loaded warnings file.');
  });
}
function readBans() {
  fs.readFile('./data/discordBans.json', 'utf8', function (err, data) {
    if (err && err.code === 'ENOENT') { return; }
    if (err) { logger.error(err); }
    app.bans = JSON.parse(data);
    logger.info('Loaded bans file.');
  });
}
function flushWarnings() {
  var warningsJson = JSON.stringify(app.warnings, null, 4);
  if (!fs.existsSync('./data/')) fs.mkdirSync('./data/');
  fs.writeFile('./data/discordWarnings.json', warningsJson, 'utf8', function (err) {
    if (err) return console.log(err);
  });
}
function flushBans() {
  var bansJson = JSON.stringify(app.bans, null, 4);
  if (!fs.existsSync('./data/')) fs.mkdirSync('./data/');
  fs.writeFile('./data/discordBans.json', bansJson, 'utf8', function (err) {
    if (err) return console.log(err);
  });
}
module.exports = { readWarnings: readWarnings, readBans: readBans, flushWarnings: flushWarnings, flushBans: flushBans }
