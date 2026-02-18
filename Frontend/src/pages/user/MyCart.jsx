import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

import {getUsercart,removeCartItem, updateCartQuantity,toggleCartSelectionAPI} from "../../APIs/productAPI.js";

import {setCart,removeFromCart, setSelectedIds, updateQuantity} from "../../features/cart/cartSlice.js";

const MyCart = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items)|| [];
  const selectedIds = useSelector(state=>state.cart.selectedIds)|| [];
  
  // const [selected, setSelected] = useState([]);

  // ---------------- load cart ----------------
  useEffect(() => {

    const loadCart = async () => {
      try {
        const res = await getUsercart();
        dispatch(setCart(res.cartitems));
      } catch (err) {
        console.log(err);
      }
    };

    loadCart();

  }, [dispatch]);

  // ---------------- checkbox handlers ----------------

  const increaseQty = async(item)=>{
    const newQty = item.quantity+1;
    try{
      await updateCartQuantity(item._id,newQty);
      dispatch(updateQuantity({cartId:item._id,quantity:newQty}));
    }catch(err){
      alert("Unable to update quantity");
    }
  };

  const decreaseQty = async (item) => {
  if (item.quantity <= 1) return;

  const newQty = item.quantity - 1;

  try {
    await updateCartQuantity(item._id, newQty);
    dispatch(updateQuantity({ cartId: item._id, quantity: newQty }));
  } catch (err) {
    alert("Unable to update quantity");
  }
};


  const toggleItem = async (item) => {
  const newValue = !selectedIds.includes(item._id);

  try {
    await toggleCartSelectionAPI(item._id, newValue);

    let updated;
    if (newValue) {
      updated = [...selectedIds, item._id];
    } else {
      updated = selectedIds.filter(x => x !== item._id);
    }

    dispatch(setSelectedIds(updated));

  } catch (err) {
    alert("Unable to update selection");
  }
};


  const toggleAll = async() => {
    try{
      const validItems = cartItems.filter(Boolean);
      const selectAll = !(selectedIds.length === validItems.length);
      const ids = [];

      for (const item of validItems){
        await toggleCartSelectionAPI(item._id,selectAll);

        if(selectAll) ids.push(item._id);
      }

      dispatch(setSelectedIds(selectAll? ids :[]));
    }
    catch(err){
      alert("Unable to update all selections")
    }
  };


  // ---------------- remove ----------------

  const handleRemove = async (cartId) => {

    try {
      await removeCartItem(cartId);
      dispatch(removeFromCart(cartId));
      dispatch(setSelectedIds(selectedIds.filter((id) => id !== cartId)));
    } catch (err) {
      alert("Unable to remove item");
    }
  };

  // ---------------- buy single ----------------

  const handleBuySingle = async (item) => {

    try {
      await toggleCartSelectionAPI(item._id, true);
      dispatch(setSelectedIds([item._id]));

      const query = `${item.product._id}:${item.quantity}`;
      navigate(`/order-summary?items=${query}`);
    } catch (err) {
      alert("Please login first");
    }
  };

  // ---------------- price calculation ----------------

  const selectedItems = cartItems.filter(item=>item&&selectedIds.includes(item._id));

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // ---------------- empty cart ----------------

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="pt-28 text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  // ---------------- UI ----------------

  return (
    <div className="pt-10 max-w-7xl mx-auto px-4">
      <Link to="/" className="text-blue-600 text-sm mb-2 inline-block">
        ← Continue Shopping
      </Link>

      <h1 className="text-4xl font-bold mb-6">My Cart (<span>{selectedItems.length}</span>)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT - CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">

          <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <input className="w-4 h-4"
              type="checkbox"
              checked={
                cartItems.length > 0 &&
                selectedIds.length === cartItems.length
              }
              onChange={toggleAll}
            />
            <span className="text-sm font-medium">Select all (<span>{selectedItems.length}</span>)</span>
          </div>

          {cartItems.filter(Boolean).map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-xl border p-4 flex gap-4"
            >

              <input className="w-4 h-4"
                type="checkbox"
                checked={selectedIds.includes(item._id)}
                onChange={() => toggleItem(item)}
              />

              <img
                src={item.product.images?.[0]?.url}
                alt={item.product.name}
                className="w-24 h-24 rounded-lg object-cover"
              />

              <div className="flex-1">

                <h3 className="font-medium text-lg">
                  {item.product.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Category : {item.product.category}
                </p>

                <p className="text-sm text-gray-500">
                  Seller : {item.product.seller?.usernamebox}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4">

                  {/* qty box */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button onClick={()=>decreaseQty(item)} className="px-3 py-1 text-lg">-</button>
                    <span className="px-4 text-sm">
                      {item.quantity}
                    </span>
                    <button onClick={()=> increaseQty(item)} className="px-3 py-1 text-lg">+</button>
                  </div>

                  <span className="text-blue-600 font-semibold">
                    ₹ {(item.product?.price * item.quantity).toFixed(2)}
                  </span>

                </div>

                <div className="flex gap-3 mt-4">

                  <button
                    onClick={() =>
                      handleBuySingle(item)
                    }
                    className="bg-black text-white text-sm px-4 py-2 rounded-lg"
                  >
                    Buy Now
                  </button>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
                  >
                    <FaTrash /> Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white rounded-xl border p-5 h-fit">

          <h2 className="font-semibold text-lg mb-4">
            Price Details
          </h2>

          <div className="flex justify-between text-sm mb-2 text-gray-600">
            <span>Selected items</span>
            <span>{selectedItems.length}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>
          

          <button 
              disabled={selectedItems.length === 0}
              onClick={() => {

              const query = selectedItems
                .map(i => `${i.product._id}:${i.quantity}`)
                .join(",");

                  navigate(`/order-summary?items=${query}`);
                }}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            Place Order
          </button>

        </div>

      </div>

    </div>
  );
};

export default MyCart;



// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { useState, useMemo } from "react";

// const MyCart = () => {

//   const items = useSelector((state) => state.cart.items);

//   const [selected, setSelected] = useState([]);

//   const allSelected = items.length > 0 && selected.length === items.length;

//   const toggleAll = () => {
//     if (allSelected) setSelected([]);
//     else setSelected(items.map(i => i._id));
//   };

//   const toggleOne = (id) => {
//     setSelected((prev) =>
//       prev.includes(id)
//         ? prev.filter(x => x !== id)
//         : [...prev, id]
//     );
//   };

//   const selectedItems = useMemo(() => {
//     return items.filter(i => selected.includes(i._id));
//   }, [items, selected]);

//   const subtotal = selectedItems.reduce(
//     (acc, item) => acc + (item.product?.price || 0) * item.quantity,
//     0
//   );

//   const shipping = selectedItems.length > 0 ? 5.99 : 0;
//   const tax = subtotal * 0.1;
//   const total = subtotal + shipping + tax;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">

//       {/* Top */}
//       <Link to="/" className="text-blue-600 text-sm mb-2 inline-block">
//         ← Continue Shopping
//       </Link>

//       <h1 className="text-2xl font-bold mb-6">
//         Shopping Cart ({items.length} items)
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* LEFT SIDE */}
//         <div className="lg:col-span-2 space-y-4">

//           {/* Select all */}
//           <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
//             <input
//               type="checkbox"
//               checked={allSelected}
//               onChange={toggleAll}
//               className="w-4 h-4"
//             />
//             <span className="text-sm font-medium">
//               Select All ({items.length} items)
//             </span>
//           </div>

//           {/* Cart items */}
//           {items.map((item) => (

//             <div
//               key={item._id}
//               className="bg-white rounded-xl border p-4 flex gap-4"
//             >

//               {/* checkbox */}
//               <div className="pt-2">
//                 <input
//                   type="checkbox"
//                   checked={selected.includes(item._id)}
//                   onChange={() => toggleOne(item._id)}
//                   className="w-4 h-4"
//                 />
//               </div>

//               {/* image */}
//               <img
//                 src={item.product?.image}
//                 alt=""
//                 className="w-24 h-24 rounded-lg object-cover"
//               />

//               {/* details */}
//               <div className="flex-1">

//                 <h3 className="font-semibold text-lg">
//                   {item.product?.title}
//                 </h3>

//                 <p className="text-sm text-gray-500">
//                   Seller: {item.product?.sellerName || "Store"}
//                 </p>

//                 <p className="text-sm text-gray-500">
//                   Category: {item.product?.category}
//                 </p>

//                 {item.product?.badge && (
//                   <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
//                     {item.product.badge}
//                   </span>
//                 )}

//                 {/* bottom row */}
//                 <div className="mt-4 flex flex-wrap items-center gap-4">

//                   {/* qty box */}
//                   <div className="flex items-center border rounded-lg overflow-hidden">
//                     <button className="px-3 py-1 text-lg">-</button>
//                     <span className="px-4 text-sm">
//                       {item.quantity}
//                     </span>
//                     <button className="px-3 py-1 text-lg">+</button>
//                   </div>

//                   <span className="text-blue-600 font-semibold">
//                     ₹ {(item.product?.price * item.quantity).toFixed(2)}
//                   </span>

//                 </div>

//                 {/* buttons */}
//                 <div className="mt-4 flex gap-3">

//                   <button
//                     className="flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
//                   >
//                     🗑 Remove
//                   </button>

//                   <button
//                     className="bg-black text-white text-sm px-4 py-2 rounded-lg"
//                   >
//                     Buy This Now
//                   </button>

//                 </div>

//               </div>

//             </div>

//           ))}

//           {items.length === 0 && (
//             <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
//               Your cart is empty
//             </div>
//           )}

//         </div>

//         {/* RIGHT SIDE */}
//         <div className="space-y-4">

//           {/* Order summary */}
//           <div className="bg-white rounded-xl border p-5">

//             <h3 className="font-semibold text-lg mb-4">
//               Order Summary
//             </h3>

//             <div className="text-sm space-y-2 text-gray-600">

//               <div className="flex justify-between">
//                 <span>Subtotal ({selectedItems.length} items):</span>
//                 <span>₹ {subtotal.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Shipping:</span>
//                 <span>₹ {shipping.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Tax (10%):</span>
//                 <span>₹ {tax.toFixed(2)}</span>
//               </div>

//             </div>

//             <hr className="my-4"/>

//             <div className="flex justify-between items-center font-semibold text-lg">
//               <span>Total:</span>
//               <span className="text-blue-600">
//                 ₹ {total.toFixed(2)}
//               </span>
//             </div>

//             <button
//               className="w-full mt-5 bg-black text-white py-3 rounded-lg font-medium"
//             >
//               Place Order
//             </button>

//           </div>

//           {/* Benefits
//           <div className="bg-white rounded-xl border p-5">

//             <h4 className="font-semibold mb-3">
//               Order Benefits:
//             </h4>

//             <ul className="text-sm text-gray-600 space-y-2">
//               <li>✓ Free shipping on orders over ₹50</li>
//               <li>✓ Easy 7 days return</li>
//               <li>✓ Secure payments</li>
//             </ul>

//           </div> */}

//         </div>

//       </div>

//     </div>
//   );
// };

// export default MyCart;

