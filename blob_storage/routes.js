const router = require('express').Router();
const storageUtils = require('./storageManager');
const isAuth = require("../auth/verifyAuth").isAuth;

// -------------- GET ROUTES ----------------

router.get('/listBlobs', isAuth, async (req, res, next) => {
    // fileName passed by client in req body
    const container_name = storageUtils.getContainerName(req.user.username);
    const blob_list = await storageUtils.list_blobs(container_name)
    res.json({
        "success": true,
        "blob_list": blob_list
    });
});

// -------------- POST ROUTES ----------------

router.post('/getSASUrl', isAuth, async (req, res, next) => {
    // fileName passed by client in req body
    console.log(req.body.filename);
    const container_name = storageUtils.getContainerName(req.user.username);
    const sas_url = await storageUtils.getSASUrl(container_name, req.body.filename);
    res.json({
        "success": true,
        "url": sas_url
    });
});

router.post('/setMetaData', isAuth, async (req, res, next) => {
    const metadata = req.body.metadata;
    // azure meta data only accepts str - do not pass int fields;
    console.log(metadata);

    const container_name = storageUtils.getContainerName(req.user.username);
    const state = await storageUtils.setMetaDataOnBlob(container_name, metadata.filename, metadata);
    if (state) {
        res.json({
            "success": true
        });
    } else {
        res.json({
            "success": false
        });
    }

});

router.post('/renameBlob', isAuth, async (req, res, next) => {
    const newmetadata = req.body.metadata;
    console.log(newmetadata);

    const container_name = storageUtils.getContainerName(req.user.username);
    console.log(container_name);
    console.log('filename ' + req.body.filename);
    console.log('rename ' + req.body.rename);

    const state = await storageUtils.blobRename(container_name, req.body.filename, newmetadata);
    if (state) {
        res.json({
            "success": true
        });
    } else {
        res.json({
            "success": false
        });
    }

});

router.post('/deleteBlob', isAuth, async (req, res, next) => {

    const container_name = storageUtils.getContainerName(req.user.username);
    const state = await storageUtils.blobDelete(container_name, req.body.filename);
    if (state) {
        res.json({
            "success": true
        });
    } else {
        res.json({
            "success": false
        });
    }

});

module.exports = router