import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true //check
        },
        description:{
            type:String,
            required:true   
        },
        price: {
      type: Number,
      required: true
            },
        stock:{
            type:Number,
            required:true,
            default:1
        },
        category:{
            type:String,
            required:true,
            enum:["All","Food","Business","Electronics","Clothings"]
        },
        
        images: [
            {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
            }
            ],
            keyFeatures: [
            {
                type: String
            }
            ],
            specifications: [
            {
                label: String,     // eg: "Brand"
                value: String     // eg: "Samsung"
            }
            ],

        seller:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserRegister",
            required:true
        },
        status: {
                type: String,
                enum: ["pending", "approved", "rejected"],
                default: "pending"
                }
    },
    {timestamps:true}
);

const ProductModel = mongoose.model("ProductModel", productSchema);
export default ProductModel;  
                                            // Schema name: productSchema
                                            // Model name: Productmodel 
                                            // and collection name: userregisters