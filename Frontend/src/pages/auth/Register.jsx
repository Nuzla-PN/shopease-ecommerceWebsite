import { useState } from "react";
import { signupUser } from "../../APIs/productAPI.js";
import { Link, useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// same pattern as your backend
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usernamebox: "",
    emailbox: "",
    passbox: "",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // frontend validation
  // -----------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.usernamebox.trim()) {
      newErrors.usernamebox = "Username is required";
    }

    if (!form.emailbox.trim()) {
      newErrors.emailbox = "Email is required";
    } else if (!emailRegex.test(form.emailbox.trim())) {
      newErrors.emailbox = "Invalid email format";
    }

    if (!form.passbox.trim()) {
      newErrors.passbox = "Password is required";
    } else if (!passwordRegex.test(form.passbox)) {
      newErrors.passbox =
        "Password must contain uppercase, lowercase, number and special character and be at least 8 characters";
    }

    if (!agree) {
      newErrors.agree = "You must accept the terms";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await signupUser(form);

      navigate("/login");
    } catch (err) {
      setErrors({
        api: err?.response?.data?.message || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">

    
      <header className="bg-white border-b border-[#E0E0E0]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          
        <Link to="/" className="text-xl font-bold text-[#0066CC]">
          ShopKart
        </Link>
      
        </div>
      </header>

      
      <main className="flex-1 flex items-center justify-center px-9">
        <div className="w-full max-w-[600px] bg-white rounded-lg border border-[#E0E0E0] p-12">

          <h1 className="text-[32px] font-bold text-[#333333]">
            Create Your Account
          </h1>
          <p className="text-[#666666] mt-1 mb-8">
            Join our community and start shopping/selling
          </p>

          {errors.api && (
            <p className="text-sm text-[#D32F2F] mb-4">
              {errors.api}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-[14px] font-semibold text-[#333333]">
                Username
              </label>
              <input
                type="text"
                name="usernamebox"
                value={form.usernamebox}
                onChange={handleChange}
                className={`w-full h-12 px-4 mt-1 rounded-lg border
                focus:ring-2 focus:ring-[#0066CC] outline-none
                ${errors.usernamebox ? "border-[#D32F2F]" : "border-[#E0E0E0]"}`}
              />
              {errors.usernamebox && (
                <p className="text-xs text-[#D32F2F] mt-1">
                  {errors.usernamebox}
                </p>
              )}
            </div>

            
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

            
            <div>
              <label className="flex items-center gap-2 text-sm text-[#666666]">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                I agree to the Terms & Conditions
              </label>
              {errors.agree && (
                <p className="text-xs text-[#D32F2F] mt-1">
                  {errors.agree}
                </p>
              )}
            </div>

          
            <button
              disabled={loading}
              className="w-full h-12 bg-[#0066CC] text-white rounded-lg
              font-semibold hover:bg-blue-700 active:scale-[0.98]
              disabled:opacity-60"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

              <Link
            to="/login"
            className="block text-center text-sm font-semibold text-[#0066CC] mt-4"
          >
            Already have an account? Login
          </Link>

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

export default Signup;
