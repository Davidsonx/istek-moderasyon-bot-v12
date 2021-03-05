const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {
    let executor = message.member

    let embed = new MessageEmbed().setAuthor(executor.user.tag, executor.user.displayAvatarURL({dynamic: true})).setFooter(ayar.conf).setColor("RED").setTimestamp();
    if (!message.member.roles.cache.has(ayar.jailHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ");
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (!victim || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}jail @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    
    victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.cezaliRol]) : victim.roles.set([ayar.cezaliRol]);
    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezaid.${message.guild.id}`, +1);
    db.push("jail", { id: victim.id });
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: victim.id, id: cezaID, zaman: Date.now(), komut: "JAIL" });
    db.set(`jstatus.${victim.id}.${message.guild.id}`, true)
    db.push(`sicil.${victim.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "JAIL" });
    db.add(`cezapuan.${victim.id}.${message.guild.id}`, +15);
    db.add(`jailCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`jail.${victim.id}.${message.guild.id}`, +1);
    let cpuan = db.get(`cezapuan.${victim.id}.${message.guild.id}`);
    if (cpuan > 120 ) {
        victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.cezaliRol]) : victim.roles.set([ayar.cezaliRol]);
    
        if (message.guild.channels.cache.has(ayar.jailLogKanali)) message.guild.channels.cache.get(ayar.jailLogKanali).send(new Discord.MessageEmbed().setAuthor(client.user.tag, client.user.displayAvatarURL({dynamic: true})).setDescription(`${victim}, üyesine <@&773281623717576718> rolü <@727146308200038462> tarafından verildi. \n Sebep: ceza puanını aştı `).setColor("RANDOM"))
    
    }
        if (ayar.cezapuanlog && client.channels.cache.has(ayar.cezapuanlog)) client.channels.cache.get(ayar.cezapuanlog).send(`${victim} : aldığınız **#${cezaID}** ID'li ceza ile **${cpuan || '0'}** ceza puanına ulaştınız. `).catch();
    
    if (victim.voice.channel) victim.voice.kick();
    message.channel.send(embed.setDescription(`${victim}, üyesine Cezalı rolü ${message.author} tarafından verildi. (\`#${cezaID}\`)`).setColor("RED"))
    if (message.guild.channels.cache.has(ayar.jailLogKanali)) message.guild.channels.cache.get(ayar.jailLogKanali).send(embed.setDescription(`${victim}, üyesine <@&773281623717576718> rolü ${message.author} tarafından verildi.(\`#${cezaID}\`) \n Sebep: ${reason} `))
    if (ayar.cezapuanlog && client.channels.cache.has(ayar.cezapuanlog)) client.channels.cache.get(ayar.cezapuanlog).send(`${victim} : aldığınız **#${cezaID}** ID'li ceza ile **${cpuan || '0'}** ceza puanına ulaştınız. `).catch();


};

module.exports.configuration = {
    name: "jail",
    aliases: ["cezalı", "ceza", "karantina"],
    usage: "",
    description: ""
};
