const {PrismaClient} = require ('@prisma/client')

const contractFunctions = require("../models/getContractsInfo.js")
const db = require("../models/db/nftDb")
const blockUpdate = require("../models/blockUpdate")
const fetch = require('node-fetch');

const prisma = new PrismaClient()



async function main() {
  let inserts = []
  
  //await db.makeBlock(block)
  const block = await contractFunctions.getCurrentBlock()

  //Delete old db 
  await prisma.NFT.deleteMany({})
  await prisma.Block.deleteMany({})
  await prisma.ipfs.deleteMany({})
  //Test list
  const testList = ['7074088231427605580',  '13625975558528728709', '10506644153155914554', '10686000386117803136', '5530297778188117316',  '6689697602956695066']
  console.log(" ------ Getting all NFTSRC40 contracts  ----- ")
  let contracts =  await contractFunctions.getAllContracts() 
  //let contracts = await contractFunctions.getContractInfo(testList)
  console.log(contracts)
  
  console.log(" ------ Started populateing db ----- ")
  console.log(block["block"] + block["height"])
  await db.makeBlock(await block["block"], await block["height"])
//Add all nft to sql
  contracts.forEach(async c => {
    inserts.push(prisma.NFT.create({
      data: {
        id: c["id"],
        owner: c["owner"],
        ipfsCid: c["ipfsCid"],
        },
      }))
    })
    await prisma.$transaction(inserts)


  
    let promises = [];
    let ipfsContracts = [];
for (let i = 0; i < contracts.length; i++){
    if((i % 1000) === 0){
        console.log(i)
    }
    console.log(contracts)
    if(contracts[i]["ipfsCid"]){
      promises.push(await fetch(process.env.IPFS_SERVER + contracts[i]["ipfsCid"], {
        method: 'Get' 
    }).then(value => value.json())
    .then(value => {
      contracts[i]["image"] = value["media"][0]["thumb"]
      contracts[i]["name"] = value["name"]
      contracts[i]["collection"] = value["collectionId"]
      ipfsContracts.push(contracts[i])
    }))
    }
   }
const t = await Promise.all(promises)
    .then(
        (async value => {
          await db.addIpfsToDb(ipfsContracts)
        }
        ),
        (reason) => {
            console.error(reason); // Error!
        },
    )

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


