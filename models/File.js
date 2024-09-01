const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  content: { type: Buffer, required: true }, // ! Store compressed content
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  contentType: {
    type: String,
    required: true,
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
