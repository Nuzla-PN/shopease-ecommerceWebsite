import UserRegister from  "../models/User.js";

const sellerAccess =  async (req,res,next)=>{
    try{
        const userId = req.user.id;
        const user = await UserRegister.findById(userId);

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            });
        }

        if(user.isSellerBlocked){
            return res.status(403).json({
                success:false,
                message:"Your Seller Account is blocked"
            });
        }

        if(!user.isSellerApproved){
            return res.status(403).json({
                success:false,
                message:"Seller not approved by admin yet."
            });
        }

        next();
    }
    catch(error){
        res.status(500).json({
      success: false,
      message: "Server error"
    });
    }
};

export default sellerAccess;