const EXPORT_OBJECT = {};

const IS_TESTNET = true;
EXPORT_OBJECT.IS_TESTNET = IS_TESTNET;

const ORD_COMMAND = IS_TESTNET ? "ord -t --cookie-file /work/blockchain-node/bitcoin/testnet/testnet3/.cookie wallet": "ord wallet";
EXPORT_OBJECT.ORD_COMMAND = ORD_COMMAND;

module.exports = EXPORT_OBJECT;