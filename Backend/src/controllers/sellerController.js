import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import OrderModel from "../models/Order.js";
import ProductModel from "../models/Product.js";

//SELLER DASHBOARD
export const sellerDashboard = async (req, res) => {

  try {

    const sellerId = new mongoose.Types.ObjectId(req.user.id);

//    TOTAL SALES + TOTAL ORDERS

    const salesAgg = await OrderModel.aggregate([
      { $unwind: "$items" },

      {
        $lookup: {
          from: "productmodels",     
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },

      { $unwind: "$product" },

      {
        $match: {
          "product.seller": sellerId,
          status: { $in: ["placed", "shipped", "delivered"] }
        }
      },

      {
        $group: {
          _id: null,
          totalSales: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"]
            }
          },
          orderIds: { $addToSet: "$_id" }
        }
      },

      {
        $project: {
          totalSales: 1,
          totalOrders: { $size: "$orderIds" }
        }
      }
    ]);

    const totalSales  = salesAgg[0]?.totalSales || 0;
    const totalOrders = salesAgg[0]?.totalOrders || 0;


    
//    PENDING ORDERS (placed)
    
    const pendingAgg = await OrderModel.aggregate([
      { $unwind: "$items" },

      {
        $lookup: {
          from: "productmodels",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },

      { $unwind: "$product" },

      {
        $match: {
          "product.seller": sellerId,
          status: "placed"
        }
      },

      {
        $group: {
          _id: "$_id"
        }
      },

      {
        $count: "pendingOrders"
      }
    ]);

    const pendingOrders = pendingAgg[0]?.pendingOrders || 0;


 //    TOTAL PRODUCTS (seller)
    
    const totalProducts = await ProductModel.countDocuments({
      seller: sellerId
    });


    
// LOW STOCK PRODUCTS
    

    const lowStockProducts = await ProductModel.find({
      seller: sellerId,
      stock: { $lte: 5 }
    })
      .select("name stock price")
      .sort({ stock: 1 })
      .limit(10);


    
    // RECENT ORDERS (seller only)
    

    const recentOrders = await OrderModel.aggregate([
      { $unwind: "$items" },

      {
        $lookup: {
          from: "productmodels",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },

      { $unwind: "$product" },

      {
        $match: {
          "product.seller": sellerId
        }
      },

      { $sort: { createdAt: -1 } },

      { $limit: 10 },

      {
        $project: {
          orderId: "$_id",
          product: {
            _id: "$product._id",
            name: "$product.name"
          },
          quantity: "$items.quantity",
          price: "$items.price",
          status: "$status",
          createdAt: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        pendingOrders,
        totalProducts
      },
      lowStockProducts,
      recentOrders
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load seller dashboard"
    });

  }

};


//TO ADD PRODUCT(SELLER)//
export const addproduct = async (req,res)=>{

    // let uploadedImages = [];

    try{
        let{name,description,price,stock,category,keyFeatures,specifications} = req.body;

          if (typeof keyFeatures === "string") {
            keyFeatures = JSON.parse(keyFeatures);
          }

          if (typeof specifications === "string") {
            specifications = JSON.parse(specifications);
          }
         if(!name||!description|| !price || !category){
            return res.status(400).json({
                success:false,
                message:"All fields ae required"
            });
         }

         if(!req.files|| req.files.length === 0){
            return res.status(400).json({
                success:false,
                message:"Please upload product images"
            });

         }

         //Upload images
         const uploadedImages = req.files.map(file => ({
            url: file.path,           // cloudinary url
            public_id: file.filename // cloudinary public_id
        }));
         

         const product = await ProductModel.create({
            name,
            description,
            price,
            stock,
            category,
            keyFeatures,
            specifications,
            images:uploadedImages,
            seller:req.user.id,
            isApproved: false
         });

         res.status(201).json({
            success:true,
            message:"Product added successfully.Waiting for admin approval",
            product
         });
    }
    catch(error){

        console.log(error);

        // cleanup (delete already uploaded cloudinary files)
        if(req.files){
            for(const file of req.files){
                try{
                    await cloudinary.uploader.destroy(file.filename);
                }catch(e){}
            }
        }

        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};


//TO VIEW OWN PRODUCTS (FOR SELLER)//
export const getMyProducts = async (req,res) =>{
    try{

      const filter = {
      seller: req.user.id
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }
        const products = await ProductModel.find({seller:req.user.id});

        res.status(200).json({
            success:true,
            count: products.length,
            products
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

//TO VIEW HIS SINGLE PRODUCT(SELLER)//
export const getMySingleProduct = async(req,res)=>{
  try{
    const product = await ProductModel.findOne({
      _id:req.params.id,
      seller:req.user.id
    });

    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      });
    }
    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//UPDATE HIS PRODUCT(SELLER)
export const updateMyProduct = async (req,res)=>{
    try{
        const product = await ProductModel.findOne({
            _id: req.params.id,
            seller: req.user.id
        });
        
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }

        const {name,description,price,stock,category} = req.body;

        if(name) product.name = name;
        if(description) product.description=description;
        if(price) product.price = price;
        if(stock)product.stock = stock;
        if(category)product.category = category;

        //if new images uploaded

        if(req.files && req.files.length>0){
            //delete old images
            for(const img of product.images){
                if (img.public_id) {
                    console.log("Deleting:", img.public_id);
                await cloudinary.uploader.destroy(img.public_id);
                }
            }
            //save new images
            const newImages = req.files.map(file=>({
                url:file.path,
                public_id:file.filename
            }));

            product.images = newImages;
        }

        product.status = "pending"; //for re-approval

        await product.save();

        res.status(200).json({
            success:true,
            message:"Product updated Successfully",
            product
        });
    }
    catch(error){
        console.log(error);
        if(req.files){
            for(const file of req.files){
                try{
                    await cloudinary.uploader.destroy(file.filename);
                }catch(e){}
            }
        }

        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }

};

//DELETE HIS PRODUCT(SELLER)
export const deleteMyProduct = async (req,res)=>{
    try{

        console.log("USER:", req.user);
        const product = await ProductModel.findOne({
            _id: req.params.id,
            seller:req.user.id
        });

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not Found"
            });
        }
        
        //delete cloudinary images

        if (product.images && product.images.length > 0) {
            for(const img of product.images){
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        await product.deleteOne();

        res.status(200).json({
            success:true,
            message:"Product deleted Successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

//Fetch sellerOrders
export const fetchSellerOrders = async(req,res)=>{
  try{
    const sellerId = req.user.id;

    const orders = await OrderModel.find().populate("items.product").populate("user","usernamebox emailbox").sort({ createdAt: -1 });
    const sellerOrders = orders
            .map(order=>{const sellerItems = order.items.filter(
                i => i.product?.seller?.toString()=== sellerId
            );
            if(sellerItems.length ===0) return null;

            return{
              ...order.toObject(),
              items:sellerItems
            };
          }).filter(o => o !== null);
                              
    res.status(200).json({
      success:true,
      count:sellerOrders.length,
      orders: sellerOrders
    });
  }catch(error){
    console.log(error);
    res.status(500).json({
      success:false,
      message:"Server Error"
    });
  }
};

//getsingleOrder
export const getSellerSingleOrder = async(req,res)=>{
  try{

    const sellerId = req.user.id;
    const orderId = req.params.id;

    const order = await OrderModel
      .findOne({_id:orderId})
      .populate("items.product")
      .populate("user","usernamebox emailbox");

    if(!order){
      return res.status(404).json({
        success:false,
        message:"Order not found"
      });
    }
     const sellerItems = order.items.filter(
      i => i.product?.seller?.toString() === sellerId
    );

    if (sellerItems.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    res.status(200).json({
      success:true,
      order
    });

  }catch(err){
    console.log(err);
    res.status(500).json({
      success:false,
      message:"Server error"
    });
  }
};
//Shipping his Orders
export const shipOrder = async(req,res)=>{
  try{
    const sellerId = req.user.id;
    const orderId = req.params.id;

    const order = await OrderModel.findById(orderId).populate("items.product");
      
    if(!order){
      return res.status(404).json({
        success:false,
        message:"Order not found"
      });
    }

    const sellerItems = order.items.filter(
      i => i.product?.seller?.toString() === sellerId
    );
    

    if (sellerItems.length === 0){
      return res.status(403).json({
        success:false,
        message:"Not Authorized"
      });
    }

    if(order.status!== "placed"){
      return res.status(400).json({
        success:false,
        message:"Order cannot be shipped now"
      });
    }

    order.status = "shipped";
    await order.save();

    res.status(200).json({
      success:true,
      message:"Order shipped Successfully",
      order
    });
  }catch(error){
    console.log(error);
    res.status(500).json({
      success:false,
      message:"Server Error"
    });
  }
};