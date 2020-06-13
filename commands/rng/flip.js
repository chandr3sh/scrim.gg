const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class FlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'flip',
      aliases: ['toss', 'f'],
      group: 'rng',
      memberName: 'flip',
      description: 'RNG coin flip',
      args: [
        {
          prompt: '',
          key: 'head',
          type: 'string|user',
          default: () => 'Head',
        },
        {
          prompt: '',
          key: 'tail',
          type: 'string|user',
          default: () => 'Tail',
        },
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(msg, { head, tail }) {
    if (Math.floor(Math.random() * 2)) {
      const embed = new MessageEmbed()
        .setColor('#f1c40f')
        .setTitle(`🇭 ${head}`);
      return msg.embed(embed);
    }
    const embed = new MessageEmbed()
      .setColor('#f1c40f')
      .setTitle(`🇹 ${tail}`);
    return msg.embed(embed);
  }
};
