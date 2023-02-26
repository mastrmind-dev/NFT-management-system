const ErrorConstants = require("../constants/Error.js");

exports.upload = async (nftData) => {
    const { imageUrl } = nftData;
    delete nftData.imageUrl;
    delete nftData.walletAddress;
    try {
        const URI = await pinataUpload(imageUrl, nftData);
        return URI;
    } catch (error) {
        console.log("error:", error);
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
            console.log(ErrorConstants.IMAGE_DOES_NOT_GET_CONVERTED_TO_FORM_DATA);
            console.log("error:", e.message)
        }

        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
                maxBodyLength: "Infinity",
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'Authorization': jwtToken,
                },
                timeout: 60000,
            });
            console.log("res data:", res.data);
            return res.data.IpfsHash;
        } catch (error) {
            console.log(ErrorConstants.IMAGE_DOES_NOT_GET_UPLOADED_TO_PINATA);
            console.log("error:", error)
        }
    };

    const uploadMetadataToPinata = async (nftMetadata, imageUri) => {
        const openseaMetadataFormat = {
            description: nftMetadata.Description,
            external_url: "https://restore.earth",
            image: imageUri,
            name: nftMetadata.Name,
            attributes: [
                {
                    "trait_type": "Farmer", 
                    "value": nftMetadata.FarmerName
                  }, 
                  {
                    "trait_type": "Registration No", 
                    "value": nftMetadata.RegistrationNo
                  }, 
                  {
                    "trait_type": "Species", 
                    "value": nftMetadata.Species
                  }, 
                  {
                    "trait_type": "NoOfERUnits", 
                    "value": nftMetadata.ServicingYear
                  }, 
                  {
                    "trait_type": "Released H2O", 
                    "value": nftMetadata.H2O
                  }, 
                  {
                    "trait_type": "Released O2", 
                    "value": nftMetadata.O2
                  }, 
                  {
                    "display_type": "boost_number", 
                    "trait_type": "Captured Carbon", 
                    "value": nftMetadata.CapturedCarbon
                  }, 
                  {
                    "display_type": "boost_percentage", 
                    "trait_type": "Boost percentage test", 
                    "value": 10
                  }, 
                  {
                    "display_type": "number", 
                    "trait_type": "Generation", 
                    "value": 2
                  }
            ]
        }
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
                ...openseaMetadataFormat
            }
        });

        let config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwtToken
            },
            data: data
        };

        try {
            const res = await axios(config);
            return res.data.IpfsHash;
        } catch (error) {
            console.log(ErrorConstants.METADATA_DOES_NOT_GET_UPLOADED_TO_PINATA);
            console.log("error:", error.message)
        }
    }

    const imageIPFSUri = await uploadImageToPinata(sourceUrl);
    const imageUri = `https://gateway.pinata.cloud/ipfs/${imageIPFSUri}`;

    const metadataIPFSUri = await uploadMetadataToPinata(nftMetadata, imageUri);
    const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataIPFSUri}`;
    return metadataUri;
}