import UserRegister from "../models/User.js";

const userAccess = async (req,res,next)=>{
    const user = await UserRegister.findById(req.user.id);

    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not found"
        });
    }

    if(user.isUserBlocked){
        return res.status(403).json({
            success:false,
            message:"Your account is blocked"
        });
    }

    next();
};

export default userAccess;