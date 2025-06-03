const fs = require("fs");
const path = require("path");
const {
  PREFIX,
  DATABASE_DIR,
  BOT_NUMBER,
  OWNER_NUMBER
} = require(`${BASE_DIR}/config`);
const MUTE_DATA_FILE = path.join(`${DATABASE_DIR}`, "muted.json");

module.exports = {
  name: "mute",
  description: "Silencia um usuário no grupo (apaga as mensagens do usuário automaticamente).",
  commands: ["mute", "mutar"],
  usage: `${PREFIX}mute <@usuario> ou (responda à mensagem do usuário que deseja mutar)`,
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
          `Você precisa mencionar um usuário ou responder à mensagem do usuário que deseja mutar.\n\nExemplo: ${PREFIX}mute @fulano`
        );
      }

     
      const protegidos = [OWNER_NUMBER];

      if (protegidos.includes(targetUser)) {
throw new DangerError("Você não pode remover esse membro protegido!");
}

      if (targetUser === userJid) {
        return sendErrorReply("❌ Você não pode se auto-mutar.");
      }

      if (targetUser === botJid) {
        return sendErrorReply("❌ Você não pode mutar o bot.");
      }

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const isUserInGroup = groupMetadata.participants.some((participant) => participant.id === targetUser);

      if (!isUserInGroup) {
        return sendErrorReply(`❌ O usuário @${targetUser.split("@")[0]} não está neste grupo.`);
      }

      const isTargetAdmin = groupMetadata.participants.some(
        (participant) => participant.id === targetUser && participant.admin
      );

      if (isTargetAdmin) {
        return sendWarningReply(`Você não pode mutar um administrador.`);
      }

      let muteData = {};
      if (fs.existsSync(MUTE_DATA_FILE)) {
        const data = fs.readFileSync(MUTE_DATA_FILE, "utf8");
        muteData = JSON.parse(data);
      }

      if (!muteData[remoteJid]) {
        muteData[remoteJid] = [];
      }

      if (muteData[remoteJid].includes(targetUser)) {
        return sendErrorReply(`❌ O usuário @${targetUser.split("@")[0]} já está silenciado neste grupo.`);
      }

      muteData[remoteJid].push(targetUser);

      await sendWaitReact();

      fs.writeFileSync(MUTE_DATA_FILE, JSON.stringify(muteData, null, 2));

      return sendText(
        `✅ @${targetUser.split("@")[0]} foi mutado com sucesso neste grupo!`,
        [targetUser]
      );
    } catch (error) {
      console.error("Erro ao tentar silenciar o usuário:", error.message);
      return sendErrorReply("❌ Ocorreu um erro ao tentar silenciar o usuário.");
    }
  },
};
