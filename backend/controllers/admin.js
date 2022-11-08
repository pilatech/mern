const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Admin = require('../models/admin')
const Client = require('../models/client')
const { Prescription } = require('../models/prescription')


module.exports.homeResponse = (req, res) => {
    res.redirect('/admin/clients')
  }

module.exports.loginFormResponse = (req, res) => {
    res.render('login');
  }

module.exports.loginResponse = catchAsync(async (req, res) => {
    const { username, password } = req.body
    const adminUser = await Admin.findOne({ username: username })
    if(!adminUser) {
       req.flash('error', 'Username or password is not correct')
       return res.redirect('login')
    }
   
    const authentic = await bcrypt.compare(password, adminUser.password)
    if(!authentic) {
     req.flash('error', 'Username or password is not correct')
     return res.redirect('login')
   }
   
   req.session.user = adminUser
   req.flash('success', 'Successfully logged in')
   res.redirect('clients')
   
   })

module.exports.logoutResponse = (req, res) => {
    req.session.user = ''
    req.flash('error', 'You are now logged out')
    res.redirect('login')
  }

module.exports.allClientsResponse = catchAsync(async (req, res) => {
    const { archive } = req.query
    let hasArchive = true
    let clients = await Client.find({})
    if(archive) {
      clients = clients.filter(client => client.archived)
      if(!clients.length && archive) hasArchive = false
      res.render('index', { clients, archive, hasArchive });
    } else {
      clients = clients.filter(client => !client.archived)
      res.render('index', { clients, archive, hasArchive });
    }
  })

module.exports.singleClientResponse = catchAsync(async (req, res) => {
    const { id } = req.params
    const client = await Client.findById(id).populate('prescriptions')
    if(!client) throw new AppError(400, 'Client not found!')
    res.render('client', { client })
  })

module.exports.toggleClientArchive = catchAsync( async (req, res) => {
    const { id } = req.params
    const client = await Client.findById(id)
    client.archived = !client.archived
    const editedClient = await client.save()
    const redirectQuery = !editedClient.archived ? '?archive=true' : ''
    res.redirect('/admin/clients'+ redirectQuery)
})

module.exports.deleteClient = catchAsync(async (req, res) => {
    const { id } = req.params
    await Client.findByIdAndDelete(id)
    res.redirect('/admin/clients')
  })

 module.exports.getSinglePrescription = catchAsync(async(req, res) => {
  const { clientId, prescriptionId } = req.params
  const prescription = await Prescription.findOne({_id: prescriptionId, clientId: clientId}).populate('clientId')
  if(!prescription) throw new AppError(400, 'Prescription not found!')
  res.render('prescription', { prescription })
 })

 module.exports.updateSinglePrescription = catchAsync(async(req, res) => {
  let { quote, status } = req.body
  const { clientId, prescriptionId } = req.params
  if(quote){
   status = "quoted" 
  } 
  if(!Number(quote)){
   quote = 0
  }
  if(status instanceof Array){
   status = "fullfilled"
  }
  
  const prescription = await Prescription.findOne({_id: prescriptionId, clientId })
  if(!prescription){
   throw new AppError(400, 'Item not found!')
  }
  prescription.status = status
  prescription.quote = quote
  await prescription.save()
  res.redirect(`/admin/clients/${clientId}/prescriptions/${prescriptionId}`)
 })

module.exports.catch404 = (req, res) => {
    throw new AppError(404, 'Page Not Found')
  }

module.exports.handleErrors = (error, req, res, next) => { 
    if(error instanceof mongoose.Error) {
      error.message = 'Not Found'
      error.statusCode = 404
    } 
    const { statusCode = 500, message = 'Something went wrong. Try again'} = error
    res.status(statusCode).render('error', { statusCode, message })
  }