const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const ayar = require("../settings.json");
module.exports = () => {
    setInterval(() => {
      checkBanLimits();
    }, 1000*60*5);
  };
  
  module.exports.configuration = {
    name: "ready"
  };

  function checkBanLimits() {
    db.delete("limitler");
  };