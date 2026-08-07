import { z } from "zod";

/* ==========================================================================
   Every rule here mirrors a backend constraint. The API enforces all of them
   again — this exists so a reviewer is told before the round trip.
   ========================================================================== */

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .max(255, "Email must be under 255 characters")
  .pipe(z.email("Enter a valid email address"));

export const password = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Password must be under 72 characters")
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/\d/, "Include at least one number");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.input<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordValues = z.input<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "This reset link is missing its token"),
    password,
    confirm_password: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
export type ResetPasswordValues = z.input<typeof resetPasswordSchema>;

/**
 * Review remarks. Required on both outcomes because this text is the only
 * feedback the student receives — an approval with no note tells them nothing,
 * and a rejection with no note leaves them guessing what to fix.
 */
const optionalUrl = z
  .union([
    z.literal(""),
    z.string().trim().pipe(z.url("Enter a valid URL")),
  ])
  .transform((value) => (value === "" ? undefined : value));

export const reviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  remarks: z
    .string()
    .trim()
    .min(3, "Write a short note — the student only sees this")
    .max(2000, "Keep remarks under 2000 characters"),
});
export type ReviewValues = z.input<typeof reviewSchema>;

/* --- Catalogue ------------------------------------------------------------- */

export const domainSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(80, "Keep the slug short")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  title: z.string().trim().min(3, "Title is required").max(150, "Title is too long"),
  description: z.string().trim().min(10, "Describe the domain in a sentence or two"),
  duration: z.string().trim().min(2, "e.g. 4 weeks").max(40, "Keep this short"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  icon: z.string().trim().min(1).max(40),
  image_url: optionalUrl,
  display_order: z.coerce.number().int().min(0, "Cannot be negative").max(999),
  status: z.enum(["active", "inactive"]),
});
export type DomainValues = z.input<typeof domainSchema>;

export const batchSchema = z
  .object({
    domain_id: z.string().min(1, "Choose a domain"),
    batch_name: z.string().trim().min(3, "Name the batch").max(150, "Name is too long"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    seats_total: z.coerce.number().int().min(1, "At least 1 seat").max(1000, "At most 1000"),
    status: z.enum(["upcoming", "ongoing", "closed"]),
  })
  .refine((data) => data.end_date > data.start_date, {
    path: ["end_date"],
    message: "End date must be after the start date",
  });
export type BatchValues = z.input<typeof batchSchema>;

export const taskSchema = z
  .object({
    title: z.string().trim().min(3, "Title is required").max(200, "Title is too long"),
    description: z.string().trim().min(10, "Describe what the student must build"),
    order_number: z.coerce.number().int().min(0, "Position cannot be negative"),
    estimated_hours: z.coerce.number().int().min(1, "At least 1 hour").max(200, "At most 200"),
    deadline: z.string().optional(),
    requirements: z.string().optional(),
    instructions: z.string().optional(),

    // Submission rules. These are enforced again by the API on every upload.
    is_active: z.boolean(),
    min_screenshots: z.coerce.number().int().min(0, "Cannot be negative").max(20, "At most 20"),
    max_screenshots: z.coerce.number().int().min(1, "At least 1").max(20, "At most 20"),
    require_github: z.boolean(),
    require_explanation: z.boolean(),
    min_explanation_chars: z.coerce.number().int().min(0).max(5000),
    require_live_demo: z.boolean(),
  })
  .refine((data) => Number(data.max_screenshots) >= Number(data.min_screenshots), {
    path: ["max_screenshots"],
    message: "Maximum must be at least the minimum",
  });
export type TaskValues = z.input<typeof taskSchema>;

/* --- Team ------------------------------------------------------------------ */

export const inviteAdminSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Enter their full name")
    .max(100, "Name is too long"),
  email,
  role: z.enum(["admin", "super_admin"]),
});
export type InviteAdminValues = z.input<typeof inviteAdminSchema>;

export const acceptInviteSchema = z
  .object({
    token: z.string().min(1, "This invitation link is missing its token"),
    password,
    confirm_password: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
export type AcceptInviteValues = z.input<typeof acceptInviteSchema>;
