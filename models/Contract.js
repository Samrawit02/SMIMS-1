const contractCollection  =require('../db').db().collection("contract");
const validator = require('validator');
const Tenant  = require('../db').db().collection("contract");
const objectId = require('mongodb').ObjectID

let Contract = function (data) {
    this.data = data;
    this.errors = [];
}

Contract.prototype.cleanUp = function () {
    // if (typeof (this.data.fullname) != "string") {
    //     this.data.fullname = ""

    // }
    if (typeof (this.data.tinnumber) != "string") {
        this.data.tinnumber = ""

    }
    if (typeof (this.data.startDate) != "string") {
        this.data.startDate = ""

    }
    if (typeof (this.data.endDate) != "string") {
        this.data.endDate = ""
    }
    if (typeof (this.data.roomsize) != "string") {
        this.data.roomsize = ""
    }
    if (typeof (this.data.roomtype) != "string") {
        this.data.roomtype = ""
    }
    if (typeof (this.data.contractNo) != "string") {
        this.data.contactNo = ""

    }
    if (typeof (this.data.date) != "string") {
        this.data.date = ""

    }
    if(typeof(this.data.price) !="string"){
        this.data.price=""

    }
    if(typeof(this.data.advance) !="string"){
        this.data.advance=""

    }
    //get ride of any bogys properties
    this.data = {
        contractNo: this.data.contractNo,
        date: this.data.date,
        fullnameId: new objectId(this.data.tenantName),
        // tinnumber: this.data.tinnumber,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        // roomsize: this.data.roomsize,
        roomnoId:new objectId(this.data.roomno) ,
        // roomtype: this.data.roomtype,
        price:this.data.price,
        advance:this.data.advance,
        createdDate:  new Date()

    }
    
    
    
}
Contract.prototype.validate =  function(){
    return new Promise(async  (resolve, reject) =>{
        if (this.data.contractNo == "") {
            this.errors.push("You must Select a Contract No.")
    
        }
        if (this.data.tenantName == "") {
            this.errors.push("You must Select a Full Name")
    
        }
        if (this.data.tinNumber == "") {
            this.errors.push("You must Provide a Tin Number")
        }
        if (this.data.startDate == "") {
            this.errors.push("You must Provide a Contract Start Date")
        }
        if (this.data.endDate == "") {
            this.errors.push("You must Provide a Contract End Date")
        }
        if (this.data.date == "") {
            this.errors.push("You must Provide a Contract Date")
        }
        if (this.data.price == "") {
            this.errors.push("You must Provide a Price")
        }
        if (this.data.advance == "") {
            this.errors.push("You must Provide a Advance")
        }
       
    //Only is contractNo is valid then check to see if it's already taken
        if(this.data.contractNo.length > 0 && this.data.contractNo  < 30 && validator.isAlphanumeric(this.data.contractNo)){
            console.log("contractId")
            let ContractNoExists = await contractCollection.findOne({contractNo: this.data.contractNo})
            console.log(contractNo)
            console.log(ContractNoExists)

            if(ContractNoExists){
                this.errors.push("That Contract No. is already taken ")
            }
       }
            
       resolve()     
    
    })
    
}
Contract.prototype.addContract = function(){
    
    return new Promise(async (resolve, reject)=> {
        // Step #1: Validate user data
        this.cleanUp()
        await this.validate()
    console.log("hi1")
        // Step #2: Only if there are no validation errors 
        // then save the user data into a database
         if (!this.errors.length) {
            console.log("hi2")
            await contractCollection.insertOne(this.data)
            
            resolve("Congrat")
        }else{
            console.log("errors")
            reject(this.errors)
        }
    
    })
}

Contract.findById = function(id){
    console.log("hi every 3one")
    return new Promise(async (resolve, reject)=> {
        console.log("hi every 3one")
       if(typeof(id)!="string" || !objectId.isValid(id)){
        
           reject()
           return
       }
       let contracts = await contractCollection.aggregate([
           {$match: {_id: new objectId(id)}},
           {$lookup: {from:"tenant", localField: "fullnameId", foreignField:"_id", as: "tenantDocument"}},
           {$lookup: {from:"room", localField: "roomnoId", foreignField:"_id", as: "roomDocument"}},
            {$project: {
                contractNo: 1,
                date: 1,
                roomsize: 1,
                roomtype:1,
                tinnumber:1,
                startDate :1,
                endDate :1,
                price :1,
                advance :1,
                fullnameId:{$arrayElemAt: ["$tenantDocument",0]},
                roomnoId: {$arrayElemAt: ["$roomDocument",0]}
            }}
       ]).toArray()

       //clean up tenant and rooms
     
       

       if(contracts.length){
           console.log(contracts)
           resolve(contracts[0])  
           console.log("tenantDocument")

        }else{
            reject()

        }
    })
     
}

module.exports = Contract