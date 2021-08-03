const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
const Express = require("express");
const app = Express();
const config = require("./config.json");

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

app.get("/users", (req, res) => {
    let arr = [];
    bot.users.cache.forEach(u => {
        arr.push(u.id);
    });
    res.send(arr);
});

fs.readdir("./commands/", (err, files) => {
    if (err) {
        console.error(err);
    }

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log("No files found!!");
    }

    console.log(`Loaded ${jsfiles.length} commands`);

    jsfiles.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
        });
    });
});

bot.on("ready", async () => {
    console.log("i'm ready");
});

bot.on('message', async message => {
    let msgArray = message.content.split(/\s+/g)
    let cmd = msgArray[0];
    let args = message.content.substring(config.prefix.length).split(" ");
    if (!message.content.startsWith(config.prefix)) return;
    if (message.channel.type === "dm") return;
    let commandfile = bot.commands.get(cmd.slice(config.prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(config.prefix.length)))
    if (commandfile) commandfile.run(bot, message, args);
});


app.listen(config.port);
bot.login(config.token);