const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs");
const notify = require("../db/notify");

dotenv.config();

const EXPORT_OBJECT = {};

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
EXPORT_OBJECT.INSCRIBE_UNKONWN = -1;
EXPORT_OBJECT.INSCRIBE_PENDING = 0;
EXPORT_OBJECT.INSCRIBE_COMPLETED = 1;
EXPORT_OBJECT.INSCRIBE_CANCELED = 2;

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

EXPORT_OBJECT.SERVICE_FEE = 40000;
EXPORT_OBJECT.OUTPUT_UTXO = 10000;

EXPORT_OBJECT.SUCCESS = "SUCCESS";
EXPORT_OBJECT.FAIL = "FAIL";

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

  try {
    const savedItem = await notifyItem.save();
    // console.log("new notifyItem object saved: ", savedItem);
    console.log("new notifyItem object saved: ");
  } catch (error) {
    // console.log('Error saving item:', error);
    console.log("Error saving item:");
  }
};

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

module.exports = EXPORT_OBJECT;
