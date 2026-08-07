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
  Pencil,
  Plus,
  ToggleLeft,
  ToggleRight,
  Save,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Alert, Skeleton } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { RequireCapability } from "@/components/shared/role-gate";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import {
  useCreateTask,
  useDeleteTask,
  useReorderTasks,
  useTasks,
  useUpdateTask,
} from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";
import type { TaskValues } from "@/lib/validation";
import { TaskFormDialog } from "@/components/admin/task-form";
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
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const reorder = useReorderTasks();
  const { toast } = useToast();

  const [creating, setCreating] = React.useState(false);
  const [editing, setEditing] = React.useState<Task | null>(null);
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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[15px] font-medium text-ink">
                        {task.title}
                      </p>
                      {!task.is_active && <Badge variant="neutral">Disabled</Badge>}
                    </div>
                    <p className="text-[13px] text-muted">
                      ~{task.estimated_hours} h · {task.min_screenshots}–
                      {task.max_screenshots} screenshots
                      {task.require_github && " · GitHub"}
                      {task.require_explanation &&
                        ` · ${task.min_explanation_chars}+ chars`}
                      {task.require_live_demo && " · live demo"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(task)}
                    >
                      <Pencil />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={updateTask.isPending}
                      onClick={async () => {
                        try {
                          await updateTask.mutateAsync({
                            id: task.id,
                            input: { is_active: !task.is_active },
                          });
                          toast({
                            title: task.is_active ? "Task disabled" : "Task enabled",
                            variant: "success",
                          });
                        } catch (error) {
                          toast({
                            title: "Couldn't update the task",
                            description: isApiError(error)
                              ? error.userMessage
                              : "Try again.",
                            variant: "error",
                          });
                        }
                      }}
                    >
                      {task.is_active ? <ToggleRight /> : <ToggleLeft />}
                    </Button>
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

      {(creating || editing) && (
        <TaskFormDialog
          open
          task={editing}
          nextPosition={technical.length + 1}
          pending={creating ? createTask.isPending : updateTask.isPending}
          error={creating ? createTask.error : updateTask.error}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={async (values) => {
            const payload = {
              title: values.title,
              description: values.description,
              order_number: Number(values.order_number),
              estimated_hours: Number(values.estimated_hours),
              deadline: values.deadline || undefined,
              instructions: values.instructions || undefined,
              is_active: values.is_active,
              min_screenshots: Number(values.min_screenshots),
              max_screenshots: Number(values.max_screenshots),
              require_github: values.require_github,
              require_explanation: values.require_explanation,
              min_explanation_chars: Number(values.min_explanation_chars),
              require_live_demo: values.require_live_demo,
              requirements: (values.requirements ?? "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            };

            try {
              if (editing) {
                await updateTask.mutateAsync({ id: editing.id, input: payload });
                toast({ title: "Task updated", variant: "success" });
              } else {
                await createTask.mutateAsync({
                  batch_id: params.batchId,
                  ...payload,
                } as never);
                toast({ title: "Task added", variant: "success" });
              }
              setCreating(false);
              setEditing(null);
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
