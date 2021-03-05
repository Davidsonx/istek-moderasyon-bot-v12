const Discord = require('discord.js');

module.exports.execute = async (client, message, args) => {
	if(message.author.id !== "329701850037092352")
  return message.channel.send('Bu komudu kullanman için yetkin yok.')

	
	if (args[0] == 'mod') {
	davidson.send(`**Moderation** botuna ${message.author} (\`${message.author.id}\`) tarafından restart atıldı.`)

 message.channel.send(`Bot yeniden başlatılıyor...`).then(msg => {
    console.log(`BOT: Bot yeniden başlatılıyor...`);

    process.exit(0);
    
  })
};
}

module.exports.configuration = {
    name: "r",
    aliases: [],
    usage: "",
    description: ""
};
