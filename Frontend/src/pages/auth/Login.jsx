import { useState } from "react";
import { loginUser } from "../../APIs/productAPI.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/auth/authSlice.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {

  const navigate = useNavigate();  
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    emailbox: "",
    passbox: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({...form,[e.target.name]: e.target.value, });
  };

  
  // frontend validation
  
  const validate = () => {
    const newErrors = {};

    if (!form.emailbox.trim()) {
      newErrors.emailbox = "Email is required";
    } else if (!emailRegex.test(form.emailbox.trim())) {
      newErrors.emailbox = "Invalid email format";
    }

    if (!form.passbox.trim()) {
      newErrors.passbox = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginUser(form);//cal backend login API
      dispatch(loginSuccess({
        token:res.token,
        user:res.user
        })
      );
      navigate("/"); //Redirect to home page

    } catch (err) {
      setErrors({
        api: err?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-[#0066CC]">
          ShopKart
        </Link>

          <Link
            to="/signup"
            className="text-sm font-semibold text-[#0066CC]"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[600px] bg-white rounded-lg border border-[#E0E0E0] p-12">

          <h1 className="text-[32px] font-bold text-[#333333]">
            Welcome Back
          </h1>
          <p className="text-[#666666] mt-1 mb-8">
            Login to your account
          </p>

          {errors.api && (
            <p className="text-sm text-[#D32F2F] mb-4">
              {errors.api}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[14px] font-semibold text-[#333333]">
                Email
              </label>
              <input
                type="email"
                name="emailbox"
                value={form.emailbox}
                onChange={handleChange}
                className={`w-full h-12 px-4 mt-1 rounded-lg border
                focus:ring-2 focus:ring-[#0066CC] outline-none
                ${errors.emailbox ? "border-[#D32F2F]" : "border-[#E0E0E0]"}`}
              />
              {errors.emailbox && (
                <p className="text-xs text-[#D32F2F] mt-1">
                  {errors.emailbox}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[14px] font-semibold text-[#333333]">
                Password
              </label>
              <input
                type="password"
                name="passbox"
                value={form.passbox}
                onChange={handleChange}
                className={`w-full h-12 px-4 mt-1 rounded-lg border
                focus:ring-2 focus:ring-[#0066CC] outline-none
                ${errors.passbox ? "border-[#D32F2F]" : "border-[#E0E0E0]"}`}
              />
              {errors.passbox && (
                <p className="text-xs text-[#D32F2F] mt-1">
                  {errors.passbox}
                </p>
              )}
            </div>

            {/* remember + forgot */}
            <div className="flex justify-between items-center text-sm text-[#666666]">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <span className="text-[#0066CC] cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* submit */}
            <button
              disabled={loading}
              className="w-full h-12 bg-[#0066CC] text-white rounded-lg
              font-semibold hover:bg-blue-700 active:scale-[0.98]
              disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Social UI only */}
            {/* <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="h-12 border rounded-lg text-sm font-semibold text-[#DB4437]"
              >
                Google
              </button>

              <button
                type="button"
                className="h-12 border rounded-lg text-sm font-semibold text-[#1877F2]"
              >
                Facebook
              </button>
            </div> */}

          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E0E0E0] py-6">
        <div className="flex flex-col md:flex-row gap-3 justify-center items-center text-sm text-[#666666]">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Us</span>
        </div>

        <p className="text-center text-xs text-[#666666] mt-2">
          © 2026 ShopEase
        </p>
      </footer>

    </div>
  );
};

export default Login;
