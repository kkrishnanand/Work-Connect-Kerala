
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  BriefcaseBusiness,
} from "lucide-react";
import axios from "axios";
import api from "../api/axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const authApi = axios.create({
  baseURL: API_BASE_URL,
});

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      general: "",
    }));

    setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Step 1: Authenticate without the main Axios interceptors.
      const tokenResponse = await authApi.post("token/", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const { access, refresh } = tokenResponse.data;

      if (!access || !refresh) {
        throw new Error("The server did not return both JWT tokens.");
      }

      // Step 2: Store tokens before requesting the current user.
      localStorage.setItem("workconnectAccessToken", access);
      localStorage.setItem("workconnectRefreshToken", refresh);

      // Step 3: Fetch the current user with the newly issued token.
      const profileResponse = await api.get("accounts/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const user = profileResponse.data;

      if (!["worker", "employer"].includes(user.role)) {
        throw new Error(
          "Your account does not have a valid worker or employer role."
        );
      }

      // Step 4: Save the user and redirect based on their role.
      localStorage.setItem(
        "workconnectLoggedInUser",
        JSON.stringify(user)
      );

      setSuccess(true);

      if (user.role === "worker") {
        navigate("/worker-dashboard");
      } else {
        navigate("/employer-dashboard");
      }
    } catch (error) {
      // Avoid leaving partially stored login information.
      localStorage.removeItem("workconnectAccessToken");
      localStorage.removeItem("workconnectRefreshToken");
      localStorage.removeItem("workconnectLoggedInUser");

      const status = error.response?.status;

      if (status === 401) {
        setErrors({
          general:
            "The login was not completed. Please try again. If this continues, check the Django authentication settings.",
        });
      } else if (error.response?.status === 404) {
        setErrors({
          general: "The current-user API endpoint was not found.",
        });
      } else {
        setErrors({
          general:
            error.response?.data?.detail ||
            error.message ||
            "Unable to connect to the server. Check that Django is running.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 shadow-sm">
            <BriefcaseBusiness className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your WorkConnect Kerala account
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-semibold text-green-700">
                ✓ Login successful
              </p>
              <p className="mt-1 text-xs text-green-600">
                Redirecting to your dashboard...
              </p>
            </div>
          )}

          {errors.general && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p role="alert" className="text-sm text-red-700">
                {errors.general}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-green-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to WorkConnect"}
            </button>
          </form>

          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="mt-1 inline-block text-sm font-semibold text-green-600 transition hover:text-green-700"
            >
              Create an account →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Find short-term work opportunities across Kerala
        </p>
      </div>
    </div>
  );
}

export default Login;
