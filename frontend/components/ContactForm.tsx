"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  city: z.string().optional(),
  projectType: z.string().optional(),
  furnitureRequired: z.string().optional(),
  message: z.string().min(5, "Please tell us a bit about your requirement"),
});

type FormData = z.infer<typeof schema>;

const projectTypes = [
  "Home",
  "Villa",
  "Apartment",
  "Hostel",
  "Hotel",
  "Restaurant / Cafe",
  "School / College",
  "Hospital / Clinic",
  "Office",
  "Shop / Showroom",
  "Other",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("idle");
    try {
      await api.post("/inquiries", data);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-walnut-800">Name *</label>
          <input id="name" {...register("name")} className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring" />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-walnut-800">Phone *</label>
          <input id="phone" {...register("phone")} className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring" />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-walnut-800">Email</label>
          <input id="email" {...register("email")} className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="city" className="text-sm font-medium text-walnut-800">City</label>
          <input id="city" {...register("city")} className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring" />
        </div>
        <div>
          <label htmlFor="projectType" className="text-sm font-medium text-walnut-800">Project Type</label>
          <select id="projectType" {...register("projectType")} className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring">
            <option value="">Select...</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="furnitureRequired" className="text-sm font-medium text-walnut-800">Furniture Required</label>
          <input id="furnitureRequired" placeholder="e.g. Wardrobe, Sofa Set" {...register("furnitureRequired")} className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-walnut-800">Tell us about your requirement *</label>
        <textarea id="message" rows={4} {...register("message")} className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring" />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-sm bg-walnut-900 px-7 py-3 font-medium text-linen hover:bg-brass-600 transition-colors disabled:opacity-60 focus-ring"
      >
        {isSubmitting ? "Sending..." : "Submit Inquiry"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-700">Thank you! We&apos;ve received your inquiry and will contact you shortly.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again or call us directly.</p>
      )}
    </form>
  );
}
