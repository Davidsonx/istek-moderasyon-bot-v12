const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(ayar.conf).setColor("RANDOM").setTimestamp();
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let data = db.get(`sicil.${user.id}.${message.guild.id}`) || [];
    let sicil = data.length > 0 ? data.map((value, index) => `\`${index+1}.\` [**${value.komut}**] ${client.users.cache.get(value.mod) || value.mod} tarafından **${value.sebep}** nedeniyle ${new Date(value.zaman).toTurkishFormatDate()} zamanında cezalandırılmış. `).join("\n") : "Bu Üyenin Ceza Bilgisi Bulunamadı."
    message.channel.send(embed.setDescription(`${sicil}`));

};

module.exports.configuration = {
    name: "sicil",
    aliases: ["sicil"],
    usage: "sicil",
    description: ""
};
