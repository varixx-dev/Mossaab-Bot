const TOKEN = "ODEyNDAwODQ1NzQzNTg3MzY4.YDANPw.pbC1mqy4bZ_X4EzhuXPz4aL6je0"
const path = require('path');
const Discord = require('discord.js');
const client = new Discord.Client()
const { prefix, embedcolor } = require('./package.json')
let welcomechannel = "123456789123456789" // Verander dit in het kanaal waar je de welkom in wilt hebben.

  client.on('ready', () => {
    console.log('I am ready!');
  });
  
  client
      .on("error", console.error)
      .on("warn", console.warn)
      .on("debug", console.log)
      .on("disconnect", () => {
        console.warn("Disconnected!");
      })
      .on("reconnecting", () => {
        console.warn("Reconnecting...");
      });

    client.on("message", async message => {
        let ticketinfo = new Discord.MessageEmbed()
            .setTitle('Maak een ticket! :ticket:')
            .setDescription(`Maak een ticket door op de :ticket: reactie hieronder te klikken!`)
            .setColor(embedcolor)
            .setTimestamp();

        let ticketgemaakt = new Discord.MessageEmbed()
            .setTitle('Ticket Aangemaakt!')
            .setDescription(`Je kan de ticket vinden in <#>`)
            .setColor(embedcolor)
            .setTimestamp();

        let ticketbestaat = new Discord.MessageEmbed()
            .setTitle('Ticket bestaat al!')
            .setDescription(`Uh oh, deze ticket bestaat al! Je kan hem vinden in <#>`)
            .setColor(embedcolor)
            .setTimestamp();

        let ticketverwijderd = new Discord.MessageEmbed()
            .setTitle('Ticket Verwijderd! :wastebasket:')
            .setDescription(`Je ticket is verwijderd door ${message.member} met reden:`)
            .setColor(embedcolor)
            .setTimestamp();

        if(message.author.id == ownerid && message.content == prefix+"ticketinfo"){
          message.channel.send(ticketinfo).then(msg => {
            msg.react('🎫')
          })
        }


        if(message.content.startsWith(prefix+"say")){
            let args = message.content.split(' ').splice(1).join(' ')
            let say = new Discord.MessageEmbed()
                .setDescription(args)
                .setColor(embedcolor)
                .setTimestamp();
            message.channel.send(say)
        }

        client.on("guildMemberAdd", async member => {
            let embed = new Discord.MessageEmbed()
                .setTitle('Welkom!')
                .setDescription(`Welkom ${member} in **${member.guild.name}** :wave:`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setColor(embedcolor)
                .setTimestamp();
            member.guild.channels.cache.get(welcomechannel).send(embed)
            });
      
        client.on("guildMemberRemove", async member => {
            let embed = new Discord.MessageEmbed()
                .setTitle('Tot ziens!')
                .setDescription(`**${member.user.username}** heeft de server verlaten :cry:`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setColor(embedcolor)
                .setTimestamp();
            member.guild.channels.cache.get(welcomechannel).send(embed)
            });
    })
  
client.login(TOKEN);