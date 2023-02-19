const { ethers } = require("ethers");

const ErrorConstants = require("../../constants/Error");
const SuccessConstants = require("../../constants/Success");
const myContractArtifact = require("./artifact.json");

const contract = async () => {
    // CHANGE METADATA JSON FORMAT TO BE SUITABLE TO OPENSEA
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/PPT8_0p08mlvodQAMMxn93kYxlMyf7mG");
    const wallet = new ethers.Wallet("5da121d1e61c94c5cf5a8cc9ec335e655804829a56ccbb09a0115d2e5c631961", provider);
    const Contract = new ethers.Contract(
        "0x41d4EA524427E25e9b7a0345aEe57e07c5236a3d",//put contract address into .env file
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