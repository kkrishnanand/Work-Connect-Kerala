
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  Clock,
  IndianRupee,
  FileText,
  CheckCircle,
  XCircle,
  Clock3,
  ArrowRight,
  BriefcaseBusiness,
  RefreshCw,
  CheckCheck,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import api from "../api/axios";

function formatDate(value) {
  if (!value) return "Not specified";

  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
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

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (typeof data?.status === "string") {
    return data.status;
  }

  if (Array.isArray(data?.status)) {
    return data.status[0];
  }

  if (typeof data?.non_field_errors?.[0] === "string") {
    return data.non_field_errors[0];
  }

  return (
    data?.message ||
    "Unable to complete this action. Please try again."
  );
}

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingId, setCompletingId] = useState(null);
  const [completionMessages, setCompletionMessages] = useState({});

  const fetchApplications = useCallback(async () => {
    const accessToken = localStorage.getItem(
      "workconnectAccessToken"
    );

    const storedUser = localStorage.getItem(
      "workconnectLoggedInUser"
    );

    if (!accessToken || !storedUser) {
      setError("Please log in to view your applications.");
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "worker") {
        setError("This page is available only to worker accounts.");
        setApplications([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const response = await api.get("applications/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results ?? [];

      // Fetch the latest job details for every application.
      const applicationDetails = await Promise.all(
        data.map(async (application) => {
          try {
            const jobResponse = await api.get(
              `jobs/${application.job}/`
            );

            return {
              ...application,
              jobDetails: jobResponse.data,
            };
          } catch {
            return {
              ...application,
              jobDetails: null,
            };
          }
        })
      );

      setApplications(applicationDetails);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          getErrorMessage(err) ||
            "Unable to load your applications. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleConfirmCompletion = async (applicationId) => {
    const application = applications.find(
      (item) => item.id === applicationId
    );

    if (!application || application.status !== "accepted") {
      return;
    }

    if (application.worker_confirmed_completion) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you have completed this job? Your employer will also need to confirm completion."
    );

    if (!confirmed) return;

    setCompletingId(applicationId);

    setCompletionMessages((previous) => ({
      ...previous,
      [applicationId]: null,
    }));

    try {
      const response = await api.patch(
        `applications/${applicationId}/confirm-completion/`,
        {}
      );

      const updatedApplication = response.data;

      setApplications((previous) =>
        previous.map((item) =>
          item.id === applicationId
            ? {
                ...item,
                ...updatedApplication,
              }
            : item
        )
      );

      setCompletionMessages((previous) => ({
        ...previous,
        [applicationId]: {
          type: "success",
          text:
            updatedApplication.status === "completed"
              ? "Both sides have confirmed. Your job is completed!"
              : "Your confirmation has been saved. Waiting for your employer to confirm.",
        },
      }));
    } catch (err) {
      setCompletionMessages((previous) => ({
        ...previous,
        [applicationId]: {
          type: "error",
          text: getErrorMessage(err),
        },
      }));
    } finally {
      setCompletingId(null);
    }
  };

  const getStatusInfo = (status) => {
    const normalizedStatus = (status || "pending").toLowerCase();

    if (normalizedStatus === "accepted") {
      return {
        label: "Accepted",
        icon: CheckCircle,
        badge: "bg-green-50 text-green-700 border-green-100",
        panel: "bg-green-50/70 border-green-100",
        iconBox: "bg-green-100 text-green-600",
        text: "text-green-700",
        message: "Your application has been accepted.",
        subMessage:
          "Check the job details and coordinate with your employer.",
      };
    }

    if (normalizedStatus === "rejected") {
      return {
        label: "Rejected",
        icon: XCircle,
        badge: "bg-red-50 text-red-700 border-red-100",
        panel: "bg-red-50/70 border-red-100",
        iconBox: "bg-red-100 text-red-600",
        text: "text-red-700",
        message: "Your application was not selected.",
        subMessage:
          "You can continue exploring other opportunities.",
      };
    }

    if (normalizedStatus === "completed") {
      return {
        label: "Completed",
        icon: CheckCheck,
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        panel: "bg-blue-50/70 border-blue-100",
        iconBox: "bg-blue-100 text-blue-600",
        text: "text-blue-700",
        message: "Job completed successfully.",
        subMessage:
          "Both you and your employer have confirmed completion.",
      };
    }

    return {
      label: "Pending",
      icon: Clock3,
      badge: "bg-amber-50 text-amber-700 border-amber-100",
      panel: "bg-amber-50/70 border-amber-100",
      iconBox: "bg-amber-100 text-amber-600",
      text: "text-amber-700",
      message: "Your application is under review.",
      subMessage:
        "You will see an update when the employer responds.",
    };
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <FileText className="h-3.5 w-3.5" />
                Worker Dashboard
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                My Applications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Track your applications, check job details, and confirm
                completed work.
              </p>
            </div>

            {!loading && !error && applications.length > 0 && (
              <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Total Applications
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {applications.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-green-600" />
            <p className="mt-4 text-sm text-gray-500">
              Loading your applications...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-white px-6 py-12 text-center shadow-sm">
            <XCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Unable to load applications
            </h2>

            <p role="alert" className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={fetchApplications}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>

              <Link
                to="/login"
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Log in
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && applications.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
              <BriefcaseBusiness className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900 sm:text-2xl">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't applied for any jobs yet. Explore available
              opportunities and submit your first application.
            </p>

            <Link
              to="/find-jobs"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              Find Work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Application cards */}
        {!loading && !error && applications.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {applications.map((application) => {
              const job = application.jobDetails;
              const statusInfo = getStatusInfo(application.status);
              const StatusIcon = statusInfo.icon;
              const completionMessage =
                completionMessages[application.id];

              return (
                <article
                  key={application.id}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-1.5 bg-green-600" />

                  <div className="p-6 sm:p-7">
                    {/* Category and status */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                        {job?.category || "Job"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusInfo.badge}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusInfo.label}
                      </span>
                    </div>

                    <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                      {job?.title ||
                        application.job_title ||
                        "Job unavailable"}
                    </h2>

                    {/* Job information */}
                    {job ? (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Location
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-gray-700">
                              {job.location}
                              {job.district ? `, ${job.district}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Date
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-gray-700">
                              {formatDate(job.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Time
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-gray-700">
                              {formatTime(job.start_time)} -{" "}
                              {formatTime(job.end_time)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                          <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Payment
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-gray-900">
                              ₹
                              {Number(job.payment).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-gray-500">
                        The job details are no longer available.
                      </p>
                    )}

                    {/* Application status panel */}
                    <div
                      className={`mt-6 rounded-2xl border p-4 ${statusInfo.panel}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${statusInfo.iconBox}`}
                        >
                          <StatusIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold ${statusInfo.text}`}
                          >
                            {statusInfo.message}
                          </p>

                          <p
                            className={`mt-1 text-xs leading-5 ${statusInfo.text} opacity-80`}
                          >
                            {statusInfo.subMessage}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Worker completion confirmation */}
                    {application.status === "accepted" && (
                      <div className="mt-4 rounded-2xl border border-green-100 bg-green-50/70 p-4">
                        <h3 className="text-sm font-semibold text-green-900">
                          Finished the work?
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-green-800">
                          Confirm after completing the work. Your employer
                          must also confirm before this application becomes
                          completed.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handleConfirmCompletion(application.id)
                          }
                          disabled={
                            completingId === application.id ||
                            application.worker_confirmed_completion === true
                          }
                          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
                        >
                          {completingId === application.id ? (
                            <>
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                              Saving confirmation...
                            </>
                          ) : application.worker_confirmed_completion ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Completion confirmed
                            </>
                          ) : (
                            <>
                              <CheckCheck className="h-4 w-4" />
                              I've completed this job
                            </>
                          )}
                        </button>

                        {application.employer_confirmed_completion && (
                          <p className="mt-3 text-xs font-medium text-green-700">
                            Your employer has also confirmed completion.
                          </p>
                        )}

                        {application.worker_confirmed_completion &&
                          !application.employer_confirmed_completion && (
                            <p className="mt-3 text-xs text-green-800">
                              Your confirmation is saved. Waiting for the
                              employer to confirm.
                            </p>
                          )}
                      </div>
                    )}

                    {/* Completion feedback */}
                    {completionMessage && (
                      <div
                        role="status"
                        className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
                          completionMessage.type === "success"
                            ? "border-green-100 bg-green-50 text-green-800"
                            : "border-red-100 bg-red-50 text-red-700"
                        }`}
                      >
                        {completionMessage.type === "success" ? (
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        ) : (
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        )}
                        <span>{completionMessage.text}</span>
                      </div>
                    )}

                    {/* Application footer */}
                    <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs text-gray-400">
                          Applied on
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {application.applied_at
                            ? new Date(
                                application.applied_at
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Date unavailable"}
                        </p>
                      </div>

                      {job && (
                        <Link
                          to={`/job/${job.id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 sm:w-auto"
                        >
                          View Job
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </Link>
                      )}
                    </div>
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

export default MyApplications;
