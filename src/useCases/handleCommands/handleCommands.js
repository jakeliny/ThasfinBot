const Mustache = require('mustache-async');
const utils = require('../../utils')

const handler = (client) => async (target, context, receivedMessage, isBot) => {
  if (isBot) return;
  if (receivedMessage.split("")[0] != "!") return

  let req = receivedMessage.split(" ")
  let template = await utils.getTemplateChannel(target)
  let ignored = template["ignored-commands"]
  let commands = template["commands"]

  let reqCmd = req.shift();
  let cmd = utils.getCommandByAction(reqCmd, ignored, commands);

  // Caso o comando não exista manda uma mensagem
  if (!cmd) {
    ["/color HotPink", "/me Esse comando não existe parça Kappa"].forEach(message => client.say(target, message))
    return
  }

  let args = {
    twitch: { target, context, receivedMessage, isBot },
    context: { cmd, req, commands, ignored, template }
  };

  // Partials se refe aos useCommands que podem ser chamados a partir
  let partials = await require('../../useCommands')(args);
  let rendered = await Mustache.render(JSON.stringify(cmd), { ...partials, ...args });
  let parsed = utils.getSanitizedRender(args, rendered);

  parsed["messages"].forEach(message => client.say(target, message))
}

module.exports = handler