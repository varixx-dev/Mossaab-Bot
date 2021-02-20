const Discord = require('discord.js')
const { ticketperms, ticketcategory, embedcolor } = require('../package.json')

module.exports = {
	name: 'ticketinfo',
	description: 'Laat de bot het bericht plaatsen waarmee leden tickets kunnen aanmaken.',

	async execute(client, message, args) {
		if(message.author.bot) return;

        message.delete()
		let ticketinfo = new Discord.MessageEmbed()
            .setTitle('Maak een ticket! :ticket:')
            .setDescription(`Maak een ticket door op de :ticket: reactie hieronder te klikken!`)
            .setColor(embedcolor)
            .setTimestamp();

        if(message.author.id == message.guild.ownerID){
            message.channel.send(ticketinfo).then(async msg => {
                msg.react("🎫")

                const ticketFilter = (reaction, user) => reaction.emoji.name === '🎫' && user.id !== client.user.id;
                const ticket = msg.createReactionCollector(ticketFilter);

                ticket.on("collect", (r, u) => {
                    r.users.remove(u.id)
                    let filteredusername = u.username
                    .replace(/\{/g, '')
                    .replace(/\}/g, '')
                    .replace(/\!/g, '')
                    .replace(/\@/g, '')
                    .replace(/\#/g, '')
                    .replace(/\$/g, '')
                    .replace(/\%/g, '')
                    .replace(/\^/g, '')
                    .replace(/\&/g, '')
                    .replace(/\*/g, '')
                    .replace(/\(/g, '')
                    .replace(/\)/g, '')
                    .replace(/\+/g, '')
                    .replace(/\=/g, '')
                    .replace(/\\/g, '')
                    .replace(/\|/g, '')
                    .replace(/\;/g, '')
                    .replace(/\:/g, '')
                    .replace(/\'/g, '')
                    .replace(/\"/g, '')
                    .replace(/\`/g, '')
                    .replace(/\~/g, '')
                    .replace(/\?/g, '')
                    .replace(/\./g, '')
                    .replace(/\,/g, '')
                    .replace(/\>/g, '')
                    .replace(/\</g, '')
                    .replace(/\//g, '')
                    
                    let ticketname = "ticket-"+filteredusername.toLowerCase()
                    let ticketchannel = msg.guild.channels.cache.find(c => c.name == ticketname)

                    let ticketbestaat = new Discord.MessageEmbed()
                        .setTitle('Ticket bestaat al!')
                        .setDescription(`Uh oh, deze ticket bestaat al! Je kan hem vinden in ${ticketchannel}`)
                        .setColor(embedcolor)
                        .setTimestamp();

                    let ticketgemaakt = new Discord.MessageEmbed()
                        .setTitle('Ticket Aangemaakt!')
                        .setColor(embedcolor)
                        .setTimestamp();

                    if(!ticketchannel){
                        msg.guild.channels.create(ticketname, {
                            type: 'text',
                            permissionOverwrites:[
                                {
                                id: u.id,
                                allow: ['VIEW_CHANNEL', "SEND_MESSAGES"],
                                deny: ["CREATE_INSTANT_INVITE"]
                                },
                                {
                                id: ticketperms,
                                allow: ['VIEW_CHANNEL', "SEND_MESSAGES"],
                                deny: ["CREATE_INSTANT_INVITE"]
                                },
                                {
                                id: message.guild.id,
                                allow: [],
                                deny: ['VIEW_CHANNEL']
                                }],
                            parent: ticketcategory
                            }).then(chan => {
                                ticketgemaakt.setDescription(`Je kan de ticket vinden in ${chan}`)
                                msg.channel.send(ticketgemaakt).then(mess => mess.delete({ timeout: 5000 }))
                            })
                    } else return msg.channel.send(ticketbestaat).then(mess => mess.delete({ timeout: 5000 }))
                })
            })
        } else return message.channel.send(`Dit kan jij niet doen!`)
    },
};