const awaitExec = require("util").promisify(require("child_process").exec);
const { SUCCESS, FAIL } = require("../../utils");

module.exports = async (req_, res_) => {
  let filePath = null;
  try {
    // console.log("estimateInscribe: ");
    const { file } = req_;
    filePath = file.path;
    // console.log("File uploaded successfully");
    // console.log(file);

    const feeRate = req_.body.feeRate;
    const btcAccount = req_.body.btcAccount;

    // console.log("feeRate: ", feeRate, !feeRate);
    // console.log("btcAccount: ", btcAccount, !btcAccount);

    if (!feeRate || !btcAccount) {
      console.log("request params fail");
      if (filePath) {
        await awaitExec(`rm ${filePath}`);
      }
      return res_.send({
        result: false,
        status: FAIL,
        message: "request params fail",
      });
    }

    const { stdout, stderr } = await awaitExec(
      `ord wallet inscribe --fee-rate ${feeRate} ${filePath} --destination ${btcAccount} --dry-run`
    );
    if (stderr) {
      await awaitExec(`rm ${filePath}`);
      return res_.send({
        result: false,
        status: FAIL,
        message: "estimateInscribe stderr",
      });
    }
    // console.log("ord wallet inscriptions stdout: ", stdout);
    await awaitExec(`rm ${filePath}`);
    return res_.send({
      result: JSON.parse(stdout).fees,
      status: SUCCESS,
      message: "estimateInscribe success",
    });
  } catch (error) {
    console.log("estimateInscribe catch error: ", error);
    if (filePath) {
      try {
        await awaitExec(`rm ${filePath}`);
      } catch (error) {}
    }
    return res_.send({
      result: false,
      status: FAIL,
      message: "estimateInscribe Catch Error",
    });
  }
};
