import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    BriefcaseBusiness
} from "lucide-react"

function Login() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)


    const handleChange = (event) => {

        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value
        })

        setErrors({
            ...errors,
            [name]: ""
        })

        setSuccess(false)
    }


    const handleSubmit = (event) => {

        event.preventDefault()

        const newErrors = {}


        // Email validation

        if (formData.email.trim() === "") {

            newErrors.email = "Email is required"

        } else if (!formData.email.includes("@")) {

            newErrors.email = "Enter a valid email address"

        }


        // Password validation

        if (formData.password === "") {

            newErrors.password = "Password is required"

        } else if (formData.password.length < 6) {

            newErrors.password =
                "Password must be at least 6 characters"

        }


        setErrors(newErrors)


        // Stop if validation errors exist

        if (Object.keys(newErrors).length > 0) {
            return
        }


        // Get all registered users

        const storedUsers = localStorage.getItem(
            "workconnectUsers"
        )


        // No users registered

        if (!storedUsers) {

            setErrors({
                email: "No account found. Please register first."
            })

            return
        }


        // Convert stored data into array

        const users = JSON.parse(storedUsers)


        // Find matching user

        const user = users.find(
            (registeredUser) =>
                registeredUser.email.toLowerCase() ===
                    formData.email.toLowerCase() &&
                registeredUser.password ===
                    formData.password
        )


        // Invalid login

        if (!user) {

            setErrors({
                email: "Invalid email or password"
            })

            return
        }


        // Login successful

        localStorage.setItem(
            "workconnectLoggedInUser",
            JSON.stringify(user)
        )

        console.log("Logged in User:", user)

        setSuccess(true)


        // Redirect based on role

        if (user.role === "worker") {

            navigate("/worker-dashboard")

        } else if (user.role === "employer") {

            navigate("/employer-dashboard")

        }

    }


    return (

        <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-10 sm:px-6 sm:py-14">

            <div className="mx-auto max-w-md">


                {/* Logo / Intro */}

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


                {/* Login Card */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">


                    {/* Success Message */}

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


                    <form onSubmit={handleSubmit}>


                        {/* Email */}

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


                        {/* Password */}

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
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                        errors.password
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                                    }`}
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
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


                        {/* Login Button */}

                        <button
                            type="submit"
                            className="mt-7 w-full rounded-xl bg-green-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md active:scale-[0.99]"
                        >
                            Login to WorkConnect
                        </button>

                    </form>


                    {/* Register Section */}

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


                {/* Bottom Text */}

                <p className="mt-6 text-center text-xs text-gray-400">
                    Find short-term work opportunities across Kerala
                </p>

            </div>

        </div>

    )
}

export default Login