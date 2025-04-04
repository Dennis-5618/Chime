const Giveaway = require('../schemas/giveaway');

async function enterGiveaway(interaction) {
    try {
        // Finds the giveaway in the database
        const giveaway = await Giveaway.findOne({ messageId: interaction.message.id });
        if (!giveaway) return interaction.reply({
            content: 'This giveaway no longer exists',
            flags: 64
        });

        // Checks if the user has already entered
        if (giveaway.entries.includes(interaction.user.id)) {
            return interaction.reply({
                content: 'You\'ve already entered this giveaway',
                flags: 64
            });
        };

        // Enters the user into the giveaway
        giveaway.entries.push(interaction.user.id);
        await giveaway.save();

        interaction.reply({
            content: 'You\'ve successfully entered the giveaway!',
            flags: 64
        });
    } catch (error) {
        console.error(`\x1b[31m[ERROR]\x1b[0m - There was an error while trying to enter a giveaway: ${error}`)
        interaction.reply({
            content: 'There was an error while entering in the giveaway, please try again later',
            flags: 64
        });
    };
};

module.exports = { enterGiveaway };