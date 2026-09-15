"use client";

import { useEffect, useState, FormEvent } from "react";
import { getSettings, updateSettings } from "@/lib/api";

interface SettingsForm {
  businessName: string;
  ownerName: string;
  experience: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  tagline: string;
  aboutDescription: string;
}

const EMPTY_FORM: SettingsForm = {
  businessName: "",
  ownerName: "",
  experience: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  businessHours: "",
  tagline: "",
  aboutDescription: "",
};

const FIELD_META: {
  key: keyof SettingsForm;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  half?: boolean;
}[] = [
  { key: "businessName", label: "Business Name", placeholder: "Sharma Furniture House", required: true },
  { key: "tagline", label: "Website Tagline", placeholder: "Custom Carpentry & Furniture, Indore" },
  { key: "ownerName", label: "Owner / Craftsman Name", placeholder: "Mr. Dhananjay Sharma", required: true },
  { key: "experience", label: "Experience", placeholder: "30+ Years", half: true },
  { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel", required: true, half: true },
  { key: "email", label: "Email Address", placeholder: "info@sharmafurniturehouse.com", type: "email", required: true, half: true },
  { key: "whatsapp", label: "WhatsApp Number", placeholder: "919876543210", type: "tel", half: true },
  { key: "address", label: "Business Address", placeholder: "203 Nandbag Colony, Near Marimata, Indore, MP, India", required: true },
  { key: "businessHours", label: "Business Hours", placeholder: "Monday – Saturday, 10:00 AM – 7:00 PM" },
  { key: "aboutDescription", label: "About / Business Description", placeholder: "Write a short description of your business for the website...", type: "textarea" },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof SettingsForm, string>>>({});

  // Fetch current settings
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getSettings();
        if (!cancelled && res?.data) {
          setForm((prev) => {
            const next = { ...prev };
            for (const key of Object.keys(next) as (keyof SettingsForm)[]) {
              if (res.data[key]) next[key] = res.data[key];
            }
            return next;
          });
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load settings. Please refresh.");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const validate = (): boolean => {
    const errors: Partial<Record<keyof SettingsForm, string>> = {};
    if (!form.businessName.trim()) errors.businessName = "Business name is required";
    if (!form.ownerName.trim()) errors.ownerName = "Owner name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    if (form.whatsapp.trim() && !/^\d{10,15}$/.test(form.whatsapp.trim())) {
      errors.whatsapp = "WhatsApp number should be 10-15 digits (no +)";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!validate()) return;

    setSaving(true);
    try {
      // Build a Record<string,string> with trimmed non-empty values
      const payload: Record<string, string> = {};
      for (const [key, val] of Object.entries(form)) {
        const trimmed = val.trim();
        if (trimmed) payload[key] = trimmed;
      }
      await updateSettings(payload);
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear field-level error on edit
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="h-8 w-48 bg-walnut-100 rounded animate-pulse mb-2" />
        <div className="h-4 w-80 bg-walnut-50 rounded animate-pulse mb-8" />
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-walnut-100 rounded animate-pulse" />
              <div className="h-11 bg-walnut-50 rounded-sm animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-walnut-900">Site Settings</h1>
        <p className="mt-1 text-sm text-walnut-500">
          Manage your business information displayed across the website — Contact page, Footer, Home, and About sections.
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 animate-fade-in">
          <svg className="h-5 w-5 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Settings form */}
      <form onSubmit={handleSubmit} noValidate className="rounded-sm border border-walnut-100 bg-white/60 shadow-sm">
        <div className="border-b border-walnut-100 bg-walnut-50/50 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">Business Information</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Grid layout for half-width fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            {FIELD_META.map((field) => {
              const fieldError = validationErrors[field.key];
              const isTextarea = field.type === "textarea";

              const inputEl = isTextarea ? (
                <textarea
                  id={`settings-${field.key}`}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className={`block w-full rounded-sm border px-3 py-2.5 text-sm text-walnut-900 placeholder:text-walnut-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brass-400/50 focus:border-brass-500 ${
                    fieldError ? "border-red-400 bg-red-50/30" : "border-walnut-200 bg-white"
                  }`}
                />
              ) : (
                <input
                  id={`settings-${field.key}`}
                  type={field.type || "text"}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`block w-full rounded-sm border px-3 py-2.5 text-sm text-walnut-900 placeholder:text-walnut-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brass-400/50 focus:border-brass-500 ${
                    fieldError ? "border-red-400 bg-red-50/30" : "border-walnut-200 bg-white"
                  }`}
                />
              );

              // Full width for textarea and non-half fields
              const wrapper = (
                <div key={field.key} className={isTextarea || !field.half ? "sm:col-span-2" : ""}>
                  <label
                    htmlFor={`settings-${field.key}`}
                    className="mb-1.5 block text-sm font-medium text-walnut-700"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {inputEl}
                  {fieldError && (
                    <p className="mt-1 text-xs text-red-600">{fieldError}</p>
                  )}
                </div>
              );

              return wrapper;
            })}
          </div>
        </div>

        {/* Footer with save button */}
        <div className="flex items-center justify-between border-t border-walnut-100 bg-walnut-50/30 px-6 py-4">
          <p className="text-xs text-walnut-400">
            Changes will be reflected on the public website immediately.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-sm bg-walnut-900 px-6 py-2.5 text-sm font-medium text-linen hover:bg-brass-600 transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {saving && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
            )}
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
