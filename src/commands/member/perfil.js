const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const path = require("path");
const fs = require("fs");

module.exports = {
  name: "perfil",
  description: "Mostra informações de um usuário",
  commands: ["perfil", "profile"],
  usage: `${PREFIX}perfil @usuário`,
  handle: async ({
    args,
    socket,
    remoteJid,
    userJid,
    sendErrorReply,
    sendWaitReply,
    sendSuccessReact
  }) => {
    const targetJid = args[0]
      ? args[0].replace(/[@ ]/g, "") + "@s.whatsapp.net"
      : userJid;

    try {
      sendWaitReply("Carregando perfil...");

      let profilePicUrl;
      let userName;
      let userLevel = "";
      let userMessages = 0;
      let userRole = "Membro";

      try {
        const contactInfo = await socket.onWhatsApp(targetJid);
        profilePicUrl = await socket.profilePictureUrl(targetJid, "image");
        userName = contactInfo[0]?.name || "Usuário Desconhecido";
      } catch (error) {
        console.log(
          `Erro ao tentar pegar dados do usuário ${targetJid}:`,
          error
        );
      }

      if (!profilePicUrl) {
        profilePicUrl = `${ASSETS_DIR}/images/default-user.png`;
      }

      let groupMessagesData = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "..", "..", "..", "database","groupMessagesData.json"),
          "utf8")
        );
      if (
        groupMessagesData[remoteJid] &&
        groupMessagesData[remoteJid][targetJid]
      ) {
        userMessages = groupMessagesData[remoteJid][targetJid];
      }

      if (userMessages >= 100) {
        userLevel = "Rei do Chat";
      } else if (userMessages >= 50) {
        userLevel = "Mestre da Conversa";
      } else if (userMessages >= 20) {
        userLevel = "Estagiário";
      } else if (userMessages >= 5) {
        userLevel = "Primata Junior";
      } else {
        userLevel = "Iniciante";
      }

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const participant = groupMetadata.participants.find(
        (p) => p.id === targetJid
      );
      if (participant?.admin) {
        userRole = "Admin";
      }

      const porcentagemGado = Math.floor(Math.random() * 100) + 1;
      const precoPrograma = (Math.random() * 5000 + 1000).toFixed(2);
      const nivelBeleza = Math.floor(Math.random() * 100) + 1;

      const mensagem = `
👤 *Nome:* @${targetJid.split("@")[0]}\n\n
🎖️ *Cargo:* ${userRole}\n
📈 *Nível:* ${userLevel}\n
📝 *Mensagens:* ${userMessages}\n
🌚 *Programa:* R$ ${precoPrograma}\n
🐮 *Gado:* ${porcentagemGado}%\n
✨ *Beleza:* ${nivelBeleza}%\n
`;

      await socket.sendMessage(remoteJid, {
        image: { url: profilePicUrl },
        caption: mensagem,
        mentions: [targetJid]
      });

      sendSuccessReact();
    } catch (error) {
      console.error(error);
      sendErrorReply("Ocorreu um erro ao tentar verificar o perfil.");
    }
  }
};
