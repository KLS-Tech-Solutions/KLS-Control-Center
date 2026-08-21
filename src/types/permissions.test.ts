import { describe, expect, it } from "vitest";

import { can, hasReached, JOURNEY_ORDER } from "@/types";

/**
 * Role capabilities.
 *
 * `can()` decides what the console *shows*. The API enforces the same rules
 * again on every request, so a mistake here is not a security hole — but a
 * reviewer seeing a button that always 403s, or not seeing one they are
 * entitled to, is a support ticket either way.
 */
describe("can", () => {
  it("lets a super admin manage the catalogue", () => {
    expect(can("super_admin", "manageCatalogue")).toBe(true);
  });

  it("does not let a plain admin manage the catalogue", () => {
    // Domains, batches and tasks stay super-admin only: changing a batch
    // mid-flight moves the goalposts for students already enrolled in it.
    expect(can("admin", "manageCatalogue")).toBe(false);
  });

  it("does not let a student do anything administrative", () => {
    expect(can("student", "manageCatalogue")).toBe(false);
    expect(can("student", "readActivityLogs")).toBe(false);
  });

  it("treats an unknown or missing role as having no capability", () => {
    // `useSession()` returns undefined while loading. Defaulting to "allowed"
    // would flash admin-only controls at everyone for a moment.
    expect(can(undefined, "manageCatalogue")).toBe(false);
    expect(can("", "manageCatalogue")).toBe(false);
    expect(can("nonsense", "manageCatalogue")).toBe(false);
  });
});

/**
 * The console renders student journeys from the same stage order the student
 * app uses. If the two drift, an admin sees a different picture of a student's
 * progress than the student does.
 */
describe("journey order", () => {
  it("matches the API's stages, with no payment step", () => {
    expect(JOURNEY_ORDER).toEqual([
      "not_enrolled",
      "enrolled",
      "offer_letter_generated",
      "linkedin_submitted",
      "linkedin_approved",
      "tasks_in_progress",
      "all_tasks_approved",
      "certificate_issued",
    ]);
  });

  it("orders consistently", () => {
    expect(hasReached("certificate_issued", "enrolled")).toBe(true);
    expect(hasReached("enrolled", "certificate_issued")).toBe(false);
  });
});
