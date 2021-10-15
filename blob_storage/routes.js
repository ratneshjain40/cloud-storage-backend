const router = require('express').Router();
const storageUtils = require('./utils');
const isAuth = require("./verifyAuth").isAuth;

// -------------- POST ROUTES ----------------
router.post('getSASUrl', isAuth ,(req, res, next) => {
    // fileName passed by client in req body
    const container_name = storageUtils.getContainerName(req.user.username,req.body.fileName);
    const sas_url = storageUtils.getSASUrl(container_name,) 
    res.json({
        "status":true,
        "url":sas_url
    });
});

router.post('setMetaData', isAuth ,(req, res, next) => {
    const metadata = JSON.parse(req.body.metadata);
    const container_name = storageUtils.getContainerName(req.user.username);
    if(storageUtils.setMetaDataOnBlob(container_name,req.body.fileName,metadata)) {
        res.json({
            "status":true
        });
    } else {
        res.json({
            "status":false
        });
    }
    
});
router.post('listBlobs', isAuth ,(req, res, next) => {
    // fileName passed by client in req body
    const container_name = storageUtils.getContainerName(req.user.username);
    const blob_list = storageUtils.list_blobs(container_name) 
    res.json({
        "status":true,
        "blob_list":blob_list
    });
});

module.exports = router