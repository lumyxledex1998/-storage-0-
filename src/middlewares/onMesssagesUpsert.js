/**
 * Evento chamado quando uma mensagem
 * é enviada para o grupo do WhatsApp
 * 
 * @author Dev Gui
 */
const {
  isAtLeastMinutesInPast,
  GROUP_PARTICIPANT_ADD,
  GROUP_PARTICIPANT_LEAVE,
  isAddOrLeave,
} = require("../utils");
const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { onGroupParticipantsUpdate } = require("./onGroupParticipantsUpdate");
const { checkMutedUser } = require("../utils/checkMutedUser");

exports.onMessagesUpsert = async ({ socket, messages, groupCache }) => {
  if (!messages?.length) {
    return;
  }

  for (const webMessage of messages) {
    try {
      if (isAtLeastMinutesInPast(webMessage.messageTimestamp)) {
        continue;
      }

      if (isAddOrLeave.includes(webMessage.messageStubType)) {
        await handleGroupParticipantsUpdate({ webMessage, socket, groupCache });
        continue;
      }

      const wasDeleted = await checkMutedUser({
        socket,
        webMessage,
        developerDebug: process.env.NODE_ENV !== 'production'
      });

      if (wasDeleted) {
        continue;
      }

      await processNormalMessage({ socket, webMessage });

    } catch (error) {
      console.error('💥 Erro ao processar mensagem:', error);
    }
  }
};

async function handleGroupParticipantsUpdate({ webMessage, socket, groupCache }) {
  const action = webMessage.messageStubType === GROUP_PARTICIPANT_ADD 
    ? "add" 
    : "remove";

  await onGroupParticipantsUpdate({
    userJid: webMessage.messageStubParameters[0],
    remoteJid: webMessage.key.remoteJid,
    socket,
    groupCache,
    action,
  });
}

async function processNormalMessage({ socket, webMessage }) {
  const commonFunctions = loadCommonFunctions({ socket, webMessage });
  
  if (commonFunctions) {
    await dynamicCommand(commonFunctions);
  }
}