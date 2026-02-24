//This all axios send requests to  and its controller runs
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL_ROOT;//ROOT means just /api


//signUpUser
  export const signupUser = async (data) => {
  const res = await axios.post(`${BASE_URL}/auth/register`, data);
  return res.data;
};

//Login 
  export const loginUser = async (data) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, data);
  console.log("LOGIN RESPONSE USER:", res.data.user);  return res.data;
};

//Apply as seller
  export const applyasseller = async ()=>{
    const token = localStorage.getItem("token");
    const res = await axios.post(`${BASE_URL}/users/apply-seller`,{},
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );
    return res.data;
  };

//getAllCategory names (here in buttons)
export const getAllCategories = async()=>{
    const res = await axios.get(`${BASE_URL}/categories`);
    return res.data;
}

//get all approved products in Home Page

export const getApprovedProducts = async()=>{
    const res = await axios.get(`${BASE_URL}/products`);
    return res.data;
};

//To getSingle Product in separatePage
export const getSingleProduct = async(id)=>{
    const res = await axios.get(`${BASE_URL}/product/${id}`);
    return res.data;
};

//ToggleAdd to Wishlist
export const addToWishlist = async(productId)=>{
  const token = localStorage.getItem("token");

  const res= await axios.post(`${BASE_URL}/users/wishlist/${productId}`,
    {},
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    console.log("wishlist responssssssssssssssss", res)
       return res.data;
};

//getWishlist
export const getWishlist = async ()=>{
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/users/wishlist`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    return res.data;
};

//Add to cart

export const addingToCart = async (productId,quantity) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(`${BASE_URL}/users/cart`,{ productId,quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

//getCart

export const getUsercart = async ()=>{
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}/users/cart`,{
    headers:{
      Authorization:`Bearer ${token}`,
    },
  });
  return res.data;
};

//TOGGLECARTsELECTION
export const toggleCartSelectionAPI = async (cartId, isSelected) => {

  const token = localStorage.getItem("token");

  const res = await axios.put(`${BASE_URL}/users/cart/select/${cartId}`,{ isSelected },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

//Remove cart item

export const removeCartItem = async (productId)=>{
  const token = localStorage.getItem("token");
  const res= await axios.delete(`${BASE_URL}/users/cart/delete/${productId}`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  return res.data;
}

//updateQuantity in Mycart

export const updateCartQuantity = async (cartId, quantity) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${BASE_URL}/users/cart/${cartId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


//BuyNowAdd tocart

export const buyNowAddToCart = async (productId) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(`${BASE_URL}/orders/buyNow`,{ productId},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

//saveUserAddress 

export const saveUserAddress = async (data)=>{
  const token =localStorage.getItem("token");

  const res = await axios.put(`${BASE_URL}/users/address`,data,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  return res.data;
};

//getUserAddress ..To load save address when page opens

export const getUserAddress = async() =>{
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/users/address`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  return res.data;
};

//ConfirmOrder
export const confirmOrder = async()=>{
   const token = localStorage.getItem("token");

  const res = await axios.post(`${BASE_URL}/orders/confirmOrder`,{},
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  return res.data;
};


//cancelorder
export const cancelOrderAPI = async (orderId) => {

  const token = localStorage.getItem("token");

  const res = await axios.put( `${BASE_URL}/orders/cancelOrder/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

//reorder

export const reOrderAPI = async (productId, quantity) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/users/product/${id}`,
    {
      productId,
      quantity
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

//view my orders

export const viewMyOrders = async () => {
const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/orders/myorders`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
  
  return res.data;   // { success, count, orders }
};




