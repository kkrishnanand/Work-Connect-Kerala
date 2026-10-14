
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Users,
  CheckCircle,
  Plus,
  ArrowRight,
  MapPin,
  CalendarDays,
  Clock,
  IndianRupee,
  FileText,
  RefreshCw,
  AlertCircle,
  BellRing,
  Clock3,
  CheckCheck,
  LoaderCircle,
} from "lucide-react";
import api from "../api/axios";

function formatDate(value) {
  if (!value) return "Not specified";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "Not specified";

  const [hours, minutes] = value.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getErrorMessage(error) {
  const data = error.response?.data;

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return "Unable to load dashboard data. Please try again.";
}

function EmployerDashboard() {
  const [user, setUser] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    const storedUser = localStorage.getItem("workconnectLoggedInUser");

    if (!storedUser || !localStorage.getItem("workconnectAccessToken")) {
      setError("Please log in to view your employer dashboard.");
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

    if (loggedInUser.role !== "employer") {
      setError("This dashboard is only available to employers.");
      setLoading(false);
      return;
    }

    setUser(loggedInUser);

    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        api.get("jobs/"),
        api.get("applications/"),
      ]);

      const jobsData = Array.isArray(jobsResponse.data)
        ? jobsResponse.data
        : jobsResponse.data.results ?? [];

      const applicationsData = Array.isArray(applicationsResponse.data)
        ? applicationsResponse.data
        : applicationsResponse.data.results ?? [];

      // Keep only jobs belonging to this employer.
      // The backend should enforce this ownership as well.
      const employerJobs = jobsData.filter(
        (job) => String(job.employer) === String(loggedInUser.id)
      );

      const employerJobIds = new Set(
        employerJobs.map((job) => String(job.id))
      );

      const employerApplications = applicationsData.filter(
        (application) => employerJobIds.has(String(application.job))
      );

      setMyJobs(
        employerJobs.map((job) => ({
          ...job,
          time: `${formatTime(job.start_time)} - ${formatTime(job.end_time)}`,
        }))
      );

      setMyApplications(
        employerApplications.map((application) => ({
          ...application,
          status: String(application.status || "pending").toLowerCase(),
        }))
      );
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("Your account cannot access this dashboard.");
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const activeJobs = myJobs.filter(
    (job) => job.status === "active"
  ).length;

  const completedJobs = myJobs.filter(
    (job) => job.status === "completed"
  ).length;

  const applicantsCount = myApplications.length;

  const pendingCompletionApplications = myApplications.filter(
    (application) =>
      application.status === "accepted" &&
      (!application.worker_confirmed_completion ||
        !application.employer_confirmed_completion)
  );

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-green-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading employer dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Unable to load dashboard
          </h2>

          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={fetchDashboard}
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
        {/* Welcome */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-green-600 shadow-sm">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-green-50">
                <BriefcaseBusiness className="h-3.5 w-3.5" />
                Employer Dashboard
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back, {user?.name || "Employer"} 👋
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-green-50 sm:text-base">
                Manage your jobs, review applicants, and confirm completed
                work with your workers.
              </p>
            </div>

            <Link
              to="/post-job"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
            >
              <Plus className="h-4 w-4" />
              Post a Job
            </Link>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Active Jobs"
            value={activeJobs}
            description="Jobs currently available to workers"
            icon={BriefcaseBusiness}
            color="green"
          />

          <StatCard
            label="Applicants"
            value={applicantsCount}
            description="Applications received for your jobs"
            icon={Users}
            color="blue"
          />

          <StatCard
            label="Completed Jobs"
            value={completedJobs}
            description="Job posts marked completed"
            icon={CheckCircle}
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
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Pending Completion
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Follow up on accepted applications that still need completion
                confirmation.
              </p>
            </div>

            {pendingCompletionApplications.length > 0 && (
              <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                {pendingCompletionApplications.length}
              </span>
            )}
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
                    No accepted applications are waiting for completion
                    confirmation.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {pendingCompletionApplications.map((application) => {
                const workerConfirmed =
                  application.worker_confirmed_completion === true;

                const employerConfirmed =
                  application.employer_confirmed_completion === true;

                const workerName =
                  application.worker_name || "Selected worker";

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
                          {application.job_title ||
                            myJobs.find(
                              (job) =>
                                String(job.id) === String(application.job)
                            )?.title ||
                            "Job"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Worker: {workerName}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                        <BriefcaseBusiness className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <ConfirmationRow
                        label="Worker confirmation"
                        confirmed={workerConfirmed}
                      />

                      <ConfirmationRow
                        label="Your confirmation"
                        confirmed={employerConfirmed}
                      />
                    </div>

                    <p className="mt-4 text-xs leading-5 text-gray-500">
                      {employerConfirmed
                        ? "Your confirmation is saved. The worker still needs to confirm."
                        : workerConfirmed
                          ? "The worker has confirmed. Please verify the work and confirm completion."
                          : "Confirm completion after verifying that the work has been completed."}
                    </p>

                    <Link
                      to={`/applicants/${application.job}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
                    >
                      Manage Applicant
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
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your jobs quickly.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <QuickAction
              to="/post-job"
              icon={Plus}
              title="Post a Job"
              description="Create a new temporary or daily work opportunity for workers across Kerala."
              color="green"
            />

            <QuickAction
              to="/my-jobs"
              icon={BriefcaseBusiness}
              title="My Jobs"
              description="View your posted jobs, manage applicants, and monitor your opportunities."
              color="blue"
            />
          </div>
        </section>

        {/* Recent jobs */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Recent Jobs
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your latest posted work opportunities.
              </p>
            </div>

            {myJobs.length > 0 && (
              <Link
                to="/my-jobs"
                className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {myJobs.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <BriefcaseBusiness className="h-8 w-8 text-gray-400" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No jobs posted yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Create your first job posting and start finding workers.
              </p>

              <Link
                to="/post-job"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...myJobs]
                .sort(
                  (a, b) =>
                    new Date(b.created_at || 0) -
                    new Date(a.created_at || 0)
                )
                .slice(0, 3)
                .map((job) => {
                  const jobApplications = myApplications.filter(
                    (application) =>
                      String(application.job) === String(job.id)
                  );

                  const isCompleted = job.status === "completed";
                  const isCancelled = job.status === "cancelled";

                  return (
                    <article
                      key={job.id}
                      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        className={`h-1.5 ${
                          isCompleted
                            ? "bg-blue-500"
                            : isCancelled
                              ? "bg-red-500"
                              : "bg-green-600"
                        }`}
                      />

                      <div className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            {job.category}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              isCompleted
                                ? "bg-blue-50 text-blue-700"
                                : isCancelled
                                  ? "bg-red-50 text-red-700"
                                  : "bg-green-50 text-green-700"
                            }`}
                          >
                            {isCompleted
                              ? "Completed"
                              : isCancelled
                                ? "Cancelled"
                                : "Active"}
                          </span>
                        </div>

                        <h3 className="mt-5 text-xl font-bold tracking-tight text-gray-900">
                          {job.title}
                        </h3>

                        <div className="mt-5 space-y-3">
                          <JobInfo icon={MapPin}>
                            {job.location}
                            {job.district ? `, ${job.district}` : ""}
                          </JobInfo>

                          <JobInfo icon={CalendarDays}>
                            {formatDate(job.date)}
                          </JobInfo>

                          <JobInfo icon={Clock}>{job.time}</JobInfo>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Payment
                            </p>
                            <div className="mt-1 flex items-center gap-1">
                              <IndianRupee className="h-5 w-5 text-green-600" />
                              <span className="text-lg font-bold text-gray-900">
                                {Number(job.payment).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Applicants
                            </p>
                            <div className="mt-1 flex items-center justify-end gap-1.5">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-700">
                                {jobApplications.length}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <Link
                            to={`/job/${job.id}`}
                            className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
                          >
                            View Job
                          </Link>

                          <Link
                            to={`/applicants/${job.id}`}
                            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            Applicants
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, description, icon: Icon, color }) {
  const colors = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
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
      <span className="text-sm text-gray-600">{label}</span>

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

function QuickAction({ to, icon: Icon, title, description, color }) {
  const colors = {
    green: "bg-green-50 text-green-600 group-hover:text-green-700",
    blue: "bg-blue-50 text-blue-600 group-hover:text-blue-700",
  };

  return (
    <Link
      to={to}
      className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>

        <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:translate-x-1 group-hover:text-green-600" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </Link>
  );
}

function JobInfo({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3 text-sm text-gray-500">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
      <span>{children}</span>
    </div>
  );
}

export default EmployerDashboard;
