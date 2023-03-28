const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/work/ordinals/ordinalart-inscribe-backend/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

/// controllers
const mint = require('./mint');
const addCollection = require('./addCollection');
const estimateMint = require("./estimateMint");
const getCollection = require("./getCollection");


router.post("/mint", mint);
router.post("/add", addCollection);
router.post("/estimate", estimateMint);
router.get("/getCollection", getCollection);

module.exports = router;