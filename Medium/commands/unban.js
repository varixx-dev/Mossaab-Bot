const Discord = require('discord.js')
const { modlog, embedcolor, prefix } = require('../package.json')

module.exports = {
	name: 'unban',
	description: 'Verwijder een ban van een lid.',
	usage: `${prefix}unban [userid] <Reden>`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let user = args[0]
		if(Number.isNaN(+user) || args[0].length !== 18) return message.reply('Het moet wel zijn ID zijn...')
		args.shift()
		let reason = args.join(" ") || "Geen reden opgegeven."

		if(message.member.hasPermission("BAN_MEMBERS")){
			let banned = await message.guild.fetchBan(user).catch(()=>{ undefined })
			let bannedreason = banned.reason
			if(!banned.reason) bannedreason = "Geen reden opgegeven."
			let bannedusername = banned.user.username
			if(!banned.user.username) bannedusername = "<NotFound>"
			let banneddiscriminator = banned.user.discriminator
			if(!banned.user.discriminator) banneddiscriminator = "<NotFound>"
			let username = `${bannedusername}#${banneddiscriminator}`
			
		let unbanembed = new Discord.MessageEmbed()
			.setTitle(`:white_check_mark: Success!`)
			.setDescription(`${username} zijn verbanning is opgeheven!`)
			.addField('Reden voor ontbanning', reason)
			.addField('Reden voor verbanning', bannedreason)
			.setColor(embedcolor)
			.setTimestamp()
	
		let unbanlogembed = new Discord.MessageEmbed()
			.setTitle(`Verbanning Opgeheven - ${user}`)
			.addField('Gebruiker', username, true)
			.addField('Moderator', message.author, true)
			.addField('Reden voor ontbanning', reason, true)
			.addField('Reden voor verbanning', bannedreason, true)
			.setColor(embedcolor)
			.setTimestamp()

		if(banned){
            message.guild.members.unban(user).catch(console.error);

            message.channel.send(unbanembed);
            message.guild.channels.cache.get(modlog).send(unbanlogembed)
            // Database stuff
        } else return message.reply('Deze gebruiker is niet verbannen!')
		} else return message.reply('Jij kan dit niet doen!')
	},
};
