import count from "./count/count";
import help from "./help/help";

/**
 * Funlções que podem ser executadas pelo Mustache na hora de ler o commands (Executa a função e retorna valor ou não)
 * @param args todos os argumentos recolhidos durante a execução no comando
 * @returns {object} todos as funções disponíveis para serem utilizadas no template
 */
module.exports = (args: any) => {
    return {
        count: () => { return count(args) },
        help: () => { return help(args) },
        funcaoComandoConsole: () => { console.log("Oie") }
    }
}