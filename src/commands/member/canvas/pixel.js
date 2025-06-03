const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const ffmpegEffect = require(`${BASE_DIR}/services/FFmpeg`);

module.exports = {
  name: "pixel",
  description: "Gero uma montagem que converte a imagem que você enviar para pixel-art",
  commands: ["pixel-art", "pixel", "px"],
  usage: `${PREFIX}pixel (marque a imagem) ou ${PREFIX}pixel (responda a imagem)`,
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
      const outputPath = await ffmpegEffect.applyPixelation(filePath);
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
