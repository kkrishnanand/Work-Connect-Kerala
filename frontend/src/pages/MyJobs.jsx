import { useState } from "react"
import { Link } from "react-router-dom"
import {
    MapPin,
    CalendarDays,
    Clock,
    Users,
    IndianRupee,
    BriefcaseBusiness,
    Plus,
    Trash2,
    ArrowRight
} from "lucide-react"

function MyJobs() {

    // Get logged-in employer
    const storedUser = localStorage.getItem(
        "workconnectLoggedInUser"
    )

    const user = storedUser
        ? JSON.parse(storedUser)
        : null


    // Get jobs belonging to this employer
    const [jobs, setJobs] = useState(() => {

        const storedJobs = localStorage.getItem(
            "workconnectJobs"
        )

        const allJobs = storedJobs
            ? JSON.parse(storedJobs)
            : []

        return allJobs.filter(
            (job) =>
                job.employerEmail === user?.email
        )
    })


    // Delete Job
    const handleDeleteJob = (jobId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        )

        if (!confirmDelete) {
            return
        }


        // Remove from current employer's jobs
        const updatedJobs = jobs.filter(
            (job) =>
                String(job.id) !== String(jobId)
        )

        setJobs(updatedJobs)


        // Get all jobs
        const storedJobs = localStorage.getItem(
            "workconnectJobs"
        )

        const allJobs = storedJobs
            ? JSON.parse(storedJobs)
            : []


        // Remove selected job only
        const updatedAllJobs = allJobs.filter(
            (job) =>
                String(job.id) !== String(jobId)
        )

        localStorage.setItem(
            "workconnectJobs",
            JSON.stringify(updatedAllJobs)
        )


        // Remove applications belonging to this job
        const storedApplications = localStorage.getItem(
            "workconnectApplications"
        )

        const applications = storedApplications
            ? JSON.parse(storedApplications)
            : []


        const updatedApplications = applications.filter(
            (application) =>
                String(application.jobId) !== String(jobId)
        )

        localStorage.setItem(
            "workconnectApplications",
            JSON.stringify(updatedApplications)
        )
    }


    return (

        <div className="min-h-[calc(100vh-73px)] bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            <BriefcaseBusiness className="h-3.5 w-3.5" />
                            Employer Dashboard
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            My Jobs
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                            Manage the work opportunities you have posted
                            and review the workers who applied.
                        </p>

                    </div>


                    {/* Post Job */}
                    <Link
                        to="/post-job"
                        className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4" />
                        Post a Job
                    </Link>

                </div>


                {/* Job Count */}
                {jobs.length > 0 && (

                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                            <BriefcaseBusiness className="h-5 w-5 text-green-600" />
                        </div>

                        <div>

                            <p className="text-xs font-medium text-gray-500">
                                Total Posted Jobs
                            </p>

                            <p className="text-xl font-bold text-gray-900">
                                {jobs.length}
                            </p>

                        </div>

                    </div>

                )}


                {/* Empty State */}
                {jobs.length === 0 ? (

                    <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:py-20">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                            <BriefcaseBusiness className="h-8 w-8 text-green-600" />
                        </div>

                        <h2 className="mt-6 text-xl font-bold text-gray-900 sm:text-2xl">
                            No jobs posted yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Create your first job opportunity and start
                            finding workers across Kerala.
                        </p>

                        <Link
                            to="/post-job"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4" />
                            Post a Job
                        </Link>

                    </div>

                ) : (

                    /* Jobs */
                    <div className="grid gap-6 lg:grid-cols-2">

                        {jobs.map((job) => {

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


                                    <div className="p-6 sm:p-7">

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
                                        <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                                            {job.title}
                                        </h2>


                                        {/* Job Information */}
                                        <div className="mt-6 grid gap-3 sm:grid-cols-2">

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
                                                            : ""
                                                        }
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


                                            {/* Workers */}
                                            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">

                                                <Users className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                                <div>

                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                        Workers
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-medium text-gray-700">
                                                        {job.workersRequired} required
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* Payment */}
                                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                                            <div>

                                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                    Payment
                                                </p>

                                                <div className="mt-1 flex items-center gap-1">

                                                    <IndianRupee className="h-5 w-5 text-green-600" />

                                                    <span className="text-xl font-bold text-gray-900">
                                                        {job.payment}
                                                    </span>

                                                    <span className="text-sm text-gray-500">
                                                        / day
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="text-right">

                                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                    Workers
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-700">
                                                    {job.workersRequired}
                                                </p>

                                            </div>

                                        </div>


                                        {/* Actions */}
                                        <div className="mt-6 grid gap-3 sm:grid-cols-3">

                                            <Link
                                                to={`/job/${job.id}`}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                                            >
                                                View Job
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>


                                            <Link
                                                to={`/applicants/${job.id}`}
                                                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                            >
                                                Applicants
                                            </Link>


                                            <button
                                                onClick={() =>
                                                    handleDeleteJob(job.id)
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>

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

export default MyJobs