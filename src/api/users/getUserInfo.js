const { user } = require('../../db');
const util = require('util');
const awaitExec = util.promisify(require('child_process').exec);

const { SUCCESS, FAIL, isAccount } = require('../../utils')

module.exports = async (req_, res_) => {
    console.log("getUserInfo: ", req_.body);
    const uuid = req_.body.uuid
    const actionDate = req_.body.actionDate

    // console.log("uuid", uuid)
    // console.log("actionDate", actionDate)

    if (!uuid || !isAccount(uuid) || !actionDate) {
        console.log("null: ", (!uuid || !isAccount(uuid) || !actionDate));
        return res_.send({ result: false, status: FAIL, message: "uuid fail" });
    }

    const fetchItem = await user.findOne({ uuid: uuid });
    //console.log("fetchItem: ", fetchItem);
    if (fetchItem) {
        if (actionDate > fetchItem.lastUpdateDate) {
            // update profile
            console.log("update user profile: ");
            const _updateResult = await user.updateOne({ uuid: uuid }, {
                lastUpdateDate: Date.now(),
                lastLoginDate: Date.now()
            });

            if (!_updateResult) {
                console.log("updateOne fail!", _updateResult);
                return res_.send({ result: true, status: FAIL, message: "Update Fail" });
            }

            return res_.send({ result: true, status: SUCCESS, message: "Update Success" });
        }

        return res_.send({ result: true, status: FAIL, message: "Valid Timestamp" });
    } else {
        // register profile
        try {
            const { stdout, stderr } = await awaitExec(`ord wallet receive`)
            if (stderr) {
                console.log(`exec stderr: ${stderr}`);
                return res_.send({ result: stderr, status: FAIL, message: "uuid create stderr" });
            }
            console.log(`stdout: ${stdout}`);
            const btcAccount = JSON.parse(stdout).address;
            console.log("add new user: ");
            const userItem = new user({
                uuid: uuid,
                btcAccount: btcAccount,
                firstLoginDate: Date.now(),
                lastUpdateDate: Date.now(),
                lastLoginDate: Date.now(),
            })
            console.log("userItem: ", userItem);
            try {
                const savedItem = await userItem.save();
                console.log("save savedItem: ", savedItem);
            } catch (error) {
                console.log('Error saving item:', error);
                return res_.send({ result: false, status: FAIL, message: "Error saving item" });
            }
            return res_.send({ result: true, status: SUCCESS, message: "Create Success" });
        } catch (error) {
            console.log(`exec error: ${error}`);
            return res_.send({ result: error, status: FAIL, message: "uuid create err" });
        }
    }
}
