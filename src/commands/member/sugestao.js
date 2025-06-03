const { PREFIX, DATABASE_DIR, BOT_EMOJI } = require(`${BASE_DIR}/config`);
const fs = require('fs');
const path = require('path');

const SUGGESTIONS_FILE = path.join(DATABASE_DIR, 'suggestions.json');

const getNextId = (suggestions) => {
  if (suggestions.length === 0) return 1;
  const maxId = Math.max(...suggestions.map(s => s.id));
  return maxId + 1;
};

module.exports = {
  name: "sugestão",
  description: "Envia uma sugestão para os administradores",
  commands: ["sugestão", "sugerir", "suggestion"],
  usage: `${PREFIX}sugestão <texto>`,
  handle: async ({
    fullArgs,
    userJid,
    remoteJid,
    socket,
    webMessage,
    sendReply,
    sendSuccessReact,
    sendErrorReply
  }) => {
    if (!fullArgs) {
      return sendErrorReply(` ❌ Forneça uma sugestão. Ex: ${PREFIX}sugestão Melhorar o bot`);
    }

    try {
      const suggestions = fs.existsSync(SUGGESTIONS_FILE)
        ? JSON.parse(fs.readFileSync(SUGGESTIONS_FILE))
        : [];

      const suggestionId = getNextId(suggestions);
      const senderName = webMessage.pushName || "Anônimo";
      const now = new Date();

      const newSuggestion = {
        id: suggestionId,
        userJid,
        userName: senderName,
        groupJid: remoteJid,
        groupName: await getGroupName(socket, remoteJid, webMessage),
        description: fullArgs,
        date: now.toLocaleDateString('pt-BR'),
        status: "aberta", 
        timestamp: now.getTime()
      };

      suggestions.push(newSuggestion);
      fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2));

      await sendSuccessReact();
      await sendReply(
        `✅ *Sugestão #${suggestionId} registrada!*\n\n` +
        `👤 Autor: ${senderName}\n` +
        `📝 Conteúdo: ${fullArgs}\n` +
        `📅 Data: ${newSuggestion.date}\n` +
        `🔄 Status: ABERTA`
      );

    } catch (error) {
      console.error("Erro no sugestão:", error);
      await sendErrorReply(`❌ Erro ao registrar sugestão`);
    }
  }
};

async function getGroupName(socket, remoteJid, webMessage) {
  if (!remoteJid.endsWith('@g.us')) return "Chat privado";
  
  try {
    const groupInfo = await socket.groupMetadata(remoteJid);
    return groupInfo.subject || "Grupo sem nome";
  } catch (e) {
    console.error("Erro ao obter grupo:", e);
    return webMessage?.message?.contextInfo?.quotedMessage?.groupSubject || "Grupo sem nome";
  }
}