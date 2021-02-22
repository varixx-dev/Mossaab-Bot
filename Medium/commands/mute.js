const Discord = require('discord.js')
const { modlog, embedcolor, prefix } = require('../package.json')

module.exports = {
	name: 'mute',
	description: 'Mute een lid.',
	usage: `${prefix}mute [Tijd in minuten (0 voor onbeperkt)] @User <Reden>`,

	async execute(client, message, args) {
		if(message.author.bot) return;
		let user = message.mentions.users.first() || args[0]
		if(message.mentions.users.first()) user = user.id
		if(Number.isNaN(+user)) return message.reply('Het moet wel zijn mention/ID zijn...')
		let member = await message.guild.members.fetch(user).catch(()=>{ undefined })
		args.shift()
		let time = args[0]
		args.shift()
		let reason = args.join(" ") || "Geen reden opgegeven."

		if(Number.isNaN(+time)) return message.reply('De tijd moet wel een nummer zijn :1234: (De tijd is in minuten :wink:) || Voor een mute met onbeperkte tijd, doe je `-mute @User 0 <Reden (optioneel)>`')
        let spel = "minuten"
        if(time <= 1) spel = "minuut"

		if(message.member.hasPermission("KICK_MEMBERS")){
			if(!member) return message.reply('Kon de gebruiker niet vinden!')
			if(member.user.id == message.author.id) return message.reply('Je kan jezelf geen mute geven!')
			if(member.hasPermission("ADMINISTRATOR")) return message.reply('Deze gebruiker heeft een hogere rol dan jou, of dezelfde rol.')
			if(member.roles.highest.position > message.guild.me.roles.highest.position) return message.reply('Deze gebruiker heeft een hogere rol dan mij, of dezelfde rol.')

		let muteembed = new Discord.MessageEmbed()
			.setTitle(`:white_check_mark: Success!`)
			.setDescription(`${member} is gemute!`)
			.addField('Reden', reason)
			.setColor(embedcolor)
			.setTimestamp()
	
		let mutelogembed = new Discord.MessageEmbed()
			.setTitle(`Mute - ${member.user.tag}`)
			.addField('Gebruiker', member, true)
			.addField('Moderator', message.author, true)
			.addField('Reden', reason, true)
			.setColor(embedcolor)
			.setTimestamp()
	
		let tempmutefinishedembed = new Discord.MessageEmbed()
			.setTitle(`:exclamation: Mute Opgeheven!`)
			.setDescription(`${member} zijn tijd zit er op!`)
			.setColor(embedcolor)
			.setTimestamp()
	
		let tempmutefinishedlogembed = new Discord.MessageEmbed()
			.setTitle(`Mute Opgeheven - ${member.user.tag}`)
			.addField('Gebruiker', member, true)
			.addField('Mute Lengte', `${time} ${spel}`, true)
			.addField('Reden', reason, true)
			.setColor(embedcolor)
			.setTimestamp()
		
        let muterole = message.guild.roles.cache.find(r => r.name == "Muted")
        if(!muterole) {

			if(time == 0){
            message.guild.roles.create({
            data: {
              name: 'Muted',
              color: '#454545',
              hoist: true,
              position: message.guild.me.roles.highest.position,
              permissions: ['VIEW_CHANNEL']
            },
            reason: 'Kon de Muted rol niet vinden, dus maakte er zelf een.',
          }).then(async(role) => {
                member.roles.add(role)
		        message.channel.send(muteembed);
		        await member.user.send(`Je bent zojuist gemute voor onbepaalde tijd door ${message.author} voor: **${reason}**`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
		        message.guild.channels.cache.get(modlog).send(mutelogembed)
                // Database Stuff (Voor de onbeperkte mute)
          })
		} else {
			message.guild.roles.create({
				data: {
				  name: 'Muted',
				  color: '#454545',
				  hoist: true,
				  position: message.guild.me.roles.highest.position,
				  permissions: ['VIEW_CHANNEL']
				},
				reason: 'Kon de Muted rol niet vinden, dus maakte er zelf een.',
			  }).then(async(role) => {
				member.roles.add(role).then(async() => {
					muteembed.addField('Mute Lengte', `${time} ${spel}`, true)
					message.channel.send(muteembed)
					await member.user.send(`Je bent zojuist gemute voor ${time} ${spel} door ${message.author} voor: **${reason}**`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:")})
					mutelogembed.addField('Mute Lengte', `${time} ${spel}`, true)
					message.guild.channels.cache.get(modlog).send(mutelogembed)
					
					// Database Stuff (Voor de tijdelijke mute)
					setTimeout(async function(){
					member.roles.remove(role)
					message.channel.send(tempmutefinishedembed);
					await member.user.send(`De tijd is om! Je mag weer praten 🗣️`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
					message.guild.channels.cache.get(modlog).send(tempmutefinishedlogembed)
					// Database Stuff (Voor als de tijdelijke mute is opgeheven)
				}, time*60000)})
			  })
		}

        } else {
		if(time == 0){
        member.roles.add(muterole)
		message.channel.send(muteembed);
		await member.user.send(`Je bent zojuist gemute voor onbepaalde tijd door ${message.author} voor: **${reason}**`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
		message.guild.channels.cache.get(modlog).send(mutelogembed)
		// Database stuff (Voor de onbeperkte mute)
		} else {
			member.roles.add(muterole).then(async() => {
				muteembed.addField('Mute Lengte', `${time} ${spel}`, true)
				message.channel.send(muteembed);
				await member.user.send(`Je bent zojuist tijdelijk gemute voor ${time} ${spel} door ${message.author} voor: **${reason}**`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
				mutelogembed.addField('Mute Lengte', `${time} ${spel}`, true)
				message.guild.channels.cache.get(modlog).send(mutelogembed)
				// Database stuff (Voor de tijdelijke mute)
				
				setTimeout(async function(){
				member.roles.remove(muterole)
				message.channel.send(tempmutefinishedembed);
				await member.user.send(`De tijd is om! Je mag weer praten 🗣️`).catch(()=>{ message.reply("Kon de gebruiker geen bericht sturen :cry:") })
				message.guild.channels.cache.get(modlog).send(tempmutefinishedlogembed)
				// Database Stuff (Voor als de mute is opgeheven)
			}, time*60000)})
		}
        }
		} else return message.reply('Jij kan dit niet doen!')
	},
};
