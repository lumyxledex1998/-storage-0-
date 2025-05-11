const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "beijo",
  description: "Beija um usuário que vc ama",
  commands: ["beijar"],
  usage: `${PREFIX}beijar @usuario`,
  handle: async ({ socket, webMessage, sendErrorReply, userJid, remoteJid, replyJid }) => {
    const mentionedJid = webMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = replyJid || (mentionedJid.length ? mentionedJid[0] : null);

    if (!target) {
      return sendErrorReply('Você precisa mencionar um usuário ou responder uma mensagem para Beijar.');
    }

    const user = userJid.split("@")[0];
    const targetUser = target.split("@")[0];

    await socket.sendMessage(remoteJid, {
      video: { url: 'https://media.tenor.com/_8oadF3hZwIAAAPo/kiss.mp4' },
      caption: `@${user} Beijou @${targetUser}!`,
      gifPlayback: true,
      mentions: [userJid, target]
    });
  },
};