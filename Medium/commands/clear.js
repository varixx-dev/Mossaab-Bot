const Discord = require('discord.js')
const { embedcolor, prefix } = require('../package.json')

module.exports = {
	name: 'clear',
	description: 'Verwijder alle waarschuwingen van een lid.',
	usage: `${prefix}clear @User`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let user = message.mentions.users.first() || args[0] || message.author.id
		if(message.mentions.users.first()) user = user.id
		if(Number.isNaN(+user)) return message.reply('Het moet wel zijn mention/ID zijn...')
		let member = await message.guild.members.fetch(user).catch(()=>{ undefined })

		if(message.member.hasPermission('BAN_MEMBERS')){
			if(!member) return message.reply('Kon de gebruiker niet vinden!')

		let clearembed = new Discord.MessageEmbed()
			.setTitle(`:white_check_mark: Success`)
			.setDescription(`Alle waarschuwingen van ${member} zijn verwijderd.`)
			.setColor(embedcolor)
			.setTimestamp()

			//Database fetching stuff and historyembed.addField() stuff...
			message.channel.send(clearembed)
		} else return message.reply('Jij kan dit niet doen!')
	},
};