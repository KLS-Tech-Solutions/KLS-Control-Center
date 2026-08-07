"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { isApiError } from "@/lib/api/errors";
import { taskSchema, type TaskValues } from "@/lib/validation";
import type { Task } from "@/types";

/**
 * Create or edit a task, including the rules its submissions are judged by.
 *
 * Every rule here is enforced again by the API on upload — this form is where
 * a super admin decides them, not where they are guaranteed.
 */
export function TaskFormDialog({
  open,
  onClose,
  onSubmit,
  task,
  nextPosition,
  pending,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskValues) => void;
  task?: Task | null;
  nextPosition: number;
  pending: boolean;
  error?: unknown;
}) {
  const form = useZodForm<TaskValues>(taskSchema, {
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      order_number: task?.order_number ?? nextPosition,
      estimated_hours: task?.estimated_hours ?? 10,
      deadline: task?.deadline?.slice(0, 10) ?? "",
      requirements: (task?.requirements ?? []).join("\n"),
      instructions: task?.instructions ?? "",
      is_active: task?.is_active ?? true,
      min_screenshots: task?.min_screenshots ?? 3,
      max_screenshots: task?.max_screenshots ?? 8,
      require_github: task?.require_github ?? true,
      require_explanation: task?.require_explanation ?? true,
      min_explanation_chars: task?.min_explanation_chars ?? 120,
      require_live_demo: task?.require_live_demo ?? false,
    },
  });

  const requireExplanation = form.watch("require_explanation");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={task ? "Edit task" : "Add task"}
      description="Everything here is shown to the student, and the rules are enforced on submission."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button disabled={pending} onClick={form.handleSubmit((v) => onSubmit(v))}>
            <Save />
            {pending ? "Saving…" : task ? "Save changes" : "Add task"}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-6" noValidate>
        {Boolean(error) && (
          <Alert variant="danger">
            {isApiError(error) ? error.userMessage : "Couldn't save the task."}
          </Alert>
        )}

        {/* --- What the student sees ------------------------------------ */}
        <div className="flex flex-col gap-5">
          <FormField form={form} name="title" label="Title" required>
            {(field) => (
              <Input
                {...field}
                {...form.register("title")}
                placeholder="Task 1 — REST API foundation"
              />
            )}
          </FormField>

          <FormField form={form} name="description" label="Brief" required>
            {(field) => (
              <Textarea
                {...field}
                {...form.register("description")}
                rows={3}
                placeholder="What the student must build."
              />
            )}
          </FormField>

          <FormField
            form={form}
            name="instructions"
            label="Detailed instructions"
            hint="Optional. Shown beneath the brief on the task page."
          >
            {(field) => (
              <Textarea
                {...field}
                {...form.register("instructions")}
                rows={4}
                placeholder="Step-by-step guidance, resources, constraints…"
              />
            )}
          </FormField>

          <FormField
            form={form}
            name="requirements"
            label="Requirements checklist"
            hint="One per line."
          >
            {(field) => (
              <Textarea
                {...field}
                {...form.register("requirements")}
                rows={4}
                placeholder={"Public GitHub repository\nMinimum three screenshots\nWritten explanation"}
              />
            )}
          </FormField>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField form={form} name="order_number" label="Position" required>
              {(field) => (
                <Input {...field} {...form.register("order_number")} type="number" min={1} />
              )}
            </FormField>

            <FormField form={form} name="estimated_hours" label="Hours" required>
              {(field) => (
                <Input
                  {...field}
                  {...form.register("estimated_hours")}
                  type="number"
                  min={1}
                />
              )}
            </FormField>

            <FormField form={form} name="deadline" label="Deadline">
              {(field) => <Input {...field} {...form.register("deadline")} type="date" />}
            </FormField>
          </div>
        </div>

        {/* --- Submission rules ----------------------------------------- */}
        <div className="rounded-field border border-line bg-canvas p-5">
          <h3 className="text-[15px] font-semibold text-ink">Submission rules</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-body">
            Enforced by the API. A student cannot submit until every rule is met.
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <label className="flex items-start gap-3 text-[15px] leading-relaxed text-body">
              <input
                type="checkbox"
                {...form.register("is_active")}
                className="mt-1 size-4 shrink-0 rounded border-line accent-[var(--color-brand)]"
              />
              <span>
                <span className="font-medium text-ink">Task is open</span>
                <br />
                Disabled tasks are hidden from students and skipped when checking whether
                an internship is complete. Existing submissions are kept.
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField form={form} name="min_screenshots" label="Minimum screenshots" required>
                {(field) => (
                  <Input
                    {...field}
                    {...form.register("min_screenshots")}
                    type="number"
                    min={0}
                    max={20}
                  />
                )}
              </FormField>

              <FormField form={form} name="max_screenshots" label="Maximum screenshots" required>
                {(field) => (
                  <Input
                    {...field}
                    {...form.register("max_screenshots")}
                    type="number"
                    min={1}
                    max={20}
                  />
                )}
              </FormField>
            </div>

            <label className="flex items-center gap-3 text-[15px] text-body">
              <input
                type="checkbox"
                {...form.register("require_github")}
                className="size-4 shrink-0 rounded border-line accent-[var(--color-brand)]"
              />
              Require a public GitHub repository
            </label>

            <label className="flex items-center gap-3 text-[15px] text-body">
              <input
                type="checkbox"
                {...form.register("require_explanation")}
                className="size-4 shrink-0 rounded border-line accent-[var(--color-brand)]"
              />
              Require a written explanation
            </label>

            {requireExplanation && (
              <FormField
                form={form}
                name="min_explanation_chars"
                label="Minimum explanation length"
                required
                hint="Characters. 120 is roughly two sentences."
              >
                {(field) => (
                  <Input
                    {...field}
                    {...form.register("min_explanation_chars")}
                    type="number"
                    min={0}
                    max={5000}
                  />
                )}
              </FormField>
            )}

            <label className="flex items-center gap-3 text-[15px] text-body">
              <input
                type="checkbox"
                {...form.register("require_live_demo")}
                className="size-4 shrink-0 rounded border-line accent-[var(--color-brand)]"
              />
              Require a live demo URL
            </label>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
