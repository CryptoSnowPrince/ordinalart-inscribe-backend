const awaitExec = require('util').promisify(require('child_process').exec);

let isRunning = false;

const syncIndex = async () => {
    try {
        if (isRunning) {
            return;
        }

        isRunning = true;
        console.log(`===========syncIndex===========`);
        // sync ord
        const { stdout, stderr } = await awaitExec(`ord wallet balance`)
        console.log('ord wallet balance stdout: ', stdout)
        console.log('ord wallet balance stderr: ', stderr)
        isRunning = false;
    } catch (error) {
        console.log('syncIndex catch error: ', error)
    }
}

module.exports = async () => {
    try {
        console.log("start syncIndex");
        setInterval(async () => { await syncIndex() }, 300000);
    } catch (error) {
        console.log('checkOffer catch error: ', error);
    }
}
