const Discord = require('discord.js')
const { embedcolor, prefix } = require('../package.json')

module.exports = {
	name: 'history',
	description: 'Bekijk een lid zijn/haar moderatie geschiedenis, of die van jezelf.',
	usage: `${prefix}history @User`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let user = message.mentions.users.first() || args[0] || message.author.id
		if(message.mentions.users.first()) user = user.id
		if(Number.isNaN(+user)) return message.reply('Het moet wel zijn mention/ID zijn...')
		let member = await message.guild.members.fetch(user).catch(()=>{ undefined })

		if(message.member.hasPermission('MANAGE_MESSAGES')){
			if(!member) return message.reply('Kon de gebruiker niet vinden!')

		let historyembed = new Discord.MessageEmbed()
			.setTitle(`:scroll: Moderatie Geschiedenis`)
			.setDescription(`De moderatie geschiedenis van ${member}`)
			.setColor(embedcolor)
			.setTimestamp()

			//Database fetching stuff and historyembed.addField() stuff...
			message.channel.send(historyembed)
		} else return message.reply('Jij kan dit niet doen!')
	},
};