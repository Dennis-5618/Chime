const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display the avatar of a user')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Select a user')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('type')
            .setDescription('Select which avatar you want to display')
            .addChoices(
                { name: 'Server avatar', value: 'guild' },
                { name: 'Global avatar', value: 'global' }
            )
        ),
    async execute(interaction) {
        // Get information from the command options
        const user = interaction.options.getUser('member') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        const avatarType = interaction.options.getString('type') || 'global';

        // Get the requested avatar
        const guildAvatar = member?.avatar
            ? member.displayAvatarURL({ dynamic: true, size: 1024 })
            : null;
        const globalAvatar = user.displayAvatarURL({ dynamic: true, size: 1024 });

        // Create the embed
        const embed = new EmbedBuilder().setColor('#e6534e');

        // Add the requested avatar
        if (avatarType === 'guild' && guildAvatar) {
            embed.setTitle('Server avatar').setImage(guildAvatar);
        } else {
            embed.setTitle('Global avatar').setImage(globalAvatar);
        };

        await interaction.reply({ embeds: [embed] });
    }
};