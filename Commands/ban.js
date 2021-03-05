const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const db = require("quick.db");

const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(ayar.conf).setColor("RANDOM").setTimestamp();
    if (!message.member.roles.cache.has(ayar.banHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));



    let bandb = db.get(`bandb.${message.author.id}.${message.guild.id}`);
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let victimfetch = client.users.fetch(args[0]);
    let reason = args.splice(1).join(" ");
    if(!reason) reason = "Belirtilmemiş"
    if (!victim) return message.channel.send(embed.setDescription(`Geçerli bir kullanıcı idsi belirtmelisin.`)).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (!victim || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}ban @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    
    if (bandb >= 2) {
        if (message.guild.channels.cache.has(ayar.yetkiasma)) message.guild.channels.cache.get(ayar.yetkiasma).send(embed.setDescription(`${message.author} (\`${message.author.id}\`) adlı yetkili 30 dakikada 2 tane ban attığı için ban yetkisi alındı.`)).catch();
        message.member.roles.remove(ayar.banHammer).catch();
        db.delete(`bandb.${message.author.id}.${message.guild.id}`);
        return;
    }

    message.guild.members.ban(victimfetch.id, {reason: reason}).catch();
    victim.send(embed.setDescription(`**${message.guild.name}** adlı sunucudan **${reason}** gerekçesiyle yasaklandın!`)).catch();
    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.push("bans", {id: victim.id});
    db.add(`cezaid.${message.guild.id}`, +1);
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: victim.id, id: cezaID, zaman: Date.now(), komut: "BAN" });
    db.push(`sicil.${victim.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "BAN" });
    db.add(`cezapuan.${victim.id}.${message.guild.id}`, +50);
    db.add(`banCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`ban.${victim.id}.${message.guild.id}`, +1);
    if (!message.member.hasPermission("ADMINISTRATOR")) { db.add(`bandb.${message.author.id}.${message.guild.id}`, +1)};
    let cpuan = db.get(`cezapuan.${victim.id}.${message.guild.id}`);
  //120 puanı geçerse cezalıya atar
  if (cpuan > 120 ) {
    victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.cezaliRol]) : victim.roles.set([ayar.cezaliRol]);
   
}
        if (ayar.cezapuanlog && client.channels.cache.has(ayar.cezapuanlog)) client.channels.cache.get(ayar.cezapuanlog).send(`${victim} : aldığınız **#${cezaID}** ID'li ceza ile **${cpuan || '0'}** ceza puanına ulaştınız. `).catch();
    
    message.channel.send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üye ${reason} sebebi ile sunucudan yasaklandı. (\`#${cezaID}\`)`));
    if (message.guild.channels.cache.has(ayar.banLogKanali)) message.guild.channels.cache.get(ayar.banLogKanali).send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üye ${reason} sebebi ile ${message.author} (\`${message.author.id}\`) tarafından sunucudan yasaklandı. (\`#${cezaID}\`)`))
    
};

module.exports.configuration = {
    name: "yasakla",
    aliases: ["ban"],
    usage: "",
    description: "."
};
