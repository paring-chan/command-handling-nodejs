require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

client.once('ready', () => {
    console.log('봇작동중...');
    client.user.setActivity(`꿀꿀봇 점검중...`, { type: 'PLAYING' })
        .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
        .catch(console.error);
});
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()


fs.readdirSync("./command/").forEach(dir => {
    const Filter = fs.readdirSync(`./command/${dir}`).filter(f => f.endsWith(".js"));
    Filter.forEach(file => {
        const cmd = require(`./command/${dir}/${file}`);
        client.commands.set(cmd.config.name, cmd)
        for (let alias of cmd.config.aliases) {
            client.aliases.set(alias, cmd.config.name)        }
    })
})

function runCommand(command, message, args, prefix) {
    if (client.commands.get(command) || client.aliases.get(command)) {
        const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
        if (cmd) cmd.run(client, message, args, prefix); return
    }
}
client.on("message", msg => {
    const prefix = "ㄲ "
    if(!msg.content.startsWith(prefix)) return
    let args = msg.content.slice(prefix.length).trim().split(/ +/g)
    let command = args.shift().toLowerCase()

    runCommand(command, msg, args, prefix)
})

client.login(process.env.TOKEN);