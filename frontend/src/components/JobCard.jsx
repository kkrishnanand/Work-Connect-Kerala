import {
    MapPin,
    Clock,
    CalendarDays,
    ArrowRight,
    Users,
    IndianRupee
} from "lucide-react"
import { Link } from "react-router-dom"

function JobCard({
    id,
    title,
    location,
    date,
    time,
    payment,
    category,
    workersRequired
}) {

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg">

            {/* ================= TOP ================= */}

            <div className="p-5 sm:p-6">

                {/* Category + Payment */}

                <div className="flex items-center justify-between gap-3">

                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                        {category}
                    </span>

                    <div className="flex items-center gap-1 text-green-700">

                        <IndianRupee className="h-4 w-4" />

                        <span className="text-sm font-bold">
                            {payment}
                        </span>

                        <span className="text-xs text-gray-400">
                            /day
                        </span>

                    </div>

                </div>


                {/* Job title */}

                <h3 className="mt-5 line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-gray-900 transition-colors group-hover:text-green-700">
                    {title}
                </h3>


                {/* Job information */}

                <div className="mt-5 space-y-3.5">

                    {/* Location */}

                    <div className="flex items-start gap-3 text-sm text-gray-500">

                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50">

                            <MapPin className="h-3.5 w-3.5 text-green-600" />

                        </div>

                        <span className="pt-1 leading-5">
                            {location}
                        </span>

                    </div>


                    {/* Date */}

                    <div className="flex items-center gap-3 text-sm text-gray-500">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50">

                            <CalendarDays className="h-3.5 w-3.5 text-green-600" />

                        </div>

                        <span>
                            {date}
                        </span>

                    </div>


                    {/* Time */}

                    <div className="flex items-center gap-3 text-sm text-gray-500">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50">

                            <Clock className="h-3.5 w-3.5 text-green-600" />

                        </div>

                        <span>
                            {time}
                        </span>

                    </div>


                    {/* Workers */}

                    {workersRequired && (

                        <div className="flex items-center gap-3 text-sm text-gray-500">

                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50">

                                <Users className="h-3.5 w-3.5 text-green-600" />

                            </div>

                            <span>
                                {workersRequired} workers required
                            </span>

                        </div>

                    )}

                </div>

            </div>


            {/* ================= BOTTOM ================= */}

            <div className="mt-auto border-t border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-6">

                <div className="flex items-center justify-between gap-4">

                    {/* Payment */}

                    <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Daily payment
                        </p>

                        <div className="mt-0.5 flex items-baseline gap-1">

                            <span className="text-lg font-bold text-gray-900">
                                ₹{payment}
                            </span>

                            <span className="text-xs text-gray-400">
                                / day
                            </span>

                        </div>

                    </div>


                    {/* View Job */}

                    <Link
                        to={`/job/${id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
                    >

                        View Job

                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />

                    </Link>

                </div>

            </div>

        </article>
    )
}

export default JobCard