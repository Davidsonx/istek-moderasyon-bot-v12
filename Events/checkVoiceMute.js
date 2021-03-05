const {MessageEmbed}= require("discord.js");
const db = require("quick.db");


module.exports = (oldState, newState) => {
  if((!oldState.channel && newState.channel) || (oldState.channel && newState.channel)){ 
    let data = db.get("tempsmute") || [{id: null,kalkmaZamani: null}];
    let member = newState.member;
    if(!member) return;
    if(data.some(d => d.id == member.id)){
      let d = data.find(x => x.id == member.id);
      if(Date.now() >= d.kalkmaZamani){
        data = data.filter(d => d.id != member.id);
        member.voice.setMute(false)
        db.set("tempsmute", data);
      } else if(member.voice.channel && !member.voice.serverMute){
       member.voice.setMute(true)
      }
    
    }
  }
}

module.exports.configuration = {
  name: "voiceStateUpdate"
}