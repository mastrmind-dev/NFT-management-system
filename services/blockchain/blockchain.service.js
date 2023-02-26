const { ethers } = require("ethers");

const ErrorConstants = require("../../constants/Error");
const SuccessConstants = require("../../constants/Success");
const myContractArtifact = require("./artifact.json");

// const storeData = {
//     investorID: 1,
//     farmerName: "Sapthaka",
//     registrationNo: 1,
//     species: ['coconut', 'jack'],
//     eRUnits: 10,
//     servicingYear: 2,
//     h2o: "10L",
//     o2: "23L",
//     capturedCarbon: "24L"
// }

const contract = async () => {
    const provider = new ethers.providers.JsonRpcProvider(/**"https://polygon-mumbai.g.alchemy.com/v2/PPT8_0p08mlvodQAMMxn93kYxlMyf7mG" */"http://127.0.0.1:7545");
    const wallet = new ethers.Wallet("88ecd07bd22885174c7d756a8aff317e553033c175e74af1399b98e4bcefd703", provider);
    const Contract = new ethers.Contract(
        "0x81aE7B8a2952E9Fbd0120a35d110f7e990E2a4A4",//put contract address into .env file
        myContractArtifact.abi,
        wallet
    );
    return { provider, wallet, Contract };
}

const mint = async (metadataUri, investorId) => {
    const { Contract, wallet } = await contract();
    try {
        const mint = await Contract.safeMint("0xeBf544A3d53b254D7d3661FA01C1645AB22283c9", metadataUri, investorId);
        const completeMint = await mint.wait();
        console.log('mint result:', completeMint);
        return SuccessConstants.MINTING_SUCCEEDED;
    } catch (e) {
        console.log(ErrorConstants.MINITING_FAILED);
        console.log(e.message);
        return ErrorConstants.MINITING_FAILED;
    }
}

const storeAnnualData = async (
    investorID,
    farmerName,
    registrationNo,
    species,
    eRUnits,
    servicingYear,
    h2o,
    o2,
    capturedCarbon
) => {
    const { Contract, wallet } = await contract();
    try {
        const store = await Contract.setERData(
            investorID,
            farmerName,
            registrationNo,
            species,
            eRUnits,
            servicingYear,
            h2o,
            o2,
            capturedCarbon,
        );
        const completeStore = await store.wait();
        console.log('data storing result:', completeStore);
        return SuccessConstants.STORING_SUCCEEDED;
    } catch (error) {
        console.log(error.message);
        return ErrorConstants.STORING_FAILED;
    }
}

const getAnnualData = async (investorID, servicingYear) => {
    const { Contract } = await contract();

    try {
        const data = await Contract.getERData(investorID, servicingYear);
        return data;
    } catch (error) {
        console.log(error.message);
        return ErrorConstants.RETRIEVING_FAILED;
    }
}

module.exports = {
    mint,
    storeAnnualData,
    getAnnualData
}