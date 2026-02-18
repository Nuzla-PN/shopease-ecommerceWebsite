import mongoose from "mongoose";
const CartSchema = new mongoose.Schema({

    user:{type:mongoose.Schema.Types.ObjectId,ref:"UserRegister",required:true},
    product:{type:mongoose.Schema.Types.ObjectId,ref:"ProductModel",required:true},
    quantity:{type:Number,default:1},
    isSelected:{type:Boolean,default:false}//buy this or dont buy this
},{
    timestamps:true
});
const CartModel = mongoose.model("CartModel",CartSchema);
export default CartModel;