const {PrismaClient} = require ('@prisma/client')
var request = require('request');

const prisma = new PrismaClient()


async function setBlockId(_id, _height){
	await prisma.Block.updateMany({
		where: {
		  name: {
            contains: "Block",
          },
		},
        data: {
            id: _id,
            height: _height
        },
	  })
	}

async function getBlockId(){
    const blockId = await prisma.Block.findUnique({
		where: {
		  name: "Block",
		},
	  })
      return blockId
}

async function makeBlock(_id, _height){
	await prisma.Block.create({
		data: {
		  id: _id,
		  name: "Block",
      height: _height,
		},
	  })
	}
async function upsertNewNft(_id, _owner){
    await prisma.NFT.upsert({
        where: {
            id: _id
        },
		update: {
		  owner: _owner,
		},
        create: {
            id: _id,
            owner: _owner,
            ipfsCid: "",
        },
	  })
}
async function getNftById(_id){
    const nft = await prisma.NFT.findUnique({
        where: {
            id: _id
        },
    })
    return nft
}
async function isContractInIpfs(_id){
    return await prisma.ipfs.count({
    where:{
      id: _id,
    },
  })
}
async function isContractInNFT(_id){
  return await prisma.NFT.count({
  where:{
    id: _id,
  },
})
}
async function isCollectionInIpfs(_id){
  return await prisma.ipfs.count({
  where:{
    collectionId: _id,
  },
})
}
async function getIpfs(_id){
  const ipfs = await prisma.ipfs.findUnique({
    where: {
        id: _id
    },
  })
  return ipfs
}
async function getNftByOwner(_id) {
   const response = await prisma.NFT.findMany({
        where: {
            owner: _id,
        },
        select: {
            id: true,
        },
        })
        .catch(err => {
            err.type = "redirect"
            next(err)
        })
        return response
}
async function getCollection(_id) {
  const response = await prisma.ipfs.findMany({
       where: {
        collectionId: _id,
       },
       select: {
           id: true,
           name: true,
       },
       })
       .catch(err => {
           err.type = "redirect"
           next(err)
       })
       return response
}

async function getNftById(_id){
    const response = await prisma.NFT.findUnique({
        where: {
            id: _id,
        },
        })
        .catch(err => {
            err.type = "redirect"
            next(err)
        })
        return response
}

async function addIpfsToDb(contract){
    for (let i = 0; i < contract.length; i++){
        await prisma.ipfs.create({
            data: {
              id: contract[i]["id"],
              image: contract[i]["image"],
              collectionId: contract[i]["collection"],
              name: contract[i]["name"],
              collection: "",
            },
          })
    }
}



module.exports = {
    getBlockId,
    setBlockId,
    makeBlock,
    upsertNewNft,
    getNftById,
    isContractInIpfs,
    getIpfs,
    addIpfsToDb,
    getNftByOwner,
    getNftById,
    getCollection,
    isContractInNFT,
    isCollectionInIpfs
}
