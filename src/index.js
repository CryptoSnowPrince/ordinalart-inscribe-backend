const app = require("./app");
const syncIndex = require("./syncIndex");

var server = require('http').createServer(app);

const port = process.env.PORT || 3306;
server.listen(port, () => console.log(`Listening on port ${port}..`));

syncIndex()
