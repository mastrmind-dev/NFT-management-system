exports.upload = async (nftMetadata) => {
    const {
        farmerName,
        RegistrationNo,
        Species,
        NoOfERUnits,
        ServicingYear,
        H20,
        O2,
        CapturedCarbon
    } = nftMetadata;
    // use Pianta SDK for uploading metadata to IPFS and generate uri
    const URI = "https://ipfs.exampleuri.ip";
    return URI;
}