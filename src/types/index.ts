/* ==========================================================================
   Domain types — mirrored one-to-one from the KLS Academy MVP PostgreSQL
   schema (v2). Keep field names identical to the database columns so the
   Phase 3 API swap needs no mapping layer.
   ========================================================================== */

export type UUID = string;
export type ISODate = string;

/* --- users ---------------------------------------------------------------- */

export type UserRole = "student" | "admin" | "super_admin";
export type UserStatus = "active" | "suspended" | "pending";

export interface User {
  id: UUID;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  created_at: ISODate;
}

export interface StudentProfile {
  id: UUID;
  user_id: UUID;
  college_name: string;
  degree: string;
  branch: string;
  year: string;
  linkedin_url: string | null;
  github_url: string | null;
}

/* --- internships ---------------------------------------------------------- */

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type PublishStatus = "active" | "inactive";

export interface InternshipDomain {
  id: UUID;
  slug: string;
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  status: PublishStatus;
  icon: string;
  image_url: string | null;
  /** Position in the public catalogue. Lower numbers appear first. */
  display_order: number;
  outcomes: string[];
  skills: string[];
  task_count: number;
}

export interface InternshipBatch {
  id: UUID;
  domain_id: UUID;
  batch_name: string;
  start_date: ISODate;
  end_date: ISODate;
  status: "upcoming" | "ongoing" | "closed";
  seats_total: number;
  seats_left: number;
}

/* --- enrollment ----------------------------------------------------------- */

export type EnrollmentStatus =
  | "active"
  | "completed"
  | "withdrawn";

export interface Enrollment {
  id: UUID;
  student_id: UUID;
  batch_id: UUID;
  status: EnrollmentStatus;
  enrolled_at: ISODate;
  completed_at: ISODate | null;
}

export interface OfferLetter {
  id: UUID;
  student_id: UUID;
  batch_id: UUID;
  offer_letter_number: string;
  pdf_url: string;
  generated_at: ISODate;
  linkedin_verified: boolean;
}

/* --- reviewable submissions ----------------------------------------------- */

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface LinkedInSubmission {
  id: UUID;
  student_id: UUID;
  offer_letter_id: UUID;
  linkedin_post_url: string;
  status: ReviewStatus;
  admin_comment: string | null;
  submitted_at: ISODate;
}

export interface Task {
  id: UUID;
  batch_id: UUID;
  title: string;
  description: string;
  order_number: number;
  deadline: ISODate | null;
  requirements: string[];
  estimated_hours: number;

  /* --- submission rules, configured per task by a super admin ----------- */
  /** A disabled task is hidden from students and skipped by the journey engine. */
  is_active: boolean;
  instructions: string | null;
  min_screenshots: number;
  max_screenshots: number;
  require_github: boolean;
  require_explanation: boolean;
  min_explanation_chars: number;
  require_live_demo: boolean;
}

export type SubmissionStatus =
  | "not_started"
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export interface TaskScreenshot {
  id: UUID;
  submission_id: UUID;
  image_url: string;
  display_order: number;
}

export interface TaskSubmission {
  id: UUID;
  task_id: UUID;
  student_id: UUID;
  title: string;
  github_url: string;
  live_demo_url: string | null;
  description: string;
  status: SubmissionStatus;
  submitted_at: ISODate | null;
  /** Incremented on resubmission so reviewers can see the history. */
  attempt: number;
  screenshots: TaskScreenshot[];
  review: AdminReview | null;
}

export interface AdminReview {
  id: UUID;
  submission_id: UUID;
  reviewed_by: string;
  remarks: string;
  status: ReviewStatus;
  reviewed_at: ISODate;
}

/* --- money & credentials --------------------------------------------------- */



export interface Certificate {
  id: UUID;
  student_id: UUID;
  certificate_number: string;
  certificate_url: string;
  qr_code_url: string;
  issued_at: ISODate;
  /* Denormalised for the public verification page. */
  student_name: string;
  domain_title: string;
  duration: string;
  batch_name: string;
}

/* --- comms ---------------------------------------------------------------- */

export type NotificationType =
  | "welcome"
  | "offer_letter"
  | "linkedin"
  | "task"
  | "review"
  | "payment"
  | "certificate"
  | "announcement";

export interface AppNotification {
  id: UUID;
  user_id: UUID;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: ISODate;
}

/* ==========================================================================
   Journey state machine — the single value that drives what every dashboard
   screen renders and what stays locked.
   ========================================================================== */

export type JourneyStage =
  | "not_enrolled"
  | "enrolled"
  | "offer_letter_generated"
  | "linkedin_submitted"
  | "linkedin_approved"
  | "tasks_in_progress"
  | "all_tasks_approved"
  | "certificate_issued";

export const JOURNEY_ORDER: JourneyStage[] = [
  "not_enrolled",
  "enrolled",
  "offer_letter_generated",
  "linkedin_submitted",
  "linkedin_approved",
  "tasks_in_progress",
  "all_tasks_approved",
  "certificate_issued",
];

/** True when `stage` has reached at least `target`. */
export function hasReached(stage: JourneyStage, target: JourneyStage) {
  return JOURNEY_ORDER.indexOf(stage) >= JOURNEY_ORDER.indexOf(target);
}

/** Aggregate view a dashboard screen needs in one object. */
export interface StudentJourney {
  stage: JourneyStage;
  user: User;
  profile: StudentProfile;
  domain: InternshipDomain | null;
  batch: InternshipBatch | null;
  enrollment: Enrollment | null;
  offerLetter: OfferLetter | null;
  linkedinSubmission: LinkedInSubmission | null;
  tasks: Task[];
  submissions: TaskSubmission[];
  certificate: Certificate | null;
  notifications: AppNotification[];
  /**
   * Every internship the student has taken, newest first, the current one
   * flagged. The API returns this on /admin/students/{id} as well, which is
   * how the console shows past internships alongside the one in progress.
   */
  history: InternshipHistoryEntry[];
  can_enroll_again: boolean;
  /** In paise, from the API config. Never hardcode the amount in the UI. */
}

/* ==========================================================================
   Admin-only additions. Everything above is copied verbatim from the academy
   repo and must stay identical — the two apps share these shapes.
   ========================================================================== */

/** Row in the student directory: the user plus their computed stage. */
export interface AdminStudentSummary extends User {
  stage: JourneyStage;
}

export interface AnalyticsOverview {
  students_total: number;
  students_by_stage: Record<string, number>;
  pending_linkedin_reviews: number;
  pending_task_reviews: number;
  certificates_issued: number;
  /** Paise — divide by 100 only at the point of display. */
  revenue_paise: number;
}

export interface ActivityLogEntry {
  id: UUID;
  user_id: UUID | null;
  activity: string;
  module: string;
  entity_id: string | null;
  created_at: ISODate;
}

export type AdminRole = Extract<UserRole, "admin"> | "super_admin";

/** What each role may do. The backend enforces this; the UI mirrors it. */
export const ROLE_CAPABILITIES = {
  review: ["admin", "super_admin"],
  viewStudents: ["admin", "super_admin"],
  viewMoney: ["admin", "super_admin"],
  manageCatalogue: ["super_admin"],
  revokeCertificates: ["super_admin"],
  readActivityLogs: ["super_admin"],
} as const;

export type Capability = keyof typeof ROLE_CAPABILITIES;

export function can(role: string | undefined, capability: Capability): boolean {
  if (!role) return false;
  return (ROLE_CAPABILITIES[capability] as readonly string[]).includes(role);
}

/** Row in the team screen. */
export interface AdminAccount extends User {
  last_login_at: ISODate | null;
}

export interface AdminInviteResult {
  admin: AdminAccount;
  /** Present only while email delivery is unconfigured — send it by hand. */
  invite_url: string | null;
  email_delivered: boolean;
}

export interface InvitePreview {
  full_name: string;
  email: string;
  role: UserRole;
}


/** One chapter of study notes for an internship domain. */
export interface LearningChapter {
  id: string;
  domain_id: string;
  title: string;
  summary: string | null;
  order_number: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  pdf_url: string | null;
  pdf_filename: string | null;
  pdf_size_bytes: number | null;
  estimated_minutes: number;
  status: "active" | "inactive";
  is_read: boolean;
  /** Who last created or edited this chapter. Any admin can, so it is worth
   *  recording. Empty for chapters that predate the audit column. */
  updated_by: string | null;
  updated_by_name: string;
}

/** One internship in a student's history. */
export interface InternshipHistoryEntry {
  enrollment_id: string;
  batch_id: string;
  batch_name: string;
  domain_title: string;
  domain_slug: string | null;
  duration: string | null;
  status: "active" | "completed" | "withdrawn";
  enrolled_at: string;
  completed_at: string | null;
  is_current: boolean;
  tasks_total: number;
  tasks_approved: number;
  offer_letter_number: string | null;
  offer_letter_url: string | null;
  certificate_number: string | null;
  certificate_url: string | null;
  certificate_issued_at: string | null;
}
