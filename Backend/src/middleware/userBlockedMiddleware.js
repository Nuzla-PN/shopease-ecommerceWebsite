export const checkUserBlocked = (req,res,next)=>{
    if(req.user.isUserBlocked){
        return res.status(403).json({
            success:false,
            message:"Your User account is blocked"
        });
    }
    next();
};

//use in 
// add to cart,
// place order,
// checkout