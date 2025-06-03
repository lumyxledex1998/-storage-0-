const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const ffmpegEffect = require(`${BASE_DIR}/services/FFmpeg`);

module.exports = {
  name: "contraste",
  description: "Gero uma montagem que ajusta o contraste da imagem que você enviar",
  commands: ["contraste", "contrast", "melhora", "melhorar", "hd", "to-hd"],
  usage: `${PREFIX}contraste (marque a imagem) ou ${PREFIX}contraste (responda a imagem)`,
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
      const outputPath = await ffmpegEffect.adjustContrast(filePath);
      await sendSuccessReact();
      await sendImageFromFile(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao aplicar efeito de contraste");
    } finally {
      await ffmpegEffect.cleanup(filePath);
    }
  },
};
