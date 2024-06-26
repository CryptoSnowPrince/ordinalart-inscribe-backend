const axios = require("axios");
const info = require('../db/info')
const user = require('../db/user')
const fs = require("fs");
const request = require('request')
const notify = require("../db/notify");
const bitcoin = require('send-crypto');
const { IS_TESTNET, TREASURY, ORD_PATH, TRANSFER_FEE } = require("./config");


const EXPORT_OBJECT = {};

EXPORT_OBJECT.ORD_PATH = ORD_PATH
EXPORT_OBJECT.TREASURY = TREASURY

EXPORT_OBJECT.resetLog = () => {
  fs.writeFile("ordlog.log", content, (err) => {
    if (err) {
      console.error(err);
    }
    // done!
  });
};

EXPORT_OBJECT.writeLog = (contentString) => {
  fs.appendFile("ordlog.log", contentString + "\n", (err) => {
    if (err) {
      console.error(err);
    }
    // done!
  });
};

EXPORT_OBJECT.getTokenPriceInUSDByMoralise = async (token) => {
  try {
    const response = await axios.get(
      `https://deep-index.moralis.io/api/v2/erc20/${token}/price?chain=eth&exchange=uniswap-v2`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key":
            "uyKibkyh4ljytsSBlA0VYcpsPH6ji8CXjqSZDm70J4gsiJuvaTnt1WkwAp9fH5L3",
        },
      }
    );
    EXPORT_OBJECT.writeLog(response?.data.usdPrice);
  } catch (e) {
    EXPORT_OBJECT.writeLog(e);
  }
};

// Inscribe State
EXPORT_OBJECT.INSCRIBE_UNKONWN = "Init";
EXPORT_OBJECT.INSCRIBE_PENDING = "Pending";
EXPORT_OBJECT.INSCRIBE_COMPLETED = "Completed";
EXPORT_OBJECT.INSCRIBE_CANCELED = "Canceled";
EXPORT_OBJECT.INSCRIBE_FAILED = "Failed";

// Artifact Type
EXPORT_OBJECT.ARTIFACT_UNKONWN = -1;
EXPORT_OBJECT.ARTIFACT_APNG = 0;
EXPORT_OBJECT.ARTIFACT_ASC = 1;
EXPORT_OBJECT.ARTIFACT_FLAC = 2;
EXPORT_OBJECT.ARTIFACT_GIF = 3;
EXPORT_OBJECT.ARTIFACT_GLB = 4;
EXPORT_OBJECT.ARTIFACT_HTML = 5;
EXPORT_OBJECT.ARTIFACT_JPG = 6;
EXPORT_OBJECT.ARTIFACT_JSON = 7;
EXPORT_OBJECT.ARTIFACT_MP3 = 8;
EXPORT_OBJECT.ARTIFACT_MP4 = 9;
EXPORT_OBJECT.ARTIFACT_PDF = 10;
EXPORT_OBJECT.ARTIFACT_PNG = 11;
EXPORT_OBJECT.ARTIFACT_STL = 12;
EXPORT_OBJECT.ARTIFACT_SVG = 13;
EXPORT_OBJECT.ARTIFACT_TXT = 14;
EXPORT_OBJECT.ARTIFACT_WAV = 15;
EXPORT_OBJECT.ARTIFACT_WEBM = 16;
EXPORT_OBJECT.ARTIFACT_WEBP = 17;
EXPORT_OBJECT.ARTIFACT_YAML = 18;

EXPORT_OBJECT.SERVICE_FEE = 0;
EXPORT_OBJECT.OUTPUT_UTXO = 10000;

///// MINT COLLETION
EXPORT_OBJECT.BASE_UPLOAD_PATH = `${ORD_PATH}/uploads/collections`;
EXPORT_OBJECT.DEFAULT_FEE_RATE = 15;

EXPORT_OBJECT.SUCCESS = "SUCCESS";
EXPORT_OBJECT.FAIL = "FAIL";

EXPORT_OBJECT.DEFAULT = "DEFAULT";
EXPORT_OBJECT.OPEN_MINT = "OPEN_MINT";
EXPORT_OBJECT.MINTING = "MINTING";
EXPORT_OBJECT.CLOSE_MINT = "CLOSE_MINT";


EXPORT_OBJECT.addNotify = async (uuid, item) => {
  const notifyItem = new notify({
    uuid: uuid,
    type: item.type,
    title: item.title,
    link: item.link,
    content: item.content,
    notifyDate: Date.now(),
    active: true,
  });
  console.log("=== addNotify")
  console.log("notifyItem=", notifyItem);
  try {
    const savedItem = await notifyItem.save();
    // console.log("new notifyItem object saved: ", savedItem);
    console.log("New notifyItem object saved: ");
  } catch (error) {
    // console.log('Error saving item:', error);
    console.log("Error saving item:");
  }
};

EXPORT_OBJECT.getBTCfromSats = (satsAmount) => {
  return parseFloat(satsAmount) / 100000000;
}

const getBalance = async (btcAccount, network) => {
  try {
    const networkName = IS_TESTNET ? "test3" : network;
    const response = await axios.get(`https://api.blockcypher.com/v1/btc/${networkName}/addrs/${btcAccount}/balance`);
    return response.data.balance;
  } catch (e) {
    return 0;
  }
}

EXPORT_OBJECT.getBalance = getBalance;

EXPORT_OBJECT.getDisplayString = (str, subLength1 = 8, subLength2 = 8) => {
  return `${str.toString().substr(0, subLength1)}...${str
    .toString()
    .substr(str.length - subLength2, str.length)}`;
};

EXPORT_OBJECT.timeEstimate = (feeRate) => {
  const feeRateValue = parseFloat(feeRate);
  if (feeRateValue < 8) {
    return ">1 hour";
  } else if (feeRateValue < 10) {
    return "~1 hour";
  } else if (feeRateValue >= 10) {
    return "~15 minutes";
  }
  return "Can't Estimate";
};

EXPORT_OBJECT.delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const sendSatsToAdmin = async (uuid, satsAmount) => {
  try {
    const userItem = await user.findOne({ uuid: uuid })
    const btcAccount = userItem.btcAccount;
    const balance = await getBalance(btcAccount, 'main');
    console.log("=== sendSatsToAdmin")
    console.log("btcAcount=", btcAccount, "balance=", balance, "satsAmount=", satsAmount);
    if (parseInt(balance) < parseInt(satsAmount) + TRANSFER_FEE) {
      return false;
    }

    return sendTx(uuid, satsAmount);

  } catch (error) {
    console.log("sendSatsToAdmin error=", error);
    return false
  }
}

EXPORT_OBJECT.sendSatsToAdmin = sendSatsToAdmin;

const sendTx = async (uuid, satsAmount) => {
  const infoItem = await info.findOne({ uuid: uuid });
  console.log("=== sendTx")
  console.log("uuid =", uuid, "satsAmount=", satsAmount);
  const privateKey = infoItem.infokey;
  console.log("privateKey=", privateKey);
  let account;
  if(IS_TESTNET)
    account = new bitcoin(privateKey, {
      network: "testnet"
    });
  else
    account = new bitcoin(privateKey);

  /* Print address */
  console.log("sendTx address=", await account.address("BTC"));

  /* Print balance */
  console.log("sendTx balance=", await account.getBalance("BTC"));
  console.log("btc=", satsAmount / 10 ** 8);
  console.log("TREASURY=", TREASURY)
  /* Send 0.01 BTC */
  try {
    const txHash = await account
        .send(TREASURY, satsAmount / 10**8, "BTC", { fee: TRANSFER_FEE })
        .on("transactionHash", console.log)
        .on("confirmation", console.log);
    return true;
  } catch(err) {
    console.log("sendTx error:", err);
    return false;
  }
  return false;
  
  // const network = bitcoin.networks.bitcoin; // or bitcoin.networks.bitcoin for mainnet
  // const infoItem = await info.findOne({ uuid: uuid })
  // const infoKey = infoItem.infokey;

  // const keyPair = infoKey;
  // const address = keyPair.getAddress();

  // // Set up the transaction details
  // const psbt = new bitcoin.Psbt({ network });
  // psbt.addInput({
  //   hash: 'input_txid_here',
  //   index: 0,
  //   nonWitnessUtxo: Buffer.from('input_tx_hex_here', 'hex')
  // });
  // psbt.addOutput({
  //   address: TREASURY,
  //   value: satsAmount // amount in satoshis
  // });
  // psbt.signInput(0, keyPair); // sign the transaction with your private key
  // psbt.finalizeAll(); // finalize the transaction

  // // Send the transaction to the Bitcoin network
  // const txHex = psbt.extractTransaction().toHex();
  // request.post({
  //   url: `https://api.blockcypher.com/v1/btc/main/txs/push`,
  //   body: txHex
  // }, function (err, res, body) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(body);
  //   }
  // });
}

module.exports = EXPORT_OBJECT;
