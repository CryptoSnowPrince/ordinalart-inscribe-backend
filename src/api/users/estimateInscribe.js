const awaitExec = require("util").promisify(require("child_process").exec);
const { SUCCESS, FAIL } = require("../../utils");

module.exports = async (req_, res_) => {
  let filePaths = [];
  try {
    console.log("estimateInscribe: ");
    console.log("File uploaded successfully");

    const feeRate = req_.body.feeRate;
    filePaths = req_.files;
    const btcAccount = req_.body.btcAccount;

    // console.log("feeRate: ", feeRate, !feeRate);
    // console.log("btcAccount: ", btcAccount, !btcAccount);

    if (!feeRate || !btcAccount || filePaths.length === 0) {
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
    var totalFees = 0;
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
      totalFees += parseInt(JSON.parse(stdout).fees)
    }
    // console.log("ord wallet inscriptions stdout: ", stdout);
    for (var index = 0; index < filePaths.length; index++) {
      await awaitExec(`rm ${filePaths[index].path}`);
    }
    return res_.send({
      result: totalFees,
      status: SUCCESS,
      message: "estimateInscribe success",
    });
  } catch (error) {
    console.log("estimateInscribe catch error: ", error);
    if (filePaths.length > 0) {
      for (var index = 0; index < filePaths.length; index++) {
        try {
          await awaitExec(`rm ${filePaths[index].path}`);
        } catch (error) { }
      }
    }
    return res_.send({
      result: false,
      status: FAIL,
      message: "estimateInscribe Catch Error",
    });
  }
};
