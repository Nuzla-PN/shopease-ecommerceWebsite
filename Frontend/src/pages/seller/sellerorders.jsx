import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageCheck, Eye, Truck } from "lucide-react";
import { fetchsellerOrdersAPI, shipOrderAPI } from "../../APIs/sellerAPI.js";

const SellerOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      const res = await fetchsellerOrdersAPI();
      setOrders(res.orders || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleShip = async (orderId) => {
    if (!window.confirm("Ship this order now?")) return;

    try {
      await shipOrderAPI(orderId);
      loadOrders();
      setSelectedItem(null);
    } catch (err) {
      console.log(err);
      alert("Shipping failed");
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(o => o.status === filter);

  const StatusBadge = ({ status }) => {

    const base =
      "inline-flex items-center px-3 py-1 text-xs rounded-full capitalize";

    if (status === "delivered")
      return <span className={`${base} bg-green-100 text-green-700`}>delivered</span>;

    if (status === "cancelled")
      return <span className={`${base} bg-red-200 text-red-700`}>cancelled</span>;

    if (status === "shipped")
      return <span className={`${base} bg-purple-100 text-purple-700`}>shipped</span>;

    return <span className={`${base} bg-blue-100 text-blue-700`}>placed</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <PackageCheck className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">
          All Orders
        </h2>
      </div>

      
      <div className="flex flex-wrap gap-2">

        {["all", "placed", "shipped", "delivered", "cancelled"].map(s => (

          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm border
              ${filter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>

        ))}

      </div>


      <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50 border-b">
            <tr className="text-sm text-gray-600 text-left">
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Qty</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {filteredOrders.map(order =>
              order.items.map(item => (

                <tr
                  key={order._id + item._id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-6 py-4">
                    #{order._id.slice(-6)}
                  </td>

                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0]?.url}
                        className="w-12 h-12 object-cover rounded"
                        alt=""
                      />
                      <span className="text-sm font-medium">
                        {item.product?.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {item.quantity}
                  </td>

                  <td className="px-6 py-4">
                    ₹ {item.price}
                  </td>

                  <td className="px-6 py-4">
                    {order.user?.usernamebox}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3 items-center">

                      <button
                        onClick={() =>
                          setSelectedItem({
                            order,
                            item
                          })
                        }
                        className="p-2 rounded hover:bg-gray-100"
                        title="View order"
                      >
                        <Eye size={18} />
                      </button>

                      {order.status === "placed" && (
                        <button
                          onClick={() => handleShip(order._id)}
                          className="p-2 rounded hover:bg-green-50 text-green-600"
                          title="Ship order"
                        >
                          <Truck size={18} />
                        </button>
                      )}

                    </div>
                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>


      <div className="grid gap-4 md:hidden">

        {filteredOrders.map(order =>
          order.items.map(item => (

            <div
              key={order._id + item._id}
              className="bg-white border rounded-xl p-4 shadow-sm space-y-3"
            >

              <div className="flex gap-3">

                <img
                  src={item.product?.images?.[0]?.url}
                  className="w-16 h-16 rounded object-cover"
                  alt=""
                />

                <div className="flex-1">

                  <p className="font-medium">
                    {item.product?.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.user?.usernamebox}
                  </p>

                  <div className="mt-1">
                    <StatusBadge status={order.status} />
                  </div>

                </div>

              </div>

              <div className="flex justify-between text-sm">
                <span>Qty : {item.quantity}</span>
                <span>₹ {item.price}</span>
              </div>

              <div className="flex gap-3 pt-2">

                <button
                  onClick={() =>
                    setSelectedItem({ order, item })
                  }
                  className="flex-1 border rounded-lg py-2 text-sm"
                >
                  View
                </button>

                {order.status === "placed" && (
                  <button
                    onClick={() => handleShip(order._id)}
                    className="flex-1 border rounded-lg py-2 text-sm text-green-600"
                  >
                    Ship
                  </button>
                )}

              </div>

            </div>

          ))
        )}

      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          No orders found
        </div>
      )}


      {selectedItem && (

        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3"
          onClick={() => setSelectedItem(null)}
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded p-4"
          >

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Order Details
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedItem.item.product?.images?.[0]?.url}
              className="w-full h-56 object-cover rounded mb-3"
              alt=""
            />

            <p className="font-semibold text-lg">
              {selectedItem.item.product?.name}
            </p>

            <div className="mt-2">
              <StatusBadge status={selectedItem.order.status} />
            </div>

            <div className="text-sm mt-4 space-y-1">

              <p><b>Order ID :</b> {selectedItem.order._id}</p>

              <p>
                <b>Ordered on :</b>{" "}
                {new Date(selectedItem.order.createdAt).toLocaleString()}
              </p>

              <p><b>Quantity :</b> {selectedItem.item.quantity}</p>

              <p><b>Price :</b> ₹ {selectedItem.item.price}</p>

              <p>
                <b>Customer :</b>{" "}
                {selectedItem.order.user?.usernamebox}
              </p>

            </div>

            {selectedItem.order.status === "placed" && (

              <div className="mt-5">
                <button
                  onClick={() =>
                    handleShip(selectedItem.order._id)
                  }
                  className="border px-4 py-2 rounded text-green-600 border-green-500"
                >
                  Ship order
                </button>
              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default SellerOrders;