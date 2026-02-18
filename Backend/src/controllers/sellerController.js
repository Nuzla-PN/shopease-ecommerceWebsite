import cloudinary from "../config/cloudinary.js";
import Productmodel from "../models/Product.js";

//TO ADD PRODUCT(SELLER)//

export const addproduct = async (req,res)=>{

    // let uploadedImages = [];

    try{
        const{name,description,price,stock,category} = req.body;

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
         

         const product = await Productmodel.create({
            name,
            description,
            price,
            stock,
            category,
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
        const products = await Productmodel.find({seller:req.user.id});

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

//UPDATE HIS PRODUCT(SELLER)

export const updateMyProduct = async (req,res)=>{
    try{
        const product = await Productmodel.findOne({
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

        product.isApproved = false; //for re-approval

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
        const product = await Productmodel.findOne({
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

        for(const img of product.images){
            await cloudinary.uploader.destroy(img.public_id);
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