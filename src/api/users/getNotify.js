const notify = require('../../db/notify');
const user = require('../../db/user');
const {
    SUCCESS,
    FAIL,
    getBalance,
    addNotify
} = require('../../utils')

module.exports = async (req_, res_) => {
    try {
        // console.log("getNotify: ", req_.query);

        const uuid = req_.query.uuid;

        // console.log("uuid: ", uuid);

        if (!uuid) {
            return res_.send({ result: false, status: FAIL, message: "getNotify uuid error" });
        }
        const fetchUserInfo = await user.findOne({ uuid: uuid, active: true });
        const balance = await getBalance(fetchUserInfo.btcAccount, 'main')
        if (fetchUserInfo.btcBalance > parseInt(balance)) {
            console.log("addNotify");
            await addNotify(uuid, {
                type: 0,
                title: "Sats Consumed successfully!",
                link: `https://blockstream.info/address/${fetchUserInfo.btcAccount}`,
                content: `Consumed Sats Amount is ${fetchUserInfo.btcBalance - parseInt(balance)}`,
            });
        } else if (fetchUserInfo.btcBalance < parseInt(balance)) {
            console.log("addNotify");
            await addNotify(uuid, {
                type: 0,
                title: "Sats Deposited successfully!",
                link: `https://blockstream.info/address/${fetchUserInfo.btcAccount}`,
                content: `Deposited Sats Amount is ${parseInt(balance) - fetchUserInfo.btcBalance}`,
            });
        }
        const _updateResult = await user.updateOne({ uuid: uuid }, {
            btcBalance: parseInt(balance)
        });

        if (!_updateResult) {
            console.log("updateOne fail!", _updateResult);
        }

        const fetchItems = await notify.find({ uuid: uuid, active: true }).sort({ notifyDate: 'desc' }).limit(10);
        if (!fetchItems) {
            return res_.send({ result: false, status: FAIL, message: "getNotify field is empty" });
        }
        return res_.send({ result: fetchItems, status: SUCCESS, message: "get getNotify success" });
    } catch (error) {
        console.log("get getNotify error: ", error)
        return res_.send({ result: false, status: FAIL, message: "get getNotify fail" });
    }
}
