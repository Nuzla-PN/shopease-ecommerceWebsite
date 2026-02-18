import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cancelMyOrder, fetchMyOrders } from "../../features/orders/orderSlice.js";

const statusTabs = ["all", "placed", "shipped", "delivered", "cancelled"];

const MyOrders = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderState = useSelector((state) => state.order);
    console.log("FULL ORDER SLICE 👉", orderState);

  const { myOrderProducts, loading } = orderState;



  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

    const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelMyOrder(id));
      setSelectedItem(null);
    }

  };

  const handleReOrder = (item) => {
  navigate(`/products/${item.product._id}`);
  };

  const filteredOrders = useMemo(() => {

    let data = myOrderProducts || [];

  if (activeTab !== "all") {
    data = data.filter(o => o.status === activeTab);
  }

  if (search.trim()) {
    const key = search.toLowerCase();
    data = data.filter(o =>
      o.product?.name?.toLowerCase().includes(key) ||
      o.orderId?.toLowerCase().includes(key)
    );
  }

  return data;

}, [myOrderProducts, activeTab, search]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">

      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by product or order id"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded border capitalize
              ${activeTab === tab ? "bg-blue-600 text-white" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {filteredOrders.map((item) => (
            <div
              key={item.orderId + item.product?._id}
              onClick={() => setSelectedItem(item)}
              className="border rounded cursor-pointer hover:shadow"

            >
              <div className="relative">

                <img
                  src={item.product?.images?.[0]?.url}
                  alt=""
                  className="w-full h-40 object-cover rounded-t"
                />

                <span
                  className={`absolute top-2 left-2 text-xs px-2 py-1 rounded text-white
                    ${item.status === "delivered" ? "bg-green-600" :
                      item.status === "cancelled" ? "bg-red-600" :
                        item.status === "shipped" ? "bg-purple-600" :
                          "bg-blue-600"}`}
                >
                  {item.status}
                </span>

              </div>

              <div className="p-3">

                <h4 className="font-medium line-clamp-1">
                  {item.product?.name}
                </h4>

                <p className="text-sm text-gray-600">
                  Qty: {item.quantity}
                </p>

                <p className="text-sm mt-1">
                  ₹ {item.price * item.quantity}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Order ID: {item.orderId}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  className="text-blue-600 text-sm mt-2"
                >
                  View details
                </button>

                {(item.status === "placed") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(item.orderId);
                      }}
                      className="text-sm text-red-600 border border-red-500 px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  )}

              </div>
            </div>
          ))}

        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl rounded p-4 max-h-[90vh] overflow-y-auto"
          >

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Order Details
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Left */}
              <div>
                <img
                  onClick={() => navigate(`/products/${selectedItem.product._id}`)}
                  src={selectedItem.product?.images?.[0].url}
                  className="w-full h-64 object-cover rounded"
                />

                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded text-white text-sm
                    ${selectedItem.status === "delivered" ? "bg-green-600" :
                        selectedItem.status === "cancelled" ? "bg-red-600" :
                          selectedItem.status === "shipped" ? "bg-purple-600" :
                            "bg-blue-600"}`}
                  >
                    {selectedItem.status}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div>

                <h4 className="text-xl font-semibold mb-1">
                  {selectedItem.product?.name}
                </h4>

                <p className="text-gray-600 mb-2">
                  by {selectedItem.product?.sellerName || "Seller"}
                </p>

                <p className="text-sm mb-4">
                  {selectedItem.product?.description}
                </p>

                <div className="border rounded p-3 mb-4">
                  <p><b>Order ID:</b> {selectedItem.orderId}</p>
                  <p><b>Order date:</b> {new Date(selectedItem.orderDate).toLocaleString()}</p>
                  <p><b>Quantity:</b> {selectedItem.quantity}</p>
                </div>

                <div className="border rounded p-3 mb-4">
                  <p className="font-semibold mb-1">Price details</p>
                  <p>Price : ₹ {selectedItem.price}</p>
                  <p>Qty : {selectedItem.quantity}</p>
                  <p>Tax (10%) : ₹ {(selectedItem.price * selectedItem.quantity * 0.1).toFixed(2)}</p>
                  <p className="font-semibold text-blue-600 mt-1">
                    Total : ₹ {(selectedItem.price * selectedItem.quantity * 1.1).toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">

                  {selectedItem.status === "placed"  && (
                      <button
                        onClick={() => handleCancel(selectedItem.orderId)}
                        className="border px-4 py-2 rounded text-red-600 border-red-500"
                      >
                        Cancel order
                      </button>
                    )}

                  {selectedItem.status === "shipped" && (
                    <button className="border px-4 py-2 rounded">
                      Track order
                    </button>
                  )}

                  {selectedItem.status === "delivered" && (
                    <>
                      <button className="border px-4 py-2 rounded">
                        Write review
                      </button>
                      
                      <button onClick={() => handleReOrder(selectedItem)} className="border px-4 py-2 rounded">
                        Reorder
                      </button>
                      

                    </>
                  )}

                  {selectedItem.status === "cancelled" && (
                    <button onClick={() => handleReOrder(selectedItem)}  className="border px-4 py-2 rounded">
                      Reorder
                    </button>
                  )}

                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrders;
