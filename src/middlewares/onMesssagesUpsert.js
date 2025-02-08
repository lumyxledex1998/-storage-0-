const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const path = require("path");
const fs = require("fs");

const { BOT_NUMBER } = require("../config");

let groupMessagesData = {};
const botId = `${BOT_NUMBER}@s.whatsapp.net`;

exports.onMessagesUpsert = async ({ socket, messages }) => {
  if (!messages) {
    return;
  }

  for (const webMessage of messages) {
    const commonFunctions = loadCommonFunctions({ socket, webMessage });

    if (!commonFunctions) {
      continue;
    }

    const isGroupMessage = webMessage.key.remoteJid.endsWith("@g.us");

    if (isGroupMessage) {
      const groupId = webMessage.key.remoteJid;
      const senderId = webMessage.key.participant || webMessage.participant;

      if (senderId === botId) {
        continue;
      }

      if (!groupMessagesData[groupId]) {
        groupMessagesData[groupId] = {};
      }

      if (!groupMessagesData[groupId][senderId]) {
        groupMessagesData[groupId][senderId] = 0;
      }

      groupMessagesData[groupId][senderId] += 1;

      fs.writeFileSync(
        path.join(__dirname, "..", "..", "database", "groupMessagesData.json"),
        JSON.stringify(groupMessagesData, null, 2)
      );
    }

    await dynamicCommand(commonFunctions);
  }
};
