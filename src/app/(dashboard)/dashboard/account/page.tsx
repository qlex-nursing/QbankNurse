"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserRound,
  Mail,
  Camera,
  Save,
  ShieldCheck,
  BookOpen,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
  Pencil,
  X,
  LoaderCircle,
} from "lucide-react";

import {
  getDemoSession,
  updateDemoSession,
  type DemoUser,
} from "@/lib/demo-auth";

import { getSavedItems } from "@/lib/saved-items";

const AVATAR_KEY = "qbanknurse-account-avatar";

export default function AccountPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<DemoUser>({
    name: "",
    email: "",
  });

  const [form, setForm] = useState<DemoUser>({
    name: "",
    email: "",
  });

  const [avatar, setAvatar] = useState("");
  const [savedCount, setSavedCount] = useState(0);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const session = getDemoSession();

    if (session) {
      setUser(session);
      setForm(session);
    }

    const storedAvatar = localStorage.getItem(AVATAR_KEY);

    if (storedAvatar) {
      setAvatar(storedAvatar);
    }

    setSavedCount(getSavedItems().length);
    setStorageReady(true);
  }, []);

  const initials = user.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "QN";

  const handleSaveProfile = () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email) {
      setSuccessMessage("Please enter your name and email address.");
      return;
    }

    setSaving(true);

    const updatedUser = { name, email };
    const updated = updateDemoSession(updatedUser);

    if (!updated) {
      setSuccessMessage("Unable to update your account. Please sign in again.");
      setSaving(false);
      return;
    }

    setUser(updatedUser);
    setForm(updatedUser);
    setEditing(false);
    setSuccessMessage("Your profile has been updated successfully.");

    setSaving(false);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  const handleCancelEdit = () => {
    setForm(user);
    setEditing(false);
    setSuccessMessage("");
  };

  const handleAvatarUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSuccessMessage("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setSuccessMessage("Your profile image must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        try {
          localStorage.setItem(AVATAR_KEY, reader.result);
          setAvatar(reader.result);
          setSuccessMessage("Profile photo updated.");

          window.setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        } catch {
          setSuccessMessage(
            "Unable to save this image. Try a smaller image.",
          );
        }
      }
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  if (!storageReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="dashboard-muted animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1250px] space-y-7 px-4 pb-12 sm:px-6 lg:px-8">

      {/* Page heading */}
      <div className="pt-3">
        <div className="flex items-center gap-2">
          <span className="dashboard-section-label">
            ACCOUNT
          </span>
          <span className="h-px w-10 bg-[#5B3DF5]/30" />
        </div>

        <h1 className="dashboard-heading mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
          My Account
        </h1>

        <p className="dashboard-muted mt-2 max-w-2xl text-sm leading-6">
          Manage your personal information and keep track of your
          learning journey with QbankNurse.
        </p>
      </div>

      {/* Success message */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-[#5B3DF5]/20 bg-[#5B3DF5]/[0.07] px-4 py-3 text-sm text-[#5B3DF5]"
        >
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      {/* Profile hero */}
      <section className="dashboard-card overflow-hidden rounded-2xl border">
        <div className="h-28 bg-gradient-to-r from-[#17263F] via-[#4531B8] to-[#7255F7] sm:h-36" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 items-end gap-4">
              <div className="relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#E8DEFF] text-2xl font-extrabold text-[#5B3DF5] shadow-lg sm:h-28 sm:w-28">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile photo"
                  className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-[#5B3DF5] text-white shadow-md transition hover:bg-[#4930D6]"
                >
                  <Camera size={16} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="dashboard-heading truncate text-xl font-extrabold sm:text-2xl">
                  {user.name || "Your Name"}
                </h2>

                <p className="dashboard-muted mt-1 truncate text-sm">
                  {user.email || "your@email.com"}
                </p>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#E8DEFF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#5B3DF5]">
                  <ShieldCheck size={13} />
                  Demo Account
                </div>
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setSuccessMessage("");
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-4 text-sm font-bold text-white transition hover:bg-[#4930D6]"
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            )}
          </div>

          <p className="dashboard-muted mt-6 text-xs">
            Upload a profile image up to 2MB. JPG, PNG and other
            common image formats are supported.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">

        {/* Personal information */}
        <section className="dashboard-card rounded-2xl border p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
                  <UserRound size={19} />
                </div>

                <div>
                  <h3 className="dashboard-heading font-bold">
                    Personal Information
                  </h3>
                  <p className="dashboard-muted mt-0.5 text-xs">
                    Your basic account details
                  </p>
                </div>
              </div>
            </div>

            {!editing && (
              <span className="dashboard-muted text-xs">
                Profile
              </span>
            )}
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="account-name"
                className="dashboard-heading mb-2 block text-xs font-bold"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="dashboard-muted absolute left-3.5 top-1/2 -translate-y-1/2"
                />

                <input
                  id="account-name"
                  type="text"
                  value={form.name}
                  disabled={!editing}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                  className="dashboard-input h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition focus:border-[#5B3DF5] disabled:cursor-default disabled:opacity-80"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="account-email"
                className="dashboard-heading mb-2 block text-xs font-bold"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="dashboard-muted absolute left-3.5 top-1/2 -translate-y-1/2"
                />

                <input
                  id="account-email"
                  type="email"
                  value={form.email}
                  disabled={!editing}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                  className="dashboard-input h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition focus:border-[#5B3DF5] disabled:cursor-default disabled:opacity-80"
                />
              </div>
            </div>

            {editing && (
              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveProfile}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-5 text-sm font-bold text-white transition hover:bg-[#4930D6] disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Account overview */}
        <section className="dashboard-card rounded-2xl border p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
              <Sparkles size={19} />
            </div>

            <div>
              <h3 className="dashboard-heading font-bold">
                Account Overview
              </h3>
              <p className="dashboard-muted mt-0.5 text-xs">
                Your QbankNurse account
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5B3DF5]/10 text-[#5B3DF5]">
                  <ShieldCheck size={17} />
                </div>

                <span className="dashboard-heading text-sm font-semibold">
                  Account Type
                </span>
              </div>

              <span className="rounded-full bg-[#E8DEFF] px-3 py-1 text-[10px] font-bold text-[#5B3DF5]">
                Demo
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5B3DF5]/10 text-[#5B3DF5]">
                  <Bookmark size={17} />
                </div>

                <span className="dashboard-heading text-sm font-semibold">
                  Saved Resources
                </span>
              </div>

              <span className="dashboard-heading text-sm font-extrabold">
                {savedCount}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5B3DF5]/10 text-[#5B3DF5]">
                  <BookOpen size={17} />
                </div>

                <span className="dashboard-heading text-sm font-semibold">
                  Learning Platform
                </span>
              </div>

              <span className="dashboard-muted text-xs font-medium">
                QbankNurse
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Learning journey */}
      <section className="dashboard-card rounded-2xl border p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="dashboard-heading text-lg font-extrabold">
              Your Learning Journey
            </h3>

            <p className="dashboard-muted mt-1 text-sm">
              Keep building your knowledge, one study session at a time.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
            <Sparkles size={20} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
              <Bookmark size={19} />
            </div>

            <p className="dashboard-muted mt-4 text-xs font-medium">
              Saved Resources
            </p>

            <p className="dashboard-heading mt-1 text-2xl font-extrabold">
              {savedCount}
            </p>

            <p className="dashboard-muted mt-1 text-xs">
              Items in your library
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
              <CalendarDays size={19} />
            </div>

            <p className="dashboard-muted mt-4 text-xs font-medium">
              Study Planning
            </p>

            <p className="dashboard-heading mt-1 text-lg font-extrabold">
              Stay Consistent
            </p>

            <p className="dashboard-muted mt-1 text-xs">
              Build a regular study routine
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DEFF] text-[#5B3DF5]">
              <Clock3 size={19} />
            </div>

            <p className="dashboard-muted mt-4 text-xs font-medium">
              Next Step
            </p>

            <p className="dashboard-heading mt-1 text-lg font-extrabold">
              Keep Learning
            </p>

            <p className="dashboard-muted mt-1 text-xs">
              Practice and review your subjects
            </p>
          </div>
        </div>
      </section>

      {/* Account notice */}
      <section className="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-[#172b45] sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
          <ShieldCheck size={20} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200">
            Demo Account Information
          </h3>

          <p className="mt-1 text-xs leading-6 text-blue-800 dark:text-blue-100">
            This is a frontend demonstration account. Profile changes
            and your uploaded photo are stored locally in this browser.
            Authentication, account verification, password management
            and cloud profile synchronization will be connected when
            the backend API is integrated.
          </p>
        </div>
      </section>
    </div>
  );
}