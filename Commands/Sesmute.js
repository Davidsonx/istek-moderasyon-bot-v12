const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("ms");
const moment = require("moment");
const ayar = require("../settings.json");

module.exports.execute = async (client, message, args) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(ayar.conf).setColor(`RANDOM`).setTimestamp();
    if (!message.member.roles.cache.has(ayar.muteHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let muteler = db.get(`tempsmute`) || [];
  let sure = args[1];
  let reason = args.splice(2).join(" ");
  if(!sure || !ms(sure) || !reason) return message.channel.send(embed.setDescription("Geçerli bir süre (1s/1m/1h/1d) ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  yaziSure = sure.replace(/y/, ' yıl').replace(/d/, ' gün').replace(/s/, ' saniye').replace(/m/, ' dakika').replace(/h/, ' saat')

  if(uye.voice.channel) uye.voice.setMute(true).catch();
  if (!muteler.some(j => j.id == uye.id)) {
    db.push(`tempsmute`, {id: uye.id, kalkmaZamani: Date.now()+ms(sure)})

  }
  let cezaID = db.get(`cezaid.${message.guild.id}`)+1
  db.add(`cezaid.${message.guild.id}`, +1);
  db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: uye.id, id: cezaID, zaman: Date.now(), komut: "VOICE-MUTE" });
  db.push(`sicil.${uye.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "VOICE-MUTE" });
  db.add(`cezapuan.${uye.id}.${message.guild.id}`, +10);
  db.add(`vmuteCez.${message.author.id}.${message.guild.id}`, +1);
  db.add(`vmute.${uye.id}.${message.guild.id}`, +1);
  db.set(`vstatus.${uye.id}.${message.guild.id}`, true);
  let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`);
  //120 puanı geçerse cezalıya atar
  if (cpuan > 120 ) {
    victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.cezaliRol]) : victim.roles.set([ayar.cezaliRol]);
   
}
  message.channel.send(` ${uye} ${yaziSure} boyunca  boyunca ses kanallarında susturuldu. (\`#${cezaID}\`)`).catch();
  if(ayar.vmuteLogKanali && client.channels.cache.has(ayar.vmuteLogKanali)) client.channels.cache.get(ayar.vmuteLogKanali).send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${yaziSure}** boyunca **${reason}** nedeniyle seste mutelendi!`)).catch();
  if (ayar.cezapuanlog && client.channels.cache.has(ayar.cezapuanlog)) client.channels.cache.get(ayar.cezapuanlog).send(`${uye} : aldığınız **#${cezaID}** ID'li ceza ile **${cpuan || '0'}** ceza puanına ulaştınız. `).catch();

};

module.exports.configuration = {
    name: "sesmute",
    aliases: ["sesmute"],
    usage: "cmute @üye [süre] [sebep]",
    description: ""
};
