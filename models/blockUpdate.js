const { response } = require('express');
const fetch = require('node-fetch');

async function getBlockIdByHeight(height){
    let blockId 
    await fetch(`http://localhost:8125/api?requestType=getBlock&block&height=${height}`).then(
        (response) => response.json()
    ).then(
        (data) =>  blockId = data
    ) 
    return blockId
}
async function getBlock(){
    let blockId 
    await fetch(`http://localhost:8125/api?requestType=getBlock`).then(
        (response) => response.json()
    ).then(
        (data) =>  blockId = data
    ) 
    return blockId
}
async function getBlockTransactions(blockId){
    let transactions = []
    await fetch(`http://localhost:8125/api?requestType=getBlock&block&block=${blockId}`).then(
        (response) => response.json()
    ).then(
        (data) => transactions = data["transactions"]
    ) 
    return transactions
}

async function getBlockRangeTransaction(heightDifference){ //heightDifference between last and current block
    let transactions = []
    await fetch(`http://localhost:8125/api?requestType=getBlocks&firstIndex=0}&lastIndex=${heightDifference}`).then(
        (response) => response.json()
    ).then(
        (data) => 
         data["blocks"].forEach(element => {
            element["transactions"].forEach(transaction => {
                transactions.push(transaction)
            })
         }) 
    )

    return transactions.reverse(); //flip array to get newest block first
}
async function getTrasactionReciver(transactionId){
    const data = await fetch(`http://localhost:8125/api?requestType=getTransaction&transaction=${transactionId}`).then(
        (response) => response.json()
    )
    let recipient = await data["recipient"]

    return recipient
}
async function getTrasactionSender(transactionId){
    const data = await fetch(`http://localhost:8125/api?requestType=getTransaction&transaction=${transactionId}`).then(
        (response) => response.json()
    )
    let sender = await data["sender"]

    return sender
}

async function isContractNFTSRC40(contractId){
    const data = await fetch(`http://localhost:8125/api?requestType=getAT&at=${contractId}`).then(
        (response) => response.json()
    )
    if(data["name"] == "NFTSRC40") return true;
    else return false;
}



module.exports = {
    getBlockRangeTransaction,
    getBlockTransactions,
    getBlockIdByHeight,
    isContractNFTSRC40,
    getTrasactionReciver,
    getBlock,
    getTrasactionSender
}