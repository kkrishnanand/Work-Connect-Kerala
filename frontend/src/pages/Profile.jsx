
import { useEffect, useState } from "react";
import {
  UserRound,
  MapPin,
  BriefcaseBusiness,
  Phone,
  Camera,
  Save,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import api from "../api/axios";

const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export default function Profile() {
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const userResponse = await api.get("accounts/me/");
        const user = userResponse.data;

        if (!user.role || !["worker", "employer"].includes(user.role)) {
          throw new Error("Your account role could not be identified.");
        }

        const profileResponse = await api.get("accounts/profile/");

        if (cancelled) return;

        const data = profileResponse.data;

        setRole(user.role);
        setProfile(data);
        setForm({
          name: user.name || "",
          district: data.district || "",
          skills: data.skills || "",
          availability: data.availability ?? true,
          business_name: data.business_name || "",
          phone: data.phone || "",
        });

        if (data.photo) {
          setPhotoPreview(
            data.photo.startsWith("http")
              ? data.photo
              : `http://127.0.0.1:8000${data.photo}`
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              err.message ||
              "Unable to load your profile."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function selectPhoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be smaller than 5 MB.");
      return;
    }

    setError("");
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      if (role === "worker") {
        formData.append("district", form.district);
        formData.append("skills", form.skills);
        formData.append("availability", String(form.availability));
      } else {
        formData.append("district", form.district);
        formData.append("business_name", form.business_name);
        formData.append("phone", form.phone);
      }

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await api.patch("accounts/profile/", formData);

      setProfile(response.data);
      setPhotoFile(null);
      setMessage("Your profile was saved successfully.");
    } catch (err) {
      const data = err.response?.data;
      const detail =
        typeof data?.detail === "string"
          ? data.detail
          : data
            ? Object.entries(data)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                .join(" ")
            : "Unable to save your profile. Please try again.";

      setError(detail);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-gray-600">
        <LoaderCircle className="h-6 w-6 animate-spin text-green-600" />
        Loading your profile...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-red-200 bg-white p-6 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Unable to open profile
        </h1>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <p className="mt-3 text-sm text-gray-500">
          If your profile has not been created yet, we need to add profile
          creation to the backend.
        </p>
      </div>
    );
  }

  const isWorker = role === "worker";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-green-700">
            WORKCONNECT KERALA
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            My Profile
          </h1>
          <p className="mt-2 text-gray-500">
            Manage your personal information and profile details.
          </p>
        </div>

        <form onSubmit={saveProfile}>
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="h-2 bg-green-600" />

            <div className="p-6 sm:p-9">
              <div className="flex flex-col items-center gap-5 border-b border-gray-100 pb-8 sm:flex-row">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-green-100 bg-green-50">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-14 w-14 text-green-700" />
                    )}
                  </div>

                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-green-600 text-white shadow-md hover:bg-green-700"
                    title="Choose profile photo"
                  >
                    <Camera className="h-5 w-5" />
                  </label>

                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={selectPhoto}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                    {role}
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    {form.name || "Your profile"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {isWorker
                      ? "Help employers discover your skills."
                      : "Keep your business information up to date."}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Images only · Maximum 5 MB
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    <UserRound className="mr-2 inline h-4 w-4" />
                    Full name
                  </label>
                  <input
                    value={form.name || ""}
                    readOnly
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Name editing can be added separately.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    <MapPin className="mr-2 inline h-4 w-4" />
                    District
                  </label>
                  <select
                    name="district"
                    value={form.district || ""}
                    onChange={updateField}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">Select your district</option>
                    {KERALA_DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {isWorker ? (
                  <>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        <BriefcaseBusiness className="mr-2 inline h-4 w-4" />
                        Skills
                      </label>
                      <textarea
                        name="skills"
                        value={form.skills || ""}
                        onChange={updateField}
                        rows={4}
                        placeholder="For example: Catering, cleaning, event assistance..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
                        <input
                          type="checkbox"
                          name="availability"
                          checked={Boolean(form.availability)}
                          onChange={updateField}
                          className="h-5 w-5 accent-green-600"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-gray-800">
                            Available for work
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            Let employers know you are currently available.
                          </span>
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        <BriefcaseBusiness className="mr-2 inline h-4 w-4" />
                        Business name
                      </label>
                      <input
                        name="business_name"
                        value={form.business_name || ""}
                        onChange={updateField}
                        required
                        maxLength={150}
                        placeholder="Enter business name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        <Phone className="mr-2 inline h-4 w-4" />
                        Contact phone
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone || ""}
                        onChange={updateField}
                        required
                        maxLength={15}
                        placeholder="Enter contact number"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div role="status" className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
                  {message}
                </div>
              )}

              <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
