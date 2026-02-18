import UserRegister from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const applyasseller = async (req,res)=>{ //user applies to become a seller
        try{
            const userId = req.user.id;
            const user = await UserRegister.findById(userId);
            if(!user){
                return res.status(404).json({
                    success:false,
                    message:"User not found"
                })
            }
            
            //If user is block,Block everything
            if(user.isUserBlocked){
                return res.status(403).json({
                success:false,
                message:"Your account is blocked. You cannot apply to become a seller."
            });
            }
            if(user.role=== "seller"){
                return res.status(400).json({
                    success:false,
                    message:"User is already a seller"
                });
            }

            if(user.isSellerRequested){
            return res.status(400).json({
                success:false,
                message:"Seller request already submitted"
            });
        }
        user.isSellerRequested = true;
        await user.save();

        res.json({
            success:true,
            message:"Seller request submitted.Waiting for admin approval"
        });
    }
        catch(error){
            res.status(500).json({
                success:false,
                message:"Server Error"
            });
        }
    };

 //To saveAddress
 
 export const saveAddress = async (req,res)=> {
    try{
        const userId = req.user.id;
        const {name,phone,addressLine,city,state,zip,country} = req.body;
        
        const user = await UserRegister.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not Found"
            });
        }

        user.address = {
            name,phone,addressLine,city,state,zip,country};
        await user.save();

        res.json({
            success:true,
            message:"Adress saved Successfully",
            address:user.address
        });

        }
        catch(err){
            res.status(500).json({
                success:false,
                message:"Server error"
            });
        }
    };
 
//to GetUserAddress

export const getMyAddress = async(req,res)=>{
    const user = await UserRegister.findById(req.user.id).select("address");

    res.json({
        success:true,
        address:user.address
    });
};
