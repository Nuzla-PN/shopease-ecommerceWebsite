import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import { getSingleProduct, saveUserAddress, updateCartQuantity,getUserAddress, confirmOrder} from "../../APIs/productAPI.js";
import { updateQuantity } from "../../features/cart/cartSlice.js";


const OrderSummary = () =>{
  
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const[items,setItems] = useState([]);
    const[loading,setloading] = useState(true);

    const[editing,setEditing] = useState(false);
    const[saving,setSaving] = useState(false);

    const [address,setAddress] = useState({
        name:"",
        phone:"",
        address:"",
        city:"",
        state:"",
        zip:"",
        country:""
    });

    useEffect(() => {

    const loadAddress = async () => {
      try {
        const res = await getUserAddress();

        if (res.address) {
          setAddress({
            name: res.address.name || "",
            phone: res.address.phone || "",
            address: res.address.addressLine || "",
            city: res.address.city || "",
            state: res.address.state || "",
            zip: res.address.zip || "",
            country: res.address.country || ""
          });
        }
      } catch (err) {
        console.log("Address not loaded");
      }
    };

    loadAddress();

  }, []);


  useEffect(() => {

    const loadItems = async () => {

      try {

        const param = searchParams.get("items");

        if (!param) {
          setloading(false);
          return;
        }

        // id1:2,id2:1
        const pairs = param.split(",");

        const results = [];

        for (let p of pairs) {

          const [id, qty] = p.split(":");

          const res = await getSingleProduct(id);

          results.push({
            product: res.product,
            quantity: Number(qty)
          });
        }

        setItems(results);

      } catch (err) {
        console.log(err);
      }

      setloading(false);
    };

    loadItems();

  }, [searchParams]);


  const increaseQty = (index) => {
    const updated = [...items];
    updated[index].quantity += 1;
    setItems(updated);
  };
  
    const decreaseQty = (index) => {
    const updated = [...items];
    if (updated[index].quantity <= 1) return;
    updated[index].quantity -= 1;
    setItems(updated);
  };
  

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

//   const shipping = subtotal > 50 ? 0 : 5.99;
//   const tax = subtotal * 0.1;
  const total = subtotal;


  //save address

  const handleSaveAddress = async ()=>{
    try{
        setSaving(true);

        const payload = {
            name: address.name,
            phone:address.phone,
            addressLine:address.address,
            city:address.city,
            state:address.state,
            zip:address.zip,
            country:address.country
        };

        const res = await saveUserAddress(payload);
        alert(res.message);
        setEditing(false);
    }
    catch(err){
        alert("Failed to save Address");
    }finally{
        setSaving(false);
    }
  };


  const handleConfirm = async()=>{
    try{
      const res = await confirmOrder(); 
       alert("Order placed successfully..");
       navigate("/orders");
    }
    catch(err){
      alert("Failed to place Order");
      console.log(err);
    }
   
  };

  if(loading) return<div className="pt-24 text-center">Loading...</div>

  return(
    <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">

      <h1 className="text-2xl font-semibold mb-6">Order Summary</h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* Address */}
          <div className="border rounded-xl p-5">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Delivery Address</h2>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-indigo-600 text-sm"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {[
                ["name", "Full Name"],
                ["phone", "Phone"],
                ["address", "Address"],
                ["city", "City"],
                ["state", "State"],
                ["zip", "ZIP"],
                ["country", "Country"]
              ].map(([key, label]) => (

                <input
                  key={key}
                  disabled={!editing}
                  placeholder={label}
                  value={address[key]}
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                  className={`border rounded-md px-3 py-2 text-sm ${
                    !editing && "bg-gray-100"
                  } ${key === "address" && "md:col-span-2"}`}
                />

              ))}

              {editing && (
                <button
                  onClick={handleSaveAddress}
                  disabled={saving}
                  className="md:col-span-2 bg-black text-white py-2 rounded-lg"
                >
                  {saving ? "Saving..." : "Save Address"}
                </button>
              )}

            </div>

          </div>

          {/* Items */}
          <div className="border rounded-xl p-5 space-y-4">

            <h2 className="font-semibold text-lg">Order Items</h2>

            {items.map((item,index) => (

              <div
                key={item.product._id}
                className="flex gap-4 border rounded-lg p-4"
              >

                <img
                  src={item.product.images?.[0]?.url}
                  className="w-20 h-20 object-contain border rounded"
                />

                <div className="flex-1">

                  <h3 className="font-medium">{item.product.name}</h3>

                  <p className="text-sm text-gray-500">
                    Seller : {item.product.seller?.usernamebox}
                  </p>

                  <div className="flex items-center gap-3 mt-2">

                  <button
                    onClick={() => decreaseQty(index)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>

                  <span className="text-sm">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(index)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>

                </div>

                  <p className="text-sm text-gray-500">
                    Qty : {item.quantity}
                  </p>

                </div>

                <div className="font-semibold text-indigo-600">
                  ₹ {(item.product.price * item.quantity).toFixed(2)}
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="border rounded-xl p-5">

            <h2 className="font-semibold text-lg mb-4">
              Price Details
            </h2>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-indigo-600 text-lg">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>

            </div>

            <div className="mt-4 text-sm text-gray-500">
              Payment Method : Cash on Delivery
            </div>

            <div className="text-sm text-gray-500">
              Estimated delivery : 3 – 5 working days
            </div>

            <p className="text-xs text-gray-400 mt-3">
              By confirming the order, you agree to our terms and conditions.
            </p>

            <button
              onClick={handleConfirm}
              className="w-full mt-5 bg-black text-white py-3 rounded-lg font-medium"
            >
              Confirm Order & Pay
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderSummary;