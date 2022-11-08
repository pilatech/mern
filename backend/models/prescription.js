const { Schema, model } = require('mongoose')
const ta = require('time-ago')
const prescriptionSchema = new Schema({
    image: {
     url: String,
     storageId: String
    },
    bloodPressure: {
        type: String
    },
    glucoseLevel: {
        type: String
    },
    quote: {
     type: Number,
     default: 0
    },
    status: {
     type: String,
     enum: ['sent', 'quoted', 'paid', 'fullfilled', 'cancelled'],
     default: 'sent'
    },

    clientId: {type: Schema.Types.ObjectId, ref: 'Client'},

    archived: {
     type: Boolean,
     default: false
    }
   }, {
      timestamps: true
   })

 prescriptionSchema.methods.timeAgo = function(){
  return ta.ago(new Date(this.createdAt))
 }

module.exports.Prescription = model('Prescription', prescriptionSchema)
module.exports.prescriptionSchema = prescriptionSchema