import {
    ArrowRight,
    CalendarDays,
    Camera,
    Car,
    ChefHat,
    Construction,
    Hammer,
    HardHat,
    Hotel,
    Laptop,
    Package,
    Sparkles,
    Users
} from "lucide-react"

import { Link } from "react-router-dom"

function CategoryCard({ name, icon }) {

    const icons = {
        event: CalendarDays,
        catering: ChefHat,
        parking: Car,
        cleaning: Sparkles,
        loading: Package,
        delivery: Package,
        construction: Construction,
        technical: Laptop,
        hospitality: Hotel,
        photography: Camera
    }

    const Icon = icons[icon] || BriefcaseIcon

    return (
        <Link
            to="/find-jobs"
            className="group rounded-2xl border border-gray-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-md sm:p-5"
        >

            <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 transition group-hover:bg-green-100">

                    <Icon className="h-5 w-5 text-green-600" />

                </div>

                <ArrowRight
                    className="h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-green-600"
                />

            </div>


            <h3 className="mt-4 text-sm font-bold leading-5 text-gray-900">
                {name}
            </h3>


            <p className="mt-1 text-xs text-gray-400">
                Find opportunities
            </p>

        </Link>
    )
}


function BriefcaseIcon(props) {
    return <Users {...props} />
}

export default CategoryCard