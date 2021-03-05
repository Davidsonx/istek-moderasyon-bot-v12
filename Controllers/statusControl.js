const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkGuildUserStatus();
    }, 10000);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkGuildUserStatus() {
    let jail = db.get("jail") || [];
    let mute = db.get("tempmute") || [];
    let vmute = db.get("tempsmute") || [];

    let sunucu = client.guilds.cache.get(ayar.sunucuID);
    client.guilds.cache.get(ayar.sunucuID).members.cache.forEach(x => {
        if (db.has(`jstatus.${x.id}.${sunucu.id}`) && jail.some(y => y.id !== x.id)) {
            db.set(`jstatus.${x.id}.${sunucu.id}`, false);
        };
        if (db.has(`mstatus.${x.id}.${sunucu.id}`) && mute.some(y => y.id !== x.id)) {
            db.set(`mstatus.${x.id}.${sunucu.id}`, false);
        };
        if (db.has(`vstatus.${x.id}.${sunucu.id}`) && vmute.some(y => y.id !== x.id)) {
            db.set(`vstatus.${x.id}.${sunucu.id}`, false);
        };
    });
  };