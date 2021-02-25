const Discord = require('discord.js')
const { modlog, embedcolor, prefix } = require('../package.json')
const fs = require("fs");
const db = require("quick.db");

module.exports = {
	name: 'kick',
	description: 'Verwijder een lid van de server.',
	usage: `${prefix}kick @User <Reden>`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let user = message.mentions.users.first() || args[0]
		if(message.mentions.users.first()) user = user.id
		if(Number.isNaN(+user)) return message.reply('Het moet wel zijn mention/ID zijn...')
		let member = await message.guild.members.fetch(user).catch(()=>{ undefined })
		args.shift()
		let reason = args.join(" ") || "Geen reden opgegeven."

		db.add(`warns_${message.guild.id}_${member.id}`, 1)

		if(message.member.hasPermission("KICK_MEMBERS")){
			if(!member) return message.reply('Kon de gebruiker niet vinden!')
			if(member.user.id == message.author.id) return message.reply('Je kan jezelf niet verwijderen van de server!')
			if(member.hasPermission("ADMINISTRATOR")) return message.reply('Deze gebruiker heeft een hogere rol dan jou, of dezelfde rol.')
			if(member.roles.highest.position > message.guild.me.roles.highest.position) return message.reply('Deze gebruiker heeft een hogere rol dan mij, of dezelfde rol.')

			let kickembed = new Discord.MessageEmbed()
				.setTitle(`:white_check_mark: Success!`)
				.setDescription(`${member} is verwijderd van de server!`)
				.addField('Reden', reason)
				.setColor(embedcolor)
				.setTimestamp()

			let kicklogembed = new Discord.MessageEmbed()
				.setTitle(`Verwijdering - ${member.user.tag}`)
				.addField('Gebruiker', member, true)
				.addField('Moderator', message.author, true)
				.addField('Reden', reason, true)
				.setColor(embedcolor)
				.setTimestamp()

			if(member.kickable){
				member.kick(`Door ${message.author.tag} met reden: ${reason}`)
					.catch(console.error);


				message.channel.send(kickembed);
				await member.user.send(`Je bent zojuist verwijderd van __${message.guild.name}__ door ${message.author} voor: **${reason}**`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
				message.guild.channels.cache.get(modlog).send(kicklogembed)
				// Database stuff
			} else return message.reply('Deze gebruiker kan niet worden verwijderd van de server!')
		} else return message.reply('Jij kan dit niet doen!')
	},
};