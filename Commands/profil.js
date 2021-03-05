const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../settings.json");
const moment = require("moment");
module.exports.execute = async (client, message, args) => {
    let executor = message.member

    let embed = new MessageEmbed().setAuthor(executor.user.tag, executor.user.displayAvatarURL({dynamic: true})).setFooter(ayar.conf).setColor("RED").setTimestamp();
    let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let uye = message.guild.member(victim)
 const filter = (reaction, user) => {
        return ["✅"].includes(reaction.emoji.name) && user.id === message.author.id; 
    };
    let jail = await db.get(`jail.${victim.id}.${message.guild.id}`);
    let ban = await db.get(`ban.${victim.id}.${message.guild.id}`);
    let cmute = await db.get(`cmute.${victim.id}.${message.guild.id}`);
    let vmute = await db.get(`vmute.${victim.id}.${message.guild.id}`);
    let jailCez = await db.get(`jailCez.${victim.id}.${message.guild.id}`);
    let banCez = await db.get(`banCez.${victim.id}.${message.guild.id}`);
    let cmuteCez = await db.get(`cmuteCez.${victim.id}.${message.guild.id}`);
    let vmuteCez = await db.get(`vmuteCez.${victim.id}.${message.guild.id}`);
    let cpuan = await db.get(`cezapuan.${victim.id}.${message.guild.id}`);

    let durum;
    if (cpuan >= 50) durum = "Tehlikeli";
    if (cpuan < 50) durum = "Güvenli";
    if (cpuan == null || cpuan == undefined) durum = "Veritabanında bir şey bulamadım.";

    let cezabilgisi = `${jail || '0'} adet jail, ${ban || '0'} adet ban, ${cmute+vmute || '0'} mute (${cmute || '0'} chat - ${vmute || '0'} ses), cezası mevcut.`;
    let cezalandirmaBilgisi = `${jailCez || '0'} adet jail, ${banCez || '0'} adet ban, ${cmuteCez+vmuteCez || '0'} mute (${cmuteCez || '0'} chat - ${vmuteCez || '0'} ses), cezalandırması mevcut.`;
    let profilBilgi = `${victim.presence.status.replace("idle", "Boşta").replace("dnd", "Rahatsız Etmeyin").replace("offline", "Çevrimdışı/Görünmez").replace("online", "Çevrimiçi")}`;
    let sunucuyaGiris = `${new Date(uye.joinedAt).toTurkishFormatDate()}`;
    let olusturulmaTarihi = `${new Date(victim.createdAt).toTurkishFormatDate()}`;
    let takmaAd = `${uye.displayName.replace("`", "")} ${uye.nickname ? "" : "[Yok]"}`;
    
    message.channel.send(embed.setDescription(`\`\`\`
Kullanıcı Bilgisi;

• Kullanıcı Adı: ${victim.username.replace("`", "")}
• Kullanıcı ID: ${victim.id}
• Durumu: ${profilBilgi}
• Oluşturulma Tarihi: ${olusturulmaTarihi}

Üye Bilgisi;

• Sunucuya Giriş Tarihi: ${sunucuyaGiris}
• Takma İsim: ${takmaAd}
    \`\`\``).setFooter(`Cezalar için 10 saniye içinde tepkiye tıkla.`, message.author.avatarURL({dynamic: true}))).then(x => {
x.react("✅");  
x.awaitReactions(filter, {max: 1, time: 10000, error: ['time']}).then(z => {
            let donut = z.first();
            if (donut) {
				
			  x.edit(embed.setDescription(`• Aldığı Cezalar: ${cezabilgisi}\n \n• Verdiği Cezalar: ${cezalandirmaBilgisi}\n \n  • Ceza Puanı: ${cpuan || '0'} (${durum})`));
            };
        });
	    });		
};

module.exports.configuration = {
    name: "veritabanı",
    aliases: ["profile", "userinfo"],
    usage: "",
    description: ""
};
