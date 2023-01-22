const express = require('express');
const router = express.Router();
const controller = require('../controllers/NFT.controller');

router.post('/mint', controller.mint);

module.exports = router;