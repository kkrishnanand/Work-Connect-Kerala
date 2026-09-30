import { useState } from "react"
import { Link } from "react-router-dom"
import {
    MapPin,
    CalendarDays,
    Clock,
    IndianRupee,
    Users,
    Search,
    SlidersHorizontal,
    X,
    ArrowRight
} from "lucide-react"

function FindJobs() {

    const [jobs] = useState(() => {

        const storedJobs = localStorage.getItem(
            "workconnectJobs"
        )

        return storedJobs
            ? JSON.parse(storedJobs)
            : []
    })


    // ================= FILTERS =================

    const [search, setSearch] = useState("")
    const [district, setDistrict] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState("")
    const [minPayment, setMinPayment] = useState("")


    // ================= CLEAR =================

    const clearFilters = () => {

        setSearch("")
        setDistrict("")
        setCategory("")
        setDate("")
        setMinPayment("")
    }


    // ================= FILTER JOBS =================

    const filteredJobs = jobs.filter((job) => {

        const searchText =
            search.trim().toLowerCase()


        const matchesSearch =
            searchText === "" ||
            job.title
                ?.toLowerCase()
                .includes(searchText) ||
            job.description
                ?.toLowerCase()
                .includes(searchText) ||
            job.location
                ?.toLowerCase()
                .includes(searchText) ||
            job.category
                ?.toLowerCase()
                .includes(searchText)


        const matchesDistrict =
            district === "" ||
            job.district === district


        const matchesCategory =
            category === "" ||
            job.category === category


        const matchesDate =
            date === "" ||
            job.date === date


        const matchesPayment =
            minPayment === "" ||
            Number(job.payment) >= Number(minPayment)


        return (
            matchesSearch &&
            matchesDistrict &&
            matchesCategory &&
            matchesDate &&
            matchesPayment
        )
    })


    const filtersActive =
        search ||
        district ||
        category ||
        date ||
        minPayment


    return (

        <div className="min-h-[calc(100vh-72px)] bg-gray-50">

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">


                {/* ================= HEADER ================= */}

                <div className="mb-8">

                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                        WorkConnect Kerala
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Find Work
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        Search temporary, daily and short-term work
                        opportunities based on your location, category and
                        preferred payment.
                    </p>

                </div>


                {/* ================= SEARCH CARD ================= */}

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">


                    {/* Search Header */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">

                                <SlidersHorizontal className="h-5 w-5 text-green-600" />

                            </div>


                            <div>

                                <h2 className="font-bold text-gray-900">
                                    Search & Filter
                                </h2>

                                <p className="mt-0.5 text-xs text-gray-500">
                                    Find work that matches your needs.
                                </p>

                            </div>

                        </div>


                        {filtersActive && (

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-red-600 transition hover:text-red-700 sm:self-auto"
                            >

                                <X className="h-4 w-4" />

                                Clear filters

                            </button>

                        )}

                    </div>


                    {/* ================= FILTERS ================= */}

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">


                        {/* Search */}

                        <div className="relative lg:col-span-2">

                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search work, location or category..."
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                            />

                        </div>


                        {/* District */}

                        <select
                            value={district}
                            onChange={(event) =>
                                setDistrict(event.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                        >

                            <option value="">
                                All districts
                            </option>

                            <option>Alappuzha</option>
                            <option>Ernakulam</option>
                            <option>Idukki</option>
                            <option>Kannur</option>
                            <option>Kasaragod</option>
                            <option>Kollam</option>
                            <option>Kottayam</option>
                            <option>Kozhikode</option>
                            <option>Malappuram</option>
                            <option>Palakkad</option>
                            <option>Pathanamthitta</option>
                            <option>Thiruvananthapuram</option>
                            <option>Thrissur</option>
                            <option>Wayanad</option>

                        </select>


                        {/* Category */}

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                        >

                            <option value="">
                                All categories
                            </option>

                            <option>Event</option>
                            <option>Catering</option>
                            <option>Parking</option>
                            <option>Cleaning</option>
                            <option>Loading</option>
                            <option>Delivery</option>
                            <option>Construction</option>
                            <option>Technical</option>
                            <option>Hospitality</option>
                            <option>Photography</option>

                        </select>


                        {/* Date */}

                        <div>

                            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                                Work date
                            </label>

                            <div className="relative">

                                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(event) =>
                                        setDate(event.target.value)
                                    }
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                                />

                            </div>

                        </div>


                        {/* Payment */}

                        <div>

                            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                                Minimum payment
                            </label>

                            <div className="relative">

                                <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="number"
                                    min="0"
                                    value={minPayment}
                                    onChange={(event) =>
                                        setMinPayment(event.target.value)
                                    }
                                    placeholder="e.g. 800"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                                />

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= RESULTS HEADER ================= */}

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                            Opportunities
                        </p>

                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                            Available Jobs
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {filteredJobs.length}{" "}
                            {filteredJobs.length === 1
                                ? "job"
                                : "jobs"}{" "}
                            found
                        </p>

                    </div>

                </div>


                {/* ================= NO RESULTS ================= */}

                {filteredJobs.length === 0 ? (

                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

                            <Search className="h-6 w-6 text-gray-400" />

                        </div>


                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            No jobs found
                        </h2>


                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            We couldn't find any jobs matching your
                            search criteria. Try changing your filters.
                        </p>


                        {filtersActive && (

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                            >

                                <X className="h-4 w-4" />

                                Clear filters

                            </button>

                        )}

                    </div>

                ) : (


                    /* ================= JOBS ================= */

                    <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {filteredJobs.map((job) => (

                            <article
                                key={job.id}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                            >

                                <div className="p-5 sm:p-6">


                                    {/* Category + Workers */}

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                            {job.category}
                                        </span>


                                        {job.workersRequired && (

                                            <div className="flex items-center gap-1 text-xs text-gray-400">

                                                <Users className="h-3.5 w-3.5" />

                                                {job.workersRequired}

                                            </div>

                                        )}

                                    </div>


                                    {/* Title */}

                                    <h3 className="mt-5 line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-gray-900 transition-colors group-hover:text-green-700">
                                        {job.title}
                                    </h3>


                                    {/* Information */}

                                    <div className="mt-5 space-y-3.5">


                                        {/* Location */}

                                        <div className="flex items-start gap-3 text-sm text-gray-500">

                                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50">

                                                <MapPin className="h-3.5 w-3.5 text-green-600" />

                                            </div>

                                            <span className="pt-1 leading-5">
                                                {job.location}
                                                {job.district
                                                    ? `, ${job.district}`
                                                    : ""}
                                            </span>

                                        </div>


                                        {/* Date */}

                                        <div className="flex items-center gap-3 text-sm text-gray-500">

                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50">

                                                <CalendarDays className="h-3.5 w-3.5 text-green-600" />

                                            </div>

                                            <span>
                                                {job.date}
                                            </span>

                                        </div>


                                        {/* Time */}

                                        <div className="flex items-center gap-3 text-sm text-gray-500">

                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50">

                                                <Clock className="h-3.5 w-3.5 text-green-600" />

                                            </div>

                                            <span>
                                                {job.time
                                                    ? job.time
                                                    : `${job.startTime} - ${job.endTime}`}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* Bottom */}

                                <div className="mt-auto border-t border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-6">

                                    <div className="flex items-center justify-between gap-4">


                                        {/* Payment */}

                                        <div>

                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                                Daily payment
                                            </p>

                                            <div className="mt-0.5 flex items-baseline gap-1">

                                                <span className="text-lg font-bold text-gray-900">
                                                    ₹{job.payment}
                                                </span>

                                                <span className="text-xs text-gray-400">
                                                    / day
                                                </span>

                                            </div>

                                        </div>


                                        {/* Button */}

                                        <Link
                                            to={`/job/${job.id}`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
                                        >

                                            View Job

                                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />

                                        </Link>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </main>

        </div>
    )
}

export default FindJobs