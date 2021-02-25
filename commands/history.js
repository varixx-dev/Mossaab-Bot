const Discord = require('discord.js')
const fs = require("fs");
const db = require("quick.db");
const { embedcolor, prefix } = require('../package.json')
let warns = JSON.parse(fs.readFileSync("./history.json", "utf8"));
let mutes = JSON.parse(fs.readFileSync("./history.json", "utf8"));
let kicks = JSON.parse(fs.readFileSync("./history.json", "utf8"));
let bans = JSON.parse(fs.readFileSync("./history.json", "utf8"));

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

			let warns = db.fetch(`warns_${message.guild.id}_${member.id}`)
			if (warns == null) warns = "0";

			let bans = db.fetch(`bans_${message.guild.id}_${member.id}`)
			if (bans == null) bans = "0";

			let mutes = db.fetch(`mutes_${message.guild.id}_${member.id}`)
			if (mutes == null) mutes = "0";

			let kick = db.fetch(`kick_${message.guild.id}_${member.id}`)
			if (kick == null) kick = "0";

			let historyembed = new Discord.MessageEmbed()
				.setTitle(`:scroll: Moderatie Geschiedenis`)
				.setDescription(`De moderatie geschiedenis van ${member}`)
				.addField("Warns:", `${warns}`)
				.addField("mutes:", `${mutes}`)
				.addField("Kickes:", `${kick}`)
				.addField("Bans:", `${bans}`)
				.setColor(embedcolor)
				.setTimestamp()

			//Database fetching stuff and historyembed.addField() stuff...
			message.channel.send(historyembed)
		} else return message.reply('Jij kan dit niet doen!')
	},
};