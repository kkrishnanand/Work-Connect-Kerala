import { useState } from "react"
import {
    BriefcaseBusiness,
    MapPin,
    CalendarDays,
    Clock,
    IndianRupee,
    Users,
    FileText,
    CheckCircle,
    Send,
} from "lucide-react"

function PostJob() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        otherCategory: "",
        district: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        payment: "",
        workersRequired: "",
    })

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value,
        })

        setErrors({
            ...errors,
            [name]: "",
        })

        setSuccess(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const newErrors = {}

        // Validation

        if (formData.title.trim() === "") {
            newErrors.title = "Job title is required"
        }

        if (formData.description.trim() === "") {
            newErrors.description = "Description is required"
        }

        if (formData.category === "") {
            newErrors.category = "Please select a category"
        }

        if (
            formData.category === "Other" &&
            formData.otherCategory.trim() === ""
        ) {
            newErrors.otherCategory = "Please enter the work category"
        }

        if (formData.district === "") {
            newErrors.district = "Please select a district"
        }

        if (formData.location.trim() === "") {
            newErrors.location = "Work location is required"
        }

        if (formData.date === "") {
            newErrors.date = "Work date is required"
        }

        if (formData.startTime === "") {
            newErrors.startTime = "Start time is required"
        }

        if (formData.endTime === "") {
            newErrors.endTime = "End time is required"
        }

        if (formData.payment === "") {
            newErrors.payment = "Payment is required"
        }

        if (formData.workersRequired === "") {
            newErrors.workersRequired =
                "Number of workers is required"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        // Get existing jobs
        const storedJobs = localStorage.getItem(
            "workconnectJobs"
        )

        const existingJobs = storedJobs
            ? JSON.parse(storedJobs)
            : []

        // Get logged-in employer
        const storedUser = localStorage.getItem(
            "workconnectLoggedInUser"
        )

        const user = storedUser
            ? JSON.parse(storedUser)
            : null

        // Create new job
        const newJob = {
            id: Date.now(),

            ...formData,

            // Save custom category when "Other" is selected
            category:
                formData.category === "Other"
                    ? formData.otherCategory.trim()
                    : formData.category,

            employerEmail: user?.email || "",
        }

        // Save job
        const updatedJobs = [
            ...existingJobs,
            newJob,
        ]

        localStorage.setItem(
            "workconnectJobs",
            JSON.stringify(updatedJobs)
        )

        // Success
        setSuccess(true)

        // Reset form
        setFormData({
            title: "",
            description: "",
            category: "",
            otherCategory: "",
            district: "",
            location: "",
            date: "",
            startTime: "",
            endTime: "",
            payment: "",
            workersRequired: "",
        })

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const inputClass = (field) =>
        `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 ${
            errors[field]
                ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                : "border-gray-200 focus:border-green-500 focus:ring-green-50"
        }`

    const selectClass = (field) =>
        `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-4 ${
            errors[field]
                ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                : "border-gray-200 focus:border-green-500 focus:ring-green-50"
        }`

    const errorMessage = (field) => {
        if (!errors[field]) {
            return null
        }

        return (
            <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors[field]}
            </p>
        )
    }

    return (
        <div className="min-h-[calc(100vh-73px)] bg-gray-50">

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* Header */}
                <div className="mb-8">

                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                        Employer Dashboard
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Post a Job
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Create a temporary work opportunity and
                        connect with workers across Kerala.
                    </p>

                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">

                        <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>

                            <div>

                                <p className="text-sm font-bold text-green-800">
                                    Job posted successfully!
                                </p>

                                <p className="mt-1 text-xs leading-5 text-green-700">
                                    Your job is now available for workers.
                                </p>

                            </div>

                        </div>

                    </div>
                )}

                {/* Form */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-5 sm:px-8">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                <FileText className="h-5 w-5 text-green-600" />
                            </div>

                            <div>

                                <h2 className="text-base font-bold text-gray-900">
                                    Job Information
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Provide the details workers need to know.
                                </p>

                            </div>

                        </div>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 sm:p-8"
                    >

                        {/* Basic Information */}
                        <div>

                            <h3 className="text-lg font-bold text-gray-900">
                                Basic Information
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Tell workers what the opportunity is about.
                            </p>

                        </div>

                        {/* Job Title */}
                        <div className="mt-6">

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Job Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Parking Staff"
                                className={inputClass("title")}
                            />

                            {errorMessage("title")}

                        </div>

                        {/* Description */}
                        <div className="mt-5">

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the work, responsibilities, and any important requirements..."
                                rows="5"
                                className={`${inputClass(
                                    "description"
                                )} resize-none`}
                            />

                            {errorMessage("description")}

                        </div>

                        {/* Category + District */}
                        <div className="mt-5 grid gap-5 sm:grid-cols-2">

                            {/* Category */}
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={selectClass("category")}
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    <option value="Event">
                                        Event Staff
                                    </option>

                                    <option value="Catering">
                                        Catering
                                    </option>

                                    <option value="Parking">
                                        Parking
                                    </option>

                                    <option value="Cleaning">
                                        Cleaning
                                    </option>

                                    <option value="Loading">
                                        Loading & Unloading
                                    </option>

                                    <option value="Delivery">
                                        Delivery
                                    </option>

                                    <option value="Construction">
                                        Construction
                                    </option>

                                    <option value="Technical">
                                        Technical
                                    </option>

                                    <option value="Hospitality">
                                        Hospitality
                                    </option>

                                    <option value="Photography">
                                        Photography
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                                {errorMessage("category")}

                                {/* Other Category */}
                                {formData.category === "Other" && (
                                    <div className="mt-3">

                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Enter Work Category
                                        </label>

                                        <input
                                            type="text"
                                            name="otherCategory"
                                            value={formData.otherCategory}
                                            onChange={handleChange}
                                            placeholder="e.g. Security, Gardening, Decoration"
                                            className={inputClass(
                                                "otherCategory"
                                            )}
                                        />

                                        {errorMessage(
                                            "otherCategory"
                                        )}

                                    </div>
                                )}

                            </div>

                            {/* District */}
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    District
                                </label>

                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className={selectClass("district")}
                                >

                                    <option value="">
                                        Select district
                                    </option>

                                    <option value="Alappuzha">
                                        Alappuzha
                                    </option>

                                    <option value="Ernakulam">
                                        Ernakulam
                                    </option>

                                    <option value="Idukki">
                                        Idukki
                                    </option>

                                    <option value="Kannur">
                                        Kannur
                                    </option>

                                    <option value="Kasaragod">
                                        Kasaragod
                                    </option>

                                    <option value="Kollam">
                                        Kollam
                                    </option>

                                    <option value="Kottayam">
                                        Kottayam
                                    </option>

                                    <option value="Kozhikode">
                                        Kozhikode
                                    </option>

                                    <option value="Malappuram">
                                        Malappuram
                                    </option>

                                    <option value="Palakkad">
                                        Palakkad
                                    </option>

                                    <option value="Pathanamthitta">
                                        Pathanamthitta
                                    </option>

                                    <option value="Thiruvananthapuram">
                                        Thiruvananthapuram
                                    </option>

                                    <option value="Thrissur">
                                        Thrissur
                                    </option>

                                    <option value="Wayanad">
                                        Wayanad
                                    </option>

                                </select>

                                {errorMessage("district")}

                            </div>

                        </div>

                        {/* Location Section */}
                        <div className="mt-10 border-t border-gray-100 pt-8">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                    <MapPin className="h-5 w-5 text-green-600" />
                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-gray-900">
                                        Work Location
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Tell workers where the job will take place.
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6">

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Kakkanad, Kochi"
                                    className={inputClass("location")}
                                />

                                {errorMessage("location")}

                            </div>

                        </div>

                        {/* Schedule */}
                        <div className="mt-10 border-t border-gray-100 pt-8">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                    <CalendarDays className="h-5 w-5 text-green-600" />
                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-gray-900">
                                        Schedule
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Set the date and working hours.
                                    </p>

                                </div>

                            </div>

                            {/* Date */}
                            <div className="mt-6">

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Work Date
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={inputClass("date")}
                                />

                                {errorMessage("date")}

                            </div>

                            {/* Time */}
                            <div className="mt-5 grid gap-5 sm:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Start Time
                                    </label>

                                    <div className="relative">

                                        <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            className={`${inputClass(
                                                "startTime"
                                            )} pl-11`}
                                        />

                                    </div>

                                    {errorMessage("startTime")}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        End Time
                                    </label>

                                    <div className="relative">

                                        <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            className={`${inputClass(
                                                "endTime"
                                            )} pl-11`}
                                        />

                                    </div>

                                    {errorMessage("endTime")}

                                </div>

                            </div>

                        </div>

                        {/* Payment & Workers */}
                        <div className="mt-10 border-t border-gray-100 pt-8">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                    <IndianRupee className="h-5 w-5 text-green-600" />
                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-gray-900">
                                        Payment & Workers
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Set the daily payment and number of workers needed.
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">

                                {/* Payment */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Payment (₹)
                                    </label>

                                    <div className="relative">

                                        <IndianRupee className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="number"
                                            name="payment"
                                            value={formData.payment}
                                            onChange={handleChange}
                                            placeholder="e.g. 800"
                                            min="0"
                                            className={`${inputClass(
                                                "payment"
                                            )} pl-11`}
                                        />

                                    </div>

                                    {errorMessage("payment")}

                                </div>

                                {/* Workers */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Workers Required
                                    </label>

                                    <div className="relative">

                                        <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="number"
                                            name="workersRequired"
                                            value={formData.workersRequired}
                                            onChange={handleChange}
                                            placeholder="e.g. 5"
                                            min="1"
                                            className={`${inputClass(
                                                "workersRequired"
                                            )} pl-11`}
                                        />

                                    </div>

                                    {errorMessage("workersRequired")}

                                </div>

                            </div>

                        </div>

                        {/* Submit */}
                        <div className="mt-10 border-t border-gray-100 pt-8">

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-100"
                            >
                                <Send className="h-4 w-4" />
                                Post Job
                            </button>

                            <p className="mt-3 text-center text-xs text-gray-400">
                                Make sure all job details are accurate before posting.
                            </p>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    )
}

export default PostJob