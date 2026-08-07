"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert } from "@/components/ui/misc";
import { isApiError } from "@/lib/api/errors";
import { domainSchema, type DomainValues } from "@/lib/validation";
import type { InternshipDomain } from "@/types";

export function DomainFormDialog({
  open,
  onClose,
  onSubmit,
  domain,
  pending,
  error,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: DomainValues) => void;
  domain?: InternshipDomain | null;
  pending: boolean;
  error?: unknown;
}) {
  const form = useZodForm<DomainValues>(domainSchema, {
    defaultValues: {
      slug: domain?.slug ?? "",
      title: domain?.title ?? "",
      description: domain?.description ?? "",
      duration: domain?.duration ?? "4 weeks",
      difficulty: domain?.difficulty ?? "intermediate",
      icon: domain?.icon ?? "code",
      image_url: domain?.image_url ?? "",
      display_order: domain?.display_order ?? 0,
      status: domain?.status ?? "active",
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={domain ? "Edit domain" : "New internship domain"}
      description="Students see this on the public site and when choosing where to enrol."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            disabled={pending}
            onClick={form.handleSubmit((values) => onSubmit(values))}
          >
            <Save />
            {pending ? "Saving…" : domain ? "Save changes" : "Create domain"}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-5" noValidate>
        {Boolean(error) && (
          <Alert variant="danger">
            {isApiError(error) ? error.userMessage : "Couldn't save. Try again."}
          </Alert>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField form={form} name="title" label="Title" required>
            {(field) => (
              <Input
                {...field}
                {...form.register("title")}
                placeholder="Full Stack Python Development"
              />
            )}
          </FormField>

          <FormField
            form={form}
            name="slug"
            label="Slug"
            required
            hint="Appears in the public URL."
          >
            {(field) => (
              <Input
                {...field}
                {...form.register("slug")}
                placeholder="full-stack-python"
                disabled={Boolean(domain)}
              />
            )}
          </FormField>
        </div>

        <FormField form={form} name="description" label="Description" required>
          {(field) => (
            <Textarea
              {...field}
              {...form.register("description")}
              rows={3}
              placeholder="What a student will build and learn."
            />
          )}
        </FormField>

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField form={form} name="duration" label="Duration" required>
            {(field) => (
              <Input {...field} {...form.register("duration")} placeholder="4 weeks" />
            )}
          </FormField>

          <FormField form={form} name="difficulty" label="Difficulty" required>
            {(field) => (
              <Select {...field} {...form.register("difficulty")}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            )}
          </FormField>

          <FormField form={form} name="status" label="Status" required>
            {(field) => (
              <Select {...field} {...form.register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Hidden</option>
              </Select>
            )}
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            form={form}
            name="icon"
            label="Icon"
            hint="code · layout · shield · sparkles · bot · chart"
          >
            {(field) => <Input {...field} {...form.register("icon")} placeholder="code" />}
          </FormField>

          <FormField
            form={form}
            name="display_order"
            label="Position"
            required
            hint="Lower numbers appear first on the public site."
          >
            {(field) => (
              <Input
                {...field}
                {...form.register("display_order")}
                type="number"
                min={0}
              />
            )}
          </FormField>
        </div>

        <FormField
          form={form}
          name="image_url"
          label="Image URL"
          hint="Optional. Shown on the domain card if set."
        >
          {(field) => (
            <Input
              {...field}
              {...form.register("image_url")}
              placeholder="https://…"
            />
          )}
        </FormField>
      </form>
    </Dialog>
  );
}
