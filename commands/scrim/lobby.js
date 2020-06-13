/* eslint-disable no-restricted-syntax */
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class LobbyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lobby',
      aliases: ['l'],
      group: 'scrim',
      memberName: 'lobby',
      description: 'Add member(s) to scrim lobby',
      guildOnly: true,
      args: [
        {
          prompt: 'add/remove/show?',
          key: 'operation',
          type: 'string',
          oneOf: ['add', 'remove', 'a', 'r', 'rm', 'show', 's'],
        },
        {
          prompt: '',
          key: 'members',
          type: 'member',
          default: (msg) => [msg.member],
          infinite: true,
        },
      ],
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(msg, { operation, members }) {
    const inParty = [];
    const notInParty = [];

    const added = this.client.provider.get(msg.guild, 'scrim', undefined);

    if (added) {
      await Promise.all(added.map(async (id) => {
        const rank = this.client.provider.get(msg.guild, id, undefined);
        if (rank) {
          const member = await msg.guild.members.fetch(id);
          inParty.push({ member, rank });
        }
      }));
    }

    if (operation === 'add' || operation === 'a') {
      for (const m of members) {
        if (!inParty.find(({ member }) => member.id === m.id)) {
          const rank = this.client.provider.get(msg.guild, m.id, undefined);
          if (rank) { inParty.push({ member: m, rank }); } else { notInParty.push({ member: m, rank: null }); }
        }
      }
    } else if (operation === 'remove' || operation === 'rm' || operation === 'r') {
      for (const m of members) {
        const idx = inParty.findIndex(({ member }) => member.id === m.id);
        if (idx > -1) { notInParty.push(inParty.splice(idx, 1)[0]); }
      }
    }

    const embed = new MessageEmbed()
      .setColor('#3498db')
      .setTitle('Scrim Lobby');

    await this.client.provider.set(msg.guild, 'scrim', inParty.map(({ member }) => member.id));

    if (inParty.length > 0) {
      embed.addField('✅ Added', '--------------------------------------------------------------------------------', false);

      for (const { member, rank } of inParty) {
        embed.addField(`⭐ Rank: ${rank}`, member.user.tag, true);
      }

      if (notInParty.length > 0) {
        embed.addField('.', '.', false);
      }
    }

    if (notInParty.length > 0) {
      embed.addField('❌ Removed', '--------------------------------------------------------------------------------', false);

      for (const { member, rank } of notInParty) {
        embed.addField(`🚫 Rank: ${rank}`, member.user.tag, true);
      }
    }

    if ((inParty.length + notInParty.length) > 0) {
      return msg.embed(embed);
    }

    embed.setDescription('🙁 So empty in here');
    return msg.embed(embed);
  }
};
