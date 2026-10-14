
import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
  AlertCircle,
} from "lucide-react"
import api from "../api/axios"

const initialFormData = {
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
}

const districts = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad",
]

const categories = [
  { value: "Event", label: "Event Staff" },
  { value: "Catering", label: "Catering" },
  { value: "Parking", label: "Parking" },
  { value: "Cleaning", label: "Cleaning" },
  { value: "Loading", label: "Loading & Unloading" },
  { value: "Delivery", label: "Delivery" },
  { value: "Construction", label: "Construction" },
  { value: "Technical", label: "Technical" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Photography", label: "Photography" },
  { value: "Other", label: "Other" },
]

function PostJob() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }))

    setSuccess(false)
    setApiError("")
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required."
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required."
    }

    if (!formData.category) {
      newErrors.category = "Please select a category."
    }

    if (
      formData.category === "Other" &&
      !formData.otherCategory.trim()
    ) {
      newErrors.otherCategory = "Please enter the work category."
    }

    if (!formData.district) {
      newErrors.district = "Please select a district."
    }

    if (!formData.location.trim()) {
      newErrors.location = "Work location is required."
    }

    if (!formData.date) {
      newErrors.date = "Work date is required."
    } else if (formData.date < new Date().toLocaleDateString("en-CA")) {
      newErrors.date = "Please select today or a future date."
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required."
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required."
    } else if (
      formData.startTime &&
      formData.endTime <= formData.startTime
    ) {
      newErrors.endTime = "End time must be after start time."
    }

    if (
      formData.payment === "" ||
      Number(formData.payment) <= 0
    ) {
      newErrors.payment = "Enter a payment greater than zero."
    }

    if (
      formData.workersRequired === "" ||
      !Number.isInteger(Number(formData.workersRequired)) ||
      Number(formData.workersRequired) < 1
    ) {
      newErrors.workersRequired =
        "Enter at least one worker."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSuccess(false)
    setApiError("")

    if (!validateForm()) return

    const storedUser = localStorage.getItem(
      "workconnectLoggedInUser"
    )
    const accessToken = localStorage.getItem(
      "workconnectAccessToken"
    )

    if (!storedUser || !accessToken) {
      setApiError("Please log in again before posting a job.")
      return
    }

    let user

    try {
      user = JSON.parse(storedUser)
    } catch {
      setApiError("Your login session is invalid. Please log in again.")
      return
    }

    if (user.role !== "employer") {
      setApiError("Only employer accounts can post jobs.")
      return
    }

    setSubmitting(true)

    try {
      // Django currently supports these category choices.
      // A custom category entered under Other is saved as Other.
      const category = formData.category

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category,
        district: formData.district,
        location: formData.location.trim(),
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        payment: Number(formData.payment).toFixed(2),
        workers_required: Number(formData.workersRequired),
      }

      await api.post("jobs/", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Job is now saved in Django, not localStorage.
      setSuccess(true)
      setFormData(initialFormData)
      setErrors({})

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } catch (error) {
      const status = error.response?.status
      const data = error.response?.data

      if (status === 401) {
        setApiError("Your session has expired. Please log in again.")
      } else if (status === 403) {
        setApiError(
          data?.detail ||
            "Your account is not permitted to post jobs."
        )
      } else if (data && typeof data === "object") {
        const firstError = Object.entries(data).find(
          ([key, value]) =>
            key !== "detail" &&
            Array.isArray(value) &&
            value.length > 0
        )

        if (firstError) {
          const [field, messages] = firstError
          setApiError(
            `${field.replaceAll("_", " ")}: ${messages[0]}`
          )
        } else {
          setApiError(
            data.detail ||
              "Unable to post the job. Please check the details."
          )
        }
      } else {
        setApiError(
          "Unable to connect to the server. Make sure Django is running."
        )
      }
    } finally {
      setSubmitting(false)
    }
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

  const errorMessage = (field) =>
    errors[field] ? (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {errors[field]}
      </p>
    ) : null

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
            Create a temporary work opportunity and connect with
            workers across Kerala.
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 shrink-0 text-green-600" />

              <div className="flex-1">
                <p className="text-sm font-bold text-green-800">
                  Job posted successfully!
                </p>
                <p className="mt-1 text-xs leading-5 text-green-700">
                  Your job has been saved to the database and is
                  ready to appear in Find Work.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/find-jobs")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  View Find Work
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API error */}
        {apiError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{apiError}</p>
          </div>
        )}

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

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Basic information */}
            <h3 className="text-lg font-bold text-gray-900">
              Basic Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Tell workers what the opportunity is about.
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Teaching Assistant"
                className={inputClass("title")}
              />
              {errorMessage("title")}
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the work, responsibilities, and requirements..."
                rows={5}
                className={`${inputClass("description")} resize-none`}
              />
              {errorMessage("description")}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errorMessage("category")}

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
                      placeholder="e.g. Teaching, Gardening"
                      className={inputClass("otherCategory")}
                    />
                    {errorMessage("otherCategory")}
                    <p className="mt-1 text-xs text-gray-400">
                      Currently, Django saves custom categories as Other.
                    </p>
                  </div>
                )}
              </div>

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
                  <option value="">Select district</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errorMessage("district")}
              </div>
            </div>

            {/* Location */}
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

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Work Date
                </label>
                <input
                  type="date"
                  name="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={formData.date}
                  onChange={handleChange}
                  className={inputClass("date")}
                />
                {errorMessage("date")}
              </div>

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
                      className={`${inputClass("startTime")} pl-11`}
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
                      className={`${inputClass("endTime")} pl-11`}
                    />
                  </div>
                  {errorMessage("endTime")}
                </div>
              </div>
            </div>

            {/* Payment and workers */}
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
                    Set the payment and number of workers needed.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                      min="1"
                      step="0.01"
                      className={`${inputClass("payment")} pl-11`}
                    />
                  </div>
                  {errorMessage("payment")}
                </div>

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
                      step="1"
                      className={`${inputClass("workersRequired")} pl-11`}
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
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Posting Job..." : "Post Job"}
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
