const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'util',
      memberName: 'ping',
      description: 'Ping the bot',
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(msg) {
    const m = await msg.say('Pinging...');
    const embed = new MessageEmbed()
      .setColor('#e74c3c')
      .setTitle(`Ping: ${m.createdTimestamp - msg.createdTimestamp}ms :ping_pong:`)
      .setDescription(`API Latency: ${Math.round(this.client.ws.ping)}ms`);
    return m.edit('', embed);
  }
};
