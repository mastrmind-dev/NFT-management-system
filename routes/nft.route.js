const express = require('express')
const router = express.Router()
const controller = require('../controllers/NFT.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/get', (req, res)=>{
    res.json({message:"port is working..."})
})
router.post('/auth', controller.auth)
router.post('/mint', authMiddleware.verifyToken, controller.mint)

module.exports = router;