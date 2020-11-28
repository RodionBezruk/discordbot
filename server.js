var discord = require('discord.js');
var fs = require('fs');
var path = require('path');
var config = require('config');
var logger = require('./logging.js');
var app = require('./app.js');
var data = require('./data.js');
var cachedModules = [];
var client = new discord.Client();
function findArray(haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};
client.on('ready', () => {
  require("fs").readdirSync('./commands/').forEach(function(file) {
    cachedModules[file] = require(`./commands/${file}`);
  });
  app.logChannel = client.channels.get(config.logChannel);
  app.guild = app.logChannel.guild;
  data.readWarnings();
  data.readBans();
  logger.info('Startup complete. Bot is now online and connected to server.');
});
client.on('message', message => {
  if (message.author.bot && message.content.startsWith('.ban') == false) { return; }
  if (message.guild == null) {
    logger.info(`${message.author.username} ${message.author} [PM]: ${message.content}`);
    app.logChannel.sendMessage(`${message.author} [PM]: ${message.content}`);
    message.reply(config.pmReply);
    return;
  }
  logger.verbose(`${message.author.username} ${message.author} [Channel: ${message.channel}]: ${message.content}`);
  if (message.content.startsWith(config.commandPrefix)) {
    let cmd = message.content.split(' ')[0].slice(1);
    let cachedModule = cachedModules[`${cmd}.js`];
    let cachedModuleType = 'Command';
    if (cachedModule == null) { cachedModule = config.quotes[cmd]; cachedModuleType = 'Quote'; }
    if (cachedModule) {
      if (cachedModule.roles != undefined && findArray(message.member.roles.map(function(x) { return x.name; }), cachedModule.roles) == false) {
        app.logChannel.sendMessage(`${message.author} attempted to use admin command: ${message.content}`);
        logger.info(`${message.author.username} ${message.author} attempted to use admin command: ${message.content}`)
        return false;
      }
      logger.info(`${message.author.username} ${message.author} [Channel: ${message.channel}] triggered command: ${message.content}`);
      message.delete();
      if (cachedModuleType == 'Command') {
        cachedModule.command(message);
      } else if (cachedModuleType == 'Quote') {
        cachedModules['quote.js'].command(message, cachedModule.reply);
      }
      if (cmd != 'warn' && cachedModule.warn == true) {
        cachedModules['warn.js'].command(message);
      }
    } else {
    }
  }
});
client.login(config.clientLoginToken);
