const {MessageEmbed } = require('discord.js')
const Discord = require('discord.js')
module.exports = {
    name: 'ping',
    category:"info",
    description: 'Get bot\'s ping',
    usage: 'ping',
    timeout: "2000",
    run : async (client, message, args) => {
        message.channel.send('Pinging...')
        .then(sentMsg => {
            sentMsg.edit(`:ping_pong: Pong! Took \`${sentMsg.createdTimestamp - message.createdTimestamp}ms\` | Latency- \`${client.ws.ping}ms\``)
   })

}
}