//4   //Register Page Schema

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const userRegisterSchema = new Schema({
    usernamebox :{type:String,required:true},
    emailbox : {type:String,required:true},
    passbox : {type:String,required:true},
    role:{type:String,enum: ["user", "seller", "admin"],
         default: "user"},
    address:{
      name:String,
      phone:String,
      addressLine:String,
      city:String,
      state:String,
      zip:String,
      country:String
    },
    isFirstOrder: { type:Boolean, default:true},
    isSellerRequested:{ type:Boolean,default:false},
    isSellerApproved:{type:Boolean,default:false},
    isUserBlocked:{type:Boolean,default:false},
    isSellerBlocked:{type:Boolean,default:false}
},
 {timestamps:true}
);
userRegisterSchema.pre('save', async function () {
  // If password is NOT modified, don't hash again
  if (!this.isModified('passbox')) return;

  // Hash the password
  this.passbox = await bcrypt.hash(this.passbox, 10);
});

userRegisterSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passbox);
};

const UserRegister = mongoose.model("UserRegister", userRegisterSchema);  // Schema name: userRegisterSchema
                                                                         // Model name: UserRegister 
export default UserRegister;                                            // and collection name: userregisters