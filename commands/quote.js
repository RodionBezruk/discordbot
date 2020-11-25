var app = require('../app.js');
var logger = require('../logging.js');
exports.roles = ['Admins', 'Moderators', 'Secret'];
exports.command = function(message, reply) {
  let replyMessage = 'Hello.';
  if (reply == null) { replyMessage = message.content.substr(message.content.indexOf(' ') + 1); }
  else { replyMessage = `${message.mentions.users.map(function (user) { return `${user}`; })} ${reply}`; }
  message.channel.sendMessage(replyMessage).catch(function (error) {
      logger.error('Unable to send reply message to quote.', error);
  });
}
