const Discord = require('discord.js')

module.exports = {
	name: 'say',
	description: 'Laat de bot je tekst napraten.',

	async execute(client, message, args) {
		if(message.author.bot) return;

		if(!args.length) return message.reply('Ja... Hier kan ik niks mee. Wat moet ik nou zeggen dan?')
		message.channel.send(args);
	},
};
