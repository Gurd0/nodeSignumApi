const { ContractDataView } =  require("@signumjs/contracts");

const NftContractDataIndex = {
    Owner: 0,
    Status: 1,
    CurrentPrice: 2,
    PlatformAddress: 3,
    PlatformFee: 4,
    RoyaltiesFee: 5,
    RoyaltiesOwner: 6,
    HighestBidder: 19,
    TotalTimesSold: 27,
    TotalBidsReceived: 28,
    TotalRoyaltiesFee: 29,
    TotalPlatformFee: 30,
    TotalLikes: 31,
}

class NftDataView {
    constructor(contract) {
        this.id = contract.at;
        this.creator = contract.creatorRS;
        this.image = null;
        this.collection = null;
        this.description= contract.description;
        this.view = new ContractDataView(contract); 

    }
   
    getId() {
        return this.id;
    }
    getDescription(){
        //TODO bør fikses bedre
        try{
            const str = this.description
            const slug = str.split('"descriptor":"');
            let s = slug[1].replace('"}','')
            return s; 
        }catch{
            return ""
        }
    }
    getOwnerId() {
        return this.view.getVariableAsDecimal(NftContractDataIndex.Owner);
    }
    getOwnerIdRS() {
        return asAddress(this.view.getVariableAsDecimal(NftContractDataIndex.Owner), "S");
    }
}

class contractView {
    constructor(_id, _owner, _ipfsCid) {
        this.id = _id
        this.owner = _owner
        this.ipfsCid = _ipfsCid
        this.image = ""
        this.name = ""
        this.collection = ""
    }
}
module.exports = {
    NftDataView,
    ContractDataView,
    contractView
}