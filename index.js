/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');

const client = new Discord.Client({ messageCacheMaxSize: 300, disabledEvents: ['TYPING_START'] });
const config = require('./config');
const { version } = require('./package.json');
const emoji = require('./src/emoji');
require('./src/functions')(client);

client.config = config;
client.version = `v${version}`;
client.emoji = emoji;

fs.readdir('./events/', (err, files) => {
  if (err) {
    return console.error(err);
  }
  return files.forEach((file) => {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();
client.aliases = new Enmap();

fs.readdir('./commands/', (err, folders) => {
  if (err) {
    return console.error(err);
  }

  // Looping over all folders to load all commands
  for (let i = 0; i < folders.length; i++) {
    fs.readdir(`./commands/${folders[i]}/`, (error, files) => {
      if (error) {
        return console.error(error);
      }
      files.forEach((file) => {
        if (!file.endsWith('.js')) {
          return;
        }

        const props = require(`./commands/${folders[i]}/${file}`);
        const commandName = props.help.name;

        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);

        if (props.conf.aliases) {
          props.conf.aliases.forEach((alias) => {
            client.aliases.set(alias, commandName);
          });
        }

        client.enabledCmds.ensure(commandName, { enabled: true });
      });
    });
  }
});

client.levelCache = {};
for (let i = 0; i < config.permLevels.length; i++) {
  const thislvl = config.permLevels[i];
  client.levelCache[thislvl.name] = thislvl.level;
}

Object.assign(client, Enmap.multi(['settings', 'enabledCmds'], { ensureProps: true }));

client.login(config.token);
