const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const ffmpegEffect = require(`${BASE_DIR}/services/FFmpeg`);

module.exports = {
  name: "blur",
  description: "Gero uma montagem que embaça a imagem que você enviar",
  commands: ["blur", "embaça", "embaçar"],
  usage: `${PREFIX}blur (marque a imagem) ou ${PREFIX}blur (responda a imagem)`,
  handle: async ({
    isImage,
    downloadImage,
    sendSuccessReact,
    sendWaitReact,
    sendImageFromFile,
    webMessage,
  }) => {
    if (!isImage) {
      throw new InvalidParameterError(
        "Você precisa marcar uma imagem ou responder a uma imagem"
      );
    }

    await sendWaitReact();
    const filePath = await downloadImage(webMessage);

    try {
      const outputPath = await ffmpegEffect.applyBlur(filePath);
      await sendSuccessReact();
      await sendImageFromFile(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao aplicar efeito de blur");
    } finally {
      await ffmpegEffect.cleanup(filePath);
    }
  },
};
