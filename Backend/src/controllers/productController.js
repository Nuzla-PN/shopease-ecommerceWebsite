//get approved products from admin to public

import CartModel from "../models/Cart.js";
import ProductModel from "../models/Product.js";
import UserRegister from "../models/User.js";
import WishlistModel from "../models/wishlist.js";

export const getApprovedProducts = async (req,res)=>{
    try{
        const product = await ProductModel.find({
            isApproved:true
        }).populate("seller","usernamebox emailbox");

        res.status(200).json({
            success:true,
            count:product.length,
            product
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

//User get single product

export const getSingleProduct = async (req,res)=>{
    try{
        const product = await ProductModel.findOne({
            _id:req.params.id,
            isApproved:true
        }).populate("seller","usernamebox");

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }

        res.json({
            success:true,
            product
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
}; 

//Search product(name+category)

export const searchProduct = async (req,res)=>{
    try{
        const{name,category} = req.query;
        if (!name && !category) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }
        let filter = {isApproved: true};
        if(name){
            filter.name= {$regex:name, $options:"i"};
        }
        if(category){
            filter.category = { $regex:category, $options:"i"};
        }
        const products = await ProductModel.find(filter);
        if(products.length===0){
            return res.status(404).json({
                success:false,
                message:"No products"
            })
        }
        console.log(products)
        
        return res.json({
            success:true,
            count: products.length,
            products
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

//To getAll Categories

export const getAllCategories = async (req, res) => {
  try {

    const categories = await ProductModel.distinct("category", {
      isApproved: true
    });

    res.json({
      success: true,
      categories
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


//Wishlisting product

export const toggleWishlist = async (req,res)=>{
    try{
        const user = await UserRegister.findById(req.user.id);
        const userId=req.user.id;
        const productId = req.params.id;
        const product = await ProductModel.findById(productId)
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }

        const exists = await WishlistModel.findOne({user:userId,product:productId});
        if(exists){
            await WishlistModel.deleteOne({_id:exists._id});
    
            return res.status(200).json({
                success:true,
                message:"Remove from wishlist",
                isWishlisted:false
            });
        }
        await WishlistModel.create({
            user:userId,
            product:productId
        })
        res.json({
            success:true,
            message:"Added to wishlist",
            isWishlisted:true
        });

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

//View wishlist

export const getWishlist = async (req,res)=>{
    try{

        const userId = req.user.id;
        const WishlistedItems = await WishlistModel.find({user:userId})
                                .populate("product");
         res.status(200).json({
            success:true,
            count:WishlistedItems.length,
            WishlistedItems
         });

        }catch(err){
            res.status(500).json({
                success:false,
                message:"Server error"
            });
        }
};

//Add to cart

export const addToCart = async (req,res)=>{
    try{

        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const product = await ProductModel.findById(productId);
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        
        const cartItem = await CartModel.create({
            user:userId,
            product:productId,
            quantity
        })
        const populatedItem = await cartItem.populate("product");
        res.json({
            success:true,
            message:"Added to cart",
            cartItem:populatedItem
        });

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Server errorrrrrrrrrrrrrrrrrrrrrrr"
        });
    }
};

//View Cart

export const getCart = async (req,res)=>{
    try{
        const userId = req.user.id;
        const cartitems = await CartModel.find({user:userId})
        .populate("product")
        .populate("product.seller");

        if(cartitems.length===0){
            return res.status(200).json({
                success:true,
                message:"No cart Items"
            })
        }

        res.json({
            success:true,
            count:cartitems.length,
            cartitems
        });

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

//remove items from cart

export const removeCart = async (req,res)=>{
    try{
        const cartId = req.params.id;
        const userId= req.user.id;
        const cartitems = await CartModel.findById(cartId);
        console.log(cartitems);
        if(!cartitems){
            return res.status(404).json({
                success:false,
                message:"Item not found in cart"
            })
        }
        if(userId!== cartitems.user.toString()){
            return res.status(403).json({
                success:false,
                message:"Access Denied"
            })
        }
        await cartitems.deleteOne();
        res.status(200).json({
            success:true,
            message:"Item Removed from Cart"
        })
    }
    catch(error){
         res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
}

//updateQuantity in Cart

export const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    const updated = await CartModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    ).populate("product");

    res.json({
      success: true,
      cartItem: updated
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};



//select/unselect cart item to buy

export const toggleCartSelection = async (req,res)=>{
    try{
        const cartId = req.params.id;
        const userId = req.user.id;
        const{isSelected} = req.body;

        const cartItem = await CartModel.findById(cartId);

        if(!cartItem){
            return res.status(404).json({
                success:false,
                message:"Cart item not found"
            });
        }
        if(cartItem.user.toString()!==userId){
            return res.status(403).json({
                success:false,
                message:"Access denied"
            });
        }

        cartItem.isSelected = isSelected;
        await cartItem.save();

        res.json({
            success:true,
            message:"Cart item updated"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};