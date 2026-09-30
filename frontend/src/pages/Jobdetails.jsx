import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
    MapPin,
    CalendarDays,
    Clock,
    IndianRupee,
    Users,
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle,
    UserPlus
} from "lucide-react"

function JobDetails() {

    const [applied, setApplied] = useState(false)

    const { id } = useParams()


    // ================= SAMPLE JOBS =================

    const sampleJobs = [
        {
            id: 1,
            title: "Parking Staff",
            location: "Kakkanad, Ernakulam",
            date: "2026-09-10",
            startTime: "12:00",
            endTime: "17:00",
            time: "12 PM - 5 PM",
            payment: "800",
            category: "Event",
            workersRequired: 5,
            description:
                "Parking staff required for an event. The work includes managing vehicle parking and assisting guests with parking arrangements."
        },
        {
            id: 2,
            title: "Catering Helper",
            location: "Edappally, Ernakulam",
            date: "2026-09-11",
            startTime: "09:00",
            endTime: "15:00",
            time: "9 AM - 3 PM",
            payment: "700",
            category: "Catering",
            workersRequired: 4,
            description:
                "Catering helpers required to assist with food service, table setup and basic event support."
        },
        {
            id: 3,
            title: "Event Setup",
            location: "Aluva, Ernakulam",
            date: "2026-09-12",
            startTime: "08:00",
            endTime: "14:00",
            time: "8 AM - 2 PM",
            payment: "900",
            category: "Event",
            workersRequired: 6,
            description:
                "Workers required for event setup including arranging chairs, tables, decorations and other event materials."
        },
        {
            id: 4,
            title: "Cleaning Staff",
            location: "Thrissur",
            date: "2026-09-13",
            startTime: "10:00",
            endTime: "16:00",
            time: "10 AM - 4 PM",
            payment: "650",
            category: "Cleaning",
            workersRequired: 3,
            description:
                "Cleaning staff required for maintaining the venue before and after the event."
        }
    ]


    // ================= POSTED JOBS =================

    const storedJobs = localStorage.getItem(
        "workconnectJobs"
    )

    const postedJobs = storedJobs
        ? JSON.parse(storedJobs)
        : []


    const jobs = [
        ...sampleJobs,
        ...postedJobs
    ]


    // ================= FIND JOB =================

    const job = jobs.find(
        (item) =>
            String(item.id) === String(id)
    )


    // ================= JOB NOT FOUND =================

    if (!job) {

        return (

            <div className="min-h-[calc(100vh-72px)] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">

                        <BriefcaseBusiness className="h-8 w-8 text-gray-400" />

                    </div>


                    <h2 className="mt-5 text-2xl font-bold text-gray-900">
                        Job not found
                    </h2>


                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        The job you are looking for does not exist
                        or may have been removed.
                    </p>


                    <Link
                        to="/find-jobs"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
                    >

                        <ArrowLeft className="h-4 w-4" />

                        Back to jobs

                    </Link>

                </div>

            </div>
        )
    }


    // ================= APPLY =================

    const handleApply = () => {

        const storedUser = localStorage.getItem(
            "workconnectLoggedInUser"
        )


        if (!storedUser) {

            alert(
                "Please login to apply for a job."
            )

            return
        }


        const user = JSON.parse(storedUser)


        if (user.role !== "worker") {

            alert(
                "Only workers can apply for jobs."
            )

            return
        }


        const storedApplications =
            localStorage.getItem(
                "workconnectApplications"
            )


        const applications = storedApplications
            ? JSON.parse(storedApplications)
            : []


        const alreadyApplied =
            applications.some(
                (application) =>
                    String(application.jobId) ===
                        String(job.id) &&
                    application.workerEmail ===
                        user.email
            )


        if (alreadyApplied) {

            setApplied(true)

            return
        }


        const newApplication = {

            id: Date.now(),

            jobId: job.id,

            workerEmail: user.email,

            workerName: user.name,

            status: "Pending"
        }


        const updatedApplications = [
            ...applications,
            newApplication
        ]


        localStorage.setItem(
            "workconnectApplications",
            JSON.stringify(
                updatedApplications
            )
        )


        setApplied(true)

    }


    return (

        <div className="min-h-[calc(100vh-72px)] bg-gray-50">

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">


                {/* ================= BACK ================= */}

                <Link
                    to="/find-jobs"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-green-600"
                >

                    <ArrowLeft className="h-4 w-4" />

                    Back to jobs

                </Link>


                {/* ================= MAIN CARD ================= */}

                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">


                    {/* ================= HEADER ================= */}

                    <div className="border-b border-gray-100 p-6 sm:p-8">

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">


                            {/* Job identity */}

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
                                        {job.district
                                            ? `, ${job.district}`
                                            : ""}
                                    </span>

                                </div>

                            </div>


                            {/* Payment */}

                            <div className="rounded-2xl border border-green-100 bg-green-50 px-6 py-5 lg:min-w-[190px]">

                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Daily payment
                                </p>


                                <div className="mt-1 flex items-center text-3xl font-extrabold text-green-700">

                                    <IndianRupee className="h-6 w-6" />

                                    {job.payment}

                                </div>


                                <p className="mt-1 text-xs text-gray-500">
                                    For the complete work period
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ================= JOB INFORMATION ================= */}

                    <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">


                        {/* Date */}

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">

                                    <CalendarDays className="h-5 w-5 text-green-600" />

                                </div>


                                <div className="min-w-0">

                                    <p className="text-xs font-medium text-gray-400">
                                        Work date
                                    </p>

                                    <p className="mt-1 truncate text-sm font-bold text-gray-900">
                                        {job.date}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Time */}

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">

                                    <Clock className="h-5 w-5 text-green-600" />

                                </div>


                                <div className="min-w-0">

                                    <p className="text-xs font-medium text-gray-400">
                                        Working hours
                                    </p>

                                    <p className="mt-1 truncate text-sm font-bold text-gray-900">

                                        {job.time
                                            ? job.time
                                            : `${job.startTime} - ${job.endTime}`}

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Workers */}

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
                                        {job.workersRequired || "Not specified"}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Category */}

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


                    {/* ================= DESCRIPTION ================= */}

                    <div className="border-t border-gray-100 px-6 py-8 sm:px-8">

                        <h2 className="text-xl font-bold text-gray-900">
                            About this work
                        </h2>


                        <p className="mt-4 max-w-4xl text-sm leading-7 text-gray-600 sm:text-base">
                            {job.description}
                        </p>

                    </div>


                    {/* ================= LOCATION ================= */}

                    <div className="border-t border-gray-100 px-6 py-8 sm:px-8">

                        <h2 className="text-xl font-bold text-gray-900">
                            Work location
                        </h2>


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


                    {/* ================= APPLY ================= */}

                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-6 sm:px-8">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">


                            <div>

                                <h3 className="font-bold text-gray-900">
                                    Interested in this job?
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    Apply now and wait for the employer's response.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={handleApply}
                                disabled={applied}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-sm transition ${
                                    applied
                                        ? "cursor-not-allowed border border-green-200 bg-green-50 text-green-700"
                                        : "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
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

                                        Apply for this job
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    )
}

export default JobDetails