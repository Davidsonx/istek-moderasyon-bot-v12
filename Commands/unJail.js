const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(ayar.conf).setColor("RANDOM").setTimestamp();
    if (!message.member.roles.cache.has(ayar.jailHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ");
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (!victim || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}unjail @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    let ceza = db.get("jail") || [];


        victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.kayıtsızRol]) : victim.roles.set([ayar.kayıtsızRol]);
        if (ceza.some(x => x.id === victim.id)) db.set("jail", ceza.filter(x => x.id !== victim.id));

    message.channel.send(embed.setDescription(`${victim} adlı üyenin cezası **${reason}** sebebi ile kaldırıldı.`));
    if (message.guild.channels.cache.has(ayar.jailLogKanali)) message.guild.channels.cache.get(ayar.jailLogKanali).send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üyenin jaili ${message.author} adlı yetkili tarafından **${reason}** sebebi ile kaldırıldı.`))

};

module.exports.configuration = {
    name: "unjail",
    aliases: ["uncezalı"],
    usage: "",
    description: ""
};
