const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "ping",
  description: "Verificar se o bot está online",
  commands: ["ping"],
  usage: `${PREFIX}ping`,
  handle: async ({ sendReply, sendReact }) => {
    const start = Date.now();
    await sendReact("🏓");
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const ping = Date.now() - start;
    await sendReply(`🏓 Pong!

📶 Velocidade de resposta: ${ping}ms\n⏱️ Uptime: ${h}h ${m}m ${s}s`);
  },
};