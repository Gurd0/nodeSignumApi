const contract = require('../models/getContractsInfo')
const db = require("../models/db/nftDb")
const fetch = require('node-fetch');
const dataView = require('../models/nftDataView')


const getIndex = async (req, res, next) => {
    res.render('index')
};

const getAdress = async (req, res, next) => {
    const adress = req.params["id"] //Add check
    
    const response = await fetch(`http://localhost:3000/api/nftDataViewForOwner?owner=${adress}`).then(
        (response) => response.json()
    )
    if(response == "error"){
        res.redirect('/error');
        return
    }
    for (let i = 0; response.length > i; i++){
        for (let y = 0; response[i][1].length > y; y++){
            let name = response[i][1][y]["name"]
            response[i][1][y] = new dataView.NftDataView(response[i][1][y]["view"]["_contract"])
            response[i][1][y].setName(name)
        }
    }

    res.render('showAccount', {nft:  response})
}
const getCollection = async (req, res, next) => {
    const id = req.params["id"] //Add check
    
    const response = await fetch(`http://localhost:3000/api/collection?id=${id}`).then(
        (response) => response.json()
    )
    if(response == "error"){
        res.redirect('/error');
        return
    }
    res.render('showCollection', {
        collection:  response,
        id: id
    })
}

// /view/adress
const getContract = async (req, res, next) => {
    let response 
    const t = await contract.getNftData(req.params["id"])
    if(t == "error"){
        res.redirect('/error');
        return
    }
    if (db.isContractInIpfs(t.getId()) == 1){
        response = await addIpfsToContractList(t)
    } else {
        response = await contract.getContractInfoIpfs(await t)
    }

    res.render('showContract', {
        contract: response,
        id: req.params["id"]
    }) 
   // await contract.getContractInfoIpfs()
}

async function addIpfsToContractList(contractList){
    if(contractList.length){
        for (let i = 0; i < contractList.length; i++){
            const t = await db.getIpfs(contractList[i]["id"])
            contractList[i].setImage(t["image"])
            contractList[i].setCollection(t["collection"])
            contractList[i].setName(t["name"])
        }; 
    }
    else{
       
        const t = await db.getIpfs(contractList["id"])
        contractList.setImage(t["image"])
        contractList.setCollection(t["collection"])
        contractList[i].setName(t["name"])
    }
    
    return await contractList
}


module.exports = {
    getIndex,
    getContract,
    getAdress,
    getCollection
}