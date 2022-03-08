const Discord = require('discord.js');
const { Client, Collection, Intents } = Discord;

const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
client.cooldowns = new Collection();

['eventsHandler', 'commandsHandler'].forEach(handler => {
	require(`./Handler/${handler}`)(client, Discord);
});

client.login(token);