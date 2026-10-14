
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  MapPin,
  CalendarDays,
  Clock,
  IndianRupee,
  Users,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle,
  UserPlus,
  AlertCircle,
} from "lucide-react"
import api from "../api/axios"

function formatTime(value) {
  if (!value) return "Not specified"

  const [hours, minutes] = value.split(":")
  const date = new Date()

  date.setHours(Number(hours), Number(minutes), 0, 0)

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDate(value) {
  if (!value) return "Not specified"

  const date = new Date(`${value}T00:00:00`)

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function JobDetails() {
  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [checkingApplication, setCheckingApplication] = useState(false)
  const [applyError, setApplyError] = useState("")
  const [applySuccess, setApplySuccess] = useState("")

  // Read the current user's role.
  const storedUser = localStorage.getItem("workconnectLoggedInUser")

  let currentUser = null

  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null
  } catch {
    currentUser = null
  }

  const accessToken = localStorage.getItem("workconnectAccessToken")
  const isWorker = currentUser?.role === "worker"
  const isEmployer = currentUser?.role === "employer"

  const isJobOwner =
    isEmployer &&
    currentUser?.id != null &&
    job?.employer != null &&
    String(job.employer) === String(currentUser.id)

  // Fetch job details from Django.
  useEffect(() => {
    let isMounted = true

    async function fetchJob() {
      setLoading(true)
      setError("")
      setJob(null)
      setApplied(false)
      setApplyError("")
      setApplySuccess("")

      try {
        const response = await api.get(`jobs/${id}/`)

        if (isMounted) {
          setJob({
            ...response.data,
            workersRequired: response.data.workers_required,
            startTime: response.data.start_time,
            endTime: response.data.end_time,
            time: `${formatTime(response.data.start_time)} - ${formatTime(
              response.data.end_time
            )}`,
          })
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.status === 404
              ? "The job you are looking for does not exist or is no longer available."
              : err.response?.data?.detail ||
                  "Unable to load job details. Please try again."
          )
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchJob()

    return () => {
      isMounted = false
    }
  }, [id])

  // Check whether the logged-in worker has already applied.
  useEffect(() => {
    let isMounted = true

    async function checkApplication() {
      const savedUser = localStorage.getItem("workconnectLoggedInUser")
      const token = localStorage.getItem("workconnectAccessToken")

      if (!savedUser || !token) {
        if (isMounted) {
          setApplied(false)
          setCheckingApplication(false)
        }
        return
      }

      let user

      try {
        user = JSON.parse(savedUser)
      } catch {
        return
      }

      if (user.role !== "worker") {
        setApplied(false)
        setCheckingApplication(false)
        return
      }

      setCheckingApplication(true)

      try {
        const response = await api.get("applications/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const applications = Array.isArray(response.data)
          ? response.data
          : response.data.results ?? []

        const alreadyApplied = applications.some(
          (application) => String(application.job) === String(id)
        )

        if (isMounted) setApplied(alreadyApplied)
      } catch {
        if (isMounted) {
          setApplied(false)
        }
      } finally {
        if (isMounted) setCheckingApplication(false)
      }
    }

    checkApplication()

    return () => {
      isMounted = false
    }
  }, [id])

  // Submit an application to Django.
  const handleApply = async () => {
    const savedUser = localStorage.getItem("workconnectLoggedInUser")
    const token = localStorage.getItem("workconnectAccessToken")

    if (!savedUser || !token) {
      setApplyError("Please log in with your worker account to apply.")
      return
    }

    let user

    try {
      user = JSON.parse(savedUser)
    } catch {
      setApplyError("Your login session is invalid. Please log in again.")
      return
    }

    if (user.role !== "worker") {
      setApplyError("Only worker accounts can apply for jobs.")
      return
    }

    if (applying || applied || !job) return

    setApplying(true)
    setApplyError("")
    setApplySuccess("")

    try {
      await api.post(
        "applications/",
        { job: job.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setApplied(true)
      setApplySuccess("Your application has been submitted successfully!")
    } catch (err) {
      const status = err.response?.status
      const data = err.response?.data

      if (status === 401) {
        setApplyError("Your session has expired. Please log in again.")
      } else if (status === 400) {
        const message =
          data?.job?.[0] ||
          data?.detail ||
          "You may have already applied for this job."

        setApplyError(
          typeof message === "string"
            ? message
            : "Unable to submit your application."
        )

        if (String(message).toLowerCase().includes("already applied")) {
          setApplied(true)
        }
      } else if (status === 403) {
        setApplyError(
          data?.detail || "You are not allowed to apply for this job."
        )
      } else {
        setApplyError(
          data?.detail ||
            "Unable to submit your application. Please try again."
        )
      }
    } finally {
      setApplying(false)
    }
  }

  // Loading screen.
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading job details...
          </p>
        </div>
      </div>
    )
  }

  // Error screen.
  if (error || !job) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <BriefcaseBusiness className="h-8 w-8 text-gray-400" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            {error.includes("does not exist")
              ? "Job not found"
              : "Unable to load job"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            {error || "The job could not be found."}
          </p>

          <Link
            to={isEmployer ? "/my-jobs" : "/find-jobs"}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEmployer ? "Back to My Jobs" : "Back to jobs"}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to={isEmployer ? "/my-jobs" : "/find-jobs"}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-green-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {isEmployer ? "Back to My Jobs" : "Back to jobs"}
        </Link>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Job header */}
          <div className="border-b border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  {job.category}
                </span>

                <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  {job.title}
                </h1>

                <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <span>
                    {job.location}
                    {job.district ? `, ${job.district}` : ""}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-green-100 bg-green-50 px-6 py-5 lg:min-w-[190px]">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Daily payment
                </p>

                <div className="mt-1 flex items-center text-3xl font-extrabold text-green-700">
                  <IndianRupee className="h-6 w-6" />
                  {Number(job.payment).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  For the complete work period
                </p>
              </div>
            </div>
          </div>

          {/* Job information */}
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <CalendarDays className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">Work date</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {formatDate(job.date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">
                    Working hours
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {job.time}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Workers required
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {job.workersRequired ?? "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <BriefcaseBusiness className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Work category
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {job.category}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 px-6 py-8 sm:px-8">
            <h2 className="text-xl font-bold text-gray-900">
              About this work
            </h2>
            <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
              {job.description}
            </p>
          </div>

          {/* Location */}
          <div className="border-t border-gray-100 px-6 py-8 sm:px-8">
            <h2 className="text-xl font-bold text-gray-900">Work location</h2>

            <div className="mt-4 flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {job.location}
                </p>
                {job.district && (
                  <p className="mt-1 text-sm text-gray-500">
                    {job.district} district
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Worker actions */}
          {isWorker && (
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Interested in this job?
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Apply now and wait for the employer's response.
                  </p>

                  {applyError && (
                    <p role="alert" className="mt-3 text-sm font-medium text-red-600">
                      {applyError}
                    </p>
                  )}

                  {applySuccess && (
                    <p role="status" className="mt-3 text-sm font-medium text-green-700">
                      {applySuccess}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applied || applying || checkingApplication}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-sm transition ${
                    applied
                      ? "cursor-not-allowed border border-green-200 bg-green-50 text-green-700"
                      : "bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  }`}
                >
                  {applied ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Application submitted
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      {checkingApplication
                        ? "Checking..."
                        : applying
                          ? "Submitting..."
                          : "Apply for this job"}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Employer viewing own job */}
          {isJobOwner && (
            <div className="border-t border-green-100 bg-green-50 px-6 py-6 sm:px-8">
              <h3 className="font-bold text-green-800">You posted this job</h3>
              <p className="mt-1 text-sm text-green-700">
                Manage applications and review workers from your employer dashboard.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/my-jobs"
                  className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  My Jobs
                </Link>

                <Link
                  to={`/applicants/${job.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <Users className="h-4 w-4" />
                  View Applicants
                </Link>
              </div>
            </div>
          )}

          {/* Employer viewing someone else's job */}
          {isEmployer && !isJobOwner && (
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 sm:px-8">
              <p className="text-sm text-gray-600">
                You are viewing another employer's job. You cannot apply as a worker using this account.
              </p>
            </div>
          )}

          {/* Logged-out visitor */}
          {!currentUser && (
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Interested in this job?
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Log in with a worker account to apply.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Log in to apply
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default JobDetails
