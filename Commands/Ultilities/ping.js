const { Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['latency', 'lag'],
    permissions: 'ADMINISTRATOR',
    desscription: "Send the client's ping",
    cooldown: 5,
    execute(message, args, commandName, client, Discord){
        const response = new MessageEmbed()
        .setColor('RED')
        .setDescription(`🏓 ${client.ws.ping}ms`);
        message.channel.send({embeds: [response]});
    }
}