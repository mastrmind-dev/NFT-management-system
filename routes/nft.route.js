const express = require('express')
const router = express.Router()
const controller = require('../controllers/NFT.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/get', (req, res) => {
    res.json({ message: "port is working..." })
})
router.post('/auth', controller.auth)
router.post('/pin', authMiddleware.verifyToken, controller.pin);
router.post('/mint', authMiddleware.verifyToken, controller.mint);//2
router.post('/burn', authMiddleware.verifyToken, controller.burn);
router.post('/store', authMiddleware.verifyToken, controller.store);
router.get('/store', authMiddleware.verifyToken, controller.retrieve);
// pin1
// burn3
// create a seperate gmail for ER and create a pinata account for ER
// use a queue to mint nfts 
module.exports = router;