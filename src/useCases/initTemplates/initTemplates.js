const LRU = require("lru-cache");
const path = require("path")
const fs = require('fs').promises;

const cache = new LRU({ maxAge: 500 * 60 * 60 });

/**
 * Método que retorna o template a ser utilizado pelo canal pegando o valor ou cache (cache de 1/2h)
 * @param channel canal de onde o bot será executado
 * @returns {object|null} Retorna o template do canal ou o template padrão do bot
 */
module.exports = async (channel = "") => {
    // Remove o primeiro valor do channel "#"
    const owner = channel.substring(1,channel.length);

    // Retorna o valor em cache do template caso já tenha sido salvo anteriormente
    if (cache.get(`commands.${owner}.json`)) { return JSON.parse(cache.get(`commands.${owner}.json`))}

    // Busca os templates (default / channel) para retornar
    const [channelCommands, commonCommands] = await Promise.all([
        fs.readFile(path.resolve(`commands.${owner}.json`), "UTF-8").catch(() => null),
        fs.readFile(path.resolve(`commands.json`), "UTF-8").catch(() => null),
    ])

    // Se encontrar o template do canal, prioriza o retorno e salva no cache
    if (channelCommands != null) {
        cache.set(`commands.${owner}.json`, channelCommands);
        return JSON.parse(channelCommands);
    }

    // Salva para esse canal o template de comandos default e retorna ele
    cache.set(`commands.${owner}.json`, commonCommands);
    return JSON.parse(commonCommands);
}