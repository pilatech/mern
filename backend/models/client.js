const { Schema, model } = require('mongoose')

const clientSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    sex: {
        type: String,
        enum: [ 'male', 'female' ]
    },

    email: {
        type: String,
        unique: true
    },
    birthDate: {
        type: Date,
        required: true
    },

    phoneNumber: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    bloodPressure: {
        type: String,
    },

    glucoseLevel: {
        type: String,
    },

    archived: {
        type: Boolean,
        required: true,
        default: false
    },

    prescription: {
        type: String
    },
    prescriptions: [{
     type: Schema.Types.ObjectId,
     ref: 'Prescription'
    }],
    password: {
     type: String,
     required: true
    }

})

clientSchema.methods.getProperName = function(){
 const fName = this.firstName.split('').map((char, i) => (i === 0 ? char.toUpperCase(): char)).join('')
 const sName = this.lastName.split('').map((char, i) => (i === 0 ? char.toUpperCase(): char)).join('')
 return `${fName} ${sName}`
}

module.exports = model('Client', clientSchema)