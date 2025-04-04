const { EmbedBuilder } = require('discord.js');
const Giveaway = require('../schemas/giveaway');

async function checkGiveaways(client) {
    const now = new Date();
    const endedGiveaways = await Giveaway.find({ endAt: { $lte: now } });

    for (const giveaway of endedGiveaways) {
        try {
            // Get the giveaway channel and message
            const channel = await client.channels.fetch(giveaway.channelId);
            const message = await channel.messages.fetch(giveaway.messageId);

            // Pick a random winner
            let winnerText = 'No one has entered the giveaway';
            const entries = giveaway.entries || [];
            if (entries.length > 0) {
                const randomizedEntries = entries.sort(() => 0.5 - Math.random());
                const winner = randomizedEntries.slice(0, giveaway.winners);
                winnerText = winner.length
                    ? winner.map(id => `<@${id}>`).join(', ')
                    : 'No valid entries have been found';
            };

            // Update the giveaway embed and removing the button
            const updatedEmbed = EmbedBuilder.from(message.embeds[0])
                .setTitle('Giveaway ended')
                .setDescription(`
                    **Prize:** ${giveaway.prize}
                    **Winner(s):** ${winnerText}
                    **Total entries** ${entries.length}
                `);
            await message.edit({
                embeds: [updatedEmbed],
                components: []
            });

            // Delete finished giveaways from database
            await Giveaway.deleteOne({ _id: giveaway._id });

        } catch (error) {
            console.error(`\x1b[31m[ERROR]\x1b[0m - ${error.message}`);
        }
    }
}

// Check the giveaway every 10 seconds
function startGiveawayTimer(client) {
    setInterval(() => checkGiveaways(client), 10000);
};

module.exports = { startGiveawayTimer };