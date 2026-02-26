import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const SellerRoute = ({children})=>{
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

export const AdminRoute = ({ children }) => {

  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};


