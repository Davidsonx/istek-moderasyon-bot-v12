const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');

const db = require("quick.db");

const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter('Davidson yaptı uzatma').setColor("RANDOM").setTimestamp();
    let executor = message.member
	if(message.author.id !== "329701850037092352")   
   return message.channel.send("Bu komutu kullanamazsın dostum.");



    let banLimit = db.get(`banLimit.${message.author.id}.${message.guild.id}`);
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let victimfetch = client.users.fetch(args[0]);
    let reason = args.splice(1).join(" ");
    if(!reason) reason = `Bu yasaklama ${message.author} tarafından açılmaz ban şeklinde banlandı.`
    if (!victim) return message.channel.send(embed.setDescription(`Geçerli bir kullanıcı idsi belirtmelisin.`)).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (!victim || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}ban @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    victim.send(embed.setDescription(`**${message.guild.name}** **${reason}** `)).catch();
    
    if (banLimit >= 2) {
        message.guild.owner.send(embed.setDescription(`${message.author} (\`${message.author.id}\`) adlı yetkili 30 dkda 2 tane ban attığı için ban yetkisi alındı.`)).catch();
        message.member.roles.remove(ayar.banHammer).catch();
        db.delete(`banLimit.${message.author.id}.${message.guild.id}`);
        return;
    }

    message.guild.members.ban(victimfetch.id, {reason: reason}).catch();
    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.push("ban", {id: victim.id});
    db.add(`cezaid.${message.guild.id}`, +1);
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: victim.id, id: cezaID, zaman: Date.now(), komut: "BAN" });
    db.push(`sicil.${victim.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "BAN" });
    db.add(`cezapuan.${victim.id}.${message.guild.id}`, +50);
    db.add(`banCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`ban.${victim.id}.${message.guild.id}`, +1);
    if (!message.member.hasPermission("ADMINISTRATOR")) { db.add(`banLimit.${message.author.id}.${message.guild.id}`, +1)};
    let cpuan = db.get(`cezapuan.${victim.id}.${message.guild.id}`);
    if (cpuan > 120 ) {
        victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.cezaliRol]) : victim.roles.set([ayar.cezaliRol]);
      
    }
        if (ayar.cezapuanlog && client.channels.cache.has(ayar.cezapuanlog)) client.channels.cache.get(ayar.cezapuanlog).send(`${victim} : aldığınız **#${cezaID}** ID'li ceza ile **${cpuan || '0'}** ceza puanına ulaştınız. `).catch();
    
    message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setAuthor(executor.user.tag, executor.user.displayAvatarURL({dynamic: true})).setDescription(`${victim.user.tag} üyesinin yasaklaması artık açılamaz.`));
    if (message.guild.channels.cache.has(ayar.banLogKanali)) message.guild.channels.cache.get(ayar.banLogKanali).send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üye **${reason}** sebebi ile ${message.author} (\`${message.author.id}\`) tarafından sunucudan yasaklandı. (\`#${cezaID}\`)`))
    
};

module.exports.configuration = {
    name: "açılmazban",
    aliases: ["açilmazban"],
    usage: "",
    description: ""
};
