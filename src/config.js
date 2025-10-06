const path = require("path");

// Prefixo padrão dos comandos.
exports.PREFIX = "!";

// Emoji do bot (mude se preferir).
exports.BOT_EMOJI = "🙂";

// Nome do bot (mude se preferir).
exports.BOT_NAME = "🤖takesh-Bot🛡️";

// Número do bot.
// Apenas números, exatamente como está no WhatsApp.
// Se o seu número não exibir o nono dígito (9) no WhatsApp, não coloque-o.
exports.BOT_NUMBER = "51925807004";

// Número do dono bot.
// Apenas números, exatamente como está no WhatsApp.
// Se o seu número não exibir o nono dígito (9) no WhatsApp, não coloque-o.
exports.OWNER_NUMBER = "51925807004";

// LID do dono do bot.
// Para obter o LID do dono do bot, use o comando <prefixo>get-lid @marca ou +telefone do dono.
exports.OWNER_LID = "219999999999999@lid";

// Diretório dos comandos
exports.COMMANDS_DIR = path.join(__dirname, "commands");

// Diretório de arquivos de mídia.
exports.DATABASE_DIR = path.resolve(__dirname, "..", "database");

// Diretório de arquivos de mídia.
exports.ASSETS_DIR = path.resolve(__dirname, "..", "assets");

// Diretório de arquivos temporários.
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

// Timeout em milissegundos por evento (evita banimento).
exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 300;

// Plataforma de API's
exports.SPIDER_API_BASE_URL = "https://api.spiderx.com.br/api";

// Obtenha seu token, criando uma conta em: https://api.spiderx.com.br.
exports.SPIDER_API_TOKEN = "seu_token_aqui";

// Caso queira responder apenas um grupo específico,
// coloque o ID dele na configuração abaixo.
// Para saber o ID do grupo, use o comando <prefixo>get-id
// Troque o <prefixo> pelo prefixo do bot (ex: /get-id).
exports.ONLY_GROUP_ID = "";

// Configuração para modo de desenvolvimento
// mude o valor para ( true ) sem os parênteses
// caso queira ver os logs de mensagens recebidas
exports.DEVELOPER_MODE = false;

// Diretório base do projeto.
exports.BASE_DIR = path.resolve(__dirname);

// Caso queira usar proxy.
exports.PROXY_PROTOCOL = "http";
exports.PROXY_HOST = "ip";
exports.PROXY_PORT = "porta";
exports.PROXY_USERNAME = "usuário";
exports.PROXY_PASSWORD = "senha";
