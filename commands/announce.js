const Discord = module.require("discord.js");
const info = require("../config.json");

module.exports.run = async (bot, message, args) => {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("You don't have enough permissions.");
    let ancmessage;
    let mchannel = message.mentions.channels.first();
    if (!mchannel) return message.reply("Please mention the channel in which you want to announce.");
    if (!args.length > 1) return message.reply(`Incorrect usage of command.\n Correct Usage: \`${info.prefix}announce [channel] [embed] [message]\` Or \`${info.prefix}announce [channel] [message]\`.`);
    if (args[2] === "embed") {
        if(args.slice(3).length < 1) return message.reply("Please provide the text to announce.");
        ancmessage = args.slice(3).join(" ");
        const anc = new Discord.MessageEmbed()
            .setDescription(`${ancmessage}`)
            .setFooter(message.guild.me.displayName)
            .setTimestamp()
            .setColor(0x6bffe1)
        mchannel.send(anc);
    } else {
        if(args.slice(2).length < 1) return message.reply("Please provide the text to announce.");
        ancmessage = args.slice(2).join(" ");
        mchannel.send(ancmessage);
    }
};

module.exports.config = {
    name: "announce",
    aliases: ["anc"]
}
