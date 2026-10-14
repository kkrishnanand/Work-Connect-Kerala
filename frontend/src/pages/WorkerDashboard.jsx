
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  ArrowRight,
  BellRing,
  CheckCheck,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import api from "../api/axios";

function formatDate(value) {
  if (!value) return "Date not specified";

  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "Time not specified";

  const [hours, minutes] = value.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function WorkerDashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem("workconnectAccessToken");
    const storedUser = localStorage.getItem("workconnectLoggedInUser");

    if (!token || !storedUser) {
      setError("Please log in to view your dashboard.");
      setLoading(false);
      return;
    }

    let loggedInUser;

    try {
      loggedInUser = JSON.parse(storedUser);
    } catch {
      setError("Your login session is invalid. Please log in again.");
      setLoading(false);
      return;
    }

    if (loggedInUser.role !== "worker") {
      setError("This dashboard is available only to workers.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setUser(loggedInUser);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [applicationsResponse, jobsResponse] = await Promise.all([
        api.get("applications/", config),
        api.get("jobs/", config),
      ]);

      const applicationData = Array.isArray(applicationsResponse.data)
        ? applicationsResponse.data
        : applicationsResponse.data.results ?? [];

      const jobData = Array.isArray(jobsResponse.data)
        ? jobsResponse.data
        : jobsResponse.data.results ?? [];

      setApplications(applicationData);
      setJobs(jobData);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load dashboard data. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const normalizedApplications = applications.map((application) => ({
    ...application,
    status: String(application.status || "pending").toLowerCase(),
  }));

  const appliedJobs = normalizedApplications.length;

  const acceptedApplications = normalizedApplications.filter(
    (application) => application.status === "accepted"
  );

  const completedApplications = normalizedApplications.filter(
    (application) => application.status === "completed"
  );

  const pendingCompletionApplications = acceptedApplications.filter(
    (application) =>
      !application.worker_confirmed_completion ||
      !application.employer_confirmed_completion
  );

  const appliedJobIds = normalizedApplications.map((application) =>
    String(application.job)
  );

  const recommendedJobs = jobs
    .filter(
      (job) =>
        job.status === "active" &&
        !appliedJobIds.includes(String(job.id))
    )
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-green-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your WorkConnect dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Unable to load dashboard
          </h1>
          <p role="alert" className="mt-2 text-sm text-gray-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            <Link
              to="/login"
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Welcome section */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-green-600 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">
                Worker Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Welcome back, {user?.name || "Worker"} 👋
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                Find temporary work, track your applications, and keep your
                job completion status up to date.
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
        </section>

        {/* Statistics */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Applied Jobs"
            value={appliedJobs}
            description="Total applications submitted"
            icon={FileText}
            color="blue"
          />

          <StatCard
            label="Accepted Jobs"
            value={acceptedApplications.length}
            description="Applications accepted by employers"
            icon={CheckCircle}
            color="green"
          />

          <StatCard
            label="Completed Jobs"
            value={completedApplications.length}
            description="Jobs confirmed by both sides"
            icon={BriefcaseBusiness}
            color="purple"
          />
        </section>

        {/* Pending completion */}
        <section className="mt-10">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <BellRing className="h-5 w-5 text-amber-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Pending Completion
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Keep track of accepted jobs that still need both confirmations.
              </p>
            </div>
          </div>

          {pendingCompletionApplications.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    You're all caught up!
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no accepted applications waiting for completion
                    confirmation.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {pendingCompletionApplications.map((application) => {
                const workerConfirmed =
                  application.worker_confirmed_completion;
                const employerConfirmed =
                  application.employer_confirmed_completion;

                return (
                  <article
                    key={application.id}
                    className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          <Clock3 className="h-3.5 w-3.5" />
                          Awaiting confirmation
                        </span>

                        <h3 className="mt-3 text-lg font-bold text-gray-900">
                          {application.job_title || `Job #${application.job}`}
                        </h3>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                        <BriefcaseBusiness className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <ConfirmationRow
                        label="Your confirmation"
                        confirmed={workerConfirmed}
                      />
                      <ConfirmationRow
                        label="Employer confirmation"
                        confirmed={employerConfirmed}
                      />
                    </div>

                    <p className="mt-4 text-xs leading-5 text-gray-500">
                      {workerConfirmed
                        ? "Your confirmation is saved. The employer still needs to confirm."
                        : "After you have completed the work, open My Applications to confirm it."}
                    </p>

                    <Link
                      to="/my-applications"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
                    >
                      View My Applications
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick actions */}
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
            <QuickAction
              to="/find-jobs"
              icon={Search}
              title="Find Work"
              description="Explore temporary and daily work opportunities across Kerala."
            />

            <QuickAction
              to="/my-applications"
              icon={FileText}
              title="My Applications"
              description="Track application decisions and confirm completed work."
            />
          </div>
        </section>

        {/* Recommended jobs */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended Jobs
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Active opportunities you haven't applied for yet.
              </p>
            </div>

            <Link
              to="/find-jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              View all jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recommendedJobs.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <BriefcaseBusiness className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-4 font-bold text-gray-900">
                No recommended jobs right now
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Check the Find Work page for current opportunities.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {recommendedJobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                >
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {job.category}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    {job.title}
                  </h3>

                  <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      {job.location}, {job.district}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays className="h-4 w-4 shrink-0 text-green-600" />
                    <span>{formatDate(job.date)}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 shrink-0 text-green-600" />
                    <span>
                      {formatTime(job.start_time)} - {formatTime(job.end_time)}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-1 text-gray-900">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-bold">
                        {Number(job.payment).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      {job.workers_required} workers
                    </span>
                  </div>

                  <Link
                    to={`/job/${job.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    View Job
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, description, icon: Icon, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles[color]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function ConfirmationRow({ label, confirmed }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-600">{label}</span>
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
          confirmed ? "text-green-700" : "text-amber-700"
        }`}
      >
        {confirmed ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Clock3 className="h-4 w-4" />
        )}
        {confirmed ? "Confirmed" : "Pending"}
      </span>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
          <Icon className="h-6 w-6 text-green-600" />
        </div>

        <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </Link>
  );
}

export default WorkerDashboard;
