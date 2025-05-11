const { PREFIX, TEMP_DIR } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors/InvalidParameterError`);
const fs = require("fs");
const { getRandomNumber } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "reveal",
  description: "Revela qualquer tipo de mídia removendo restrições",
  commands: ["reveal", "rmvonce", "unrestrict"],
  usage: `${PREFIX}reveal (responda a qualquer mídia)`,
  handle: async ({
    isReply,
    webMessage,
    downloadImage,
    downloadVideo,
    sendSuccessReact,
    sendErrorReply,
    sendWaitReact,
    sendImageFromFile,
    sendVideoFromFile,
    sendErrorReact
  }) => {
    await sendWaitReact();

    let mediaType, inputPath, mediaMessage;
    try {
      const targetMessage = isReply ?
        webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage :
        webMessage.message;

      const viewOnceContent =
        targetMessage?.viewOnceMessageV2?.message ||
        targetMessage?.viewOnceMessage?.message ||
        targetMessage?.ephemeralMessage?.message?.viewOnceMessageV2?.message ||
        targetMessage?.ephemeralMessage?.message?.viewOnceMessage?.message;

      mediaMessage = viewOnceContent || targetMessage;

      mediaType =
        mediaMessage.imageMessage ? "image" :
        mediaMessage.videoMessage ? "video" :
        mediaMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ? "image" :
        mediaMessage?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage ? "video" :
        null;

      if (!mediaType) {
        throw new InvalidParameterError("Nenhuma mídia detectada! Envie ou responda a uma imagem/vídeo");
      }

      const tempMessage = {
        message: {
          [`${mediaType}Message`]: 
            mediaMessage[`${mediaType}Message`] ||
            mediaMessage?.extendedTextMessage?.contextInfo?.quotedMessage[`${mediaType}Message`]
        }
      };

      inputPath = mediaType === "image" ?
        await downloadImage(tempMessage, "input") :
        await downloadVideo(tempMessage, "input");

      if (mediaType === "image") {
        await sendImageFromFile(inputPath);
      } else {
        await sendVideoFromFile(inputPath);
      }

      fs.unlinkSync(inputPath);
      await sendSuccessReact();

    } catch (error) {
      if (inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
      
      if (error instanceof InvalidParameterError) {
        await sendErrorReply(error.message);
      } else {
        console.error("Erro no reveal:", error);
        await sendErrorReply("Falha ao processar a mídia!");
      }
      await sendErrorReact();
    }
  }
};