import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
    Users,
    MapPin,
    CalendarDays,
    Clock,
    IndianRupee,
    CheckCircle,
    XCircle,
    Clock3,
    ArrowLeft,
    BriefcaseBusiness
} from "lucide-react"

function Applicants() {

    const { jobId } = useParams()

    const [applications, setApplications] = useState(() => {

        const storedApplications = localStorage.getItem(
            "workconnectApplications"
        )

        return storedApplications
            ? JSON.parse(storedApplications)
            : []
    })


    // Get posted jobs
    const storedJobs = localStorage.getItem(
        "workconnectJobs"
    )

    const jobs = storedJobs
        ? JSON.parse(storedJobs)
        : []


    // Find selected job
    const job = jobs.find(
        (job) =>
            String(job.id) === String(jobId)
    )


    // Find applications for this job
    const jobApplications = applications.filter(
        (application) =>
            String(application.jobId) === String(jobId)
    )


    // Update application status
    const updateApplicationStatus = (
        applicationId,
        newStatus
    ) => {

        const updatedApplications = applications.map(
            (application) => {

                if (
                    application.id === applicationId
                ) {

                    return {
                        ...application,
                        status: newStatus
                    }

                }

                return application
            }
        )


        setApplications(updatedApplications)

        localStorage.setItem(
            "workconnectApplications",
            JSON.stringify(updatedApplications)
        )

    }


    // Status information
    const getStatusInfo = (status) => {

        if (status === "Accepted") {
            return {
                icon: CheckCircle,
                label: "Accepted",
                badge: "bg-green-50 text-green-700 border-green-100",
                iconBox: "bg-green-100 text-green-600",
                text: "text-green-700"
            }
        }

        if (status === "Rejected") {
            return {
                icon: XCircle,
                label: "Rejected",
                badge: "bg-red-50 text-red-700 border-red-100",
                iconBox: "bg-red-100 text-red-600",
                text: "text-red-700"
            }
        }

        if (status === "Completed") {
            return {
                icon: CheckCircle,
                label: "Completed",
                badge: "bg-blue-50 text-blue-700 border-blue-100",
                iconBox: "bg-blue-100 text-blue-600",
                text: "text-blue-700"
            }
        }

        return {
            icon: Clock3,
            label: "Pending",
            badge: "bg-amber-50 text-amber-700 border-amber-100",
            iconBox: "bg-amber-100 text-amber-600",
            text: "text-amber-700"
        }
    }


    return (

        <div className="min-h-[calc(100vh-73px)] bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

                {/* Back */}
                <Link
                    to="/my-jobs"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-green-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Jobs
                </Link>


                {/* Header */}
                <div className="mb-8">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                <Users className="h-3.5 w-3.5" />
                                Applicant Management
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Applicants
                            </h1>

                            {job && (
                                <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                                    Review workers who applied for{" "}
                                    <span className="font-semibold text-gray-700">
                                        {job.title}
                                    </span>
                                </p>
                            )}

                        </div>


                        {/* Applicant Count */}
                        <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>

                            <div>

                                <p className="text-xs font-medium text-gray-500">
                                    Total Applicants
                                </p>

                                <p className="text-xl font-bold text-gray-900">
                                    {jobApplications.length}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* Job Summary */}
                {job && (

                    <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">

                            <div className="flex items-center gap-2">

                                <BriefcaseBusiness className="h-4 w-4 text-green-600" />

                                <p className="text-sm font-semibold text-gray-700">
                                    Job Details
                                </p>

                            </div>

                        </div>


                        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

                            {/* Location */}
                            <div className="flex items-start gap-3">

                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                <div>

                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        Location
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {job.location}
                                        {job.district
                                            ? `, ${job.district}`
                                            : ""
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* Date */}
                            <div className="flex items-start gap-3">

                                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                <div>

                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        Date
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {job.date}
                                    </p>

                                </div>

                            </div>


                            {/* Time */}
                            <div className="flex items-start gap-3">

                                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                <div>

                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        Time
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {job.time
                                            ? job.time
                                            : `${job.startTime} - ${job.endTime}`
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* Payment */}
                            <div className="flex items-start gap-3">

                                <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                                <div>

                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        Payment
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-gray-900">
                                        ₹{job.payment}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* No Job */}
                {!job && (

                    <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                            <BriefcaseBusiness className="h-8 w-8 text-red-500" />
                        </div>

                        <h2 className="mt-6 text-xl font-bold text-gray-900">
                            Job not found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            The job you're looking for may have been
                            deleted or is no longer available.
                        </p>

                        <Link
                            to="/my-jobs"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to My Jobs
                        </Link>

                    </div>

                )}


                {/* Applicants */}
                {job && (

                    <>
                        {jobApplications.length === 0 ? (

                            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Users className="h-8 w-8 text-gray-400" />
                                </div>

                                <h2 className="mt-6 text-xl font-bold text-gray-900">
                                    No applicants yet
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                    Workers who apply for this job will
                                    appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="grid gap-6 lg:grid-cols-2">

                                {jobApplications.map((application) => {

                                    const statusInfo =
                                        getStatusInfo(
                                            application.status
                                        )

                                    const StatusIcon =
                                        statusInfo.icon

                                    return (

                                        <article
                                            key={application.id}
                                            className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                        >

                                            {/* Top Accent */}
                                            <div
                                                className={`h-1.5 ${
                                                    application.status === "Accepted"
                                                        ? "bg-green-500"
                                                        : application.status === "Rejected"
                                                            ? "bg-red-500"
                                                            : application.status === "Completed"
                                                                ? "bg-blue-500"
                                                                : "bg-amber-500"
                                                }`}
                                            />


                                            <div className="p-6 sm:p-7">

                                                {/* Applicant Header */}
                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex items-center gap-4">

                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50">
                                                            <Users className="h-6 w-6 text-green-600" />
                                                        </div>

                                                        <div>

                                                            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                                                                {application.workerName}
                                                            </h2>

                                                            <p className="mt-1 break-all text-sm text-gray-500">
                                                                {application.workerEmail}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* Status */}
                                                    <span
                                                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusInfo.badge}`}
                                                    >
                                                        <StatusIcon className="h-3.5 w-3.5" />
                                                        {statusInfo.label}
                                                    </span>

                                                </div>


                                                {/* Applicant Information */}
                                                <div className="mt-6 rounded-2xl bg-gray-50 p-4">

                                                    <div className="flex items-center justify-between">

                                                        <div>

                                                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                                Application Status
                                                            </p>

                                                            <p
                                                                className={`mt-1 text-sm font-semibold ${statusInfo.text}`}
                                                            >
                                                                {statusInfo.label}
                                                            </p>

                                                        </div>

                                                        <div
                                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${statusInfo.iconBox}`}
                                                        >
                                                            <StatusIcon className="h-5 w-5" />
                                                        </div>

                                                    </div>

                                                </div>


                                                {/* Actions */}
                                                {application.status === "Pending" && (

                                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">

                                                        <button
                                                            onClick={() =>
                                                                updateApplicationStatus(
                                                                    application.id,
                                                                    "Accepted"
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                            Accept Applicant
                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                updateApplicationStatus(
                                                                    application.id,
                                                                    "Rejected"
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                            Reject
                                                        </button>

                                                    </div>

                                                )}


                                                {/* Accepted Message */}
                                                {application.status === "Accepted" && (

                                                    <div className="mt-6 rounded-2xl border border-green-100 bg-green-50/70 p-4">

                                                        <div className="flex items-start gap-3">

                                                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                                                            <div>

                                                                <p className="text-sm font-semibold text-green-700">
                                                                    Applicant accepted
                                                                </p>

                                                                <p className="mt-1 text-xs leading-5 text-green-600">
                                                                    This worker has been selected for this job.
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )}


                                                {/* Rejected Message */}
                                                {application.status === "Rejected" && (

                                                    <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/70 p-4">

                                                        <div className="flex items-start gap-3">

                                                            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                                                            <div>

                                                                <p className="text-sm font-semibold text-red-700">
                                                                    Applicant rejected
                                                                </p>

                                                                <p className="mt-1 text-xs leading-5 text-red-600">
                                                                    This application was not selected.
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )}

                                            </div>

                                        </article>

                                    )
                                })}

                            </div>

                        )}

                    </>
                )}

            </div>

        </div>
    )
}

export default Applicants