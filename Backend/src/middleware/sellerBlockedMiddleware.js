export const checkSellerBlocked = (req,res,next)=>{
    if(req.user.isSellerBlocked){
        return res.status(403).json({
            success:false,
            message:"Your seller account is blocked"
        });

    }
    next();
};
//Use in 
// add Product,
// update product,
// delete product,
// view product