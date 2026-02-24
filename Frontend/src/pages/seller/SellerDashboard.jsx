import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Truck } from "lucide-react";
import {
  getSellerDashboardAPI,
  shipOrderAPI
} from "../../APIs/sellerAPI.js";

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded shadow p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </div>
);

const SellerDashboard = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const loadDashboard = async () => {
    try {
      const data = await getSellerDashboardAPI();

      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setLowStockProducts(data.lowStockProducts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleShip = async (id) => {
    if (!window.confirm("Ship this order now?")) return;

    try {
      await shipOrderAPI(id);
      loadDashboard();
    } catch (err) {
      console.log(err);
      alert("Shipping failed");
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold">Seller Dashboard</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
<Link to="/seller/orders">
        <StatCard
          title="Total Sales"
          value={`₹ ${stats?.totalSales?.toFixed(2) || 0}`}
        /></Link>
<Link to="/seller/orders">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
        /></Link>
<Link to="/seller/orders">
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
        /></Link>
<Link to="/seller/products">
        <StatCard
          title="Total Available Products"
          value={stats?.totalProducts || 0}
        /></Link>

      </div>

      
      <div className="bg-white rounded shadow p-4 mb-8">

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Recent Orders</h3>
          <button
            onClick={() => navigate("/seller/orders")}
            className="text-sm text-blue-600"
          >
            View all
          </button>
        </div>

        
        <div className="hidden md:block overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="py-2">Order</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-3 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              )}

              {recentOrders.map((o) => (

                <tr key={o._id} className="border-b">

                  <td className="py-4">
                    #{o.orderId?.slice(-6)}
                  </td>

                  <td>{o.product?.name}</td>
                  <td>{o.quantity}</td>
                  <td>₹ {o.price}</td>

                  <td>
                    {o.status === "delivered" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 capitalize">
                        delivered
                      </span>
                    ) : o.status === "cancelled" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 capitalize">
                        cancelled
                      </span>
                    ) : o.status === "shipped" ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 capitalize">
                        shipped
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 capitalize">
                        placed
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="flex gap-3 items-center">

                      <button
                        onClick={() =>
                          navigate(`/seller/orders/${o.orderId}`)
                        }
                        className="p-2 rounded hover:bg-gray-100"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>

                      {o.status === "placed" && (
                        <button
                          onClick={() => handleShip(o._id)}
                          className="p-2 rounded hover:bg-green-50 text-green-600"
                          title="Ship"
                        >
                          <Truck size={16} />
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>

        </div>

        
        <div className="md:hidden space-y-4">

          {recentOrders.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No orders yet
            </p>
          )}

          {recentOrders.map((o) => (

            <div
              key={o._id}
              className="border rounded-xl p-4 space-y-3"
            >

              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    #{o.orderId?.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {o.product?.name}
                  </p>
                </div>

                {o.status === "delivered" ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 capitalize">
                    delivered
                  </span>
                ) : o.status === "cancelled" ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 capitalize">
                    cancelled
                  </span>
                ) : o.status === "shipped" ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 capitalize">
                    shipped
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 capitalize">
                    placed
                  </span>
                )}
              </div>

              <div className="flex justify-between text-sm">
                <span>Qty : {o.quantity}</span>
                <span>₹ {o.price}</span>
              </div>

              <div className="flex gap-3 pt-2">

                <button
                  onClick={() =>
                    navigate(`/seller/orders/${o.orderId}`)
                  }
                  className="flex-1 border rounded-lg py-2 text-sm"
                >
                  View
                </button>

                {o.status === "placed" && (
                  <button
                    onClick={() => handleShip(o._id)}
                    className="flex-1 border rounded-lg py-2 text-sm text-green-600"
                  >
                    Ship
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>
      
      
      <div className="bg-white rounded shadow p-4">

        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">
            Low Stock Alerts
          </h3>

          <button
            onClick={() => navigate("/seller/products")}
            className="text-sm text-blue-600"
          >
            Manage products
          </button>
        </div>

        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500">
            All products are sufficiently stocked.
          </p>
        ) : (
          <div className="space-y-3">

            {lowStockProducts.map((p) => (
              <div
                key={p._id}
                className="flex justify-between items-center border rounded p-2"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    Stock : {p.stock}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/seller/products/edit/${p._id}`)}
                  className="text-sm text-blue-600"
                >
                  Update
                </button>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default SellerDashboard;