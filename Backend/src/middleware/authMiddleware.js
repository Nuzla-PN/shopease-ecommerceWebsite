//authmiidleware:Middleware to check weather user is logged in first we have write this
//it verifies JWT
//Attaches user info to req.user ie to get role
import jwt from 'jsonwebtoken';
// import UserRegister from '../models/User';

export const authMiddleware = async (req,res,next) =>{
    const token = req.headers.authorization?.split(" ")[1]; //Bearer token

    if(!token)
         return res.status(401).json({
            message:"Not authorized"
        });

    try{
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        // const user = await UserRegister.findById(decoded.id);
        // if (!user) return res.status(401).json({ message: "User not found" });
        req.user = decoded; // {id,role}
        next();    
    }
    catch(error){
        res.status(401).json({
            message:"Invalid Token"
        });
    }
        
};


