import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ClipboardList,
  ChevronDown
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useState } from "react";

const AdminLayout = () => {

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-sm
     ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

  return (
    <div className="min-h-screen flex bg-gray-100">

     
      <aside className="w-64 bg-white border-r p-4">
<Link to="/admin">
        <h2 className="text-xl font-bold mb-6 text-blue-600">
          Admin Panel
        </h2></Link>

        <nav className="space-y-1">

          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={18}/> Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <Users size={18}/> Users
          </NavLink>

          <NavLink to="/admin/sellers" className={linkClass}>
            <Store size={18}/> Sellers
          </NavLink>

          <NavLink to="/admin/seller-requests" className={linkClass}>
            <ClipboardList size={18}/> Seller Requests
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            <Package size={18}/> Products
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            <ClipboardList size={18}/> Orders
          </NavLink>

        </nav>

      </aside>

      
      <div className="flex-1 flex flex-col">

        
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">

          <Link to="/" className="text-xl font-bold text-indigo-600">
            ShopKart
          </Link>

          <div className="relative">
            <button
              onClick={() => setOpen((p) => !p)}
              className="flex items-center gap-3 pl-3 pr-2 py-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="text-right">
                <div className="text-sm text-gray-900">
                  {user?.usernamebox || user?.name || "Admin"}
                </div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>

              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                {(user?.usernamebox || user?.name || "A")[0].toUpperCase()}
              </div>

              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </header>

        
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;