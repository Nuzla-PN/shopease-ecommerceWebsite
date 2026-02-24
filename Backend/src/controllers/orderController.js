import CartModel from "../models/Cart.js";
import OrderModel from "../models/Order.js";
import ProductModel from "../models/Product.js";
import UserRegister from "../models/User.js";


//BuyNow also adding to cart

export const BuyNowAddtoCart = async(req,res)=>{
    try{
        const userId = req.user.id;
        const{productId} = req.body;

        const product = await ProductModel.findById(productId);

        if(!product || !product.status){
          return res.status(404).json({
            success:false,
            message:"Product not available"
      });
    }

      await CartModel.updateMany(
      { user: userId },
      { $set: { isSelected: false } }
    );

    let cartItem = await CartModel.findOne({
      user: userId,
      product: productId
    });

    if (cartItem) {
      cartItem.quantity = 1;     // BuyNow normally starts with 1
      cartItem.isSelected = true;
      await cartItem.save();
    } else {
      cartItem = await CartModel.create({
        user: userId,
        product: productId,
        quantity: 1,
        isSelected: true
      });
    }

    const populatedItem = await cartItem.populate("product");
    return res.json({
      success: true,
      message: "Buy now item ready",
      cartItem:populatedItem
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


//In EachProduct:To BuyNow summary

// export const BuyNowSummary = async (req,res)=>{
//     try{
//         const {productId} = req.params;
//         const product = await ProductModel.findById(productId);

//         if(!product || !product.isApproved){
//             return res.status(404).json({
//                 success:false,
//                 message:"Product not Available"
//             });
//         }

//         const item = {
//             product,
//             quantity :1
//         };

//         const totalAmount = product.price;

//         res.json({
//             success:true,
//             item,
//             totalAmount
//         });
//     }
//     catch (err) {
//     res.status(500).json({
//       success:false,
//       message:"Server error"
//     });
//   }
// };

//Confrim BuyNow 

// export const placeBuyNowOrder = async (req,res)=>{
//     try{
//         const userId = req.user.id;
//         const{productId}= req.body;

//         const product = await ProductModel.findById(productId);

//         if(!product || !product.isApproved){
//             return res.status(404).json({
//                 success:false,
//                 message:"Product Not Available"
//             });
//         }


//     const order = await OrderModel.create({
//         user:userId,
//         items:[
//             {
//           product: product._id,
//           quantity: 1,
//           price: product.price
//         }
//       ],
//       totalAmount: product.price
//     });
//     res.status(201).json({
//       success:true,
//       message:"Order placed successfully",
//       order
//     });
//     }
//     catch (err) {
//     res.status(500).json({
//       success:false,
//       message:"Server error"
//     });
//   }
// };





//In Cart page and Each Product Page:getting ordersummary after click PLACEORDER/BuyNow button in cartPage and Each Product page
export const getOrderSummary = async (req,res)=>{
    try{

        const userId=req.user.id;
        const cartItems = await CartModel.find({user:userId,isSelected:true}).populate("product");

        if(cartItems.length===0){
            return res.status(400).json({
                success:false,
                message:"No items is selected for order(cart)"
            });
        }
        let totalAmount = 0;
        const items = cartItems.map(item=>{
            totalAmount += item.product.price * item.quantity;

            return {
        cartId: item._id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        subTotal: item.product.price * item.quantity
      };
    });
        res.json({
            success:true,
            message:"Summary Page",
            items:items,
            totalAmount
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

//To confirm order from summary page.It has CONFIRM ORDER button
export const ConfirmOrder = async (req,res)=>{
    try{

        const userId=req.user.id;
        const cartItems = await CartModel.find({user:userId,isSelected:true}).populate("product");
        console.log("MY ORDERS USER ID:", req.user.id);

        console.log("SELECTED CART ITEMS:", cartItems.length);
        if(cartItems.length===0){
            return res.status(400).json({
                success:false,
                message:"No items is selected from cart"
            });
        }

        let orderItems = [];
        let totalAmount = 0;

            for(const item of cartItems){
              if (!item.product) continue;
              orderItems.push({
                product:item.product._id,
                quantity:item.quantity,
                price:item.product.price
        });

        totalAmount += item.product.price * item.quantity;
    }
    
    
    const order = await OrderModel.create({
            user:userId,
            items:orderItems,
            totalAmount:totalAmount
        });
        // remove only selected items from cart
        await CartModel.deleteMany({
            user:userId,
            isSelected:true
        });

        res.status(201).json({
            success:true,
            message:"Order placed successfully",
            order
        });

    }catch(err){
        console.log("CONFIRM ORDER ERROR",err);
        res.status(500).json({
            success:false,
            message:"Server error"
        });
    }
};

//To view MyOrders
export const ViewMyOrders = async (req,res)=>{
  try{
    const userId = req.user.id;
    const allOrders = await OrderModel.find({});
    console.log("TOTAL ORDERS IN DB..1:", allOrders.length);

    const orders = await OrderModel.find({user:userId}).populate("items.product").sort({createdAt:-1});
    console.log("USER ID:..2", userId);
    console.log("MATCHED ORDERS:..3", orders.length);

   res.status(200).json({
    success:true,
    count:orders.length,
    orders
   });
}
catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }

};

//CancelOrder by user
export const CancelOrder = async(req,res)=>{
    try{
        const userId = req.user.id;
        const orderId = req.params.id;

        const order = await OrderModel.findById(orderId);
        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        //Only user can cancel

        if(order.user.toString()!==userId){
            return res.status(403).json({
                success: false,
                message: "Access denied"
            }); 
        }
        //do not allow cancel after shipped

        if (order.status !== "placed") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now"
      });
    }
    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

    }
    
    catch (error) {
        console.log(error);
        res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
};

//create Order to find seller 
export const createOrder = async (req, res) => {
  try {

    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items" });
    }

    const firstProduct = await ProductModel.findById(items[0].product);

    if (!firstProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = await OrderModel.create({

      user: req.user._id,
      seller: firstProduct.seller,
      items,
      totalAmount,
      shippingAddress

    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};
