const Discord = require('discord.js')
const { modlog, embedcolor, prefix } = require('../package.json')

module.exports = {
	name: 'unmute',
	description: 'Unmute een lid.',
	usage: `${prefix}unmute @User`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let user = message.mentions.users.first() || args[0]
		if(message.mentions.users.first()) user = user.id
		if(Number.isNaN(+user)) return message.reply('Het moet wel zijn mention/ID zijn...')
        let member = await message.guild.members.fetch(user).catch(()=>{ undefined })

        if(message.member.hasPermission("KICK_MEMBERS")){
            if(!member) return message.reply('Kon de gebruiker niet vinden!')
			//if(member.user.id == message.author.id) return message.reply('Je kan jezelf niet unmuten!')
			//if(member.hasPermission("ADMINISTRATOR")) return message.reply('Deze gebruiker heeft een hogere rol dan jou, of dezelfde rol.')
			//if(member.roles.highest.position > message.guild.me.roles.highest.position) return message.reply('Deze gebruiker heeft een hogere rol dan mij, of dezelfde rol.')

        let unmutelogembed = new Discord.MessageEmbed()
		    .setTitle(`Unmute - ${member.user.tag}`)
		    .addField('Gebruiker', member, true)
		    .addField('Moderator', message.author, true)
		    .setColor(embedcolor)
		    .setTimestamp()

        let unmuteembed = new Discord.MessageEmbed()
		    .setTitle(`:exclamation: Mute Opgeheven!`)
		    .setDescription(`${member} is ge-unmute!`)
		    .setColor(embedcolor)
		    .setTimestamp()
        
        let muterole = message.guild.roles.cache.find(r => r.name == "Muted")
        if(!muterole) return message.reply('Kon de Muted rol niet vinden!')

        if(member.roles.cache.get(muterole.id)){
        member.roles.remove(muterole)
        await member.user.send(`Je mag weer praten 🗣️`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
        message.channel.send(unmuteembed)
		message.guild.channels.cache.get(modlog).send(unmutelogembed)
        } else return message.reply('Deze gebruiker is niet gemute!')
        }
	},
};