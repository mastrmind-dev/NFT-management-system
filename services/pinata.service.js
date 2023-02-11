exports.upload = async (nftMetadata) => {
    // use Pianta SDK for uploading metadata to IPFS and generate uri
    const URI = await pinataUpload("https://i.ibb.co/NSBGXT8/Whats-App-Image-2023-01-26-at-08-11-53-1.jpg", nftMetadata);
    return URI;
}

const pinataUpload = async (sourceUrl, nftMetadata) => {
    const axios = require("axios");
    const axiosRetry = require("axios-retry");
    const FormData = require("form-data");
    const jwtToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjMjQ0OTkxMS00MjQxLTRiMmUtOTgwNS1hOTE1N2U5ZDdmYTgiLCJlbWFpbCI6InNhcHRoYWthLm1vcmFoZWxhQGVsemlhbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzhlZTQ1YTgyZjIwMmYzZWMyMGYiLCJzY29wZWRLZXlTZWNyZXQiOiI5MzZhMGRhYzg2N2FlOTJjZGUxODk0YjM0MjUwM2U0YzM1NDczOTg0NTg3OGYzYzg0MGJiNDc0ZWRlNjM4ZmM1IiwiaWF0IjoxNjc2MDM1NjY5fQ.3-t_H4pGcKg4WOQCT0ixVAw5qXHZHRF-yILlC0AYfR4`

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