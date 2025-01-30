const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({}, { strict: false }); // Allows any structure

module.exports = mongoose.model("File", FileSchema);
