const Contract = require('../models/Contract')
const { room } = require('./roomController')
const tenantCollection = require('../db').db().collection("tenant")
const roomCollection = require('../db').db().collection("room")
const contractCollection = require('../db').db().collection("contract")
const collectiont = require('../db').db('shoppingMall')



exports.getContract = async function (req, res) {
    let Collectiontenants = []
    let Collectionrooms = []
   
     tenantCollection.find().toArray(function (err, tenants) {
        if (err) {
            throw err
        } else {
            for (i = 0; i < tenants.length; i++) {
                Collectiontenants[i] = tenants[i]

            }
            
        }
       //  console.log(tenants) 
    
    roomCollection.find().toArray(function(err,rooms){

        if(err){
            throw err;
        }else{
            for (i=0; i<rooms.length; i++) {
                Collectionrooms[i] = rooms[i];
              }
            //  console.log(Collectionrooms)
        }


        res.render('contract', {
            tenants: Collectiontenants,
            room: Collectionrooms ,
            regErrors: req.flash('regErrors')  
})
})
}) 


}   

exports.getAllContract = async function(req, res){


collectiont.collection('contract').aggregate([
        {
            $lookup:

            {
                from: 'room',
                localField:'roomnoId',
                foreignField: '_id',
                as: 'contractDetails'

            }

        }
    ]).toArray(function(err, ContractDetail){
        if(err) throw err
        else{
            console.log(ContractDetail)

            res.render('allcontracts', {
                ContractDetail: ContractDetail,
              //  room: Collectionrooms ,
                regErrors: req.flash('regErrors')  
    })
}

    })

}
exports.postContractRegister = function (req, res) {
    // console.log(req.body)
    let contract = new Contract(req.body)
 
    contract.addContract().then(()=>{
       
            res.redirect('contract')
            console.log("congratulation")
        // })
    }).catch((regErrors)=>{
        regErrors.forEach(function (error) {
            req.flash('regErrors', error)
            console.log("error")

        })
        req.session.save(function () {
            res.redirect('contract')
        })

    })
}
exports.viewSingle = async function(req, res){
    console.log("hi every one")
   // res.render('editContract')
    const id = req.params.id;

    try{
        console.log("hi every 2one")
        let contract = await Contract.findById(req.params.id)
        console.log("try")
        res.render('editContract', {contract: contract,  regErrors: req.flash('regErrors')})
       

    }catch{
        res.render('404')

    }
  
 

  
    }



    
