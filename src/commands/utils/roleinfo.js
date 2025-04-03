const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Displays some information about a role')
        .addRoleOption(option => option
            .setName('role')
            .setDescription('The role you want to view')
            .setRequired(true)
        ),
    async execute(interaction) {
        // Getting the specified role from the interation
        const role = interaction.options.getRole('role');

        // Formatting the permissions and timestamp
        const permissionArray = new PermissionsBitField(role.permissions.bitfield).toArray();
        const permissions = permissionArray.length > 0
            ? permissionArray.map(permission => `\`${permission}\``).join(', ')
            : 'No permissions';
        const timestamp = `<t:${Math.floor(role.createdTimestamp / 1000)}:F> (<t:${Math.floor(role.createdTimestamp / 1000)}:R>)`;

        // Creating and sending the embed
        const embed = new EmbedBuilder()
            .setTitle('Role information')
            .setColor(role.hexColor ?? '#e6534e')
            .addFields(
                { name: 'Name', value: role.name, inline: true },
                { name: 'Role ID', value: role.id, inline: true },
                { name: 'Color', value: role.hexColor.toUpperCase(), inline: false },
                { name: 'Position', value: role.position.toString(), inline: true },
                { name: 'Members', value: role.members.size.toString(), inline: true },
                { name: 'Created on', value: timestamp, inline: false },
                { name: 'Permissions', value: permissions.length > 1024 ? 'Too many to display' : permissions, inline: false }
            )
        await interaction.reply({ embeds: [embed] });
    }
};