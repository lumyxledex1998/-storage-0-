const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "agendar-mensagem",
  description: "Agenda uma mensagem para ser enviada após um tempo definido",
  commands: ["agendar", "agendar-mensagem"],
  usage: `${PREFIX}agendar-mensagem <mensagem> <tempo>`,
  handle: async ({
    args,
    fullArgs,
    sendErrorReply,
    sendWaitReact,
    socket,
    remoteJid,
    sendReply
  }) => {
    if (!fullArgs || fullArgs.split(" ").length < 2) {
      return await sendErrorReply(
        `Formato incorreto. Use: ${PREFIX}agendar-mensagem [mensagem] [tempo]\nExemplo: ${PREFIX}agendar-mensagem "Reunião amanhã" 10m`
      );
    }

    const partes = fullArgs.split(" ");
    const tempoRaw = partes.pop().toLowerCase();
    const mensagem = partes.join(" ");
    let tempoMs = 0;

    if (/^\d+s$/.test(tempoRaw)) {
      tempoMs = parseInt(tempoRaw) * 1000;
    } else if (/^\d+m$/.test(tempoRaw)) {
      tempoMs = parseInt(tempoRaw) * 60 * 1000;
    } else if (/^\d+h$/.test(tempoRaw)) {
      tempoMs = parseInt(tempoRaw) * 60 * 60 * 1000;
    } else {
      return await sendErrorReply(
        "Formato de tempo inválido. Use:\n• `10s` para 10 segundos\n• `5m` para 5 minutos\n• `2h` para 2 horas"
      );
    }

    if (!mensagem || mensagem.trim() === "" || isNaN(tempoMs) || tempoMs <= 0) {
      return await sendErrorReply("Mensagem inválida ou tempo não especificado corretamente.");
    }

    await sendWaitReact();
    await sendReply(`⌛ Mensagem agendada para daqui a ${tempoRaw}...`);

    setTimeout(async () => {
      try {
        await socket.sendMessage(remoteJid, {
          text: `⏰ *Mensagem agendada:*\n\n${mensagem}`,
        });
      } catch (error) {
        console.error("Erro ao enviar mensagem agendada:", error);
      }
    }, tempoMs);
  },
};