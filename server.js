var discord = require('discord.js');
var fs = require('fs');
var path = require('path');
var config = require('config');
var logger = require('./logging.js');
var app = require('./app.js');
var data = require('./data.js');
var cachedModules = [];
var cachedTriggers = [];
var client = new discord.Client();
function findArray(haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};
client.on('ready', () => {
  app.logChannel = client.channels.get(config.logChannel);
  app.guild = app.logChannel.guild;
  logger.info('Bot is now online and connected to server.');
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
      try {
        if (cachedModuleType == 'Command') {
          cachedModule.command(message);
        } else if (cachedModuleType == 'Quote') {
          cachedModules['quote.js'].command(message, cachedModule.reply);
        }
      } catch (err) { logger.error(err); }
      try {
        if (cmd != 'warn' && cachedModule.warn == true) {
          cachedModules['warn.js'].command(message);
        }
      } catch (err) { logger.error(err); }
    } else {
    }
  } else if (message.author.bot == false) {
    cachedTriggers.forEach(function(trigger) {
        if (trigger.roles == undefined || findArray(message.member.roles.map(function(x) { return x.name; }), trigger.roles)) {
          if (trigger.trigger(message) == true) {
              try {
                trigger.execute(message);
              } catch (err) { logger.error(err); }
          }
        }
    });
  }
});
cachedModules = [];
require("fs").readdirSync('./commands/').forEach(function(file) {
  if (path.extname(file) == '.js') {
    logger.info(`Loaded module: ${file}`);
    cachedModules[file] = require(`./commands/${file}`);
  }
});
cachedTriggers = [];
require("fs").readdirSync('./triggers/').forEach(function(file) {
  if (path.extname(file) == '.js') {
    logger.info(`Loaded trigger: ${file}`);
    cachedTriggers.push(require(`./triggers/${file}`));
  }
});
data.readWarnings();
data.readBans();
logger.info('Startup completed.');
client.login(config.clientLoginToken);
