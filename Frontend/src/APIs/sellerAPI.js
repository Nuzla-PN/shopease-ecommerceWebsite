import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL_ROOT;//ROOT means just /api

//SELLER DASHBORAD API

export const getSellerDashboardAPI = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${BASE_URL}/seller/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

//Seller add product API
export const addSellerProductAPI = async(formData)=>{
  const token =localStorage.getItem("token");
  const res = await axios.post(`${BASE_URL}/seller/addproduct`,formData,
    {
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
      }
    }
  );
  return res.data;
};

//sellergetAllProductAPI
export const getSellerProductAPI = async()=>{
  
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/seller/getproducts`,
    {
      headers:{
        Authorization :`Bearer ${token}`
      }
    }
  );
  return res.data;

}


//getSingleSellerProduct API
export const getSingleSellerProductAPI = async(id)=>{
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/seller/product/${id}`,
    {
      headers:{
        Authorization :`Bearer ${token}`
      }
    }
  );
  return res.data;
  
}

//UpdateSellerProductAPI

export const UpdateSellerProductAPI = async(id,formData)=>{
  const token = localStorage.getItem("token");
  const res = await axios.put(`${BASE_URL}/seller/product/${id}`,formData,
    {
      headers:{
        Authorization :`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
      }
    }
  );
  return res.data;
  
}


 //sellerDeleteProductAPI
 export const deleteSellerProductAPI = async(id)=>{
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${BASE_URL}/seller/product/${id}`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
    return res.data;
 };

 //FetchHisOrders
 export const fetchsellerOrdersAPI = async()=>{
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/seller/orders`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  return res.data
 }

//Shipping Orders
export const shipOrderAPI =async(orderId)=>{
  const token = localStorage.getItem("token");
  const res = await axios.put(`${BASE_URL}/seller/orders/${orderId}/ship`,
    {},
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  return res.data;
};

//get seller single order details
export const getSellerSingleOrder = async(orderId)=>{
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/seller/orders/${orderId}`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  return res.data;
};

