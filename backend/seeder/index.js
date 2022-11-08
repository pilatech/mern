const Admin = require('../models/admin')
const Client = require('../models/client')
const dbCon = require('../config/dbconfig')
const bcrypt = require('bcrypt')
const { Prescription } = require('../models/prescription')

/////connecting to database
dbCon()
.then(() => {
  console.log('Connected to DB')
})
.catch((err) => console.log(err))
///////////

async function addClients(){
    await Client.deleteMany({})
    const clients = await Client.insertMany([
        { firstName: 'Jane', lastName: 'Hamilton', sex: 'female', email: 'jane@hconsultant.org', phoneNumber: 06154653, birthDate: '1974-08-17 12:09:36', address: '44 Winston Street, Johannesburg, South Africa', password: `${generateHashedPassword(generatePassword())}`, prescriptions: [] },
        { firstName: 'James', lastName: 'Hamilton', sex: 'male', email: 'james@hconsultant.org', phoneNumber: 06154654, birthDate: '1972-08-17 12:09:36', address: '44 Winston Street, Johannesburg, South Africa', password: `${generateHashedPassword(generatePassword())}`, prescriptions: [] },
        { firstName: 'Lily', lastName: 'Sanderson', sex: 'female', email: 'lil@hconsultant.org', phoneNumber: 04157653, birthDate: '1974-08-17 12:09:36', address: '321 Naville Road, Johannesburg, South Africa', password: `${generateHashedPassword(generatePassword())}`, prescriptions: []}
    ])

    console.log(clients)
}
//addClients()

async function addAdmin(){
    await Admin.deleteMany()
    const admin = new Admin({ username: 'admin', email: 'hubnet@gmail.com', password: 'admin'})
    const saved = await admin.save()
    console.log(saved)
}

//addAdmin()

function generateHashedPassword(plainText){
 (async() => {
  const hashedPassword = await bcrypt.hash(plainText, 10)
  return hashedPassword
 })().then(password => {
  console.log(password)
  return password
 })
 .catch(err => console.log(err, 'Something is not right!'))
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

async function addPrescription(){
 const prescriptions = await Prescription.deleteMany({})
 console.log(prescriptions)
}

addPrescription()