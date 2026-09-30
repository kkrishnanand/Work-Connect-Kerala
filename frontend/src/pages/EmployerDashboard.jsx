import { Link } from "react-router-dom"
import {
    BriefcaseBusiness,
    Users,
    CheckCircle,
    Plus,
    ArrowRight,
    MapPin,
    CalendarDays,
    Clock,
    IndianRupee,
    FileText,
} from "lucide-react"

function EmployerDashboard() {

    // Get logged-in employer
    const storedUser = localStorage.getItem(
        "workconnectLoggedInUser"
    )

    const user = storedUser
        ? JSON.parse(storedUser)
        : null

    // Get all posted jobs
    const storedJobs = localStorage.getItem(
        "workconnectJobs"
    )

    const allJobs = storedJobs
        ? JSON.parse(storedJobs)
        : []

    // Only jobs posted by this employer
    const myJobs = allJobs.filter(
        (job) =>
            job.employerEmail === user?.email
    )

    // Get all applications
    const storedApplications = localStorage.getItem(
        "workconnectApplications"
    )

    const allApplications = storedApplications
        ? JSON.parse(storedApplications)
        : []

    // Applications for this employer's jobs
    const myJobIds = myJobs.map(
        (job) => String(job.id)
    )

    const myApplications = allApplications.filter(
        (application) =>
            myJobIds.includes(
                String(application.jobId)
            )
    )

    // Statistics
    const activeJobs = myJobs.filter(
        (job) =>
            job.status !== "completed"
    ).length

    const completedJobs = myJobs.filter(
        (job) =>
            job.status === "completed"
    ).length

    const applicantsCount =
        myApplications.length

    return (
        <div className="min-h-[calc(100vh-73px)] bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* Welcome Section */}
                <div className="mb-8 overflow-hidden rounded-3xl bg-green-600 shadow-sm">

                    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-green-50">
                                <BriefcaseBusiness className="h-3.5 w-3.5" />
                                Employer Dashboard
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Welcome back, {user?.name} 👋
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-green-50 sm:text-base">
                                Manage your jobs, review applicants,
                                and find the right workers for your
                                opportunities.
                            </p>

                        </div>

                        <Link
                            to="/post-job"
                            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
                        >
                            <Plus className="h-4 w-4" />
                            Post a Job
                        </Link>

                    </div>

                </div>

                {/* Statistics */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Active Jobs */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Active Jobs
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {activeJobs}
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                                <BriefcaseBusiness className="h-6 w-6 text-green-600" />
                            </div>

                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            Jobs currently available to workers
                        </p>

                    </div>

                    {/* Applicants */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Applicants
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {applicantsCount}
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>

                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            Workers who applied for your jobs
                        </p>

                    </div>

                    {/* Completed Jobs */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Completed Jobs
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {completedJobs}
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                                <CheckCircle className="h-6 w-6 text-purple-600" />
                            </div>

                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            Jobs successfully completed
                        </p>

                    </div>

                </div>

                {/* Quick Actions */}
                <section className="mt-10">

                    <div className="mb-5">

                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your jobs quickly.
                        </p>

                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                        {/* Post Job */}
                        <Link
                            to="/post-job"
                            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                                    <Plus className="h-6 w-6 text-green-600" />
                                </div>

                                <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600" />

                            </div>

                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                Post a Job
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Create a new temporary or daily work
                                opportunity for workers across Kerala.
                            </p>

                        </Link>

                        {/* My Jobs */}
                        <Link
                            to="/my-jobs"
                            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                                    <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
                                </div>

                                <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />

                            </div>

                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                My Jobs
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                View your posted jobs, manage applicants,
                                and monitor your work opportunities.
                            </p>

                        </Link>

                    </div>

                </section>

                {/* Recent Jobs */}
                <section className="mt-10">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Recent Jobs
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your latest posted work opportunities.
                            </p>

                        </div>

                        {myJobs.length > 0 && (
                            <Link
                                to="/my-jobs"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 transition hover:text-green-700"
                            >
                                View all
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}

                    </div>

                    {myJobs.length === 0 ? (

                        /* Empty State */
                        <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                <BriefcaseBusiness className="h-8 w-8 text-gray-400" />
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-gray-900">
                                No jobs posted yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Create your first job posting and
                                start finding workers.
                            </p>

                            <Link
                                to="/post-job"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4" />
                                Post a Job
                            </Link>

                        </div>

                    ) : (

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {myJobs.slice(0, 3).map((job) => {

                                const jobApplicants =
                                    myApplications.filter(
                                        (application) =>
                                            String(application.jobId) ===
                                            String(job.id)
                                    ).length

                                const isCompleted =
                                    job.status === "completed"

                                return (

                                    <article
                                        key={job.id}
                                        className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                    >

                                        {/* Top Accent */}
                                        <div
                                            className={`h-1.5 ${
                                                isCompleted
                                                    ? "bg-blue-500"
                                                    : "bg-green-600"
                                            }`}
                                        />

                                        <div className="p-6">

                                            {/* Category + Status */}
                                            <div className="flex flex-wrap items-center justify-between gap-3">

                                                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                                    {job.category}
                                                </span>

                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                        isCompleted
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "bg-green-50 text-green-700"
                                                    }`}
                                                >
                                                    {isCompleted
                                                        ? "Completed"
                                                        : "Active"
                                                    }
                                                </span>

                                            </div>

                                            {/* Title */}
                                            <h3 className="mt-5 text-xl font-bold tracking-tight text-gray-900">
                                                {job.title}
                                            </h3>

                                            {/* Job Details */}
                                            <div className="mt-5 space-y-3">

                                                {/* Location */}
                                                <div className="flex items-start gap-3 text-sm text-gray-500">

                                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                                    <span>
                                                        {job.location}
                                                        {job.district
                                                            ? `, ${job.district}`
                                                            : ""
                                                        }
                                                    </span>

                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-3 text-sm text-gray-500">

                                                    <CalendarDays className="h-4 w-4 shrink-0 text-green-600" />

                                                    <span>
                                                        {job.date}
                                                    </span>

                                                </div>

                                                {/* Time */}
                                                <div className="flex items-center gap-3 text-sm text-gray-500">

                                                    <Clock className="h-4 w-4 shrink-0 text-green-600" />

                                                    <span>
                                                        {job.time
                                                            ? job.time
                                                            : `${job.startTime} - ${job.endTime}`
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Payment + Applicants */}
                                            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                                                <div>

                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                        Payment
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-1">

                                                        <IndianRupee className="h-5 w-5 text-green-600" />

                                                        <span className="text-lg font-bold text-gray-900">
                                                            {job.payment}
                                                        </span>

                                                    </div>

                                                </div>

                                                <div className="text-right">

                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                        Applicants
                                                    </p>

                                                    <div className="mt-1 flex items-center justify-end gap-1.5">

                                                        <FileText className="h-4 w-4 text-blue-600" />

                                                        <span className="text-sm font-semibold text-gray-700">
                                                            {jobApplicants}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* Actions */}
                                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                                                <Link
                                                    to={`/job/${job.id}`}
                                                    className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                                                >
                                                    View Job
                                                </Link>

                                                <Link
                                                    to={`/applicants/${job.id}`}
                                                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                                >
                                                    Applicants
                                                </Link>

                                            </div>

                                        </div>

                                    </article>

                                )
                            })}

                        </div>

                    )}

                </section>

            </div>

        </div>
    )
}

export default EmployerDashboard