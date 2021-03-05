const { Discord, MessageEmbed } = require('discord.js');
const ayar = require("../settings.json");
const moment = require("moment");
const db = require("quick.db");

module.exports = (member) => {

    if (member.user.bot) return;

    let durum = Date.now()-member.createdTimestamp < 1000 * 60 * 60 * 24 * 7;

    if (durum) {
        member.roles.set([ayar.cezaliRol]).catch();
        if (member.guild.channels.cache.has(ayar.yeniHesapLogKanali)) member.guild.channels.cache.get(ayar.yeniHesapLogKanali).send(`${member} (\`${member.id}\`) adlı üye sunucuya giriş yaptı ancak hesabı yeni açıldığı için cezalıya atıldı.`);
    }else{
        let jailStatus = db.fetch(`jstatus.${member.id}.${member.guild.id}`);
        let muteStatus = db.fetch(`mstatus.${member.id}.${member.guild.id}`);
        let voiceStatus = db.fetch(`vstatus.${member.id}.${member.guild.id}`);
        
        if (jailStatus) {
            member.roles.set([ayar.cezaliRol]).catch();
            return;
        }

        if (muteStatus) {
            member.roles.add(ayar.muteRol).catch();
            return;
        }

        if (voiceStatus) {
            member.voice.setMute(true);
            member.roles.add(ayar.voiceMuteRol).catch();
            return;
        }

    

        member.roles.add(ayar.kayıtsızRol).catch();
    }

};

module.exports.configuration = {
    name: "guildMemberAdd"
  }