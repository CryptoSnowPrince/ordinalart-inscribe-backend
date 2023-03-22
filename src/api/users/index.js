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

const getUserInscriptions = require("./getUserInscriptions");

const getNotify = require('./getNotify')
const removeNotify = require('./removeNotify')

const inscribe = require('./inscribe')
const estimateInscribe = require('./estimateInscribe')

// getUserInfo
router.post('/getUserInfo', getUserInfo);

// getUserInscriptions
router.post('/getUserInscriptions', getUserInscriptions);

// getNotify
router.get('/getNotify', getNotify);
router.post('/removeNotify', removeNotify);

// inscribe
router.post('/inscribe', upload.single('file'), inscribe);

// estimateInscribe
router.post('/estimateInscribe', upload.single('file'), estimateInscribe);

module.exports = router;