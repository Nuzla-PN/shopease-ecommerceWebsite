//1
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import router from "./routes/index.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT||8000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

app.use("/",router);

      //Starting the server
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
});


