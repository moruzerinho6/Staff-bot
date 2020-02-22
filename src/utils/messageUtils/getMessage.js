/**
 * Gets the message from the given guild, channel and message ID.
 * @async
 * @function
 * @param {Object} bot - The Discord bot instance.
 * @param {string} guildId - The guild ID.
 * @param {string} channelId - The channel from the guild ID.
 * @param {string} messageId - The message from the channel ID.
 * @returns {Promise<Object>} - The found message
 */
module.exports.getMessage = async (bot, guildId, channelId, messageId) => {
  const Guild = bot.guilds.get(guildId)

  if (Guild === undefined) {
    return null
  }

  const Channel = Guild.channels.get(channelId)

  if (Channel === undefined) {
    return null
  }

  try {
    const Message = await Channel.fetchMessage(messageId)
    return Message || null
  } catch { }

  return null
}