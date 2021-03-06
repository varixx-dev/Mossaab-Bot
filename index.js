const TOKEN = ""
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, embedcolor, welcomechannel } = require('./package.json')
const client = new Discord.Client()
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.on('ready', () => {
  console.log('I am ready!');

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
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
      if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        const cmd = client.commands.get(command);
        if (!cmd) return
        try {
            cmd.execute(client, message, args);
        } catch (err) {
            console.error(err)
            message.reply("An error occured ")
            return;
        }
    })
  
client.login(TOKEN);
