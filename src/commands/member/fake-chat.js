const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors/InvalidParameterError`);

module.exports = {
  name: "fake-chat",
  description: "Cria uma citação falsa mencionando um usuário",
  commands: ["fq", "fake-quote", "f-quote", "fake-chat", "fk"],
  usage: `${PREFIX}fq @usuário /texto citado/mensagem que será enviada`,
  handle: async ({
    fullArgs,
    sendErrorReply,
    sendWarningReply,
    remoteJid,
    socket,
  }) => {
    try {
      if (!fullArgs.includes("@") || !fullArgs.includes("/") || fullArgs.split("/").length < 3) {
        throw new InvalidParameterError(`Use: ${PREFIX}fq @usuário /texto citado/mensagem que será enviada`);
      }

      const [mentionRaw, citado, resposta] = fullArgs.split("/").map(str => str.trim());

      const numero = mentionRaw.replace("@", "").replace(/\D/g, "");
      const jid = `${numero}@s.whatsapp.net`;

      if (!citado || !resposta) {
        return await sendWarningReply("Escreva corretamente: @usuário /texto citado/mensagem que será enviada");
      }

      const fakeQuoted = {
        key: {
          fromMe: false,
          participant: jid,
          remoteJid,
        },
        message: {
          extendedTextMessage: {
            text: citado,
            contextInfo: {
              mentionedJid: [jid],
            },
          },
        },
      };

      await socket.sendMessage(remoteJid, { text: resposta }, { quoted: fakeQuoted });
    } catch (e) {
      return await sendErrorReply(e.message || "Erro ao processar comando.");
    }
  },
};