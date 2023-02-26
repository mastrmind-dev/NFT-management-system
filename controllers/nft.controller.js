const Pinata = require('../services/pinata.service');
const Blockchain = require('../services/blockchain/blockchain.service');
const SuccessConstants = require("../constants/Success");
const ErrorConstants = require("../constants/Error");
const jwt = require('jsonwebtoken');

exports.auth = async (req, res) => {
    const incomer = {
        name: "web backend",
        address: "https://er.webbackend.sample"
    }
    try {
        const { password } = req.body;
        if (password === process.env.PASSWORD) {
            jwt.sign({ incomer }, 'secretkey', (err, token) => {
                if (err) res.sendStatus(500);
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

exports.pin = async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', { expiresIn: '30m' }, async (error, authData) => {
            if (error) {
                res.status(403).json({ error: error.message })
            } else {
                try {
                    const URI = await Pinata.upload(req.body);
                    res.status(200).json({ URI, AuthData: authData });
                } catch (error) {
                    console.log("error:", error);
                    res.status(500).json({ error: error.message });
                }
            }
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.mint = async (req, res) => {
    const { metadataUri, investorId } = req.body;
    try {
        const mint = await Blockchain.mint(metadataUri, investorId);
        console.log('Mint result:', mint);
        if (mint === SuccessConstants.MINTING_SUCCEEDED) {
            res.status(200).json({ message: "Successfully Minted", NFTUri: `https://testnets.opensea.io/assets/mumbai/0x919c55A13DFfd2351c11068353DF303304b47900/${investorId}` })
        } else { throw new Error(ErrorConstants.MINITING_FAILED); }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message })
    }
}

exports.burn = async (req, res) => {
    res.send({ message: "burn is about to happen..." })
}

exports.store = async (req, res) => {
    const {
        investorID,
        farmerName,
        registrationNo,
        species,
        eRUnits,
        servicingYear,
        h2o,
        o2,
        capturedCarbon
    } = req.body;

    try {
        const store = await Blockchain.storeAnnualData(
            investorID,
            farmerName,
            registrationNo,
            species,
            eRUnits,
            servicingYear,
            h2o,
            o2,
            capturedCarbon
        );
        if (store === SuccessConstants.STORING_SUCCEEDED) {
            res.status(200).json({ message: "Data stored successfully!" });
        } else {
            res.status(500).json({ error: "Data storing failed!" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

exports.retrieve = async (req, res) => {
    const { investorID, servicingYear } = req.body;

    try {
        const data = await Blockchain.getAnnualData(investorID, servicingYear);
        if (data !== ErrorConstants.RETRIEVING_FAILED) {
            res.status(200).json({ message: SuccessConstants.RETRIEVING_SUCCEEDED, data: `${data}` });
        } else {
            res.status(500).json({ error: ErrorConstants.RETRIEVING_FAILED });
        }
    } catch (error) {
        console.log(error.message);
    }
}