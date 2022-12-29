var cron = require('node-cron');


const contractFunctions = require("../models/getContractsInfo.js")
const db = require("../models/db/nftDb")
const blockUpdate = require("../models/blockUpdate")


const job = cron.schedule('*/1 * * * *', async () => {
    const localBlock = await db.getBlockId()
    const currentBlock = await blockUpdate.getBlock()

    console.log(currentBlock["block"])
	//await db.makeBlock(currentBlock["block"], currentBlock["height"])
	const heightDif =  currentBlock["height"] -  localBlock["height"]

	console.log(`Height diff: ${heightDif}  currentBlock ${currentBlock["height"]}  localBlock: ${localBlock["height"]}`)
	if(heightDif != 0){
        let transactionList = await blockUpdate.getBlockRangeTransaction(heightDif - 1)
        await db.setBlockId(currentBlock["id"], currentBlock["height"]
        )
        let t = []
        //console.log(await blockUpdate.getTrasactionReciver("11688400110099860552"))

        await Promise.all(transactionList.map(async (i) => {
           // t.push(await blockUpdate.getTrasactionReciver(i))
            t.push(await blockUpdate.getTrasactionSender(i))
        }));

        t = t.filter(e =>!!e)
        
        //let t = ['11429143353368421951']
        let temp = []
        
        
        await Promise.all(t.map(async (i) => {
            if(await blockUpdate.isContractNFTSRC40(await i)){
                if(!temp.includes(i)){
                    console.log("NFTSR40 contract found")
                    temp.push(i)
                    //need time out as smartcontract update is slow TODO find time 
                    setTimeout(async function(){
                        //success.push(await contractFunctions.getContractInfo([i]))
                        const res = await contractFunctions.getContractInfo([i])
                        console.log(await res)
                        await addToDb(await res[0]["id"], await res[0]["owner"])
                    }, 2000 *60);
                    console.log(`true ${i}`)		
                }
            }
            }));
        }
        });

async function addToDb(id, owner){
    await db.upsertNewNft(id, owner)
    console.log(`changes made to contract ${id}, owner is set to ${owner}`)
        
}


function startJob(){
    job.start()
}
module.exports = {
    startJob
}
