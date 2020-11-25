var app = require('../app.js');
var data = require('../data.js');
var logger = require('../logging.js');
exports.roles = ['Admins', 'Moderators'];
exports.command = function(message) {
  message.mentions.users.map((user) => {
    var count = app.warnings.filter(function(x) { return x.id == user.id && !x.cleared }).length || 0;
    count.forEach(function(warning) {
      warning.cleared = true;
    });
    data.flushWarnings();
    message.channel.sendMessage(`${user}, your warnings have been cleared.`);
    app.logChannel.sendMessage(`${message.author} has cleared all warnings for ${user} [${count}].`);
  });
}
