const Pinata = require('../services/pinata.service');

exports.mint = async (req, res) => {
    try {
        const URI = await Pinata.upload(req.body);
        res.status(200).json({ URI });
    } catch (error) {
        res.status(400).json({ xerror: error.message });
    }
};