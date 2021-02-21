const Discord = require('discord.js')
const { embedcolor, prefix } = require('../package.json')

module.exports = {
	name: 'announce',
	description: 'Announce een bericht in de server!',
	usage: `${prefix}announce #Channel [Message]`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let channels = message.mentions.channels.first() || args[0]
		if(message.mentions.channels.first()) channels = channels.id
		if(Number.isNaN(+channels)) return message.reply('Het moet wel zijn mention/ID zijn...')
		let channel = message.guild.channels.cache.get(channels)
		args.shift()
		let announcement = args.join(" ")

		if(message.member.hasPermission('MANAGE_MESSAGES')){
			if(!channel) return message.reply('Kon het kanaal niet vinden!')
			if(!announcement) return message.reply('Hier kan ik niks mee... Wat moet ik nou zeggen?')

		let announceembed = new Discord.MessageEmbed()
			.setTitle(`Announcement`)
			.setDescription(announcement)
			.setColor(embedcolor)
			.setFooter(`Uitgevoerd Door ${message.author.tag}`)
			.setTimestamp()
			channel.send(announceembed)
		} else return message.reply('Jij kan dit niet doen!')
	},
};