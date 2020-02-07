const {model, Schema} = require('mongoose')
const PLM = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true
    },
    email: {
      lowercase: true,
      trim: true,
      type: String,
      required: true
    },
    status: {
      type:String,
      enmu:['Pending Confirmation', 'Active'],
      default: 'Pending Confirmation'
    },
    confirmationCode: String
  },{
    timestamps: true,
    versionKey: false
  }
)

userSchema.plugin(PLM, {usernameField: 'email'})

module.exports = model('User', userSchema)
