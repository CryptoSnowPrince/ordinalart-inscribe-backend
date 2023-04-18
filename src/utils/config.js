const EXPORT_OBJECT = {};

const IS_TESTNET = false;
EXPORT_OBJECT.IS_TESTNET = IS_TESTNET;

const TESTNET_EXPLORER = "https://testnet.hariwhitedream.com";// "http://127.0.0.1:5000";
const MAINNET_EXPLORER = "https://ordinals.com";
const EXPLORER_URL = IS_TESTNET ? TESTNET_EXPLORER : MAINNET_EXPLORER;
EXPORT_OBJECT.EXPLORER_URL = EXPLORER_URL;

const ORD_PATH = '/work/inscribe.ordinal.art/ordinalart-inscribe-backend';
const ORD_COMMAND = IS_TESTNET ? "ord -t --cookie-file /work/blockchain-node/bitcoin/testnet/testnet3/.cookie wallet": "ord wallet";
const MAINNET_TREASURY = 'bc1qakj552djms5p7gr3edp8we6rqaqqej970a2sal'
const TREASURY = IS_TESTNET ? "tb1qyje9f3h6gpz5mkwjzuj232uymk7de8hlvnnpt5" : MAINNET_TREASURY;

const TRANSFER_FEE = 5000;

EXPORT_OBJECT.TRANSFER_FEE = TRANSFER_FEE;

EXPORT_OBJECT.ORD_COMMAND = ORD_COMMAND;
EXPORT_OBJECT.TREASURY = TREASURY;
EXPORT_OBJECT.ORD_PATH = ORD_PATH;

module.exports = EXPORT_OBJECT;