const express = require('express')
const router = express.Router()
const admin = require('../controllers/admin')
const { checkLogin } = require('../utils/middleware')

router.get('/', admin.homeResponse)

router.get('/login', admin.loginFormResponse);

router.post('/login', admin.loginResponse);

router.get('/logout', admin.logoutResponse)

router.get('/clients/:clientId/prescriptions/:prescriptionId',checkLogin, admin.getSinglePrescription)

router.post('/clients/:clientId/prescriptions/:prescriptionId',checkLogin, admin.updateSinglePrescription)
  
router.get('/clients', checkLogin, admin.allClientsResponse);
  
router.get('/clients/:id', checkLogin, admin.singleClientResponse)
  
router.patch('/clients/:id', checkLogin, admin.toggleClientArchive)

router.delete('clients/:id', checkLogin, admin.deleteClient)

router.all('*', admin.catch404);

router.use(admin.handleErrors)

module.exports = router