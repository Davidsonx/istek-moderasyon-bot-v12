const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {
   
    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();


    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    let cpuan = db.get(`cezapuan.${victim.id}.${message.guild.id}`);



    message.channel.send(`${victim} adlı üyenin toplam ceza puanı; ${cpuan || '0'}`)

};
module.exports.configuration = {
    name: "cezapuan",
    aliases: ["cpuan", "puan", "cezaprofil"],
    usage: "",
    description: ""
};
