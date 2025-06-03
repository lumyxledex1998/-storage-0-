const { PREFIX, DATABASE_DIR, BOT_EMOJI } = require(`${BASE_DIR}/config`);
const fs = require('fs');
const path = require('path');

const SUGGESTIONS_FILE = path.join(DATABASE_DIR, 'suggestions.json');

module.exports = {
  name: "fechar-sugestão",
  description: "Marca sugestão como resolvida (sem reutilizar IDs)",
  commands: ["fechar-sugestão", "fs", "concluir-sugestão"],
  usage: `${PREFIX}fechar-sugestão <ID>`,
  handle: async ({
    args,
    userJid,
    sendReply,
    sendSuccessReact,
    sendErrorReply
  }) => {
    const suggestionId = parseInt(args[0]);
    if (isNaN(suggestionId)) {
      return sendErrorReply(` ❌ ID inválido! Use: ${PREFIX}fechar-sugestão 1`);
    }

    try {
      const suggestions = fs.existsSync(SUGGESTIONS_FILE)
        ? JSON.parse(fs.readFileSync(SUGGESTIONS_FILE))
        : [];

      const index = suggestions.findIndex(s => s.id === suggestionId && s.status === "aberta");
      
      if (index === -1) {
        return sendErrorReply(` ❌ Sugestão #${suggestionId} não encontrada ou já fechada`);
      }

      suggestions[index] = {
        ...suggestions[index],
        status: "fechada",
        closedBy: userJid,
        closedAt: new Date().toLocaleDateString('pt-BR')
      };

      fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2));

      await sendSuccessReact();
      await sendReply(
        ` ✅ *Sugestão #${suggestionId} concluída!*\n\n` +
        `👤 Autor: ${suggestions[index].userName}\n` +
        `📝 Conteúdo: ${suggestions[index].description}\n` +
        `🗓️ Aberta em: ${suggestions[index].date}\n` +
        `🔒 Fechada em: ${suggestions[index].closedAt}`
      );

    } catch (error) {
      console.error("Erro ao fechar sugestão:", error);
      await sendErrorReply(`b ❌ Erro ao processar`);
    }
  }
};