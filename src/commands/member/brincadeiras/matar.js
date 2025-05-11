const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "Matar",
  description: "Mata um usuário desejado.",
  commands: ["matar"],
  usage: `${PREFIX}matar @usuario`,
  handle: async ({ socket, webMessage, sendErrorReply, userJid, remoteJid, replyJid }) => {
    const mentionedJid = webMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = replyJid || (mentionedJid.length ? mentionedJid[0] : null);

    if (!target) {
      return sendErrorReply('Você precisa mencionar um usuário ou responder uma mensagem para Matar.');
    }

    const user = userJid.split("@")[0];
    const targetUser = target.split("@")[0];

    await socket.sendMessage(remoteJid, {
      video: { url: 'https://media.tenor.com/b7UhYIWfmXEAAAPo/yumeko-mirai-nikki.mp4' },
      caption: `@${user} matou brutalmente @${targetUser}!`,
      gifPlayback: true,
      mentions: [userJid, target]
    });
  },
};