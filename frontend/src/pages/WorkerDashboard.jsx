import { Link } from "react-router-dom"
import {
    BriefcaseBusiness,
    CheckCircle,
    Clock3,
    Search,
    FileText,
    MapPin,
    CalendarDays,
    Clock,
    IndianRupee,
    ArrowRight
} from "lucide-react"

function WorkerDashboard() {

    // Get logged-in worker

    const storedUser = localStorage.getItem(
        "workconnectLoggedInUser"
    )

    const user = storedUser
        ? JSON.parse(storedUser)
        : null


    // Get all applications

    const storedApplications = localStorage.getItem(
        "workconnectApplications"
    )

    const allApplications = storedApplications
        ? JSON.parse(storedApplications)
        : []


    // Get this worker's applications

    const myApplications = user
        ? allApplications.filter(
            (application) =>
                application.workerEmail === user.email
        )
        : []


    // Calculate statistics

    const appliedJobs = myApplications.length

    const acceptedJobs = myApplications.filter(
        (application) =>
            application.status === "Accepted"
    ).length

    const completedJobs = myApplications.filter(
        (application) =>
            application.status === "Completed"
    ).length


    // Get all posted jobs

    const storedJobs = localStorage.getItem(
        "workconnectJobs"
    )

    const allJobs = storedJobs
        ? JSON.parse(storedJobs)
        : []


    // Get IDs of jobs already applied for

    const appliedJobIds = myApplications.map(
        (application) =>
            String(application.jobId)
    )


    // Recommended jobs

    const recommendedJobs = allJobs
        .filter(
            (job) =>
                !appliedJobIds.includes(
                    String(job.id)
                )
        )
        .slice(0, 3)


    return (

        <div className="min-h-[calc(100vh-73px)] bg-gray-50">

            <div className="mx-auto max-w-7xl px-6 py-10">


                {/* Welcome Section */}

                <div className="mb-8 rounded-3xl bg-green-600 p-8 text-white shadow-sm">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm font-medium text-green-100">
                                Worker Dashboard
                            </p>

                            <h1 className="mt-2 text-3xl font-bold">
                                Welcome back, {user?.name} 👋
                            </h1>

                            <p className="mt-2 max-w-xl text-sm text-green-100 sm:text-base">
                                Find temporary work opportunities,
                                manage your applications, and track your progress.
                            </p>

                        </div>


                        <Link
                            to="/find-jobs"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                        >
                            <Search className="h-4 w-4" />

                            Find Work

                        </Link>

                    </div>

                </div>


                {/* Statistics */}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


                    {/* Applied Jobs */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Applied Jobs
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {appliedJobs}
                                </p>

                            </div>


                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                                <FileText className="h-6 w-6 text-blue-600" />

                            </div>

                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            Total jobs you have applied for
                        </p>

                    </div>


                    {/* Accepted Jobs */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Accepted Jobs
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {acceptedJobs}
                                </p>

                            </div>


                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">

                                <CheckCircle className="h-6 w-6 text-green-600" />

                            </div>

                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            Applications accepted by employers
                        </p>

                    </div>


                    {/* Completed Jobs */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

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

                                <BriefcaseBusiness className="h-6 w-6 text-purple-600" />

                            </div>

                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                            Jobs you have successfully completed
                        </p>

                    </div>

                </div>


                {/* Quick Actions */}

                <section className="mt-10">

                    <div className="mb-5">

                        <h2 className="text-2xl font-bold text-gray-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Quickly access the things you use most.
                        </p>

                    </div>


                    <div className="grid gap-5 sm:grid-cols-2">


                        {/* Find Work */}

                        <Link
                            to="/find-jobs"
                            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">

                                    <Search className="h-6 w-6 text-green-600" />

                                </div>


                                <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600" />

                            </div>


                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                Find Work
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Search for temporary and daily work
                                opportunities across Kerala.
                            </p>

                        </Link>


                        {/* My Applications */}

                        <Link
                            to="/my-applications"
                            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                                    <FileText className="h-6 w-6 text-blue-600" />

                                </div>


                                <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />

                            </div>


                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                My Applications
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Track your applications and check
                                whether employers have accepted them.
                            </p>

                        </Link>

                    </div>

                </section>


                {/* Recommended Jobs */}

                <section className="mt-10">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                Recommended Jobs
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Work opportunities you haven't applied for yet.
                            </p>

                        </div>


                        {recommendedJobs.length > 0 && (

                            <Link
                                to="/find-jobs"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
                            >
                                View all
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                        )}

                    </div>


                    {recommendedJobs.length === 0 ? (

                        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

                                <BriefcaseBusiness className="h-7 w-7 text-gray-400" />

                            </div>


                            <h3 className="mt-4 text-lg font-bold text-gray-900">
                                No recommended jobs
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Check back later for new work opportunities.
                            </p>


                            <Link
                                to="/find-jobs"
                                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                            >
                                <Search className="h-4 w-4" />
                                Find Work
                            </Link>

                        </div>

                    ) : (

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {recommendedJobs.map((job) => (

                                <div
                                    key={job.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >

                                    {/* Category */}

                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                        {job.category}
                                    </span>


                                    {/* Title */}

                                    <h3 className="mt-4 text-lg font-bold text-gray-900">
                                        {job.title}
                                    </h3>


                                    {/* Location */}

                                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">

                                        <MapPin className="h-4 w-4 text-green-600" />

                                        <span>
                                            {job.location}, {job.district}
                                        </span>

                                    </div>


                                    {/* Date */}

                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">

                                        <CalendarDays className="h-4 w-4 text-green-600" />

                                        <span>
                                            {job.date}
                                        </span>

                                    </div>


                                    {/* Time */}

                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">

                                        <Clock3 className="h-4 w-4 text-green-600" />

                                        <span>
                                            {job.startTime} - {job.endTime}
                                        </span>

                                    </div>


                                    {/* Payment */}

                                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">

                                        <div className="flex items-center gap-1">

                                            <IndianRupee className="h-5 w-5 text-green-600" />

                                            <span className="text-lg font-bold text-gray-900">
                                                {job.payment}
                                            </span>

                                        </div>


                                        <span className="text-xs text-gray-500">
                                            {job.workersRequired} workers
                                        </span>

                                    </div>


                                    {/* View Job */}

                                    <Link
                                        to={`/job/${job.id}`}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                                    >
                                        View Job
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


            </div>

        </div>
    )
}

export default WorkerDashboard