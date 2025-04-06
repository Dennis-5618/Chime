const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Logs = require('../../schemas/logs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletelogs')
        .setDescription('Delete the logs channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        try {
            // Delete logs channel from database
            await Logs.deleteOne({ guildId: interaction.guild.id });

            // Replying to the user
            await interaction.reply('The logs channel has been deleted')
        } catch (error) {
            console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while trying delete the logs channel: ${error}`);
            interaction.reply({
                content: 'There was an error while deleting the logs channel, please try again later',
                flags: 64
            });
        };
    }
};