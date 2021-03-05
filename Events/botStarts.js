module.exports = () => {
    console.log("Bot başarıyla çalıştırıldı.");
    client.user.setPresence({ activity: { name: "Project ❤️ Davidson" }, status: "idle" });
  }
  module.exports.configuration = {
    name: "ready"
  }