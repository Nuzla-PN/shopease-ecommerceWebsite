import { Users, Store, Package, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";

import { getAllOrdersForAdmin, getAllProductsForAdmin, getAllSellerAdmin, getAllUsersAdmin } from "../../APIs/adminAPI.JS";

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
    <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    products: 0,
    orders: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const u = await getAllUsersAdmin();
    const s = await getAllSellerAdmin();
    const p = await getAllProductsForAdmin();
    const o = await getAllOrdersForAdmin();

    setStats({
      users: u.count || u.users?.length || 0,
      sellers: s.count || s.sellers?.length || 0,
      products: p.count || p.products?.length || 0,
      orders: o.count || o.orders?.length || 0
    });
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<Users/>}
        />

        <StatCard
          title="Total Sellers"
          value={stats.sellers}
          icon={<Store/>}
        />

        <StatCard
          title="Products"
          value={stats.products}
          icon={<Package/>}
        />

        <StatCard
          title="Orders"
          value={stats.orders}
          icon={<ClipboardList/>}
        />

      </div>

    </div>
  );
};

export default AdminDashboard;