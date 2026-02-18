//3
import mongoose from 'mongoose';
// require('dotenv').config({path:'./config/.env'});
// import dotenv from 'dotenv';
// dotenv.config({path:'./.env'});

        //MongoDB Connection
const connectDB = async() =>{   
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Succesfully");

    }catch(err){
    console.log("Mongo DB cConnection Failed:",err);
    }
}
export default connectDB;
 