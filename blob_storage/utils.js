const storage = require("@azure/storage-blob");
require('dotenv').config();

// ---------------------- SETUP ----------------------

const account = "ratneshjain";
const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
const accessKey = process.env.AZURE_STORAGE_ACCESS_KEY;
const cerds = new storage.StorageSharedKeyCredential(account, accessKey);
const blobServiceClient = storage.BlobServiceClient.fromConnectionString(connStr);

function getContainerName(user_name) {
    let container_name = user_name.replace(/\s+/g, '-').toLowerCase();
    return container_name
}

async function create_container(container_name) {
    // Connect to container: user-files
    const containerClient = blobServiceClient.getContainerClient(container_name);
    const createContainerResponse = await containerClient.createIfNotExists();
    console.log("Container created for user " + container_name);
    console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
}

// ---------------------- SAS TOKENS ----------------------

// Pass blobName=null to get sasUrl for whole container
async function getSASUrl(containerName, blobName) {
    const client = blobServiceClient.getContainerClient(containerName);

    if (blobName != null) {
        const blobClient = client.getBlobClient(blobName);

        const startsOn = new Date();
        startsOn.setMinutes(startsOn.getMinutes() - 5);
        const expiresOn = new Date();
        expiresOn.setMinutes(expiresOn.getMinutes() + 60);

        const sasUrl = await blobClient.generateSasUrl({
            permissions: storage.BlobSASPermissions.parse("cw"), // "racwdl for all Permissions"
            startsOn,
            expiresOn
        });
        console.log("SAS URL IS " + sasUrl);
        // on put req - returns status 201 created
        // status 403 if not authorized
        return sasUrl;
    } else {
        console.log("blobname is null err");
        return "NoBlobName";
    }
}

// dont use for now, alternate approch - get token and use azure rest api endpoints on client
async function getSASUrlContainer(containerName) {
    const client = blobServiceClient.getContainerClient(containerName);

    const startsOn = new Date();
    startsOn.setMinutes(startsOn.getMinutes() - 5);
    const expiresOn = new Date();
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

    //to upload file client.url + filename +"?" + blobSAS
    const sasUrl = client.url + "?" + blobSAS;
    console.log("SAS URL IS " + sasUrl);
    return sasUrl;
}

// ---------------------- MANAGE BLOBS ----------------------

// since container-name is linked to username we only pass container_name after verifying user
async function list_blobs(container_name) {
    const containerClient = blobServiceClient.getContainerClient(container_name);
    const blobs = await containerClient.listBlobsFlat({ include: ["metadata"] });
    let blobList = [];
    for await (const blob of blobs) {
        blobList.push({
            name: blob.name,
            metadata: blob.metadata
        });
    }
    return blobList;
}

async function getMetaDataOnBlob(containerName, blobName) {
    const client = blobServiceClient.getContainerClient(containerName);
    const blobClient = client.getBlobClient(blobName);
    const data = await blobClient.getProperties();
    console.log(data.metadata)
    return data.metadata;
}

async function setMetaDataOnBlob(containerName, blobName, metadata) {
    metadata = {
        "hello": "world"
    }
    const client = blobServiceClient.getContainerClient(containerName);
    const blobClient = client.getBlobClient(blobName);
    const state = await blobClient.setMetadata(metadata).
        then(() => {
            console.log("set metadata");
            return true;
        }).catch((err) => {
            console.log("err on set metadata");
            return false;
        });

    return state;
}

//list_blobs("test-con");
//getSASUrl("test-con", "newfile");
//setMetaDataOnBlob("test-con","Endpoints.docx");
//getMetaDataOnBlob("test-con", "Endpoints.docx");

module.exports.getContainerName = getContainerName;
module.exports.create_container = create_container;
module.exports.getSASUrl = getSASUrl;
module.exports.list_blobs = list_blobs;
module.exports.getMetaDataOnBlob = getMetaDataOnBlob;
module.exports.setMetaDataOnBlob = setMetaDataOnBlob;