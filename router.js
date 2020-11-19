const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const tenantController = require('./controllers/tenantController')
const roomController = require('./controllers/roomController')
const contractController = require('./controllers/contractController')
const receiptController = require('./controllers/receiptController')
const expenseController = require('./controllers/expenseController')
router.get('/', userController.home)
//router.get('/admin', userController.login)
router.get('/register', userController.register)


router.get('/about', function (req, res) {
    res.send("This is our about Page")

})
router.get('/login', userController.login)

router.post('/login', userController.postlogin)
router.post('/logout', userController.logout)
router.post('/register', userController.postRegister)
router.get('/tenantRegistration', tenantController.tenatRegister)
router.post('/tenantRegistration', tenantController.postTenantRegister)

router.get('/room', roomController.room)
router.post('/room', roomController.postRoom)


router.get('/contract', contractController.getContract)
router.post('/contract', contractController.postContractRegister)
router.get('/allcontracts',contractController.getAllContract)
router.get('/contract/:id',contractController.viewSingle)



router.get('/receipt',receiptController.getReceipt)
router.post('/receipt',receiptController.postReceipt)
router.get('/allreceipts',receiptController.getAllReceipts)


router.get('/expense', expenseController.getExpense)
router.post('/expense', expenseController.postExpense)

module.exports = router