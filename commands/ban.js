var discord = require('discord.js');
var app = require('../app.js');
var data = require('../data.js');
var logger = require('../logging.js');
var UserBan = require('../models/UserBan.js');
exports.roles = ['Admins', 'Moderators', 'Secret', 'CitraBot'];
exports.command = function(message) {
  message.mentions.users.map((user) => {
    var count = app.warnings.filter(function(x) { return x.id == user.id && !x.cleared }).length || 0;
    message.channel.sendMessage(`${user} You will now be banned from this channel.`).catch(function (error) {
      logger.error('Error sending #admin-log message.', error);
    });
    logger.info(`${message.author.username} ${message.author} has banned ${user.username} ${user}.`);
    app.logChannel.sendMessage(`${message.author} has banned ${user} [${count} + 1].`).catch(function (error) {
      logger.error('Error sending #admin-log message.', error);
    });
    message.guild.member(user).ban().catch(function (error) {
      logger.error(`Error banning ${user.username} ${user.id}.`, error);
    });
    app.bans.push(new UserBan(user.id, user.username, message.author.id, message.author.username, count));
    data.flushBans();
  });
}
