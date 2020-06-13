/* eslint-disable no-console */
const { CommandoClient, SyncSQLiteProvider } = require('discord.js-commando');
const Database = require('better-sqlite3');
const path = require('path');

const { commandPrefix, owner, token } = require('./config.json');

const databaseProvider = new SyncSQLiteProvider(
  new Database('database.sqlite3', { error: console.error }),
);

const client = new CommandoClient({ commandPrefix, owner });

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerGroups([
    ['scrim', 'Scrimmage'],
    ['util', 'Utility'],
    ['rng', 'RNG'],
  ])
  .registerDefaultCommands({
    eval: false, ping: false,
  })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  client.setProvider(databaseProvider);
  console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
  console.log(`Bot is watching ${client.users.cache.size} user(s), in ${client.channels.cache.size} channel(s) of ${client.guilds.cache.size} guild(s)`);

//   client.user.setPresence({
//     status: 'online',
//     activity: {
//       type: 'WATCHING',
//       name: `${client.guilds.cache.size || 0} guild(s), ${commandPrefix}help`,
//     },
//   });
});

client.on('error', console.error);
client.login(token);
