const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class ShutdownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shutdown',
      aliases: ['q'],
      group: 'util',
      memberName: 'shutdown',
      description: 'Shutdown the bot',
      details: 'Shutdown process runnning the bot application. Access owner only.'
      ownerOnly: true,
      guarded: true,
    });
  }

  async run(msg) {
    try {
      await msg.embed(
        new MessageEmbed()
          .setColor('#e74c3c')
          .setTitle('🤚 Bye bye!'),
      );
      this.client.provider.destroy();
      this.client.destroy();
      process.exit(0);
    } catch (e) {
      msg.say(`Error: \`${e.message}\``);
    }
  }
};
