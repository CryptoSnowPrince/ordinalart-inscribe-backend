const { INSCRIBE_UNKONWN } = require("../utils");
const mongoose = require("mongoose");

const inscribeSchema = new mongoose.Schema({
  uuid: { type: String, default: "" }, // uuid
  inscriptionID: { type: String, default: "" },
  feeRate: { type: Number, default: 0 },
  btcDestination: { type: String, default: "" }, // btcDestination
  state: { type: Number, default: INSCRIBE_UNKONWN },
  actionDate: { type: Date, default: Date.now() },
  txHash: { type: String, default: "" }, // Bitcoin txHash
});

module.exports = inscribe = mongoose.model("inscribe", inscribeSchema);
