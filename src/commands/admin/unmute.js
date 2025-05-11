const fs = require("fs");
const path = require("path");
const {
  PREFIX,
  DATABASE_DIR,
  BOT_NUMBER
} = require(`${BASE_DIR}/config`);
const MUTE_DATA_FILE = path.join(`${DATABASE_DIR}/muted.json`);

module.exports = {
  name: "unmute",
  description: "Remove o silenciamento de um usuário no grupo.",
  commands: ["unmute", "desmutar"],
  usage: `${PREFIX}unmute <@usuario> ou (responda à mensagem do usuário que deseja desmutar)`,
  handle: async ({
    remoteJid,
    replyJid,
    args,
    userJid,
    socket,
    sendReply,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
    sendWarningReply,
    sendText,
  }) => {
    try {
      const botJid = `${BOT_NUMBER}@s.whatsapp.net`;

      const targetUser = replyJid || (args.length ? args[0].replace(/[@<>]/g, "") + "@s.whatsapp.net" : null);
      if (!targetUser) {
        return sendWarningReply(
          `Você precisa mencionar um usuário ou responder à mensagem do usuário que deseja desmutar.\n\nExemplo: ${PREFIX}unmute @fulano`
        );
      }

      if (targetUser === userJid) {
        return sendErrorReply("❌ Você não pode se auto-desmutar.");
      }

      if (targetUser === botJid) {
        return sendErrorReply("❌ Você não pode desmutar o bot.");
      }

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const isUserInGroup = groupMetadata.participants.some((participant) => participant.id === targetUser);

      if (!isUserInGroup) {
        return sendErrorReply(`❌ O usuário @${targetUser.split("@")[0]} não está neste grupo.`);
      }

      let muteData = {};
      if (fs.existsSync(MUTE_DATA_FILE)) {
        const data = fs.readFileSync(MUTE_DATA_FILE, "utf8");
        muteData = JSON.parse(data);
      }

      if (!muteData[remoteJid] || !muteData[remoteJid].includes(targetUser)) {
        return sendErrorReply(`❌ O usuário @${targetUser.split("@")[0]} não está silenciado neste grupo.`);
      }

      muteData[remoteJid] = muteData[remoteJid].filter((jid) => jid !== targetUser);

      await sendWaitReact();

      fs.writeFileSync(MUTE_DATA_FILE, JSON.stringify(muteData, null, 2));

      return sendText(
        `✅ @${targetUser.split("@")[0]} foi desmutado com sucesso neste grupo!`,
        [targetUser]
      );
    } catch (error) {
      console.error("Erro ao tentar desmutar o usuário:", error.message);
      return sendErrorReply("❌ Ocorreu um erro ao tentar desmutar o usuário.");
    }
  },
};