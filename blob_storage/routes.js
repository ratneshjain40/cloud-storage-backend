const router = require('express').Router();
const storageUtils = require('./utils');
const isAuth = require("../auth/verifyAuth").isAuth;

// -------------- POST ROUTES ----------------
router.post('/getSASUrl', isAuth ,async (req, res, next) => {
    // fileName passed by client in req body
    console.log(req.body.fileName);
    const container_name = storageUtils.getContainerName(req.user.username);
    const sas_url = await storageUtils.getSASUrl(container_name,req.body.fileName);
    res.json({
        "status":true,
        "url":sas_url
    });
});

router.post('/setMetaData', isAuth ,async (req, res, next) => {
    console.log(req.body.metadata);
    const container_name = storageUtils.getContainerName(req.user.username);
    const state = await storageUtils.setMetaDataOnBlob(container_name,req.body.fileName,req.body.metadata);
    if(state) {
        res.json({
            "status":true
        });
    } else {
        res.json({
            "status":false
        });
    }
    
});

router.post('/listBlobs', isAuth , async (req, res, next) => {
    // fileName passed by client in req body
    const container_name = storageUtils.getContainerName(req.user.username);
    const blob_list = await storageUtils.list_blobs(container_name) 
    res.json({
        "status":true,
        "blob_list":blob_list
    });
});

module.exports = router