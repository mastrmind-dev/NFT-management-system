exports.upload = async (nftData) => {
    const { imageUrl } = nftData;
    delete nftData.imageUrl;
    delete nftData.walletAddress;
    try {
        const URI = await pinataUpload(imageUrl, nftData);
        return URI;
    } catch (error) {
        console.log("error:",error);
    }
}

const pinataUpload = async (sourceUrl, nftMetadata) => {
    const axios = require("axios");
    const axiosRetry = require("axios-retry");
    const FormData = require("form-data");
    const jwtToken = `Bearer ${process.env.JWT_TOKEN}`

    const uploadImageToPinata = async (sourceUrl) => {

        const axiosInstance = axios.create();

        axiosRetry(axiosInstance, { retries: 5 });
        const data = new FormData();
        try {
            const response = await axiosInstance(sourceUrl, {
                method: "GET",
                responseType: "stream",
            });
            data.append(`file`, response.data);
        } catch (e) {
            console.log("error:", e.message)
        }
        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'Authorization': jwtToken
                }
            });
            console.log("res data:", res.data);
            return res.data.IpfsHash;
        } catch (error) {
            console.log("error:", error)
        }
    };

    const uploadMetadataToPinata = async (nftMetadata, imageUri) => {
        var data = JSON.stringify({
            "pinataOptions": {
                "cidVersion": 1
            },
            "pinataMetadata": {
                "name": "LifeForce",
                "keyvalues": {
                    "customKey": "customValue",
                    "customKey2": "customValue2"
                }
            },
            "pinataContent": {
                ...nftMetadata,
                image: imageUri
            }
        });

        var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken
            },
            data: data
        };

        const res = await axios(config);
        return res.data.IpfsHash;
    }

    const imageIPFSUri = await uploadImageToPinata(sourceUrl);
    const imageUri = `https://gateway.pinata.cloud/ipfs/${imageIPFSUri}`;

    const metadataIPFSUri = await uploadMetadataToPinata(nftMetadata, imageUri);
    const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataIPFSUri}`;
    return metadataUri;
}