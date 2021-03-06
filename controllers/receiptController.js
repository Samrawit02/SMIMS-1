const Receipt = require('../models/Receipt')
const tenantCollection = require('../db').db().collection("tenant")
const roomCollection = require('../db').db().collection("room")


exports.getReceipt = async function (req, res) {
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

        res.render('receipt', {
            tenants: Collectiontenants,
            room: Collectionrooms ,
            regErrors: req.flash('regErrors')  
})
})
})
} 

exports.postReceipt = function (req, res) {
    // console.log(req.body)
    let receipt = new Receipt(req.body)
    receipt.addReceipt().then(()=>{
       
            res.redirect('receipt')
            console.log("congratulation")
        
    }).catch((regErrors)=>{
        regErrors.forEach(function (error) {
            req.flash('regErrors', error)
            console.log("error")

        })
        req.session.save(function () {
            res.redirect('receipt')
        })

    })
}

