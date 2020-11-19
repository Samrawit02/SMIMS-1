const receiptCollection  =require('../db').db().collection("receipt")
const  ObjectId  = require('mongodb').ObjectID
const validator = require('validator')


let Receipt = function (data) {
    this.data = data
    this.errors = []
}

Receipt.prototype.cleanUp = function () {
    // if (typeof (this.data.fullname) != "string") {
    //     this.data.fullname = ""

    // }

       if (typeof (this.data.receiptNo) != "string") {
        this.data.receiptNo = ""

    }
    if (typeof (this.data.tinnumber) != "string") {
        this.data.tinnumber = ""

    }
    if (typeof (this.data.startDate) != "string") {
        this.data.startDate = ""

    }
    if (typeof (this.data.endDate) != "string") {
        this.data.endDate = ""
    }
    
     if (typeof (this.data.date) != "string") {
        this.data.date = ""

    }

    if (typeof (this.data.roomsize) != "string") {
        this.data.roomsize = ""

    }
    
    if (typeof (this.data.price) != "string") {
        this.data.price = ""

    }
    if (typeof (this.data.total) != "string") {
        this.data.total = ""

    }
    if (typeof (this.data.vat) != "string") {
        this.data.vat = ""

    }

    if (typeof (this.data.totalAmount) != "string") {
        this.data.totalAmount = ""

    }
    
    
    
    //get ride of any bogys properties
    this.data = {
        receiptNo: this.data.receiptNo,
        fullnameId: new ObjectId(this.data.tenantName) ,
        // tinnumber: this.data.tinnumber,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        // roomsize: this.data.roomsize,
        roomnoId: new ObjectId(this.data.roomno),
        date: this.data.date,
        price: this.data.price,
        total: this.data.total,
        vat:this.data.vat,
        totalAmount: this.data.totalAmount,
        createdDate:  new Date()

    }

}
Receipt.prototype.validate =  function(){
    return new Promise(async  (resolve, reject) =>{
        if (this.data.receiptNo == "") {
            this.errors.push("You must Select a Receipt No.")
    
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
        if (this.data.roomsize == "") {
            this.errors.push("You must Provide a Room size")
        }
        if (this.data.price == "") {
            this.errors.push("You must Provide a Price")
        }
        if (this.data.total == "") {
            this.errors.push("You must Provide a Total")
        }
        if (this.data.vat == "") {
            this.errors.push("You must Provide a Vat")
        }

        if (this.data.totalAmount == "") {
            this.errors.push("You must Provide a Total Amount")
        }
    //Only is contractNo is valid then check to see if it's already taken
        if(this.data.receiptNo.length > 0 && this.data.receiptNo  < 30 ){
            console.log("ReceiptId")
            let ReceiptNoExists = await receiptCollection.findOne({receiptNo: this.data.receipt})
            console.log(receiptNo)
           
            if(ReceiptNoExists){
                this.errors.push("That Receipt No. is already taken ")
            }
       }
            
       resolve()     
    
    })
    
}
Receipt.prototype.addReceipt = function(){
    
    return new Promise(async (resolve, reject)=> {
        // Step #1: Validate user data
        this.cleanUp()
        await this.validate()
    console.log("hi1")
        // Step #2: Only if there are no validation errors 
        // then save the user data into a database
         if (!this.errors.length) {
            console.log("hi2")
            await receiptCollection.insertOne(this.data)
            
            resolve("Congrat")
        }else{
            console.log("errors")
            reject(this.errors)
        }
    
    })
}

Receipt.findAllReceipts = function(){
    //console.log("receip")
   // return new Promise(async (resolve, reject)=> {
    //    let receipts = await receiptCollection.find()
        let receipts =  receiptCollection.aggregate([
            {
                $lookup:
    
                {
                    from: 'room',
                    localField:'roomnoId',
                    foreignField: '_id',
                    as: 'roomDetail'
    
                }},
                {$lookup: {
                    from: 'tenant',
                    localField:'fullnameId',
                    foreignField: '_id',
                    as: 'tenantDetail'

                }
    
            }
        ]).toArray()
console.log("hi")
        if(receipts.length){
            console.log("hi2")
            //console.log(receipts)
            resolve(receipts)  
            console.log("tenantDocument")
 
         }else{
             reject()
 
         }
               
       

}

module.exports = Receipt