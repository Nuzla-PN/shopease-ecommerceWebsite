import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL_ROOT;//ROOT means just /api

//To get all Users for Admin
export const getAllUsersAdmin = async()=>{
    const token = localStorage.getItem("token");
    const res= await axios.get(`${BASE_URL}/admin/getallusers`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
 );
 return res.data;
};


//To Get All Sellers for Admin
export const getAllSellerAdmin = async()=>{
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/admin/getallsellers`,{
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};

//To get Seller Request for Admin
export const getSellerRequestAdmin = async()=>{
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/admin/seller-requests`,{
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};

//To approve Seller REquest
export const approveSellerAdmin = async(sellerId)=>{
 const token = localStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/admin/approve-seller/${sellerId}`,{
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};
//tO REJECT sELLER rEQUEST 
export const rejectSellerAdmin = async (id) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(`${BASE_URL}/admin/reject-seller/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return res.data;
};
//Toget All Products for Admin
export const getAllProductsForAdmin = async(page=1)=>{
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/admin/getallproducts?page=${page}`,
        {
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};

//To approve products by Admin
export const approveProductAdmin = async(productId)=>{
    const token = localStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/admin/product/approve/${productId}`,
        {},
        {
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};

//To reject Product by Admin
export const rejectProductAdmin = async(productId)=>{
    const token = localStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/admin/product/reject/${productId}`,{},
        {
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};

//To get all Orders for Admin
export const getAllOrdersForAdmin = async(productId)=>{
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/admin/allorders`,{
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};

//To Block and Unblock User by Admin
export const blockUserAdmin = async(userId)=>{
    const token = localStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/admin/user/block-unblock/${userId}`,
        {},
        {
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};

//To Block and unBlock Seller by Admin
export const blockSellerAdmin = async(sellerId)=>{
    const token = localStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/admin/seller/block-unblock/${userId}`,
        {},
        {
    headers:{
            Authorization:`Bearer ${token}`
        }
    }
);
return res.data;
};
