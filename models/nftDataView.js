const { ContractDataView } =  require("@signumjs/contracts");
const { Address } =  require("@signumjs/core");
const { Amount } =  require("@signumjs/util");

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

// using a dedicated class for contract data view is a nice pattern
class NftDataView {
    constructor(contract) {
        this.id = contract.at;
        this.creator = contract.creatorRS;
        this.image = null;
        this.collection = null;
        this.name = null;
        this.description= contract.description;
        this.view = new ContractDataView(contract); 

    }
    setImage(image){
        this.image = image; 
    }
    setCollection(collection){
        this.collection = collection
    }
    setName(name){
        this.name = name
    }
    getName(){
        return this.name
    }
    getImage(){
        return this.image;
    }
    getCollection(){
        return this.collection;
    }   

    getId() {
        return this.id;
    }
   
    getDescription(){
        //TODO bør fikses bedre
        const str = this.description
        const slug = str.split('"descriptor":"');

        let s = slug[1].replace('"}','')
        return s;
    }
    getCreatorId(){
        return asNumericId(this.creator)
    }
    getOwnerId() {
        return this.view.getVariableAsDecimal(NftContractDataIndex.Owner);
    }
    getOwnerIdRS() {
        return asAddress(this.view.getVariableAsDecimal(NftContractDataIndex.Owner), "S");
    }

    getRoyaltiesOwnerId() {
        return this.view.getVariableAsDecimal(NftContractDataIndex.RoyaltiesOwner);
    }

    getPlatformId() {
        return this.view.getVariableAsDecimal(NftContractDataIndex.PlatformAddress);
    }

    getPlatformFee() {
        return parseInt(
            this.view.getVariableAsDecimal(NftContractDataIndex.PlatformFee),
            10
        );
    }

    getRoyaltiesFee() {
        return parseInt(
            this.view.getVariableAsDecimal(NftContractDataIndex.RoyaltiesFee),
            10
        );
    }

    getStatus() {
        const status = this.view.getVariableAsDecimal(NftContractDataIndex.Status);
        switch (status) {
            case "1":
                return "For Sale";
            case "2":
                return "For Auction";
            case "0":
            default:
                return "Not For Sale"
        }
    }

    getCurrentPrice() {
        return Amount.fromPlanck(
            this.view.getVariableAsDecimal(NftContractDataIndex.CurrentPrice)
        )
    }

    getHighestBidder() {
        return this.view.getVariableAsDecimal(NftContractDataIndex.HighestBidder);
    }

    getTotalTimesSold() {
        return parseInt(
            this.view.getVariableAsDecimal(NftContractDataIndex.TotalTimesSold),
            10
        );
    }

    getTotalBidsReceived() {
        return parseInt(
            this.view.getVariableAsDecimal(NftContractDataIndex.TotalBidsReceived),
            10
        );
    }

    getTotalRoyaltiesFee() {
        return BigInt(
            this.view.getVariableAsDecimal(NftContractDataIndex.TotalRoyaltiesFee)
        );
    }

    getTotalPlatformFee() {
        return BigInt(
            this.view.getVariableAsDecimal(NftContractDataIndex.TotalPlatformFee)
        );
    }

    getTotalLikes() {
        return parseInt(
            this.view.getVariableAsDecimal(NftContractDataIndex.TotalLikes)
        );
    }
}
function asAddress(id, prefix){
    return Address.fromNumericId(id, prefix).getReedSolomonAddress()
}
function asNumericId(adress){
    return Address.fromReedSolomonAddress(adress).getNumericId()
}
module.exports ={
    NftDataView
}