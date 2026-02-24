import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

const SellerRoute = ({children})=>{
    const user = useSelector((state)=>state.auth.user);
console.log("SellerRoute:", user);
    if(!user){
        return <Navigate to ="/login" />;
    }

    if(user.role !== "seller") {
        return <Navigate to = "/" />;
    }

    return children;
};

export default SellerRoute;