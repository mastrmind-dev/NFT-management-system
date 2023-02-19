const { ethers } = require("ethers");

const ErrorConstants = require("../../constants/Error");
const SuccessConstants = require("../../constants/Success");
const myContractArtifact = require("./artifact.json");

const contract = async () => {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
    const wallet = new ethers.Wallet("88ecd07bd22885174c7d756a8aff317e553033c175e74af1399b98e4bcefd703", provider);
    const Contract = new ethers.Contract(
        "0xA51AA032caea12649FE5CCc5b6f78BF2339bFe55",//put contract address into .env file
        myContractArtifact.abi,
        wallet
    );
    return { provider, wallet, Contract };
}

const mint = async (metadataUri) => {
    const { Contract, wallet } = await contract();
    try {
        const mint = await Contract.safeMint("0xB871f2026EF8F08C0899E757C4592BC37B0A0301", metadataUri);
        const completeMint = await mint.wait();
        console.log('mint result:', completeMint);
        return SuccessConstants.MINTING_SUCCEEDED;
    } catch (e) {
        console.log(ErrorConstants.MINITING_FAILED);
        console.log(e.message);
        return ErrorConstants.MINITING_FAILED;
    }
}

module.exports = {
    mint
}