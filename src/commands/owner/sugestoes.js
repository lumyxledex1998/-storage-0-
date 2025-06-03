const { PREFIX, DATABASE_DIR, BOT_EMOJI } = require(`${BASE_DIR}/config`);
const fs = require('fs');
const path = require('path');

const SUGGESTIONS_FILE = path.join(DATABASE_DIR, 'suggestions.json');

module.exports = {
  name: "ver-sugestões",
  description: "Lista sugestões abertas ou fechadas",
  commands: ["sugestões", "versug", "listsug"],
  usage: `${PREFIX}sugestões [fechadas]`,
  handle: async ({
    args,
    sendReply,
    sendErrorReply
  }) => {
    try {
      if (!fs.existsSync(SUGGESTIONS_FILE)) {
        return sendReply(` 📭 Nenhuma sugestão registrada ainda.`);
      }

      const allSuggestions = JSON.parse(fs.readFileSync(SUGGESTIONS_FILE));
      
      const showClosed = args[0]?.toLowerCase() === 'fechadas';
      const suggestions = showClosed
        ? allSuggestions.filter(s => s.status === "fechada")
        : allSuggestions.filter(s => s.status === "aberta");

      if (suggestions.length === 0) {
        return sendReply(
          ` 📭 Nenhuma sugestão ` +
          (showClosed ? "fechada" : "aberta") +
          ` encontrada.`
        );
      }

      const sorted = suggestions.sort((a, b) => b.id - a.id);
      const limited = sorted.slice(0, 15);

      let message = ` 📋 *SUGESTÕES ${showClosed ? 'FECHADAS' : 'ABERTAS'}* `;
      message += `[${suggestions.length} total]\n\n`;

      sorted.forEach(sug => {
        message +=
          `🆔  Id: *${sug.id}*\n` +
          `👤 Autor: ${sug.userName}\n` +
          `📅 Data: ${sug.date}\n` +
          `📍 Grupo ${sug.groupName}\n` +
          `✏️ Descrição: ${sug.description}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      });

      if (suggestions.length > 15) {
        message += ` 📌 Mostrando 15 de ${suggestions.length} sugestões\n`;
      }

      await sendReply(message);

    } catch (error) {
      console.error("Erro em sugestões:", error);
      await sendErrorReply(
        ` ❌ Erro ao carregar sugestões\n` +
        `Tente: ${PREFIX}sugestões [fechadas]`
      );
    }
  }
};