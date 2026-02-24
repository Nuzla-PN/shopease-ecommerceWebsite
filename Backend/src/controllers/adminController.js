import Productmodel from "../models/Product.js";
import UserRegister from "../models/User.js";
import OrderModel from "../models/Order.js";

//ADMIN Aprroving Seller request
export const approveSellerRequest = async (req,res)=> {
    try{
        const {userId} = req.params;
        const user = await UserRegister.findById(userId);
        if(!user || !user.isSellerRequested){
            return res.status(400).json({
                success:false,
                message:"No seller request found for this user"
            });
        }

        user.role = "seller";
        user.isSellerApproved = true;
        user.isSellerRequested = false;

        await user.save();

        res.json({
            success:true,
            message:"Seller request approved",
        });

        }
        catch(error){
            res.status(500).json({
                success:false,
                message:"Server Error"
            });
        }
    };

//GET all products for admin
export const getAllProductsForAdmin = async (req,res)=>{
    try{
        const products = await Productmodel.find({status:{$ne:"rejected"}}).populate("seller", "usernamebox emailbox role");
        
        res.status(200).json({
            success:true,
            count:products.length,
            products
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

//ADMIN get all Users
export const getAllUsers = async(req,res)=>{
    try{
        const users = await UserRegister.find({role:"user"});

        res.status(200).json({
            success:true,
            count:users.length,
            users
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

//ADMIN get all Sellers
export const getAllSellers = async (req,res)=>{
    try{
        const sellers = await UserRegister.find({role:"seller"});

        res.status(200).json({
            success:true,
            count:sellers.length,
            sellers
        });
    }
    catch(error){
        res.status(500).josn({
            success:false,
            message:"Server Error"
        });
    }
};

//ADMIN Blocking and UnBlocking User
export const blockUnblockUserAccount = async (req,res)=>{
    try{
        const{id} = req.params;
        const user = await UserRegister.findById(id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
                        });
                
        }

        // if(user.isUserBlocked===true){
        //     return res.status(400).json({
        //         success:false,
        //         message:"User already blocked"
        //                 });
                
        // }
        // user.isUserBlocked=true
        // await user.save();

        user.isUserBlocked = !user.isUserBlocked;
        await user.save();

        res.json({
            success:true,
            message:user.isUserBlocked
            ? "User blocked successfully"
            : "User unblocked successfully",
            user
    });
        }
        catch(err){
            res.status(500).json({
                success:false,
                message:"Server error"
            });
        }
    };

//ADMIN Blocking and UnBlocking Seller
export const blockUnblockSellerAccount = async (req,res)=>{
    try{
        const{id} =req.params;
        const user = await UserRegister.findById(id)
          if(!user){
            return res.status(404).json({
                success:false,
                message:"Seller not found"
             });
                
        }
        
        // if(user.isSellerBlocked===true){
        //     return res.status(400).json({
        //         success:true,
        //         message:"Seller already blocked"
        //                 });
                
        // }
        // user.isSellerBlocked = true
        // await user.save();

        user.isSellerBlocked = !user.isSellerBlocked;
        await user.save();
        res.json({
            success:true,
            message:user.isSellerBlocked
            ? "Seller blocked successfully"
            : "Seller unblocked succesfully",
            user
        });    
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

//ADMIN Approve seller Product
export const approveProduct = async (req,res)=>{
    try{
        const {id} = req.params;
        const product = await Productmodel.findByIdAndUpdate(
            id,
            {status:"approved"},
            {new:true}
        );

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }
        res.json({
            success:true,
            message:"Product Approved Successfully",
            product
        });

    }
   catch (error) {
    res.status(500).json({ success:false, message:"Server error" });
  }
};

//ADMIN Reject Seller Product
export const rejectProduct = async (req,res)=>{
    try{
        const{id} = req.params;
        const product = await Productmodel.findByIdAndUpdate(id,
            {status:"rejected"},
            {new:true}
        );

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }
         res.status(200).json({
            success:true,
            message:"Product rejected and deleted"
        });
    }
     catch (error) {
            res.status(500).json({ 
                 success:false,
                 message:"Server error" 
                });
            }
};

//ADMIN view all Orders
export const getAllOrdersForAdmin = async (req, res) => {
  try {

    const orders = await OrderModel.find()
      .populate("user", "usernamebox emailbox")
      .populate("items.product");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};