import { useState } from "react"
import {
    Search,
    MapPin,
    BriefcaseBusiness,
    CalendarDays,
    IndianRupee
} from "lucide-react"

function SearchBar({ onSearch }) {

    const [work, setWork] = useState("")
    const [district, setDistrict] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState("")
    const [payment, setPayment] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        onSearch({
            work,
            district,
            category,
            date,
            payment
        })
    }

    return (
        <form onSubmit={handleSubmit}>

            <div className="space-y-4">

                {/* Work */}

                <div>

                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        What work are you looking for?
                    </label>

                    <div className="relative">

                        <BriefcaseBusiness className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={work}
                            onChange={(e) => setWork(e.target.value)}
                            placeholder="e.g. Catering, Parking, Cleaning"
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                        />

                    </div>

                </div>


                {/* District + Category */}

                <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                            District
                        </label>

                        <div className="relative">

                            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                            >

                                <option value="">
                                    All districts
                                </option>

                                <option value="Alappuzha">
                                    Alappuzha
                                </option>

                                <option value="Ernakulam">
                                    Ernakulam
                                </option>

                                <option value="Idukki">
                                    Idukki
                                </option>

                                <option value="Kannur">
                                    Kannur
                                </option>

                                <option value="Kasaragod">
                                    Kasaragod
                                </option>

                                <option value="Kollam">
                                    Kollam
                                </option>

                                <option value="Kottayam">
                                    Kottayam
                                </option>

                                <option value="Kozhikode">
                                    Kozhikode
                                </option>

                                <option value="Malappuram">
                                    Malappuram
                                </option>

                                <option value="Palakkad">
                                    Palakkad
                                </option>

                                <option value="Pathanamthitta">
                                    Pathanamthitta
                                </option>

                                <option value="Thiruvananthapuram">
                                    Thiruvananthapuram
                                </option>

                                <option value="Thrissur">
                                    Thrissur
                                </option>

                                <option value="Wayanad">
                                    Wayanad
                                </option>

                            </select>

                        </div>

                    </div>


                    <div>

                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                        >

                            <option value="">
                                All categories
                            </option>

                            <option value="Event">
                                Event
                            </option>

                            <option value="Catering">
                                Catering
                            </option>

                            <option value="Parking">
                                Parking
                            </option>

                            <option value="Cleaning">
                                Cleaning
                            </option>

                            <option value="Loading">
                                Loading & Unloading
                            </option>

                            <option value="Delivery">
                                Delivery
                            </option>

                            <option value="Construction">
                                Construction
                            </option>

                            <option value="Technical">
                                Technical
                            </option>

                            <option value="Hospitality">
                                Hospitality
                            </option>

                            <option value="Photography">
                                Photography
                            </option>

                        </select>

                    </div>

                </div>


                {/* Date + Payment */}

                <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                            Date
                        </label>

                        <div className="relative">

                            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                    </div>


                    <div>

                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                            Minimum payment
                        </label>

                        <div className="relative">

                            <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                            <input
                                type="number"
                                min="0"
                                value={payment}
                                onChange={(e) => setPayment(e.target.value)}
                                placeholder="e.g. 700"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                    </div>

                </div>


                {/* Button */}

                <button
                    type="submit"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
                >

                    <Search className="h-4 w-4" />

                    Search opportunities

                </button>

            </div>

        </form>
    )
}

export default SearchBar