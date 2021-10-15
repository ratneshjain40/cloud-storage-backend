const storage = require("@azure/storage-blob");
require('dotenv').config();
// Setup
const account = "ratneshjain";
const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
const accessKey = process.env.AZURE_STORAGE_ACCESS_KEY;
const cerds = new storage.StorageSharedKeyCredential(account, accessKey);

const blobServiceClient = storage.BlobServiceClient.fromConnectionString(connStr);

function getContainerName(user_name) {
    let container_name = user_name.replace(/\s+/g, '-').toLowerCase();
    return container_name
}

async function create_container(name) {
    // Connect to container: user-files
    const container_name = getContainerName(name);
    const containerClient = blobServiceClient.getContainerClient(container_name);
    await containerClient.createIfNotExists();
    console.log("Container created for user " + container_name)
}

// Pass blobName=null to get sasUrl for whole container
async function getSASUrl(name, blobName) {
    const containerName = getContainerName(name);;
    const client = blobServiceClient.getContainerClient(containerName);
    const blobClient = client.getBlobClient(blobName);

    let startsOn = new Date();
    startsOn.setMinutes(startsOn.getMinutes() - 5);
    let expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + 60);

    const blobSAS = storage.generateBlobSASQueryParameters({
        containerName,
        blobName,
        permissions: storage.BlobSASPermissions.parse("racwdl"),
        startsOn,
        expiresOn
    },
        cerds
    ).toString();

    const sasUrl = blobClient.url + "?" + blobSAS;
    console.log("SAS URL IS " + sasUrl);
}

module.exports.create_container = create_container;
module.exports.getSASUrl = getSASUrl;