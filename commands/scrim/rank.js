const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class RankCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rank',
      aliases: ['r'],
      group: 'scrim',
      memberName: 'rank',
      description: 'Get skill point of a guild member',
      guildOnly: true,
      args: [
        {
          prompt: '',
          key: 'arg1',
          type: 'member|integer',
          default: (msg) => msg.member,
        },
        {
          prompt: '',
          key: 'arg2',
          type: 'member|integer',
          default: (msg) => msg.member,
        },
      ],
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  async run(msg, { arg1, arg2 }) {
    let getRank = false;
    let setRank = false;
    let rank = 0;
    let member;

    if (arg1.id === msg.author.id && arg2.id === msg.author.id) {
      getRank = true;
      member = arg1;
    } else if (typeof arg1 === 'number' && arg2.id === msg.author.id) {
      setRank = true;
      member = arg2;
      rank = arg1;
    } else if (await msg.guild.members.fetch(arg1) && arg2.id === msg.author.id) {
      getRank = true;
      member = arg1;
    } else if (await msg.guild.members.fetch(arg1) && typeof arg2 === 'number') {
      setRank = true;
      member = arg1;
      rank = arg2;
    } else if (await msg.guild.members.fetch(arg2) && typeof arg1 === 'number') {
      setRank = true;
      member = arg2;
      rank = arg1;
    }

    if (getRank && member) {
      rank = this.client.provider.get(msg.guild, member.id, undefined);
      if (rank) {
        await msg.embed(new MessageEmbed()
          .setColor('#3498db')
          .setTitle(member.user.tag)
          .setDescription(`⭐ Rank: ${rank}`));
      } else {
        await msg.embed(new MessageEmbed()
          .setColor('#3498db')
          .setTitle(member.user.tag)
          .setDescription('🚫 Rank: null'));
      }
    } else if (setRank && member) {
      if (rank < 1 || rank > 20) {
        await msg.reply('Invalid value: Rank has range 1-20');
      } else {
        try {
          await this.client.provider.set(msg.guild, member.id, rank);
          await msg.embed(new MessageEmbed()
            .setColor('#3498db')
            .setTitle(member.user.tag)
            .setDescription(`⭐ Rank: ${rank}`));
        } catch (e) {
          await msg.reply(`Error: ${e.message}`);
        }
      }
    }
  }
};
