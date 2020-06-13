/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class MatchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'match',
      aliases: ['m', 'mm'],
      group: 'scrim',
      memberName: 'match',
      description: 'Divide "scrim lobby" members into two groups',
      guildOnly: true,
      args: [
        {
          prompt: '',
          key: 'skillMultiplier',
          type: 'integer|float',
          default: () => 2,
        },
      ],
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  async run(msg, { skillMultiplier }) {
    const scrimLobby = [];

    const added = this.client.provider.get(msg.guild, 'scrim', undefined);

    if (added) {
      await Promise.all(added.map(async (id) => {
        const rank = this.client.provider.get(msg.guild, id, undefined);
        if (rank) {
          const member = await msg.guild.members.fetch(id);
          scrimLobby.push({ member, rank });
        }
      }));
    }

    const embed = new MessageEmbed()
      .setColor('#3498db')
      .setTitle('Scrim Match');

    if (scrimLobby.length > 1) {
      const powerSet = (arr) => arr.reduce(
        (subsets, value) => subsets.concat(
          subsets.map((set) => [value, ...set]),
        ),
        [[]],
      );

      const universalSet = scrimLobby
        .map(({ member, rank }) => ({ username: member.user.tag, rank }));

      const neSplitPerm = _.uniqWith(powerSet(universalSet)
        .map((A) => ({ A, B: _.differenceWith(universalSet, A, _.isEqual) }))
        .filter(({ A, B }) => A.length && B.length),
      (a, b) => _.isEqual(a.A, b.B) || _.isEqual(a.B, b.A));

      const rankedTeamPerm = neSplitPerm.map(({ A, B }) => {
        const rankA = A.map((x) => x.rank).reduce((a, b) => a + b, 0);
        const rankB = B.map((x) => x.rank).reduce((a, b) => a + b, 0);
        const rankDiff = Math.abs(rankA - rankB);
        const numDiff = Math.abs(A.length - B.length);

        return {
          A, B, rankA, rankB, rankDiff, numDiff,
        };
      }).sort((x, y) => (x.rankDiff - y.rankDiff) * skillMultiplier + (x.numDiff - y.numDiff));

      if (rankedTeamPerm.length > 0) {
        const teamA = rankedTeamPerm[0].A;
        const teamB = rankedTeamPerm[0].B;

        const teamARank = rankedTeamPerm[0].rankA;
        const teamBRank = rankedTeamPerm[0].rankB;

        embed.addField(`🅰️ Team Rank: ${teamARank}`, '--------------------------------------------------------------------------------', false);
        for (const { username, rank } of teamA) { embed.addField(`⭐ Rank: ${rank}`, username, true); }
        embed.addField('.', '.', false);
        embed.addField(`🅱️ Team Rank: ${teamBRank}`, '--------------------------------------------------------------------------------', false);
        for (const { username, rank } of teamB) { embed.addField(`⭐ Rank: ${rank}`, username, true); }

        return msg.embed(embed);
      }
    }

    embed.setDescription('ℹ️ Matchmaking requires 2 (or more) players in lobby');
    return msg.embed(embed);
  }
};
