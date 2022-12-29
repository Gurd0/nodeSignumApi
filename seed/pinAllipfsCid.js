const {PrismaClient} = require ('@prisma/client')
const request = require('request');
const fetch = require('node-fetch');

const prisma = new PrismaClient()


async function main() {
    const response = await prisma.NFT.findMany({
        select: {
            ipfsCid: true,
        },
        })
        .catch(err => {
            err.type = "redirect"
            next(err)
        })
        //console.log(response)
       // console.log(response[1]["ipfsCid"])
        let promises = [];
    
        for (let i = 0; i < response.length; i++){
            if((i % 1000) === 0){
                console.log(i)
            }
            promises.push(await fetch(process.env.IPFS_API + "api/v0/pin/add?arg="+ response[i]["ipfsCid"], {
                method: 'POST' 
            }))
        }; 
        console.log("dakjdka")
        try{
            Promise.all(promises)
        }catch{
            console.log("error")
        }
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