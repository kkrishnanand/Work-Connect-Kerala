
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Users,
  MapPin,
  CalendarDays,
  Clock,
  IndianRupee,
  CheckCircle,
  XCircle,
  Clock3,
  ArrowLeft,
  BriefcaseBusiness,
  AlertCircle,
  RefreshCw,
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
  if (typeof data?.status === "string") return data.status;
  if (Array.isArray(data?.status)) return data.status[0];
  if (typeof data?.message === "string") return data.message;

  return "Something went wrong. Please try again.";
}

function Applicants() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionMessages, setActionMessages] = useState({});

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("workconnectAccessToken");
    const storedUser = localStorage.getItem("workconnectLoggedInUser");

    if (!token || !storedUser) {
      setError("Please log in with your employer account.");
      setLoading(false);
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch {
      setError("Your login session is invalid. Please log in again.");
      setLoading(false);
      return;
    }

    if (user.role !== "employer") {
      setError("Only employers can manage applicants.");
      setLoading(false);
      return;
    }

    if (!jobId) {
      setError("No job was selected. Open Applicants from My Jobs.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const [jobResponse, applicationsResponse] = await Promise.all([
        api.get(`jobs/${jobId}/`, config),
        api.get("applications/", config),
      ]);

      const fetchedJob = jobResponse.data;

      if (String(fetchedJob.employer) !== String(user.id)) {
        setError("You can only manage applicants for your own jobs.");
        setJob(null);
        setApplications([]);
        return;
      }

      setJob({
        ...fetchedJob,
        time: `${formatTime(fetchedJob.start_time)} - ${formatTime(
          fetchedJob.end_time
        )}`,
      });

      const responseData = applicationsResponse.data;
      const allApplications = Array.isArray(responseData)
        ? responseData
        : responseData.results ?? [];

      const selectedApplications = allApplications
        .filter(
          (application) => String(application.job) === String(jobId)
        )
        .map((application) => ({
          ...application,
          workerName: application.worker_name,
          workerEmail: application.worker_email,
          status: String(application.status || "pending").toLowerCase(),
        }));

      setApplications(selectedApplications);
    } catch (err) {
      setJob(null);
      setApplications([]);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError(
          err.response?.data?.detail ||
            "You don't have permission to view these applicants."
        );
      } else if (err.response?.status === 404) {
        setError("The job could not be found or is not accessible.");
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateApplicationStatus = async (applicationId, newStatus) => {
    if (!["accepted", "rejected"].includes(newStatus)) return;

    const token = localStorage.getItem("workconnectAccessToken");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setActionLoading(applicationId);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.patch(
        `applications/${applicationId}/status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = response.data;

      setApplications((previous) =>
        previous.map((application) =>
          String(application.id) === String(updated.id)
            ? {
                ...application,
                ...updated,
                workerName:
                  updated.worker_name ?? application.workerName,
                workerEmail:
                  updated.worker_email ?? application.workerEmail,
                status: String(updated.status).toLowerCase(),
              }
            : application
        )
      );

      setSuccessMessage(
        newStatus === "accepted"
          ? "Applicant accepted successfully."
          : "Application rejected successfully."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const confirmCompletion = async (application) => {
    if (
      application.status !== "accepted" ||
      application.employer_confirmed_completion
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Confirm that ${application.workerName || "this worker"} has completed the job?`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("workconnectAccessToken");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setActionLoading(`completion-${application.id}`);
    setError("");
    setSuccessMessage("");
    setActionMessages((previous) => ({
      ...previous,
      [application.id]: "",
    }));

    try {
      const response = await api.patch(
        `applications/${application.id}/confirm-completion/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updated = response.data;

      setApplications((previous) =>
        previous.map((item) =>
          String(item.id) === String(updated.id)
            ? {
                ...item,
                ...updated,
                workerName: updated.worker_name ?? item.workerName,
                workerEmail: updated.worker_email ?? item.workerEmail,
                status: String(updated.status).toLowerCase(),
              }
            : item
        )
      );

      setActionMessages((previous) => ({
        ...previous,
        [application.id]:
          updated.status === "completed"
            ? "Both sides have confirmed completion. This application is now completed!"
            : "Your confirmation is saved. The worker's confirmation is still required.",
      }));
    } catch (err) {
      setActionMessages((previous) => ({
        ...previous,
        [application.id]: getErrorMessage(err),
      }));
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusInfo = (status) => {
    const normalized = String(status || "pending").toLowerCase();

    if (normalized === "accepted") {
      return {
        icon: CheckCircle,
        label: "Accepted",
        badge: "border-green-100 bg-green-50 text-green-700",
      };
    }

    if (normalized === "rejected") {
      return {
        icon: XCircle,
        label: "Rejected",
        badge: "border-red-100 bg-red-50 text-red-700",
      };
    }

    if (normalized === "completed") {
      return {
        icon: CheckCheck,
        label: "Completed",
        badge: "border-blue-100 bg-blue-50 text-blue-700",
      };
    }

    return {
      icon: Clock3,
      label: "Pending",
      badge: "border-amber-100 bg-amber-50 text-amber-700",
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-green-600" />
          <p className="mt-4 text-sm text-gray-500">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Unable to load applicants
          </h2>

          <p role="alert" className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={fetchApplicants}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            <Link
              to="/my-jobs"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Link
          to="/my-jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-green-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Jobs
        </Link>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <Users className="h-3.5 w-3.5" />
                Applicant Management
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Applicants
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                Review applicants and confirm completed work for{" "}
                <span className="font-semibold text-gray-700">
                  {job?.title}
                </span>
                .
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Total Applicants
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {applications.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Job details */}
        {job && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-green-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Job Details
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <JobInfo icon={MapPin} label="Location">
                {job.location}
                {job.district ? `, ${job.district}` : ""}
              </JobInfo>

              <JobInfo icon={CalendarDays} label="Date">
                {formatDate(job.date)}
              </JobInfo>

              <JobInfo icon={Clock} label="Time">
                {job.time}
              </JobInfo>

              <JobInfo icon={IndianRupee} label="Payment">
                ₹{Number(job.payment).toLocaleString("en-IN")}
              </JobInfo>
            </div>
          </div>
        )}

        {/* Applicants */}
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Users className="h-8 w-8 text-gray-400" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900">
              No applicants yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Workers who apply for this job will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {applications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              const StatusIcon = statusInfo.icon;
              const isPending = application.status === "pending";
              const isUpdating = actionLoading === application.id;
              const isConfirming =
                actionLoading === `completion-${application.id}`;
              const message = actionMessages[application.id];

              return (
                <article
                  key={application.id}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`h-1.5 ${
                      application.status === "accepted"
                        ? "bg-green-500"
                        : application.status === "rejected"
                          ? "bg-red-500"
                          : application.status === "completed"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                    }`}
                  />

                  <div className="p-6 sm:p-7">
                    {/* Worker details and status */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                            {application.workerName || "Worker"}
                          </h2>
                          <p className="mt-1 break-all text-sm text-gray-500">
                            {application.workerEmail || "Email unavailable"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusInfo.badge}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Application date */}
                    <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Applied On
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {application.applied_at
                          ? new Date(
                              application.applied_at
                            ).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Date unavailable"}
                      </p>
                    </div>

                    {/* Accept or reject */}
                    {isPending && (
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          disabled={actionLoading !== null}
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              "accepted"
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {isUpdating ? "Updating..." : "Accept Applicant"}
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading !== null}
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              "rejected"
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <XCircle className="h-4 w-4" />
                          {isUpdating ? "Updating..." : "Reject"}
                        </button>
                      </div>
                    )}

                    {/* Accepted application */}
                    {application.status === "accepted" && (
                      <div className="mt-6 rounded-2xl border border-green-100 bg-green-50/70 p-4">
                        <p className="text-sm font-semibold text-green-800">
                          Applicant accepted
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-700">
                          Confirm completion after this worker has finished
                          the work.
                        </p>

                        {application.worker_confirmed_completion ? (
                          <div className="mt-4 rounded-xl border border-green-200 bg-white p-3">
                            <p className="flex items-center gap-2 text-sm font-semibold text-green-800">
                              <CheckCircle className="h-4 w-4" />
                              Worker confirmed completion
                            </p>
                            <p className="mt-1 text-xs text-gray-600">
                              Please confirm if the work has been completed.
                            </p>
                          </div>
                        ) : (
                          <p className="mt-4 rounded-xl bg-white p-3 text-xs text-gray-600">
                            Waiting for the worker to confirm completion.
                          </p>
                        )}

                        <button
                          type="button"
                          disabled={
                            actionLoading !== null ||
                            application.employer_confirmed_completion === true
                          }
                          onClick={() => confirmCompletion(application)}
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
                        >
                          {isConfirming ? (
                            <>
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                              Saving confirmation...
                            </>
                          ) : application.employer_confirmed_completion ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Completion confirmed
                            </>
                          ) : (
                            <>
                              <CheckCheck className="h-4 w-4" />
                              Confirm completion
                            </>
                          )}
                        </button>

                        {application.employer_confirmed_completion &&
                          !application.worker_confirmed_completion && (
                            <p className="mt-3 text-xs text-green-800">
                              Your confirmation is saved. Waiting for the
                              worker to confirm.
                            </p>
                          )}

                        {application.worker_confirmed_completion &&
                          application.employer_confirmed_completion && (
                            <p className="mt-3 text-xs font-semibold text-green-800">
                              Both sides confirmed completion.
                            </p>
                          )}
                      </div>
                    )}

                    {/* Rejected */}
                    {application.status === "rejected" && (
                      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/70 p-4">
                        <p className="text-sm font-semibold text-red-700">
                          Applicant rejected
                        </p>
                        <p className="mt-1 text-xs leading-5 text-red-600">
                          This application was not selected.
                        </p>
                      </div>
                    )}

                    {/* Completed */}
                    {application.status === "completed" && (
                      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                        <p className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                          <CheckCheck className="h-5 w-5" />
                          Job completed
                        </p>
                        <p className="mt-1 text-xs leading-5 text-blue-700">
                          Both the worker and employer have confirmed
                          completion. Ratings and reviews can be added next.
                        </p>
                      </div>
                    )}

                    {/* Action feedback */}
                    {message && (
                      <div
                        role="status"
                        className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{message}</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function JobInfo({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-700">
          {children}
        </p>
      </div>
    </div>
  );
}

export default Applicants;
