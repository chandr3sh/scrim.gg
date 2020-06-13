const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      aliases: ['rl'],
      group: 'rng',
      memberName: 'roll',
      description: 'RNG dice roll',
      args: [
        {
          prompt: '',
          key: 'max',
          type: 'integer',
          default: () => 6,
        },
        {
          prompt: '',
          key: 'min',
          type: 'integer',
          default: () => 1,
        },
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(msg, { max, min }) {
    const roll = min + Math.floor(Math.random() * (max - min + 1));
    return msg.embed(new MessageEmbed().setColor('#f1c40f').setTitle(`🎲 ${roll}`));
  }
};
