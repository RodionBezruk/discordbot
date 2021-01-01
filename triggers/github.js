var request = require('request');
var app = require('../app.js');
var logger = require('../logging.js');
var regex = /[^\<]\#\d+[^\>]/;
exports.trigger = function(message) {
  return regex.test(message.content);
}
exports.execute = function(message) {
  let match = regex.exec(message.content);
  if (match) {
    let url = `https:
    logger.info(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        message.channel.sendMessage(`Github Pull Request: ${url}`);
      } else {
      }
    });
  }
}
