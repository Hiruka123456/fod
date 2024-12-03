const express = require('express')
const app = express()



app.get('/', (req, res) => {
  res.send('Running!');
});

app.listen(3000, () => {
  console.log('success');
});

const { Discord, Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const { prefix } = require("./config.json")
const Timeout = new Set();
const ms = require('ms')
client.commands = new Collection();
client.aliases = new Collection();
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("ready", async () => {
  console.log(client.user.tag + " is currently in " + client.guilds.cache.size + " servers " + ",watching " +
    `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}` + " people")
});

client.on("ready", async() => {
  let servers = await client.guilds.cache.size
  let servercount = await client.guilds.cache.reduce((a,b) => a+b.memberCount,0) 
  const activites = [
    `Watching ${servercount} members`
  ]
  setInterval (() =>{
    const status = activites[Math.floor(Math.random()*activites.length)]
    client.user.setPresence({ activities : [{name : `${status}`}]})
  }, 5000)
}
         )










client.on("messageCreate", async message => {


  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  // If message.member is uncached, cache it.
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) {
    if (command.timeout) {
      if (Timeout.has(`${message.author.id}${command.name}`)) {
        let timecommand = ms(command.timeout) / 1000
        let embed = new MessageEmbed().setColor("RED").setTitle(`**Slow down, you can only use this command every ${timecommand}! seconds**`)
        return message.reply({embeds:[embed]})
      } else {
        command.run(client, message, args);
        Timeout.add(`${message.author.id}${command.name}`)
        setTimeout(() => {
          Timeout.delete(`${message.author.id}${command.name}`)
        }, command.timeout);
      }
    } else {
      command.run(client, message, args)
    }
  }
});
client.login(process.env.token)