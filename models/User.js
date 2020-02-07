const {Schema,model}   = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  status:{
    type: String,
    enum: ["Pending Confirmation", "Active"],
    default: "Pending Confirmation"
  },
    confirmationCode:{
      unique: true, 
      type: String,
    },
    email: String,
}, 
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


userSchema.plugin(PLM, { usernameField: 'email' })
module.exports = model('User', userSchema)

