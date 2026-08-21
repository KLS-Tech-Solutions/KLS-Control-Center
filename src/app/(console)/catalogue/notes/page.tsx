"use client";

import * as React from "react";
import {
  BookOpen,
  FileUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Alert, Skeleton } from "@/components/ui/misc";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/primitives";
import {
  useChapters,
  useCreateChapter,
  useDeleteChapter,
  useDomains,
  useUpdateChapter,
  useUploadChapterPdf,
} from "@/hooks/use-admin-data";
import { isApiError } from "@/lib/api/errors";
import type { LearningChapter } from "@/types";

const DIFFICULTY = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const TONE: Record<string, "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

/**
 * Study notes, managed per domain.
 *
 * Chapters hang off the domain rather than the batch, so material is uploaded
 * once and every cohort of that domain gets it. The alternative — per batch —
 * means re-uploading the same PDFs every intake.
 */
export default function NotesPage() {
  const domains = useDomains();
  const [domainId, setDomainId] = React.useState("");

  // Default to the first domain once they load, so the page is never empty
  // for no reason.
  React.useEffect(() => {
    if (!domainId && domains.data?.length) setDomainId(domains.data[0].id);
  }, [domains.data, domainId]);

  const chapters = useChapters(domainId || undefined);
  const [editing, setEditing] = React.useState<LearningChapter | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<LearningChapter | null>(null);

  const remove = useDeleteChapter();
  const { toast } = useToast();

  const list = (chapters.data ?? []).filter((c) => c.domain_id === domainId);
  const nextPosition = list.length
    ? Math.max(...list.map((c) => c.order_number)) + 1
    : 1;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Study notes"
        description="Chapter-wise material students work through before starting the technical tasks, ordered beginner to advanced. Any admin can add, edit or remove them."
        action={
          <Button onClick={() => setCreating(true)} disabled={!domainId}>
            <Plus />
            Add chapter
          </Button>
        }
      />

      <Card className="p-4">
        <label className="flex flex-col gap-2 sm:max-w-sm">
          <span className="text-sm font-medium text-ink">Domain</span>
          <Select
            value={domainId}
            onChange={(e) => setDomainId(e.target.value)}
            disabled={domains.isPending}
          >
            {(domains.data ?? []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </Select>
        </label>
      </Card>

      {chapters.isError ? (
        <Card className="p-6">
          <ErrorState
            message={
              isApiError(chapters.error)
                ? chapters.error.userMessage
                : "Couldn't load the chapters."
            }
            onRetry={() => chapters.refetch()}
          />
        </Card>
      ) : chapters.isPending ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-card" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<BookOpen />}
            title="No chapters yet"
            description="Add the first chapter and upload its PDF. Students see them in order, from beginner to advanced."
            action={
              <Button onClick={() => setCreating(true)} disabled={!domainId}>
                <Plus />
                Add chapter
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {list
            .slice()
            .sort((a, b) => a.order_number - b.order_number)
            .map((chapter) => (
              <ChapterRow
                key={chapter.id}
                chapter={chapter}
                onEdit={() => setEditing(chapter)}
                onDelete={() => setDeleting(chapter)}
              />
            ))}
        </div>
      )}

      <ChapterDialog
        open={creating || editing !== null}
        chapter={editing}
        domainId={domainId}
        nextPosition={nextPosition}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete this chapter?"
        description={
          deleting
            ? `"${deleting.title}" and its PDF will be removed. Students lose access immediately.`
            : ""
        }
        confirmLabel="Delete chapter"
        pending={remove.isPending}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await remove.mutateAsync(deleting.id);
            toast({ title: "Chapter deleted", variant: "success" });
            setDeleting(null);
          } catch (error) {
            toast({
              title: "Couldn't delete it",
              description: isApiError(error) ? error.userMessage : "Try again.",
              variant: "error",
            });
          }
        }}
      />
    </div>
  );
}

function ChapterRow({
  chapter,
  onEdit,
  onDelete,
}: {
  chapter: LearningChapter;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const upload = useUploadChapterPdf();
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const choose = async (file: File | undefined) => {
    if (!file) return;
    try {
      await upload.mutateAsync({ id: chapter.id, file });
      toast({ title: "Notes uploaded", variant: "success" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: isApiError(error)
          ? error.userMessage
          : "The file must be a PDF under 25 MB.",
        variant: "error",
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-[15px] font-semibold text-brand">
          {chapter.order_number}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[16px] font-semibold text-ink">{chapter.title}</h2>
            <Badge variant={TONE[chapter.difficulty]}>{chapter.difficulty}</Badge>
            {chapter.status !== "active" && (
              <Badge variant="neutral">{chapter.status}</Badge>
            )}
            {chapter.pdf_url ? (
              <Badge variant="brand">
                PDF · {Math.round((chapter.pdf_size_bytes ?? 0) / 1024)} KB
              </Badge>
            ) : (
              <Badge variant="warning">No PDF yet</Badge>
            )}
          </div>

          {chapter.summary && (
            <p className="mt-1.5 text-[15px] leading-relaxed text-body">
              {chapter.summary}
            </p>
          )}
          <p className="mt-1 text-[13px] text-muted">
            About {chapter.estimated_minutes} minutes
            {chapter.pdf_filename ? ` · ${chapter.pdf_filename}` : ""}
            {chapter.updated_by_name
              ? ` · last edited by ${chapter.updated_by_name}`
              : ""}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => choose(e.target.files?.[0])}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending}
          >
            {upload.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FileUp />
            )}
            {chapter.pdf_url ? "Replace PDF" : "Upload PDF"}
          </Button>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Pencil />
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onDelete}
            className="border-danger/30 text-danger hover:bg-danger-bg"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ChapterDialog({
  open,
  chapter,
  domainId,
  nextPosition,
  onClose,
}: {
  open: boolean;
  chapter: LearningChapter | null;
  domainId: string;
  nextPosition: number;
  onClose: () => void;
}) {
  const create = useCreateChapter();
  const update = useUpdateChapter();
  const { toast } = useToast();

  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [position, setPosition] = React.useState(1);
  const [difficulty, setDifficulty] = React.useState("beginner");
  const [minutes, setMinutes] = React.useState(20);
  const [error, setError] = React.useState<string | null>(null);

  // Reset whenever the dialog opens, so an edit never inherits the previous
  // chapter's values.
  React.useEffect(() => {
    if (!open) return;
    setTitle(chapter?.title ?? "");
    setSummary(chapter?.summary ?? "");
    setPosition(chapter?.order_number ?? nextPosition);
    setDifficulty(chapter?.difficulty ?? "beginner");
    setMinutes(chapter?.estimated_minutes ?? 20);
    setError(null);
  }, [open, chapter, nextPosition]);

  const pending = create.isPending || update.isPending;
  const valid = title.trim().length >= 3 && position >= 1;

  const save = async () => {
    setError(null);
    try {
      if (chapter) {
        await update.mutateAsync({
          id: chapter.id,
          title: title.trim(),
          summary: summary.trim() || null,
          order_number: position,
          difficulty,
          estimated_minutes: minutes,
        });
      } else {
        await create.mutateAsync({
          domain_id: domainId,
          title: title.trim(),
          summary: summary.trim() || null,
          order_number: position,
          difficulty,
          estimated_minutes: minutes,
        });
      }
      toast({
        title: chapter ? "Chapter updated" : "Chapter added",
        description: chapter ? undefined : "Upload its PDF next.",
        variant: "success",
      });
      onClose();
    } catch (err) {
      setError(
        isApiError(err) ? err.userMessage : "Couldn't save the chapter.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={chapter ? "Edit chapter" : "Add chapter"}
      description="Students see these in order. The PDF is uploaded separately once the chapter exists."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!valid || pending}>
            {pending ? "Saving…" : chapter ? "Save changes" : "Add chapter"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">Title</span>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chapter 1 — HTTP and REST fundamentals"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">
            Summary <span className="text-muted">(optional)</span>
          </span>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            placeholder="One or two lines on what this chapter covers."
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">Position</span>
            <Input
              type="number"
              min={1}
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">Level</span>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {DIFFICULTY.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">Minutes</span>
            <Input
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
    </Dialog>
  );
}
