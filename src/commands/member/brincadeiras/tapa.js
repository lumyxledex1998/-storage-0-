const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "Tapa",
  description: "Dá um tapa em alguém",
  commands: ["tapa"],
  usage: `${PREFIX}tapa @usuario ou reply`,
  handle: async ({ socket, webMessage, sendErrorReply, userJid, remoteJid }) => {
    let target;
    
    if (webMessage?.message?.extendedTextMessage?.contextInfo?.participant) {
      target = webMessage.message.extendedTextMessage.contextInfo.participant;
    } 
    
    else if (webMessage?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
      target = webMessage.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } 
    
    else {
      return sendErrorReply('Você precisa mencionar um usuário ou responder uma mensagem para dar um Tapa.');
    }

    const user = userJid.split("@")[0];
    const targetUser = target.split("@")[0];

    await socket.sendMessage(remoteJid, {
      video: { url: 'https://media.tenor.com/eU5H6GbVjrcAAAPo/slap-jjk.mp4' },
      caption: `@${user} Deu um tapa na cara de @${targetUser}!`,
      gifPlayback: true,
      mentions: [userJid, target]
    });
  },
};