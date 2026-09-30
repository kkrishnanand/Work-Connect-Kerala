import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    BriefcaseBusiness
} from "lucide-react"

function Register() {

    const [role, setRole] = useState("worker")
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })


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


        // Name

        if (formData.name.trim() === "") {
            newErrors.name = "Full name is required"
        }


        // Email

        if (formData.email.trim() === "") {

            newErrors.email = "Email is required"

        } else if (!formData.email.includes("@")) {

            newErrors.email = "Enter a valid email address"

        }


        // Phone

        if (formData.phone.trim() === "") {

            newErrors.phone = "Phone number is required"

        } else if (!/^\d{10}$/.test(formData.phone)) {

            newErrors.phone = "Enter a valid 10-digit phone number"

        }


        // Password

        if (formData.password === "") {

            newErrors.password = "Password is required"

        } else if (formData.password.length < 6) {

            newErrors.password =
                "Password must be at least 6 characters"

        }


        // Confirm Password

        if (formData.confirmPassword === "") {

            newErrors.confirmPassword =
                "Please confirm your password"

        } else if (
            formData.password !== formData.confirmPassword
        ) {

            newErrors.confirmPassword =
                "Passwords do not match"

        }


        setErrors(newErrors)


        if (Object.keys(newErrors).length > 0) {
            return
        }


        // Get existing users

        const storedUsers = localStorage.getItem(
            "workconnectUsers"
        )

        const existingUsers = storedUsers
            ? JSON.parse(storedUsers)
            : []


        // Check duplicate email

        const emailExists = existingUsers.some(
            (existingUser) =>
                existingUser.email.toLowerCase() ===
                formData.email.toLowerCase()
        )


        if (emailExists) {

            setErrors({
                email: "An account with this email already exists"
            })

            return
        }


        // Create new user

        const newUser = {

            id: Date.now(),

            name: formData.name,

            email: formData.email,

            phone: formData.phone,

            password: formData.password,

            role: role

        }


        // Add user to existing users

        const updatedUsers = [
            ...existingUsers,
            newUser
        ]


        // Save all users

        localStorage.setItem(
            "workconnectUsers",
            JSON.stringify(updatedUsers)
        )


        console.log("Registered User:", newUser)

        setSuccess(true)


        // Clear form

        setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
        })

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
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Join WorkConnect Kerala and connect with opportunities
                    </p>

                </div>


                {/* Registration Card */}

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">


                    {/* Success */}

                    {success && (

                        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                            <p className="text-sm font-semibold text-green-700">
                                ✓ Account created successfully
                            </p>

                            <p className="mt-1 text-xs text-green-600">
                                You can now login to your account.
                            </p>

                            <Link
                                to="/login"
                                className="mt-2 inline-block text-xs font-semibold text-green-700 hover:text-green-800"
                            >
                                Go to Login →
                            </Link>

                        </div>

                    )}


                    <form onSubmit={handleSubmit}>


                        {/* Role */}

                        <div>

                            <label className="mb-3 block text-sm font-semibold text-gray-700">
                                I want to
                            </label>

                            <div className="grid grid-cols-2 gap-3">

                                {/* Worker */}

                                <button
                                    type="button"
                                    onClick={() => setRole("worker")}
                                    className={`rounded-xl border px-4 py-4 text-sm font-semibold transition ${
                                        role === "worker"
                                            ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50/50"
                                    }`}
                                >
                                    <User className="mx-auto mb-1 h-5 w-5" />

                                    Find Work

                                    <span className="mt-1 block text-xs font-normal text-gray-400">
                                        Looking for jobs
                                    </span>
                                </button>


                                {/* Employer */}

                                <button
                                    type="button"
                                    onClick={() => setRole("employer")}
                                    className={`rounded-xl border px-4 py-4 text-sm font-semibold transition ${
                                        role === "employer"
                                            ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50/50"
                                    }`}
                                >
                                    <BriefcaseBusiness className="mx-auto mb-1 h-5 w-5" />

                                    Hire Workers

                                    <span className="mt-1 block text-xs font-normal text-gray-400">
                                        Post work opportunities
                                    </span>
                                </button>

                            </div>

                        </div>


                        {/* Full Name */}

                        <div className="mt-5">

                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Full Name
                            </label>

                            <div className="relative">

                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                        errors.name
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                                    }`}
                                />

                            </div>

                            {errors.name && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.name}
                                </p>
                            )}

                        </div>


                        {/* Email */}

                        <div className="mt-5">

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
                                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
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


                        {/* Phone */}

                        <div className="mt-5">

                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Phone Number
                            </label>

                            <div className="relative">

                                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit phone number"
                                    maxLength="10"
                                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                        errors.phone
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                                    }`}
                                />

                            </div>

                            {errors.phone && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.phone}
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
                                    placeholder="Create a password"
                                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
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


                        {/* Confirm Password */}

                        <div className="mt-5">

                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                        errors.confirmPassword
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}

                                </button>

                            </div>

                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-xs font-medium text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            className="mt-7 w-full rounded-xl bg-green-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md active:scale-[0.99]"
                        >
                            Create WorkConnect Account
                        </button>

                    </form>


                    {/* Login Link */}

                    <div className="mt-7 border-t border-gray-100 pt-6 text-center">

                        <p className="text-sm text-gray-500">
                            Already have an account?
                        </p>

                        <Link
                            to="/login"
                            className="mt-1 inline-block text-sm font-semibold text-green-600 transition hover:text-green-700"
                        >
                            Login to your account →
                        </Link>

                    </div>

                </div>


                {/* Bottom Text */}

                <p className="mt-6 text-center text-xs text-gray-400">
                    Connect with short-term work opportunities across Kerala
                </p>

            </div>

        </div>

    )
}

export default Register