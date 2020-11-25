var discord = require('discord.js');
var app = require('../app.js');
var data = require('../data.js');
var logger = require('../logging.js');
var UserWarning = require('../models/UserWarning.js');
exports.roles = ['Admins', 'Moderators', 'Secret', 'Helpers'];
exports.command = function(message) {
  message.mentions.users.map((user) => {
    var count = app.warnings.filter(function(x) { return x.id == user.id && !x.cleared }).length || 0;
    message.channel.sendMessage(`${user} You have been warned. Additional infractions may result in a ban.`).catch(function (error) {
      logger.error('Error sending #admin-log message.', error);
    });
    logger.info(`${message.author.username} ${message.author} has warned ${user.username} ${user} [${count} + 1].`);
    app.logChannel.sendMessage(`${message.author} has warned ${user} [${count} + 1].`).catch(function (error) {
      logger.error('Error sending #admin-log message.', error);
    });
    app.warnings.push(new UserWarning(user.id, user.username, message.author.id, message.author.username, count));
    data.flushWarnings();
    if (count + 1 >= 3) {
      app.logChannel.sendMessage(`.ban ${user}`);
    }
  });
}
