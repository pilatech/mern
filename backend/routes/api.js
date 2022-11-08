const express = require('express')
const router = express.Router()
const api = require('../controllers/api');
const { checkAuthentication } = require('../utils/middleware');

router.post('/register', api.handleRegistration);
router.post('/login', api.handleLogin)
router.post('/getProfile', checkAuthentication, api.handleClientProfileRequest)
router.post('/add',api.handleAdd)
router.patch('/:clientId', checkAuthentication, api.handleProfileUpdate)
router.patch('/prescriptions/:prescriptionId',checkAuthentication, api.handlePrescriptionArchive)
router.all('*', api.handle404)

module.exports = router