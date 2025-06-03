const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const ffmpegEffect = require(`${BASE_DIR}/services/FFmpeg`);

module.exports = {
  name: "espelhar",
  description: "Inverto a posição da imagem que você enviar",
  commands: ["espelhar", "muda-direcao", "mudar-direcao", "mirror"],
  usage: `${PREFIX}espelhar (marque a imagem) ou ${PREFIX}espelhar (responda a imagem)`,
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
      const outputPath = await ffmpegEffect.mirrorImage(filePath);
      await sendSuccessReact();
      await sendImageFromFile(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao aplicar efeito de Espelhamento");
    } finally {
      await ffmpegEffect.cleanup(filePath);
    }
  },
};
