const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')


const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})


adminSchema.pre('save', async function(){
    this.password = await bcrypt.hash(this.password, 12)
    console.log(this)
})


module.exports = model('Admin', adminSchema)