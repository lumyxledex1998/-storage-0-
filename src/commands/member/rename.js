const fs = require("node:fs");
const path = require("node:path");
const { PREFIX } = require(`${BASE_DIR}/config`);
const addStickerMetadata = require(`${BASE_DIR}/services/addStickerMetadata`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { 
  isAnimatedSticker,
  processStaticSticker,
  processAnimatedSticker
} = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "rename",
  description: "Adiciona novos meta-dados à figurinha.",
  commands: ["rename", "renomear", "rn"],
  usage: `${PREFIX}rename Usuário/Bot (responda a uma figurinha)`,
  handle: async ({
    isSticker,
    downloadSticker,
    webMessage,
    sendWaitReact,
    sendSuccessReact,
    sendStickerFromFile,
    sendErrorReply,
    fullArgs,
  }) => {
    if (!isSticker) {
      throw new InvalidParameterError("Você precisa responder a uma figurinha!");
    }

    let userInput = fullArgs?.trim();
    if (!userInput || !userInput.includes("/")) {
      throw new InvalidParameterError(
        "Você precisa fornecer os parâmetros no formato Usuário/Bot!"
      );
    }

    const [username, botName] = userInput.split("/").map(param => param.trim());
    if (!username || !botName) {
      throw new InvalidParameterError("Use o formato Usuário/Bot.");
    }

    let inputPath = null;
    let finalStickerPath = null;

    try {
      await sendWaitReact();

      inputPath = await downloadSticker(webMessage, "input");

      if (!inputPath || !fs.existsSync(inputPath)) {
        throw new Error("Erro ao baixar a figurinha.");
      }

      const metadata = {
        username,
        botName,
      };

      const isAnimated = await isAnimatedSticker(inputPath);

      if (isAnimated) {
        finalStickerPath = await processAnimatedSticker(inputPath, metadata, addStickerMetadata);
      } else {
        finalStickerPath = await processStaticSticker(inputPath, metadata, addStickerMetadata);
      }

      await sendStickerFromFile(finalStickerPath);
      await sendSuccessReact();

    } catch (err) {
      console.error("Erro no comando rename:", err);
      const errorMessage = err instanceof InvalidParameterError
        ? err.message
        : "Erro ao processar a figurinha. Tente novamente.";

      await sendErrorReply(errorMessage);
    } finally {
      if (inputPath && fs.existsSync(inputPath)) {
        try {
          fs.unlinkSync(inputPath);
        } catch (e) {
          console.error("Erro ao remover arquivo temporário:", e);
        }
      }

      if (finalStickerPath && fs.existsSync(finalStickerPath)) {
        try {
          fs.unlinkSync(finalStickerPath);
        } catch (e) {
          console.error("Erro ao remover arquivo temporário:", e);
        }
      }
    }
  },
};
