const {PrismaClient} = require ('@prisma/client')
const db = require("../models/db/nftDb")
const contract = require('../models/getContractsInfo')
const fetch = require('node-fetch');
const dataView = require('../models/nftDataView');
const { getBlock } = require('../models/blockUpdate');
const prisma = new PrismaClient()

// get nft by id
const getNftById = async (req, res, next) => {
    const response = await db.getNftById(req.query.id)
    
    res.json(response)
};
const getCollectionById = async (req, res, next) => {
    const respoonse = await db.getCollection(req.query.id)

    res.json(respoonse)
}
//get all nfts by owner
const getNftByOwner = async (req, res, next) => {
    const response = await db.getNftByOwner(req.query.owner)
     res.json(await response)
};

const getContractDataViewByOwner = async (req, res, next) => {
    let promises = []
    let added = []
    //TODO add if check
    
    const response = await db.getNftByOwner(req.query.owner)
    if (!response.length){
        res.json("error")
        return
    }
    try{
    for (let i = 0; i < response.length; i++){
        promises.push(await contract.getNftData(response[i]["id"]))
    }; 
    const t = await Promise.all(promises)
    .then(
        (async value => value
        ),
        (reason) => {
            console.error(reason); // Error!
        },
    )
   // console.table(t)
    
   
    let saved = []
    let notSaved = []
    for (let i = 0; i < t.length; i++){
        if(await db.isContractInIpfs(t[i].getId()) != 1){
            notSaved.push(t[i])
        }else{
            saved.push(await addIpfsToContractList(t[i]))
        }
    };
    let s 
    let n 
    let list 
    if(saved.length == 0){
         n = await contract.getContractInfoIpfs(notSaved)
         await db.addIpfsToDb(n)
         list = n
    }else if (notSaved.length == 0) {
        s = await Promise.all(saved).then()
        list = s
       // n = await contract.getContractInfoIpfs(notSaved)
    }else {
        n = await contract.getContractInfoIpfs(notSaved)
        s = await Promise.all(saved).then()
        await db.addIpfsToDb(n)
        list = s.concat(n)
    }
    added = add(list)
}finally{
        res.json(added)
    } 
};
function add(nftDataView){ 
    let nftCollectionList = []
    nftDataView.forEach(element => {
        if (!nftCollectionList.some(row =>  row.some(row => row === element.getCollection()))){
            nftCollectionList.push([element.getCollection(), [element]])
        }
        else {
            nftCollectionList[nftCollectionList.findIndex(x => x[0,0] === element.getCollection())][0,1].push(element)
        }
    }); 
   return nftCollectionList
}
async function addIpfsToContractList(contractList){
    if(contractList.length){
        for (let i = 0; i < contractList.length; i++){
            const t = await db.getIpfs(contractList[i]["id"])
            contractList[i].setImage(t["image"])
            contractList[i].setCollection(t["collectionId"])
            contractList[i].setName(t["name"])
            
        }; 
    }
    else{
        const t = await db.getIpfs(contractList["id"])
        contractList.setImage(t["image"])
        contractList.setCollection(t["collectionId"])
        
        contractList.setName(t["name"])
    }
    
    return await contractList
}
//Get all nfts
const getNft = async (req, res, next) => {
    await prisma.NFT.findMany()
        .then(data => res.json(data))
        .catch(err => {
            err.type = "redirect"
            next(err)
        })
};
module.exports = {
    getNftById,
    getNft,
    getNftByOwner,
    getContractDataViewByOwner,
    getCollectionById
};
