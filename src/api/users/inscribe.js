const inscribe = require("../../db/inscribe");
const awaitExec = require("util").promisify(require("child_process").exec);
const {
  SUCCESS,
  FAIL,
  INSCRIBE_CREATED,
  OUTPUT_UTXO,
  SERVICE_FEE,
  addNotify,
  getDisplayString,
  timeEstimate,
  sendSatsToAdmin,
} = require("../../utils");

module.exports = async (req_, res_) => {
  let filePaths = [];
  try {
    // console.log("inscribe: ");
    filePaths = req_.files;
    // console.log("File uploaded successfully");
    // console.log(file);

    const uuid = req_.body.uuid;
    const feeRate = req_.body.feeRate;
    const actionDate = req_.body.actionDate;
    const btcDestination = req_.body.btcDestination;

    // console.log("uuid: ", uuid, !uuid);
    // console.log("feeRate: ", feeRate, !feeRate);
    // console.log("actionDate: ", actionDate, !actionDate);
    // console.log("btcDestination: ", btcDestination, !btcDestination);

    if (!uuid || !feeRate || !actionDate || !btcDestination || filePaths.length === 0) {
      console.log("request params fail");
      if (filePaths.length > 0) {
        for (var index = 0; index < filePaths.length; index++) {
          await awaitExec(`rm ${filePaths[index].path}`);
        }
      }
      return res_.send({
        result: false,
        status: FAIL,
        message: "request params fail",
      });
    }

    var fees = 0;
    for (var index = 0; index < filePaths.length; index++) {
      const { stdout, stderr } = await awaitExec(
        `ord wallet inscribe --fee-rate ${feeRate} ${filePaths[index].path} --destination ${btcAccount} --dry-run`
      );
      if (stderr) {
        for (var index = 0; index < filePaths.length; index++) {
          await awaitExec(`rm ${filePaths[index].path}`);
        }
        return res_.send({
          result: false,
          status: FAIL,
          message: "estimateInscribe stderr",
        });
      }
      fees += parseInt(JSON.parse(stdout).fees)
    }

    const estimateSatsAmount = fees + SERVICE_FEE + OUTPUT_UTXO * filePaths.length;
    const retVal = await sendSatsToAdmin(uuid, estimateSatsAmount);
    if(!retVal) {
      for (var index = 0; index < filePaths.length; index++) {
        await awaitExec(`rm ${filePaths[index].path}`);
      }
      return res_.send({
        result: false,
        status: FAIL,
        message: "not enough sats",
      });
    }

    for (var index = 0; index < filePaths.length; index++) {
      const { stdout, stderr } = await awaitExec(
        `ord wallet inscribe --fee-rate ${feeRate} ${filePaths[index].path} --destination ${btcAccount}`
      );
      if (stderr) {
        for (var index = 0; index < filePaths.length; index++) {
          await awaitExec(`rm ${filePaths[index].path}`);
        }
        return res_.send({
          result: false,
          status: FAIL,
          message: "inscribe stderr",
        });
      }

      const btcTxHash = JSON.parse(inscribeReturn.stdout).commit;
      const inscriptionID = JSON.parse(inscribeReturn.stdout).inscription;

      const inscribeItem = new inscribe({
        uuid: uuid,
        feeRate: feeRate,
        btcDestination: btcDestination,
        state: INSCRIBE_CREATED,
        actionDate: actionDate,
        inscriptionID: inscriptionID,
        txHash: btcTxHash,
      });
      const savedItem = await inscribeItem.save();
      // console.log("new inscribeItem object saved: ", savedItem);
      console.log("new inscribeItem object saved: ");

      await addNotify(uuid, {
        type: 0,
        title: "Inscribe Success!",
        link: `https://mempool.space/tx/${btcTxHash}`,
        content: `Congratulation! Your inscription ${getDisplayString(
          inscriptionID
        )} will arrive to your wallet in ${timeEstimate(feeRate)}.`,
      });
    }

    for (var index = 0; index < filePaths.length; index++) {
      await awaitExec(`rm ${filePaths[index].path}`);
    }
    return res_.send({
      result: true,
      status: SUCCESS,
      message: message,
    });
  } catch (error) {
    console.log("inscribe catch error: ", error);
    if (filePaths.length > 0) {
      for (var index = 0; index < filePaths.length; index++) {
        try {
          await awaitExec(`rm ${filePaths[index].path}`);
        } catch (error) { }
      }
    }
    return res_.send({ result: false, status: FAIL, message: "Catch Error" });
  }
};
