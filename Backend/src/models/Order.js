import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProductModel",
        required:true
    },

    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
});



const orderSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserRegister",
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserRegister"
    }, 

    // items:[
    //     {
    //         product:{
    //             type:mongoose.Schema.Types.ObjectId,
    //             ref:"ProductModel"
    //         },
    //         quantity:Number,
    //         price:Number
    //     }
    // ],

    // totalAmount:Number,

    items:[orderItemSchema],

    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["placed","shipped","delivered","cancelled"],
        default:"placed"
    },

     shippingAddress:{
        type:Object
    }


},{timestamps:true});

const OrderModel = mongoose.model("OrderModel",orderSchema);
export default OrderModel