const { Schema, model } = require("mongoose");

const logsSchema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true }
});

module.exports = model('Logs', logsSchema);