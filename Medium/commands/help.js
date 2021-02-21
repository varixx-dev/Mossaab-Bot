const Discord = require('discord.js')
const { embedcolor, prefix } = require('../package.json')

module.exports = {
	name: 'help',
	description: 'Alle commando\'s van de bot.',
    usage: `${prefix}help`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		const { commands } = message.client;

		if(message.member.hasPermission('MANAGE_MESSAGES')){

		let helpembed = new Discord.MessageEmbed()
			.setTitle(`Bot Commando's`)
			.setDescription('[] = Required\n<> = Optioneel')
			.setColor(embedcolor)
			.setTimestamp()

			commands.forEach(command => {
				helpembed.addField(command.name, `**Beschrijving:** ${command.description}\n**Gebruik:** ${command.usage}`)
			})
			message.channel.send(helpembed)
		} else return message.reply('Jij kan dit niet doen!')
	},
};