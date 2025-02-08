const axios = require('axios');
const { PREFIX, SPIDER_API_BASE_URL, SPIDER_API_TOKEN } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "ia-sticker",
  description: "Cria uma figurinha com base em uma descrição",
  commands: ["ia-sticker", "ia-fig"],
  usage: `${PREFIX}ia-sticker <descrição>`,
  handle: async ({
    args,
    sendWaitReply,
    sendWarningReply,
    sendStickerFromURL,
    sendSuccessReact,
    sendErrorReply
  }) => {
    if (!args[0]) {
      return sendWarningReply("Você precisa fornecer uma descrição para a figurinha.");
    }

    const descricao = args.join(" ");
    const apiUrl = `${SPIDER_API_BASE_URL}/ai/stable-diffusion-turbo?search=${encodeURIComponent(descricao)}&api_key=${SPIDER_API_TOKEN}`;

    await sendWaitReply("Gerando figurinha...");

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.image) {
        await sendStickerFromURL(data.image);
        await sendSuccessReact();
      } else {
        await sendWarningReply("Não foi possível gerar a figurinha. Tente novamente mais tarde.");
      }
    } catch (error) {
      console.log(error);
      await sendErrorReply("Houve um erro ao tentar gerar a imagem. Verifique sua conexão ou tente mais tarde.");
    }
  },
};
