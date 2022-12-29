const { response } = require('express');
const db = require("../models/db/nftDb")
const fetch = require('node-fetch');

//let contracts = ['15368059332433627355', '937501322712187487']
let contracts = []
let contractViewList = []



var myFunctions = require("./contractView.js")
var d = require('./nftDataView')

async function getAllContracts(){
    if(contracts.length == 0){ //Testing 
        let t = await fetch("http://localhost:8125/api?requestType=getATIds&machineCodeHashId=15155055045342098571").then(
            (response) => response.json()
        ).then(
            (data) => contracts = data["atIds"]
        )
    }
        console.log(contracts.length)  
        return await getContractInfo(contracts)
}

async function getContractInfo(contracts){
    let promises = [];
    
    if (contracts)
    for (let i = 0; i < contracts.length; i++){
        if((i % 1000) === 0){
            console.log(i)
        }
        promises.push(await fetch("http://localhost:8125/api?requestType=getAT&at=" + contracts[i]).then(
            (value) => value.json()
        ))
    }; 
   
    try{
        Promise.all(promises)
        .then(
            (value => {
                for (let i = 0; i < value.length; i++){
                    let t = new myFunctions.NftDataView(value[i])
                    //TODO fjærn contractView å lægg lat i ein 
                    
                    contractViewList.push(new myFunctions.contractView(t.getId(), t.getOwnerId(), t.getDescription()))
                }; 
                
            }),
            (reason) => {
                console.error(reason); // Error!
            },
        )
        return await contractViewList 
    }catch{

    }
       // console.log(promises.length)
}

async function getNftData(adress) { 
    const response = await fetch(`http://localhost:8125/api?requestType=getAT&at=${adress}`).then(
        (response) => response.json()
        )
        if(response["errorCode"]){
        //    return "error"
        }
        data = new d.NftDataView(response)
        return data
}

async function getContractInfoIpfs(contractDataView){
    let promises = []
    if(contractDataView.length){
        for (let i = 0; i < contractDataView.length; i++){
            promises.push(
                await fetch(process.env.IPFS_SERVER + contractDataView[i].getDescription()).then( value =>  value.json()
            ))
        }; 
        const response = await Promise.all(promises)
        .catch((err) => {
            console.log(err)
        })
        const value = response
        const ret = []
        for (let i = 0; i < value.length; i++){
            try{
                if(value[i]["media"] && value[i]["collectionId"]){
                    contractDataView[i].setImage(value[i]["media"][0].thumb)
                    contractDataView[i].setCollection(value[i]["collectionId"])
                    contractDataView[i].setName(value[i]["name"])
                    
                    ret.push(await contractDataView[i])
                } else if (value[i]["media"]){
                    contractDataView[i].setImage(value[i]["media"][0].thumb)
                    contractDataView[i].setCollection("")
                    contractDataView[i].setName(value[i]["name"])
        
                    ret.push(await contractDataView[i])
                } 
            }catch (err){
                console.log("err")
            }
        }; 
       // db.addIpfsToDb(contractDataView)
       
        return ret
    }else {
        const response = await fetch(process.env.IPFS_SERVER + contractDataView.getDescription()).then(
            (response) => response.json()
            )
            contractDataView.setImage(response["media"][0].thumb);
            contractDataView.setCollection(response["collectionId"])
            contractDataView.setName(response["name"])

            return contractDataView
            }
    }


async function getCurrentBlock(){
    let t = await fetch("http://localhost:8125/api?requestType=getBlock").then(
        (response) => response.json()
    ).then(
        (resJson) => resJson
    )  
    return t
}

async function fetchAsync (url, i) {
    let response = await fetch(url);
    let data = await response.json();
    
    return {
        data,
        i,
    }

  }

    module.exports = {
        getAllContracts,
        getContractInfo,
        getCurrentBlock,
        getNftData,
        getContractInfoIpfs
    }