const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../settings.json");

module.exports.execute = async (client, message, args) => {
    let executor = message.member
	
    let embed = new MessageEmbed().setAuthor(executor.user.tag, executor.user.displayAvatarURL({dynamic: true})).setFooter(ayar.conf).setColor("RED").setTimestamp();
    let cezaID = Number (args[0]);
    if (!cezaID) return message.channel.send(embed.setDescription("Geçerli bir ceza numarası belirtmelisin.")).then(x => x.delete({timeout: 5000}))
    let punishment = db.fetch(`punishments.${cezaID}.${message.guild.id}`) || {};
    if (!punishment) return message.channel.send(embed.setDescription(`Belirtilen ID ile bir ceza bulamadım \`!#${cezaID}\``)).then(x => x.delete({timeout: 10000}));
    let victim = client.users.fetch(punishment.kisi) || punishment.kisi;
    let mod = client.users.fetch(punishment.mod) || punishment.mod;
    let zaman = punishment.zaman;

    message.channel.send(embed.setDescription(`Ceza ID: \`#${cezaID}\`  \n\n\`•\` Ceza Bilgisi: ${punishment.komut} \n\`•\` Ceza Alan Üye: ${message.guild.members.cache.get(punishment.kisi) || punishment.kisi} (\`${victim.id || punishment.kisi}\`) \n\`•\` Yetkili: ${message.guild.members.cache.get(punishment.mod) || punishment.mod} (\`${mod.id || punishment.mod}\`) \n\`•\` Ceza Tarihi: \`${new Date(zaman).toTurkishFormatDate()}\` \n\`•\` Sebep: ${punishment.sebep}`));

};

module.exports.configuration = {
    name: "cezabilgi",
    aliases: ["cezainfo"],
    usage: "",
    description: "."
};
