const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "abraço",
  description: "Abraça um usuário desejado.",
  commands: ["abracar"],
  usage: `${PREFIX}abracar @usuario`,
  handle: async ({ socket, webMessage, sendErrorReply, userJid, remoteJid, replyJid }) => {
    const mentionedJid = webMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = replyJid || (mentionedJid.length ? mentionedJid[0] : null);

    if (!target) {
      return sendErrorReply('Você precisa mencionar um usuário ou responder uma mensagem para Abraçar.');
    }

    const user = userJid.split("@")[0];
    const targetUser = target.split("@")[0];

    await socket.sendMessage(remoteJid, {
      video: { url: 'https://media.tenor.com/wWFm70VeC7YAAAPo/hug-darker-than-black.mp4' },
      caption: `@${user} Deu um abraço apaixonante em @${targetUser}!`,
      gifPlayback: true,
      mentions: [userJid, target]
    });
  },
};