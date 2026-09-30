import { Link } from "react-router-dom"
import {
    MapPin,
    CalendarDays,
    Clock,
    IndianRupee,
    FileText,
    CheckCircle,
    XCircle,
    Clock3,
    ArrowRight,
    BriefcaseBusiness,
} from "lucide-react"

function MyApplications() {

    // Sample jobs
    const sampleJobs = [
        {
            id: 1,
            title: "Parking Staff",
            location: "Kakkanad, Ernakulam",
            date: "2026-09-10",
            time: "12 PM - 5 PM",
            payment: "800",
            category: "Event",
        },
        {
            id: 2,
            title: "Catering Helper",
            location: "Edappally, Ernakulam",
            date: "2026-09-11",
            time: "9 AM - 3 PM",
            payment: "700",
            category: "Catering",
        },
        {
            id: 3,
            title: "Event Setup",
            location: "Aluva, Ernakulam",
            date: "2026-09-12",
            time: "8 AM - 2 PM",
            payment: "900",
            category: "Event",
        },
        {
            id: 4,
            title: "Cleaning Staff",
            location: "Thrissur",
            date: "2026-09-13",
            time: "10 AM - 4 PM",
            payment: "650",
            category: "Cleaning",
        },
    ]

    // Get employer-posted jobs
    const storedJobs = localStorage.getItem("workconnectJobs")

    const postedJobs = storedJobs
        ? JSON.parse(storedJobs)
        : []

    // Combine all jobs
    const jobs = [
        ...sampleJobs,
        ...postedJobs,
    ]

    // Get logged-in worker
    const storedUser = localStorage.getItem(
        "workconnectLoggedInUser"
    )

    const user = storedUser
        ? JSON.parse(storedUser)
        : null

    // Get applications
    const storedApplications = localStorage.getItem(
        "workconnectApplications"
    )

    const allApplications = storedApplications
        ? JSON.parse(storedApplications)
        : []

    // Show only this worker's applications
    const myApplications = user
        ? allApplications.filter(
            (application) =>
                application.workerEmail === user.email
        )
        : []

    // Status information
    const getStatusInfo = (status) => {

        if (status === "Accepted") {
            return {
                label: "Accepted",
                icon: CheckCircle,
                badge: "bg-green-50 text-green-700 border-green-100",
                panel: "bg-green-50/70 border-green-100",
                iconBox: "bg-green-100 text-green-600",
                text: "text-green-700",
                message: "Your application has been accepted.",
                subMessage:
                    "Please check the job details before attending the work.",
            }
        }

        if (status === "Rejected") {
            return {
                label: "Rejected",
                icon: XCircle,
                badge: "bg-red-50 text-red-700 border-red-100",
                panel: "bg-red-50/70 border-red-100",
                iconBox: "bg-red-100 text-red-600",
                text: "text-red-700",
                message: "Your application was not selected.",
                subMessage:
                    "You can continue exploring other opportunities.",
            }
        }

        if (status === "Completed") {
            return {
                label: "Completed",
                icon: CheckCircle,
                badge: "bg-blue-50 text-blue-700 border-blue-100",
                panel: "bg-blue-50/70 border-blue-100",
                iconBox: "bg-blue-100 text-blue-600",
                text: "text-blue-700",
                message: "Job completed successfully.",
                subMessage:
                    "This application has been marked as completed.",
            }
        }

        return {
            label: "Pending",
            icon: Clock3,
            badge: "bg-amber-50 text-amber-700 border-amber-100",
            panel: "bg-amber-50/70 border-amber-100",
            iconBox: "bg-amber-100 text-amber-600",
            text: "text-amber-700",
            message: "Your application is under review.",
            subMessage:
                "You will see an update when the employer responds.",
        }
    }

    return (
        <div className="min-h-[calc(100vh-73px)] bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* Header */}
                <div className="mb-8">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                <FileText className="h-3.5 w-3.5" />
                                Worker Dashboard
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                My Applications
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                                Track the jobs you have applied for and
                                monitor each application status.
                            </p>

                        </div>

                        {myApplications.length > 0 && (
                            <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                                    <FileText className="h-5 w-5 text-green-600" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">
                                        Total Applications
                                    </p>

                                    <p className="text-xl font-bold text-gray-900">
                                        {myApplications.length}
                                    </p>
                                </div>

                            </div>
                        )}

                    </div>

                </div>

                {/* Empty State */}
                {myApplications.length === 0 ? (

                    <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:py-20">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                            <BriefcaseBusiness className="h-8 w-8 text-green-600" />
                        </div>

                        <h2 className="mt-6 text-xl font-bold text-gray-900 sm:text-2xl">
                            No applications yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            You haven't applied for any jobs yet.
                            Explore available opportunities and submit
                            your first application.
                        </p>

                        <Link
                            to="/find-jobs"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                        >
                            Find Work
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                    </div>

                ) : (

                    <div className="grid gap-6 lg:grid-cols-2">

                        {myApplications.map((application) => {

                            // Find the related job
                            const job = jobs.find(
                                (job) =>
                                    String(job.id) ===
                                    String(application.jobId)
                            )

                            // If job no longer exists
                            if (!job) {
                                return null
                            }

                            const statusInfo =
                                getStatusInfo(application.status)

                            const StatusIcon =
                                statusInfo.icon

                            return (

                                <article
                                    key={application.id}
                                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                >

                                    {/* Top Accent */}
                                    <div className="h-1.5 bg-green-600" />

                                    <div className="p-6 sm:p-7">

                                        {/* Category + Status */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">

                                            <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                                {job.category}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusInfo.badge}`}
                                            >
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {statusInfo.label}
                                            </span>

                                        </div>

                                        {/* Job Title */}
                                        <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                                            {job.title}
                                        </h2>

                                        {/* Job Details */}
                                        <div className="mt-5 grid gap-3 sm:grid-cols-2">

                                            {/* Location */}
                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">

                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                                <div>
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                        Location
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-medium text-gray-700">
                                                        {job.location}
                                                        {job.district
                                                            ? `, ${job.district}`
                                                            : ""}
                                                    </p>
                                                </div>

                                            </div>

                                            {/* Date */}
                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">

                                                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                                <div>
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                        Date
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-medium text-gray-700">
                                                        {job.date}
                                                    </p>
                                                </div>

                                            </div>

                                            {/* Time */}
                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">

                                                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                                <div>
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                        Time
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-medium text-gray-700">
                                                        {job.time
                                                            ? job.time
                                                            : `${job.startTime} - ${job.endTime}`
                                                        }
                                                    </p>
                                                </div>

                                            </div>

                                            {/* Payment */}
                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">

                                                <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                                <div>
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                        Payment
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                                                        ₹{job.payment}
                                                    </p>
                                                </div>

                                            </div>

                                        </div>

                                        {/* Status Panel */}
                                        <div
                                            className={`mt-6 rounded-2xl border p-4 ${statusInfo.panel}`}
                                        >

                                            <div className="flex items-start gap-3">

                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${statusInfo.iconBox}`}
                                                >
                                                    <StatusIcon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">

                                                    <p
                                                        className={`text-sm font-semibold ${statusInfo.text}`}
                                                    >
                                                        {statusInfo.message}
                                                    </p>

                                                    <p
                                                        className={`mt-1 text-xs leading-5 ${statusInfo.text} opacity-80`}
                                                    >
                                                        {statusInfo.subMessage}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {/* Bottom */}
                                        <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                            <div>

                                                <p className="text-xs text-gray-400">
                                                    Application Status
                                                </p>

                                                <div className="mt-1 flex items-center gap-2">

                                                    <span
                                                        className={`h-2 w-2 rounded-full ${
                                                            application.status === "Accepted"
                                                                ? "bg-green-500"
                                                                : application.status === "Rejected"
                                                                    ? "bg-red-500"
                                                                    : application.status === "Completed"
                                                                        ? "bg-blue-500"
                                                                        : "bg-amber-500"
                                                        }`}
                                                    />

                                                    <p
                                                        className={`text-sm font-semibold ${statusInfo.text}`}
                                                    >
                                                        {statusInfo.label}
                                                    </p>

                                                </div>

                                            </div>

                                            <Link
                                                to={`/job/${job.id}`}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 sm:w-auto"
                                            >
                                                View Job
                                                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                            </Link>

                                        </div>

                                    </div>

                                </article>

                            )
                        })}

                    </div>

                )}

            </div>

        </div>
    )
}

export default MyApplications