const Client = require('../models/client')
const  { clientValidator } = require('../utils/validators')
const { uploadImage } = require('../utils/uploader')
const sendEmail = require('../utils/sendEmail')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Prescription } = require('../models/prescription')

module.exports.handleRegistration = async (req, res) => {
    try {
      const { error } = clientValidator.validate(req.body)
      if(error) return res.status(400).json(error.details)

      //upload image to cloudinary
      const prescription = await uploadImage(req.body.prescription)

      //generate password
      const plainPassword = generatePassword()
      const password = await bcrypt.hash(plainPassword, 10)
      console.log(plainPassword) //to be emailed
      console.log(password) //to be saved to db

      //save the returned url to the database
      //paused code
      // const client = {...req.body, prescription: prescription.url, password}
      

      const client = {...req.body, prescription: prescription.url, password, prescriptions:[]}
      const newPrescription = new Prescription({image: {url: prescription.url,storageId: prescription.etag}})
      const newClient = new Client(client)
      newPrescription.clientId = newClient._id
      newClient.prescriptions.push(newPrescription._id)

      //filtering clients with age that might be too low
     const age =  Math.floor((new Date() - new Date(client.birthDate)) / 1000 / 60 / 60 / 24 / 365 )
     if(age < 16) newClient.archive = true

      await newPrescription.save()
      const savedClient = await newClient.save()
      sendEmail(savedClient.email, plainPassword)
      res.status(202).json({ success: 'true' })
    } catch(e){
     res.json({error: true, message: 'Your email needs to be correct and not have been used on this platform before'})
    }
  }

 module.exports.handleLogin = async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) {
  return res.json({error: 'Enter email and password'})
  }

  const foundUser = await Client.findOne({email})
  if(!foundUser){
   return res.json({error: 'Wrong username/password combination!'})
  }

 const authentic = await bcrypt.compare(password, foundUser.password)
  if(!authentic) {
   return res.json({error: 'Wrong username/password combination!'})
 }

 const id = foundUser._id
 const token = jwt.sign({id},process.env.TOKEN_SECRET, {
  expiresIn: '1d'
 })
  res.json({auth: true, token, user: {...foundUser._doc, password: null}})
 }

 module.exports.handleClientProfileRequest = async (req, res) => {
  try {
   const profile = await Client.findById(req.userId).populate('prescriptions')
   if(!profile){
    return res.json({auth: false, msg: "Could not find the profile!"})
   }
   res.json({auth: true, user: {...profile._doc, password: null}})
  } catch(e){
   res.json({auth: false, msg: "Could not find the profile!"})
  }
 }

 module.exports.handleAdd = async (req, res) => {
   try {
    let { prescription, glucoseLevel, bloodPressure, id} = req.body
    
   prescription = await uploadImage(prescription)
   const clientPrescription = new Prescription({clientId: id, image: { url: prescription.url, storageId: prescription.etag}, glucoseLevel, bloodPressure})

   // const clientPrescription = new Prescription({clientId: id, image: { url: 'imgurl', storageId: 'storageId'}, glucoseLevel, bloodPressure})

   const foundClient = await Client.findById(id)
   if(!foundClient) return res.json({error: true, msg: 'user not found'})
   foundClient.prescriptions.push(clientPrescription._id)
   clientPrescription.save()
   foundClient.save()
    //res.json({'success': true})

    //to be removed
   await Client.findByIdAndUpdate(id, { prescription: prescription.url, glucoseLevel, bloodPressure})
   res.json({'success': true})
   } catch(e){
    console.log('There is an error')
    console.log(e)
   }
 }

 module.exports.handleProfileUpdate = async(req, res) => {
 try {
  let { address, phoneNumber, password } = req.body
  const { clientId } = req.params
  let hashedPassword

 if(password){
   //generate password
   hashedPassword = await bcrypt.hash(password, 10)
   console.log(password) //to be emailed
   console.log(hashedPassword) //to be saved to db
 }
   
   const foundClient = await Client.findById(clientId)
   foundClient.address = address || foundClient.address
   foundClient.phoneNumber = phoneNumber || foundClient.phoneNumber
  if(password){
   foundClient.password = hashedPassword
   sendEmail(foundClient.email, password)
  }
  await foundClient.save()
  res.status(200).json({success: true})
 } catch (error) {
  res.status(500).json({error: {message: 'could not change the settings'}})
 }
 }

module.exports.handlePrescriptionArchive = async (req, res) => {
 try {
  const { prescriptionId } = req.params
  console.log(prescriptionId)
  await Prescription.findByIdAndUpdate(prescriptionId, {archived: true})
  res.json({success: true})
 } catch (error) {
  console.log(error)
 }
}

  module.exports.handle404 = (req, res) => {
   res.status(404).json({ error: 'Not found!'})
 }

  function generatePassword() {
   let length = 8,
   charset = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      retVal = "";
   for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
   }
   return retVal;
}
