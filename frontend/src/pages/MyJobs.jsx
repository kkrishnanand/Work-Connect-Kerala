import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  Clock,
  Users,
  IndianRupee,
  BriefcaseBusiness,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("workconnectLoggedInUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = localStorage.getItem("workconnectAccessToken");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!user || user.role !== "employer" || !token) {
      setError("Please log in again with your employer account.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("jobs/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // The API may return jobs for all employers.
      // Filter by the logged-in employer's database ID.
      const myJobs = response.data.filter(
        (job) => String(job.employer) === String(user.id)
      );

      setJobs(myJobs);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load your jobs. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [token, user?.id, user?.role]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await api.delete(`jobs/${jobId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((previousJobs) =>
        previousJobs.filter((job) => String(job.id) !== String(jobId))
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to delete this job. Please try again."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Employer Dashboard
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              My Jobs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Manage your posted jobs and review workers who applied.
            </p>
          </div>

          <Link
            to="/post-job"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Post a Job
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button
              onClick={loadJobs}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border bg-white p-10 text-center text-gray-600">
            Loading your jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <BriefcaseBusiness className="mx-auto h-10 w-10 text-green-600" />
            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No jobs posted yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Post your first opportunity to start finding workers.
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
          <>
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <BriefcaseBusiness className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Total Posted Jobs
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {jobs.length}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {jobs.map((job) => {
                const isCompleted = job.status === "completed";

                return (
                  <article
                    key={job.id}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      className={`h-1.5 ${
                        isCompleted ? "bg-blue-500" : "bg-green-600"
                      }`}
                    />

                    <div className="p-6 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                          {job.category}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            isCompleted
                              ? "bg-blue-50 text-blue-700"
                              : job.status === "active"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                        {job.title}
                      </h2>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <Info icon={MapPin} label="Location">
                          {job.location}
                          {job.district ? `, ${job.district}` : ""}
                        </Info>

                        <Info icon={CalendarDays} label="Date">
                          {formatDate(job.date)}
                        </Info>

                        <Info icon={Clock} label="Time">
                          {formatTime(job.start_time)} –{" "}
                          {formatTime(job.end_time)}
                        </Info>

                        <Info icon={Users} label="Workers">
                          {job.workers_required} required
                        </Info>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Payment
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            <IndianRupee className="h-5 w-5 text-green-600" />
                            <span className="text-xl font-bold text-gray-900">
                              {Number(job.payment).toLocaleString("en-IN")}
                            </span>
                            <span className="text-sm text-gray-500">/ day</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Workers
                          </p>
                          <p className="mt-1 text-sm font-semibold text-gray-700">
                            {job.workers_required}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <Link
                          to={`/job/${job.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
                        >
                          View Job <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                          to={`/applicants/${job.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                        >
                          Applicants
                        </Link>

                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-gray-700">
          {children}
        </p>
      </div>
    </div>
  );
}

export default MyJobs;