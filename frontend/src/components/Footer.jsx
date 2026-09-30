import { Link } from "react-router-dom"
import {
    BriefcaseBusiness,
    ArrowRight,
    Mail,
    MapPin
} from "lucide-react"

function Footer() {

    return (
        <footer className="border-t border-gray-200 bg-white">

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}

                    <div className="lg:col-span-2">

                        <Link
                            to="/"
                            className="inline-flex items-center gap-3"
                        >

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                                <BriefcaseBusiness className="h-5 w-5 text-white" />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold leading-tight text-gray-900">
                                    WorkConnect
                                </h2>

                                <p className="text-xs font-medium text-green-600">
                                    Kerala
                                </p>
                            </div>

                        </Link>


                        <p className="mt-5 max-w-md text-sm leading-6 text-gray-500">
                            A platform connecting workers and employers for
                            temporary, daily and short-term work opportunities
                            across Kerala.
                        </p>


                        <div className="mt-5 space-y-3">

                            <div className="flex items-center gap-2 text-sm text-gray-500">

                                <MapPin className="h-4 w-4 text-green-600" />

                                Kerala, India

                            </div>


                            <div className="flex items-center gap-2 text-sm text-gray-500">

                                <Mail className="h-4 w-4 text-green-600" />

                                Connect with us

                            </div>

                        </div>

                    </div>


                    {/* For Workers */}

                    <div>

                        <h3 className="text-sm font-bold text-gray-900">
                            For Workers
                        </h3>

                        <div className="mt-4 flex flex-col gap-3">

                            <Link
                                to="/find-jobs"
                                className="text-sm text-gray-500 transition hover:text-green-600"
                            >
                                Find Work
                            </Link>

                            <Link
                                to="/register"
                                className="text-sm text-gray-500 transition hover:text-green-600"
                            >
                                Create Account
                            </Link>

                            <Link
                                to="/login"
                                className="text-sm text-gray-500 transition hover:text-green-600"
                            >
                                Login
                            </Link>

                        </div>

                    </div>


                    {/* For Employers */}

                    <div>

                        <h3 className="text-sm font-bold text-gray-900">
                            For Employers
                        </h3>

                        <div className="mt-4 flex flex-col gap-3">

                            <Link
                                to="/post-job"
                                className="text-sm text-gray-500 transition hover:text-green-600"
                            >
                                Post a Job
                            </Link>

                            <Link
                                to="/my-jobs"
                                className="text-sm text-gray-500 transition hover:text-green-600"
                            >
                                Manage Jobs
                            </Link>

                            <Link
                                to="/register"
                                className="inline-flex items-center gap-1 text-sm font-medium text-green-600 transition hover:text-green-700"
                            >
                                Get Started
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>

                        </div>

                    </div>

                </div>


                {/* Bottom */}

                <div className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-gray-400">
                        © 2026 WorkConnect Kerala. All rights reserved.
                    </p>

                    <p className="text-xs text-gray-400">
                        Connecting people with opportunities.
                    </p>

                </div>

            </div>

        </footer>
    )
}

export default Footer