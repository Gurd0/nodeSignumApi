const express = require('express'); //import express

const router  = express.Router(); 
const apiController = require('../controllers/api'); 

router.get('/nftById', apiController.getNftById); 
router.get('/nftByOwner', apiController.getNftByOwner); 
router.get('/collection', apiController.getCollectionById); 
router.get('/nftDataViewForOwner', apiController.getContractDataViewByOwner);
router.get('/nft', apiController.getNft); 
//router.post('/ipfs', apiController.postIpfs)

module.exports = router; // export to use in server.js
