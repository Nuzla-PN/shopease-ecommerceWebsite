import mongoose from "mongoose";
const WishlistSchema = new mongoose.Schema({

    user:{type:mongoose.Schema.Types.ObjectId,ref:"UserRegister",required:true},
    product:{type:mongoose.Schema.Types.ObjectId,ref:"ProductModel",required:true},
},{
    timestamps:true
});
const WishlistModel = mongoose.model("WishlistModel",WishlistSchema);
export default WishlistModel;