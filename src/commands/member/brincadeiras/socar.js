const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "socar",
  description: "Bate em um usuário com um soco",
  commands: ["socar"],
  usage: `${PREFIX}socar @usuario`,
  handle: async ({ socket, webMessage, sendErrorReply, userJid, remoteJid, replyJid }) => {
    const mentionedJid = webMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = replyJid || (mentionedJid.length ? mentionedJid[0] : null);

    if (!target) {
      return sendErrorReply('Você precisa mencionar um usuário ou responder uma mensagem para socar.');
    }

    const user = userJid.split("@")[0];
    const targetUser = target.split("@")[0];

    await socket.sendMessage(remoteJid, {
      video: { url: 'https://media.tenor.com/wYyB8BBA8fIAAAPo/some-guy-getting-punch-anime-punching-some-guy-anime.mp4' },
      caption: `@${user} Deu um soco bombástico em @${targetUser}!`,
      gifPlayback: true,
      mentions: [userJid, target]
    });
  },
};