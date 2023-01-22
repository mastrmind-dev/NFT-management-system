const Pinata = require('../services/pinata.service');

exports.create = async (req, res) => {
    const {investorId} = req.body;
    try {
        const uri = await Pinata.upload(investorId);
        console.log(uri)
        res.status(200).json({ uri: uri });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};