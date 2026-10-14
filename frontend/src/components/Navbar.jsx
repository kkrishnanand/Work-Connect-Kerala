
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  BriefcaseBusiness,
  Menu,
  X,
  LogOut,
  UserRound,
} from "lucide-react"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const storedUser = localStorage.getItem("workconnectLoggedInUser")

  let user = null

  try {
    user = storedUser ? JSON.parse(storedUser) : null
  } catch {
    user = null
  }

  const handleLogout = () => {
    localStorage.removeItem("workconnectLoggedInUser")
    localStorage.removeItem("workconnectAccessToken")
    localStorage.removeItem("workconnectRefreshToken")

    setMenuOpen(false)
    navigate("/")
    window.location.reload()
  }

  const closeMenu = () => setMenuOpen(false)

  const isActive = (path) => location.pathname === path

  const desktopLinkClass = (path) =>
    `relative py-2 text-sm font-medium transition ${
      isActive(path)
        ? "text-green-600"
        : "text-gray-600 hover:text-green-600"
    }`

  const mobileLinkClass = (path) =>
    `rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive(path)
        ? "bg-green-50 text-green-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
    }`

  const desktopLink = (path, label) => (
    <Link
      key={path}
      to={path}
      className={desktopLinkClass(path)}
      onClick={closeMenu}
    >
      {label}
      {isActive(path) && (
        <span className="absolute -bottom-[22px] left-0 right-0 h-0.5 rounded-full bg-green-600" />
      )}
    </Link>
  )

  const mobileLink = (path, label) => (
    <Link
      key={path}
      to={path}
      onClick={closeMenu}
      className={mobileLinkClass(path)}
    >
      {label}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 shadow-sm transition group-hover:bg-green-700">
              <BriefcaseBusiness className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900">
                WorkConnect
              </h1>
              <p className="text-[11px] font-semibold tracking-wide text-green-600">
                KERALA
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {desktopLink("/", "Home")}

            {user?.role === "worker" && (
              <>
                {desktopLink("/find-jobs", "Find Work")}
                {desktopLink("/my-applications", "My Applications")}
                {desktopLink("/worker-dashboard", "Dashboard")}
              </>
            )}

            {user?.role === "employer" && (
              <>
                {desktopLink("/employer-dashboard", "Dashboard")}
                {desktopLink("/my-jobs", "My Jobs")}
                {desktopLink("/post-job", "Post Job")}
                {desktopLink("/applicants", "Applicants")}
              </>
            )}

            {!user && (
              <div className="ml-2 flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-green-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}

            {user && (
              <div className="ml-2 flex items-center gap-3 border-l border-gray-200 pl-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                    <UserRound className="h-4 w-4 text-green-600" />
                  </div>

                  <div className="max-w-[130px]">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-[11px] capitalize text-gray-500">
                      {user.role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-50 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {mobileLink("/", "Home")}

              {user?.role === "worker" && (
                <>
                  {mobileLink("/find-jobs", "Find Work")}
                  {mobileLink("/my-applications", "My Applications")}
                  {mobileLink("/worker-dashboard", "Dashboard")}
                </>
              )}

              {user?.role === "employer" && (
                <>
                  {mobileLink("/employer-dashboard", "Dashboard")}
                  {mobileLink("/my-jobs", "My Jobs")}
                  {mobileLink("/post-job", "Post Job")}
                  {mobileLink("/applicants", "Applicants")}
                </>
              )}

              {!user && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-2 flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {user && (
                <div className="mt-3 border-t border-gray-100 pt-4">
                  <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <UserRound className="h-4 w-4 text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="mt-0.5 text-xs capitalize text-gray-500">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
