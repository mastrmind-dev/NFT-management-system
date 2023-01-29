const Pinata = require('../services/pinata.service')
const jwt = require('jsonwebtoken');

exports.auth = async (req, res) => {
    const incomer = {
        name: "web backend",
        address: "https://er.webbackend.sample"
    }
    try {
        const { authenticationKey } = req.body;
        if (authenticationKey === process.env.AUTHENTICATION_KEY) {
            jwt.sign({ incomer }, 'secretkey', (err, token) => {
                res.status(200).json({ token })
            })
        } else {
            throw new Error("Unauthorized user")
        }
    } catch (error) {
        if (error.toString().includes("Unauthorized user")) {
            res.status(401).json({ error: error.message })
        } else {
            res.sendStatus(500)
        }
    }
}

exports.mint = async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', { expiresIn: '30m' }, async (error, authData) => {
            if (error) {
                res.status(403).json({ error: error.message })
            } else {
                const URI = await Pinata.upload(req.body);
                res.status(200).json({ URI, AuthData: authData });
            }
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};