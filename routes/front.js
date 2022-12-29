const express = require('express'); //import express

const router  = express.Router(); 
const controller = require('../controllers/front'); 

router.get('/', controller.getIndex); 
router.get('/contract/:id', controller.getContract);
router.get('/adress/:id', controller.getAdress);
router.get('/collection/:id', controller.getCollection);



module.exports = router; // export to use in server.js
