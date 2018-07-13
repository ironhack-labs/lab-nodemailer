const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type:String, required:[true, 'Name is a required field']},
  password: {type:String, required:[true, 'Password is a required field']},
  status: {
    type:String,
    enum:['Pending Confirmation','Active'],
    default:'Pending Confirmation',
    required:true
  },
  confirmationCode:{type:String, unique : true, lowercase: true, required : true},
  email: {type:String,
    lowercase:true,
    required:[true, 'User phone number required'],
    validate:{
        validator:function(email){
          var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(email);
        }
      },
    message: '{VALUE} is not a valid email'
    }
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);


module.exports = User;

