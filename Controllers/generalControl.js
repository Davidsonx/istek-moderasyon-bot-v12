const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkingAll();
    }, 10000);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkingAll() {
    let jail = db.get("jail") || [];
    let mute = db.get("tempmute") || [];

    let bans = db.get("bans") || [];
    let ban = db.get("ban") || [];
   let sesmuteler = db.get("tempsmute") || [];


    for (let jailUye of jail) {
        let kullanici = client.guilds.cache.get(ayar.sunucuID).members.cache.get(jailUye.id);
        if (kullanici && !kullanici.roles.cache.has(ayar.cezaliRol)) {
            kullanici.roles.cache.has(ayar.boosterRol) ? kullanici.roles.set([ayar.boosterRol, ayar.cezaliRol]) : kullanici.roles.set([ayar.cezaliRol]).catch();
            if (kullanici.voice.channel) kullanici.voice.kick();
        };
    };

    for (let muteUye of mute) {
        let kullanici = client.guilds.cache.get(ayar.sunucuID).members.cache.get(muteUye.id);
        if (Date.now() >= muteUye.bitis) {
            if (kullanici && kullanici.roles.cache.has(ayar.muteRol)) kullanici.roles.remove(ayar.muteRol).catch();
            db.set("tempmute", mute.filter(x => x.id !== muteUye.id));
        }else{
            if (kullanici && !kullanici.roles.cache.has(ayar.muteRol)) kullanici.roles.add(ayar.muteRol).catch();
        };
    };

   
  for (let ceza of sesmuteler) {
    let uye = client.guilds.cache.get(ayar.sunucuId).members.cache.get(ceza.id);
    if (Date.now() >= ceza.kalkmaZamani) {
      db.set("tempsmute", sesmuteler.filter(x => x.id !== ceza.id));
      if (uye && uye.voice.channel && uye.voice.serverMute) uye.voice.setMute(false);
    } else {
      if (uye && uye.voice.channel && !uye.voice.serverMute) uye.voice.setMute(true);
    };
  };



	
	
	 


    for (let yasak of bans) {
        let kullanici = client.guilds.cache.get(ayar.sunucuID).members.cache.get(yasak.id);
        if (kullanici) {
            kullanici.ban({reason: "Ban Kontrol"}).catch();
        };
    };





};
