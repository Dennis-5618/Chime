const { Schema, model } = require("mongoose");

const giveawaySchema = new Schema({
    guildId: String,
    channelId: String,
    messageId: String,
    prize: String,
    endAt: Date,
    winners: Number,
    entries: [String]
});

module.exports = model('Giveaway', giveawaySchema);