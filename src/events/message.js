/**
 * Splits the message content.
 * @param {object} message 
 * @returns {Array<String>}
 */
const Args = (message) => {
  return message.content.split(" ")
}

/**
 * Gets the command name from the args array.
 * @param {Array<String>} args 
 * @param {object} keys 
 * @returns {string}
 */
const CommandName = (args, keys) => {
  return args[0].toLowerCase().slice(keys.PREFIX.length)
}

const { guildConfig } = require("../cache/index.js")
const { LanguageUtils, MessageUtils } = require("../utils/index.js")
const Commands = require("../commands/index.js")

exports.condition = (message, keys, bot) => {
  if (message.channel.type === "dm" || !message.content.toLowerCase().startsWith(keys.PREFIX)) {
    return false
  }

  if (message.author.bot) {
    return false
  }

  const GuildDefinedLanguage = guildConfig[message.guild.id] && guildConfig[message.guild.id].language ? 
  guildConfig[message.guild.id].language : ""
  const Send = MessageUtils.ConfigSender(message.channel, LanguageUtils.init(GuildDefinedLanguage === "" ? LanguageUtils.fallbackLanguage : GuildDefinedLanguage))
  if (!message.channel.permissionsFor(bot.user.id).has("SEND_MESSAGES")) {
    try {
      Send("I can't send a message to that channel")
    } catch { }
    return false
  }

  const SafeCommandName = CommandName(Args(message), keys)

  if (!SafeCommandName) {
    return false
  }

  if (!Object.keys(Commands).includes(SafeCommandName)) {
    Send("Sorry, that command doesn't exist")
    return
  }

  return true
}

exports.run = (message, keys, bot) => {
  const SafeArgs = Args(message)
  const SafeCommandName = CommandName(SafeArgs, keys)
  const Command = Commands[SafeCommandName]
  const GuildDefinedLanguage = guildConfig[message.guild.id] && guildConfig[message.guild.id].language ? 
  guildConfig[message.guild.id].language : ""
  const I18n = LanguageUtils.init(GuildDefinedLanguage === "" ? LanguageUtils.fallbackLanguage : GuildDefinedLanguage)
  const Send = MessageUtils.ConfigSender(message.channel, I18n)
  const Arguments = { message, keys, bot, args: SafeArgs, fastEmbed: MessageUtils.FastEmbed(message), fastSend: Send, i18n: I18n }

  if (Command.condition !== undefined && !Command.condition(Arguments)) {
    return
  }

  Commands[SafeCommandName].run(Arguments)
}
