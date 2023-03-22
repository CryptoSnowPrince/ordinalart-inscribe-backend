const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/work/ordinalbtc-marketplace/test/ordinalbtc-marketplace-backend/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const getUserInfo = require("./getUserInfo");
const setUserInfo = require("./setUserInfo");

const getUserInscriptions = require("./getUserInscriptions");
const withdrawInscription = require("./withdrawInscription");

const listInscription = require("./listInscription");
const unListInscription = require("./unListInscription");

const getNotify = require('./getNotify')
const removeNotify = require('./removeNotify')

const inscribe = require('./inscribe')
const estimateInscribe = require('./estimateInscribe')

// getUserInfo
router.post('/getUserInfo', getUserInfo);

// setUserInfo
router.post('/setUserInfo', setUserInfo);

// getUserInscriptions
router.post('/getUserInscriptions', getUserInscriptions);

// withdrawInscription
router.post('/withdrawInscription', withdrawInscription);

// listInscription
router.post('/listInscription', listInscription);

// unListInscription
router.post('/unListInscription', unListInscription);

// getNotify
router.get('/getNotify', getNotify);
router.post('/removeNotify', removeNotify);

// inscribe
router.post('/inscribe', upload.single('file'), inscribe);

// estimateInscribe
router.post('/estimateInscribe', upload.single('file'), estimateInscribe);

module.exports = router;