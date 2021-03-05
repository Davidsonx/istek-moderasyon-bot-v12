const Discord = require('discord.js');

const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const ms = require("ms");
const moment = require("moment");
const ayar = require("../settings.json");
module.exports.execute = async (client, message, args) => {
    let executor = message.member

    if (!message.member.roles.cache.has(ayar.muteHammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let embed = new MessageEmbed().setAuthor(executor.user.tag, executor.user.displayAvatarURL({dynamic: true})).setFooter(ayar.conf).setColor("RED").setTimestamp();
   // if (victim.hasPermission("BAN_MEMBERS")) return message.channel.send(`Hata! ${victim} isimli kullanıcı bu sunucuda yetkili.`)

    let time = args[1]
    let reason = args.splice(2).join(" ");
    if (message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (!victim || !time || !ms(time) || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${ayar.prefix || ""}mute @üye [süre (1s/1d/1m/1h) ] [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (victim.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));
    
    yaziSure = time.replace(/y/, ' yıl').replace(/d/, ' gün').replace(/s/, ' saniye').replace(/m/, ' dakika').replace(/h/, ' saat')
    let atilanAy = moment(Date.now()).format("MM");
    let atilanSaat = moment(Date.now()).format("HH:mm:ss");
    let atilanGün = moment(Date.now()).format("DD");
    let bitişAy = moment(Date.now()+ms(time)).format("MM");
    let bitişSaat = moment(Date.now()+ms(time)).format("HH:mm:ss");
    let bitişGün = moment(Date.now()+ms(time)).format("DD");

    let muteAtılma = `${atilanGün} ${atilanAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${atilanSaat}`;
    let muteBitiş = `${bitişGün} ${bitişAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${bitişSaat}`;

    victim.roles.add(ayar.muteRol).catch();
    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    db.add(`cezaid.${message.guild.id}`, +1);
    db.push("tempmute", { id: victim.id, bitis: Date.now()+ms(time) });
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: victim.id, id: cezaID, zaman: Date.now(), komut: "METİN-SUSTURMA" });
    db.set(`mstatus.${victim.id}.${message.guild.id}`, true);
    db.push(`sicil.${victim.id}.${message.guild.id}`, { mod: message.author.id, sebep: reason, id: cezaID, zaman: Date.now(), komut: "METİN-SUSTURMA" });
    db.add(`cezapuan.${victim.id}.${message.guild.id}`, +7);
    db.add(`cmuteCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`cmute.${victim.id}.${message.guild.id}`, +1);
    let cpuan = db.get(`cezapuan.${victim.id}.${message.guild.id}`);
  //120 puanı geçerse cezalıya atar
    if (cpuan > 120 ) {
        victim.roles.cache.has(ayar.boosterRol) ? victim.roles.set([ayar.boosterRol, ayar.cezaliRol]) : victim.roles.set([ayar.cezaliRol]);
       
    }
    message.channel.send(` ${victim} ${yaziSure} boyunca metin kanallarında susturuldu. (\`#${cezaID}\`) `)


    if (message.guild.channels.cache.has(ayar.muteLogKanali)) message.guild.channels.cache.get(ayar.muteLogKanali).send(embed.setDescription(`${victim} (\`${victim.user.username}\` - \`${victim.id}\`) adlı üye ${yaziSure} boyunca metin kanallarında susturuldu. (\`#${cezaID}\`) \n \n\`•\` Yetkili: ${message.author} (\`${message.author.id}\`) \n\`•\` Metin kanalında susturulma: ${muteAtılma} \n\`•\` Metin kanalında susturulma bitiş: ${muteBitiş} \n\`•\` Sebep: ${reason}`));
victim.send(`**- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -**\n \n \nMerhaba, ${victim.user.username}\n \n Sunucumuzda ${yaziSure} boyunca ${reason} sebebiyle metin kanallarında susturuldunuz. Başka bir ceza alma durumunuzda bu cezayı göz önünde bulunduracağız diğer cezaların bu duruma göre artabilir.\n \n Kurallarımıza tekrardan göz atmanı istiyoruz. Okumak için <#773281624212635700> kanalından kurallarımızı okuyun.`)
if (ayar.cezapuanlog && client.channels.cache.has(ayar.cezapuanlog)) client.channels.cache.get(ayar.cezapuanlog).send(`${victim} : aldığınız **#${cezaID}** ID'li ceza ile **${cpuan || '0'}** ceza puanına ulaştınız. `).catch();

};

module.exports.configuration = {
    name: "mute",
    aliases: ["cmute", "chatmute", "sustur"],
    usage: "",
    description: ""
};
