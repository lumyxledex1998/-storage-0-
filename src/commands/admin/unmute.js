const fs = require("fs");
const path = require("path");
const { PREFIX, DATABASE_DIR } = require(`${BASE_DIR}/config`);

const DB_PATH = path.join(`${DATABASE_DIR}`, "muted.json");

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
}

module.exports = {
  name: "unmute",
  description: "Desativa o mute de um membro do grupo",
  commands: ["unmute", "desmutar"],
  usage: `${PREFIX}unmute @usuario`,
  handle: async ({
    webMessage,
    remoteJid,
    sendErrorReply,
    sendSuccessReply,
    isGroup,
  }) => {

    const contextInfo =
      webMessage.message?.extendedTextMessage?.contextInfo ||
      webMessage.message?.conversation?.contextInfo ||
      {};

    const mentions = contextInfo.mentionedJid || [];

    if (mentions.length === 0) {
      return sendErrorReply("Você precisa mencionar um usuário para desmutar.");
    }

    const unmutedId = mentions[0];
    const db = JSON.parse(fs.readFileSync(DB_PATH));

    if (!db[remoteJid] || !db[remoteJid].includes(unmutedId)) {
      return sendErrorReply("Este usuário não está silenciado.");
    }

    db[remoteJid] = db[remoteJid].filter((jid) => jid !== unmutedId);

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

    sendSuccessReply("Usuário desmutado com sucesso.");
  },
};