const Commands = require("../commands/index.js")
const { MessageUtils } = require("../utils/index.js")

exports.run = ({ bot, message, keys, fastSend, fastEmbed, args, i18n }) => {
  if (args.length < 2) {
    fastEmbed.setTitle(i18n.__("Help_Commands"))
    fastEmbed.setDescription("``" + Object.keys(Commands).join("``, ``") + "``")

    fastSend(fastEmbed, true)
    return
  }

  const SafeCommandName = args[1].toLowerCase()
  if (!Object.keys(Commands).includes(SafeCommandName)) {
    fastSend("Help_errorCommandDontExist")
    return
  }

  if (Commands[SafeCommandName].helpEmbed === undefined) {
    fastSend("Help_errorNoHelpMade")
    return
  }

  fastSend(Commands[SafeCommandName].helpEmbed({ bot, message, keys, fastSend, fastEmbed, helpEmbed: MessageUtils.helpEmbedFactory, i18n }), true)
}

exports.helpEmbed = ({ message, helpEmbed, i18n }) => {
  const Options = {
    argumentsLength: 1,
    argumentsNeeded: false,
    argumentsFormat: ["help"] // Commands can't get translated
  }

  return helpEmbed(message, i18n, Options)
}
