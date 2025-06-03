const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "dado",
  description: "Jogue um dado de 1 a 6 e tente acertar o número para ganhar!",
  commands: ["dado", "dice"],
  usage: `${PREFIX}dado <número>`,
  handle: async ({
    args,
    sendReply,
    sendStickerFromURL,
    sendReact,
    webMessage
  }) => {
    const numeroApostado = parseInt(args[0]);
    
    if (!numeroApostado || numeroApostado < 1 || numeroApostado > 6) {
      return await sendReply(`❌ Por favor, escolha um número entre 1 e 6!\nExemplo: ${PREFIX}dado 3`);
    }

    await sendReply("🎲 Rolando o dado...");

    const dados = [
      { url: "https://i.ibb.co/zmVD85Z/53025f3f00f8.webp", no: 6 },
      { url: "https://i.ibb.co/BchBsJ1/0b7b4a9b811d.webp", no: 5 },
      { url: "https://i.ibb.co/25Pf1sY/a66d2b63f357.webp", no: 4 },
      { url: "https://i.ibb.co/hccTrhd/5b36dd6442b8.webp", no: 3 },
      { url: "https://i.ibb.co/9tPHPDt/544dbba5bb75.webp", no: 2 },
      { url: "https://i.ibb.co/y040HHw/3e583d6459e6.webp", no: 1 }
    ];

    const resultado = dados[Math.floor(Math.random() * dados.length)];
    const pushName = webMessage?.pushName || "Usuário";

    await sendStickerFromURL(resultado.url);

    await new Promise(resolve => setTimeout(resolve, 3200));

    if (numeroApostado === resultado.no) {
      await sendReply(`🎉 *${pushName} GANHOU!* Você apostou no *${numeroApostado}* e o dado caiu em *${resultado.no}*! 🍀`);
      await sendReact("🏆");
    } else {
      await sendReply(`💥 *${pushName} PERDEU...* Você apostou no *${numeroApostado}* mas o dado caiu em *${resultado.no}*! Tente novamente.`);
      await sendReact("❌");
    }
  }
};