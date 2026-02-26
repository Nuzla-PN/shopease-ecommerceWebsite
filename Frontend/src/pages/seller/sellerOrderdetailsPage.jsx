import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSellerSingleOrder, shipOrderAPI,  } from "../../APIs/sellerAPI.js";

const SellerOrderDetailsPage = () => {

  const { id } = useParams();   // order item id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await getSellerSingleOrder(id);   
      console.log(res.order);
      setOrder(res.order);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async () => {
    try {
      await shipOrderAPI(id);
      loadOrder();
    } catch (err) {
      console.log(err);
    }
  };

  const statusStyle = (status) =>
    `inline-flex px-3 py-1 rounded-md text-xs font-medium text-white
    ${status === "delivered" ? "bg-green-600" :
      status === "cancelled" ? "bg-red-600" :
        status === "shipped" ? "bg-purple-600" :
          "bg-blue-600"}`;

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  return (

    <div className="p-4 max-w-5xl mx-auto">

      <h2 className="text-xl font-semibold mb-4">
        Order Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6 border rounded p-4">

        
        <div>
          <div className="w-full h-72 overflow-hidden rounded border">
            <img
              src={order.items[0].product?.images?.[0]?.url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-3">
            <span className={statusStyle(order.status)}>
              {order.status}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div>

          <h3 className="text-lg font-semibold">
            {order.items[0].product?.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3">
            Customer : {order.user?.usernamebox}
          </p>

          <div className="text-sm space-y-1 mb-4">
            <p><b>Order ID :</b> {order._id}</p>
            <p>
              <b>Ordered on :</b>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p><b>Quantity :</b> {order.items[0].quantity}</p>
            <p><b>Price :</b> ₹ {order.items[0].price}</p>
          </div>

          <div className="border rounded p-3 text-sm mb-4">
            <p className="font-semibold mb-1">Total</p>
            <p>
              ₹ {order.totalAmount}
            </p>
          </div>

          {order.status === "placed" && (
            <button
              onClick={handleShip}
              className="px-4 py-2 bg-black text-white rounded text-sm"
            >
              Ship order
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default SellerOrderDetailsPage;