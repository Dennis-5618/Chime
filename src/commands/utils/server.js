const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays some information about this server'),
    async execute(interaction) {
        const { guild } = interaction;

        const guildOwner = await guild.fetchOwner();
        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;

        // Creating and sending the embed
        const embed = new EmbedBuilder()
            .setTitle('Server information')
            .setColor('#e6534e')
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: 'Server name', value: guild.name, inline: true },
                { name: 'Owner', value: guildOwner.user.tag, inline: true },
                { name: 'Created on', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false },
                { name: 'Boosts', value: `${guild.premiumSubscriptionCount || 0} (${guild.premiumTier ? `Level ${guild.premiumTier}` : 'No boosts'})`, inline: false },
                { name: 'Total members', value: guild.memberCount.toString(), inline: true },
                { name: 'Humans', value: guild.members.cache.filter(m => !m.user.bot).size.toString(), inline: true },
                { name: 'Bots', value: guild.members.cache.filter(m => m.user.bot).size.toString(), inline: true },
                { name: 'Text channels', value: textChannels.toString(), inline: true },
                { name: 'Voice channels', value: voiceChannels.toString(), inline: true }
            )
        await interaction.reply({ embeds: [embed] });
    }
};