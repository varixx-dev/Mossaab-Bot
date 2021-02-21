const Discord = require('discord.js')
const { modlog, embedcolor, prefix } = require('../package.json')

module.exports = {
	name: 'ban',
	description: 'Verban een lid.',
	usage: `${prefix}ban @User <Reden>`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let user = message.mentions.users.first() || args[0]
		if(message.mentions.users.first()) user = user.id
		if(Number.isNaN(+user)) return message.reply('Het moet wel zijn mention/ID zijn...')
		let member = await message.guild.members.fetch(user).catch(()=>{ undefined })
		args.shift()
		let reason = args.join(" ") || "Geen reden opgegeven."

		if(message.member.hasPermission("BAN_MEMBERS")){
			if(!member) return message.reply('Kon de gebruiker niet vinden!')
			if(member.user.id == message.author.id) return message.reply('Je kan jezelf niet verbannen geven!')
			if(member.hasPermission("ADMINISTRATOR")) return message.reply('Deze gebruiker heeft een hogere rol dan jou, of dezelfde rol.')
			if(member.roles.highest.position > message.guild.me.roles.highest.position) return message.reply('Deze gebruiker heeft een hogere rol dan mij, of dezelfde rol.')

		let banembed = new Discord.MessageEmbed()
			.setTitle(`:white_check_mark: Success!`)
			.setDescription(`${member} is verbannen!`)
			.addField('Reden', reason)
			.setColor(embedcolor)
			.setTimestamp()
	
		let banlogembed = new Discord.MessageEmbed()
			.setTitle(`Verbanning - ${member.user.tag}`)
			.addField('Gebruiker', member, true)
			.addField('Moderator', message.author, true)
			.addField('Reden', reason, true)
			.setColor(embedcolor)
			.setTimestamp()
		
        if(member.bannable){
            member.ban({
                reason: `Door ${message.author.tag} met reden: ${reason}`
              })
                  .catch(console.error);


            message.channel.send(banembed);
            await member.user.send(`Je bent zojuist verbannen in __${message.guild.name}__ door ${message.author} voor: **${reason}**`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
            message.guild.channels.cache.get(modlog).send(banlogembed)
            // Database stuff
        } else return message.reply('Deze gebruiker kan niet worden verbannen!')
		} else return message.reply('Jij kan dit niet doen!')
	},
};