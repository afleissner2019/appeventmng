const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true },
    Phone: { type: String },
    Date: { type: Date, default: Date.now },
    subject: { type: String, required: true },
    message: { type: String, required: true },
});

module.exports = ContactSchema;