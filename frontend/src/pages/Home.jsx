import { useState } from "react"
import { Link } from "react-router-dom"
import {
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    Search,
    ShieldCheck,
    Users,
    MapPin,
    CalendarDays,
    IndianRupee
} from "lucide-react"

import JobCard from "../components/JobCard"
import CategoryCard from "../components/CategoryCard"
import SearchBar from "../components/SearchBar"

function Home() {

    const [filteredJobs, setFilteredJobs] = useState(null)

    const jobs = [
        {
            id: 1,
            title: "Parking Staff",
            location: "Kakkanad, Ernakulam",
            date: "2026-09-10",
            time: "12 PM - 5 PM",
            payment: "800",
            category: "Event"
        },
        {
            id: 2,
            title: "Catering Helper",
            location: "Edappally, Ernakulam",
            date: "2026-09-11",
            time: "9 AM - 3 PM",
            payment: "700",
            category: "Catering"
        },
        {
            id: 3,
            title: "Event Setup",
            location: "Aluva, Ernakulam",
            date: "2026-09-12",
            time: "8 AM - 2 PM",
            payment: "900",
            category: "Event"
        },
        {
            id: 4,
            title: "Cleaning Staff",
            location: "Thrissur",
            date: "2026-09-13",
            time: "10 AM - 4 PM",
            payment: "650",
            category: "Cleaning"
        }
    ]

    const handleSearch = (searchData) => {

        const results = jobs.filter((job) => {

            const matchesWork =
                searchData.work === "" ||
                job.title
                    .toLowerCase()
                    .includes(searchData.work.toLowerCase())

            const matchesDistrict =
                searchData.district === "" ||
                job.location.includes(searchData.district)

            const matchesCategory =
                searchData.category === "" ||
                job.category === searchData.category

            const matchesDate =
                searchData.date === "" ||
                job.date === searchData.date

            const matchesPayment =
                searchData.payment === "" ||
                Number(job.payment) >= Number(searchData.payment)

            return (
                matchesWork &&
                matchesDistrict &&
                matchesCategory &&
                matchesDate &&
                matchesPayment
            )
        })

        setFilteredJobs(results)

        setTimeout(() => {
            document
                .getElementById("latest-jobs")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                })
        }, 100)
    }

    const categories = [
        { id: 1, name: "Event Staff", icon: "event" },
        { id: 2, name: "Catering", icon: "catering" },
        { id: 3, name: "Parking", icon: "parking" },
        { id: 4, name: "Cleaning", icon: "cleaning" },
        { id: 5, name: "Loading & Unloading", icon: "loading" },
        { id: 6, name: "Delivery", icon: "delivery" },
        { id: 7, name: "Construction", icon: "construction" },
        { id: 8, name: "Technical", icon: "technical" },
        { id: 9, name: "Hospitality", icon: "hospitality" },
        { id: 10, name: "Photography", icon: "photography" }
    ]

    const displayedJobs = filteredJobs ?? jobs

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ================= HERO ================= */}

            <section className="border-b border-gray-200 bg-white">

                <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-16 lg:pt-16">

                    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">

                        {/* LEFT */}

                        <div>

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 text-xs font-semibold text-green-700">
                                <BriefcaseBusiness className="h-4 w-4" />
                                Temporary work opportunities across Kerala
                            </div>

                            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

                                Find the right work.

                                <span className="block text-green-600">
                                    When you need it.
                                </span>

                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                                Discover short-term, daily and temporary
                                work opportunities across Kerala based on
                                your location, skills and availability.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-5 text-sm text-gray-600">

                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    Flexible opportunities
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    Multiple job categories
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    Across Kerala
                                </div>

                            </div>

                        </div>

                        {/* RIGHT - SEARCH CARD */}

                        <div className="lg:pl-6">

                            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-lg shadow-gray-200/60 sm:p-6">

                                <div className="mb-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                            <Search className="h-5 w-5 text-green-600" />
                                        </div>

                                        <div>
                                            <h2 className="font-bold text-gray-900">
                                                Find work
                                            </h2>

                                            <p className="text-xs text-gray-500">
                                                Search opportunities that match you
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                <SearchBar onSearch={handleSearch} />

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= MAIN ================= */}

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">


                {/* ================= CATEGORIES ================= */}

                <section className="mb-14">

                    <div className="mb-6 flex items-end justify-between gap-4">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                                Explore
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                Browse by category
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Find opportunities based on the type of work you do.
                            </p>

                        </div>

                        <Link
                            to="/find-jobs"
                            className="hidden items-center gap-1.5 text-sm font-semibold text-green-600 transition hover:text-green-700 sm:flex"
                        >
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                    </div>


                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">

                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                name={category.name}
                                icon={category.icon}
                            />
                        ))}

                    </div>


                    <Link
                        to="/find-jobs"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 sm:hidden"
                    >
                        View all categories
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                </section>


                {/* ================= LATEST JOBS ================= */}

                <section
                    id="latest-jobs"
                    className="scroll-mt-24"
                >

                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                                Opportunities
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">

                                {filteredJobs !== null
                                    ? "Search results"
                                    : "Latest opportunities"}

                            </h2>

                            <p className="mt-2 text-sm text-gray-500">

                                {filteredJobs !== null
                                    ? `${displayedJobs.length} opportunity${displayedJobs.length === 1 ? "" : "ies"} found`
                                    : "Explore available temporary work opportunities."}

                            </p>

                        </div>


                        <Link
                            to="/find-jobs"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition hover:text-green-700"
                        >
                            View all jobs
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                    </div>


                    {filteredJobs !== null && filteredJobs.length === 0 ? (

                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                No opportunities found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Try changing your search filters or look for
                                another type of work.
                            </p>

                            <Link
                                to="/find-jobs"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                Browse all jobs
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                        </div>

                    ) : (

                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                            {displayedJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    title={job.title}
                                    id={job.id}
                                    location={job.location}
                                    date={job.date}
                                    time={job.time}
                                    payment={job.payment}
                                    category={job.category}
                                    workersRequired={job.workersRequired}
                                />
                            ))}

                        </div>

                    )}

                </section>


                {/* ================= HOW IT WORKS ================= */}

                <section className="mt-16 border-t border-gray-200 pt-14">

                    <div className="mx-auto max-w-2xl text-center">

                        <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                            Simple process
                        </p>

                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            How WorkConnect works
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
                            Find an opportunity or post your requirement in
                            just a few simple steps.
                        </p>

                    </div>


                    <div className="mt-10 grid gap-5 md:grid-cols-3">

                        <div className="rounded-2xl border border-gray-200 bg-white p-6">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg font-bold text-green-700">
                                01
                            </div>

                            <h3 className="mt-5 font-bold text-gray-900">
                                Search or post
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Workers can search for suitable jobs while
                                employers can post their requirements.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-gray-200 bg-white p-6">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg font-bold text-green-700">
                                02
                            </div>

                            <h3 className="mt-5 font-bold text-gray-900">
                                Connect
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Workers apply for opportunities and employers
                                can review their applications.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-gray-200 bg-white p-6">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg font-bold text-green-700">
                                03
                            </div>

                            <h3 className="mt-5 font-bold text-gray-900">
                                Get the work done
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Once selected, workers and employers can
                                complete the job and track its progress.
                            </p>

                        </div>

                    </div>

                </section>


                {/* ================= TWO SIDED CTA ================= */}

                <section className="mt-16">

                    <div className="grid gap-5 md:grid-cols-2">

                        {/* WORKER */}

                        <div className="rounded-3xl border border-green-100 bg-green-50 p-7 sm:p-9">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600">
                                <Users className="h-6 w-6 text-white" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold text-gray-900">
                                Looking for work?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Create your worker profile, discover suitable
                                opportunities and apply for jobs around you.
                            </p>

                            <Link
                                to="/register"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                Create worker account
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                        </div>


                        {/* EMPLOYER */}

                        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold text-gray-900">
                                Need workers?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Post your temporary work requirement and
                                connect with workers who match your needs.
                            </p>

                            <Link
                                to="/register"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-gray-50"
                            >
                                Post a job
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                        </div>

                    </div>

                </section>


                {/* ================= TRUST STRIP ================= */}

                <section className="mt-14 rounded-2xl border border-gray-200 bg-white px-5 py-6 shadow-sm">

                    <div className="grid gap-6 sm:grid-cols-3">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                <MapPin className="h-5 w-5 text-green-600" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    Across Kerala
                                </p>
                                <p className="text-xs text-gray-500">
                                    Opportunities across 14 districts
                                </p>
                            </div>

                        </div>


                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                <CalendarDays className="h-5 w-5 text-green-600" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    Flexible work
                                </p>
                                <p className="text-xs text-gray-500">
                                    Daily and short-term opportunities
                                </p>
                            </div>

                        </div>


                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                                <IndianRupee className="h-5 w-5 text-green-600" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    Clear payments
                                </p>
                                <p className="text-xs text-gray-500">
                                    See payment details before applying
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    )
}

export default Home