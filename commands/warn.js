const Discord = require('discord.js')
const { modlog, embedcolor, prefix } = require('../package.json')
const db = require("quick.db")

module.exports = {
	name: 'warn',
	description: 'Waarschuw een lid.',
	usage: `${prefix}warn @User <Reden>`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let user = message.mentions.users.first() || args[0]
		if(message.mentions.users.first()) user = user.id
		if(Number.isNaN(+user)) return message.reply('Het moet wel zijn mention/ID zijn...')
		let member = await message.guild.members.fetch(user).catch(()=>{ undefined })
		args.shift()
		let reason = args.join(" ") || "Geen reden opgegeven"

		if(message.member.hasPermission("MANAGE_MESSAGES")){
			if(!member) return message.reply('Kon de gebruiker niet vinden!')
			if(member.user.id == message.author.id) return message.reply('Je kan jezelf geen waarschuwing geven!')
			if(member.hasPermission("ADMINISTRATOR")) return message.reply('Deze gebruiker heeft een hogere rol dan jou, of dezelfde rol.')
			if(member.roles.highest.position > message.guild.me.roles.highest.position) return message.reply('Deze gebruiker heeft een hogere rol dan mij, of dezelfde rol.')

			db.add(`warns_${message.guild.id}_${member.id}`, 1)

			let warnembed = new Discord.MessageEmbed()
				.setTitle(`:white_check_mark: Success!`)
				.setDescription(`${member} is gewaarschuwd!`)
				.addField('Reden', reason)
				.setColor(embedcolor)
				.setTimestamp()

			let warnlogembed = new Discord.MessageEmbed()
				.setTitle(`Warning - ${member.user.tag}`)
				.addField('Gebruiker', member, true)
				.addField('Moderator', message.author, true)
				.addField('Reden', reason, true)
				.setColor(embedcolor)
				.setTimestamp()

			message.channel.send(warnembed);
			await member.user.send(`Je bent zojuist gewaarschuwd door ${message.author} voor: **${reason}**`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
			message.guild.channels.cache.get(modlog).send(warnlogembed)
			// Database stuff
		} else return message.reply('Jij kan dit niet doen!')
	},
};