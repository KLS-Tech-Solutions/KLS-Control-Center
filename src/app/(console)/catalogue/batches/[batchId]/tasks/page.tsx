"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  ListOrdered,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Textarea } from "@/components/ui/input";
import { FormField, useZodForm } from "@/components/ui/form";
import { Alert, Skeleton } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { RequireCapability } from "@/components/shared/role-gate";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import {
  useCreateTask,
  useDeleteTask,
  useReorderTasks,
  useTasks,
} from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";
import { taskSchema, type TaskValues } from "@/lib/validation";
import type { Task } from "@/types";

export default function BatchTasksPage() {
  return (
    <RequireCapability capability="manageCatalogue">
      <BatchTasks />
    </RequireCapability>
  );
}

function BatchTasks() {
  const params = useParams<{ batchId: string }>();
  const query = useTasks(params.batchId);
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const reorder = useReorderTasks();
  const { toast } = useToast();

  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Task | null>(null);
  const [order, setOrder] = React.useState<string[] | null>(null);

  const tasks = query.data ?? [];
  const technical = tasks.filter((t) => t.order_number > 0);
  const onboarding = tasks.find((t) => t.order_number === 0);

  const workingOrder = order ?? technical.map((t) => t.id);
  const dirty = order !== null && order.join() !== technical.map((t) => t.id).join();

  const move = (index: number, delta: number) => {
    const next = [...workingOrder];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  };

  const byId = new Map(technical.map((t) => [t.id, t]));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link
        href="/catalogue/batches"
        className="inline-flex items-center gap-2 text-sm font-medium text-body transition-colors hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        All batches
      </Link>

      <PageHeader
        title="Tasks"
        description="Students work through these in order — each one unlocks only after the previous is approved."
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus />
            Add task
          </Button>
        }
      />

      <Alert variant="warning" icon={<AlertTriangle />} title="Reordering is not cosmetic">
        Students are locked task-by-task behind the previous approval. Changing the order
        of a batch that is already running changes which task is open to people mid-flight.
      </Alert>

      {onboarding && (
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Badge variant="brand">Position 0</Badge>
            <p className="text-[15px] font-medium text-ink">{onboarding.title}</p>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-body">
            The LinkedIn onboarding task. It always sits first and cannot be reordered.
          </p>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        {query.isPending ? (
          <div className="flex flex-col gap-2 p-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : query.isError ? (
          <ErrorState
            message={
              isApiError(query.error) ? query.error.userMessage : "Couldn't load tasks."
            }
            onRetry={() => query.refetch()}
          />
        ) : technical.length === 0 ? (
          <EmptyState
            icon={<ListOrdered />}
            title="No technical tasks"
            description="Add the tasks students will build and submit."
          />
        ) : (
          <ul className="divide-y divide-line">
            {workingOrder.map((id, index) => {
              const task = byId.get(id);
              if (!task) return null;
              return (
                <li key={id} className="flex items-center gap-4 p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-canvas text-sm font-semibold text-body">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-ink">
                      {task.title}
                    </p>
                    <p className="text-[13px] text-muted">
                      ~{task.estimated_hours} hours · {task.requirements.length} requirements
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Move up"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Move down"
                      disabled={index === workingOrder.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete task"
                      onClick={() => setDeleting(task)}
                      className="text-danger hover:bg-danger-bg"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {dirty && (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-warning/30 bg-warning-bg p-4">
          <p className="flex-1 text-[15px] text-ink">
            Order changed but not saved.
          </p>
          <Button variant="secondary" onClick={() => setOrder(null)}>
            Discard
          </Button>
          <Button
            disabled={reorder.isPending}
            onClick={async () => {
              try {
                await reorder.mutateAsync({
                  batchId: params.batchId,
                  taskIds: workingOrder,
                });
                toast({ title: "Order saved", variant: "success" });
                setOrder(null);
              } catch (error) {
                toast({
                  title: "Couldn't reorder",
                  description: isApiError(error) ? error.userMessage : "Try again.",
                  variant: "error",
                });
              }
            }}
          >
            <Save />
            {reorder.isPending ? "Saving…" : "Save order"}
          </Button>
        </div>
      )}

      {creating && (
        <TaskDialog
          nextPosition={technical.length + 1}
          pending={createTask.isPending}
          error={createTask.error}
          onClose={() => setCreating(false)}
          onSubmit={async (values) => {
            try {
              await createTask.mutateAsync({
                batch_id: params.batchId,
                title: values.title,
                description: values.description,
                order_number: Number(values.order_number),
                estimated_hours: Number(values.estimated_hours),
                deadline: values.deadline || undefined,
                requirements: (values.requirements ?? "")
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              } as never);
              toast({ title: "Task added", variant: "success" });
              setCreating(false);
              setOrder(null);
            } catch {
              // The dialog renders the error.
            }
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this task?"
        description={
          deleting
            ? `"${deleting.title}" will be removed. If any student has already submitted it, the API will refuse.`
            : ""
        }
        confirmLabel="Delete task"
        destructive
        pending={deleteTask.isPending}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await deleteTask.mutateAsync(deleting.id);
            toast({ title: "Task deleted", variant: "success" });
            setDeleting(null);
            setOrder(null);
          } catch (error) {
            toast({
              title: "Couldn't delete",
              description: isApiError(error) ? error.userMessage : "Try again.",
              variant: "error",
            });
            setDeleting(null);
          }
        }}
      />
    </div>
  );
}

function TaskDialog({
  nextPosition,
  onClose,
  onSubmit,
  pending,
  error,
}: {
  nextPosition: number;
  onClose: () => void;
  onSubmit: (values: TaskValues) => void;
  pending: boolean;
  error?: unknown;
}) {
  const form = useZodForm<TaskValues>(taskSchema, {
    defaultValues: {
      title: "",
      description: "",
      order_number: nextPosition,
      estimated_hours: 10,
      deadline: "",
      requirements: "",
    },
  });

  return (
    <Dialog
      open
      onClose={onClose}
      title="Add task"
      description="Everything here is shown to the student on their task page."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button disabled={pending} onClick={form.handleSubmit((v) => onSubmit(v))}>
            {pending ? "Adding…" : "Add task"}
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-5" noValidate>
        {Boolean(error) && (
          <Alert variant="danger">
            {isApiError(error) ? error.userMessage : "Couldn't add the task."}
          </Alert>
        )}

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
              rows={4}
              placeholder="What the student must build."
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
              <Input {...field} {...form.register("estimated_hours")} type="number" min={1} />
            )}
          </FormField>

          <FormField form={form} name="deadline" label="Deadline">
            {(field) => <Input {...field} {...form.register("deadline")} type="date" />}
          </FormField>
        </div>

        <FormField
          form={form}
          name="requirements"
          label="Requirements"
          hint="One per line. Shown as the checklist on the student's task page."
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
      </form>
    </Dialog>
  );
}
