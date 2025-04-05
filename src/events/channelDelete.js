const { Events, EmbedBuilder, ChannelType } = require("discord.js");
const Logs = require('../schemas/logs');

module.exports = {
    name: Events.ChannelDelete,
    once: false,
    async execute(channel) {
        try {
            // Ignore DMs
            if (!channel.guild) return;

            // Get the logs channel from the database
            const logsData = await Logs.findOne({ guildId: channel.guild.id });
            if (!logsData) return;

            // Fetch the logs channel
            const logChannel = await channel.guild.channels.fetch(logsData.channelId);
            if (!logChannel) return;

            // Create and send the embed
            const embed = new EmbedBuilder()
                .setTitle('Channel deleted')
                .setColor('#e6534e')
                .addFields(
                    { name: 'Name', value: channel.name, inline: true },
                    { name: 'Type', value: ChannelType[channel.type], inline: true }
                )
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`\x1b[31m[ERROR]\x1b[0m - ${error.message}`);
            return;
        }
    }
};