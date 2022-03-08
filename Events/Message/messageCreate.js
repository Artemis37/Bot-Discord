const { time } = require('@discordjs/builders');
const { Client, Message, MessageEmbed, Collection } = require('discord.js');
const prefix = process.env.prefix;

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    async execute(message, client, Discord) {
        console.log(message);
        if(!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLocaleLowerCase();
        const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(command.permissions){
            const authorPerms = message.channel.permissionsFor(message.author);
            if(!authorPerms || !authorPerms.has(command.permission)){
                const error = new MessageEmbed()
                .setColor('RED')
                .setDescription(`You don't have permission to use this command: ${command.name}`);
                message.channel.send({embeds: [error]})
                .then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 3000);
                });
            }
        }

        const { cooldowns } = client;
        if(!cooldowns.has(command.name)){
            cooldowns.set(command.name, new Collection());
        }

        const now = Date().now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000;

        if(timestamps.has(message.author.id)){
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if(now < expirationTime){
                const timeLeft = (expirationTime - now) / 1000;
                const timeLeftEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`Please another time ${timeLeft.toFixed(1)} more second to be to run this command again!`);
                return message.channel.send({embeds: [timeLeftEmbed]})
                .then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 2000);
                });
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args, commandName, client, Discord);
        } catch (error) {
            console.log(error);
            const ErrorEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`An error has occured while executing the command: ${command.name}`);
            message.channel.send({embeds: [ErrorEmbed]});
        }
    }
}