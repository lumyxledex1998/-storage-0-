const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const ffmpegEffect = require(`${BASE_DIR}/services/FFmpeg`);

module.exports = {
  name: "preto-e-branco",
  description: "Gero uma montagem que converte a imagem que você enviar para preto e branco",
  commands: ["preto-e-branco", "gray", "pb"],
  usage: `${PREFIX}gray (marque a imagem) ou ${PREFIX}gray (responda a imagem)`,
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
      const outputPath = await ffmpegEffect.convertToGrayscale(filePath);
      await sendSuccessReact();
      await sendImageFromFile(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao aplicar efeito de preto e branco");
    } finally {
      await ffmpegEffect.cleanup(filePath);
    }
  },
};
