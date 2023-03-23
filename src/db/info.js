const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema(
    {
        uuid: { type: String, default: "" }, // uuid
        infokey: { type: Buffer, default: 0 }, // info,
        firstLoginDate: { type: Date, default: Date.now() },
        active: { type: Boolean, default: true }
    }
)

module.exports = info = mongoose.model("info", infoSchema)
