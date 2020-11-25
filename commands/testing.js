var app = require('../app.js');
var logger = require('../logging.js');
exports.command = function(message) {
  var roleId = '254036987508424714';
  var alreadyJoined = app.guild.roles.get(roleId).members.find(function(member) { return member.id == message.member.id });
  if (alreadyJoined != null) {
    message.member.removeRole(roleId);
    message.reply('You are no longer part of the testing group.');
  } else {
    message.member.addRole(roleId);
    message.reply('You are now part of the testing group.');
  }
}
