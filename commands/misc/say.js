module.exports.run = async (client, message, args, level, Discord) => {
  message.channel.send(args.join(' '));
  message.delete();
};

module.exports.conf = {
  guildOnly: false,
  aliases: [],
  permLevel: 'Mod',
  args: 1,
};

module.exports.help = {
  name: 'say',
  category: 'misc',
  description: 'Speaks as the bot',
  usage: 'say <message>',
};
