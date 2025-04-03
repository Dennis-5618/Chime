const { Schema, model } = require("mongoose");

const ticketSchema = new Schema({
    categoryId: { type: String, required: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true },
    roleId: { type: String, required: true }
});

module.exports = model('Tickets', ticketSchema);