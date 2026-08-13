"use client";

import * as React from "react";
import { IndianRupee, Lock, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { usePlatformSettings, useUpdateCertificateFee } from "@/hooks/use-admin-data";
import { useSession } from "@/hooks/use-session";
import { isApiError } from "@/lib/api/errors";
import { can } from "@/types";

/**
 * The certificate issuance fee, editable in place.
 *
 * Rupees in the field, paise on the wire — the API stores paise to match
 * Razorpay, and getting that conversion wrong by a factor of 100 is the
 * classic payments mistake, so it happens in exactly one place.
 */
export function CertificateFeeCard() {
  const { data: user } = useSession();
  const settings = usePlatformSettings();
  const update = useUpdateCertificateFee();
  const { toast } = useToast();

  const mayEdit = can(user?.role, "manageCatalogue");

  const [editing, setEditing] = React.useState(false);
  const [rupees, setRupees] = React.useState("");

  const current = settings.data?.certificate_fee_paise ?? null;
  const min = (settings.data?.min_fee_paise ?? 100) / 100;
  const max = (settings.data?.max_fee_paise ?? 5_000_000) / 100;

  const start = () => {
    setRupees(current !== null ? String(current / 100) : "");
    setEditing(true);
  };

  const parsed = Number(rupees);
  const valid =
    rupees.trim() !== "" &&
    Number.isFinite(parsed) &&
    parsed >= min &&
    parsed <= max;

  const save = async () => {
    try {
      // Rounded because paise are integers — 49.999 must not become 4999.9.
      const data = await update.mutateAsync(Math.round(parsed * 100));
      toast({
        title: "Fee updated",
        description: `Students now pay ₹${data.certificate_fee_paise / 100}.`,
        variant: "success",
      });
      setEditing(false);
    } catch (error) {
      toast({
        title: "Couldn't update the fee",
        description: isApiError(error)
          ? error.userMessage
          : "Try again in a moment.",
        variant: "error",
      });
    }
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <IndianRupee className="size-4" />
            </span>
            <h2 className="text-[17px] font-semibold text-ink">
              Certificate issuance fee
            </h2>
          </div>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-body">
            Charged once, on completion. The internship itself stays free.
            Orders already in checkout keep the price they were quoted.
          </p>
        </div>

        {!editing && settings.isError && (
          <p className="shrink-0 text-[13px] text-danger">
            Couldn&apos;t load the current fee.
          </p>
        )}

        {!editing && !settings.isError && (
          <div className="flex shrink-0 items-center gap-4">
            <p className="text-2xl font-bold text-ink">
              {settings.isPending
                ? "—"
                : current !== null
                  ? `₹${current / 100}`
                  : "—"}
            </p>
            {mayEdit ? (
              <Button variant="secondary" size="sm" onClick={start}>
                Edit
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
                <Lock className="size-3.5" />
                Super admin only
              </span>
            )}
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">
              New fee in rupees
            </span>
            <div className="relative sm:max-w-xs">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                ₹
              </span>
              <Input
                value={rupees}
                onChange={(e) => setRupees(e.target.value)}
                inputMode="decimal"
                autoFocus
                className="pl-8"
                invalid={rupees.trim() !== "" && !valid}
              />
            </div>
            <span className="text-[13px] text-muted">
              Between ₹{min} and ₹{max.toLocaleString("en-IN")}.
            </span>
          </label>

          {rupees.trim() !== "" && !valid && (
            <Alert variant="danger">
              Enter an amount between ₹{min} and ₹{max.toLocaleString("en-IN")}.
            </Alert>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
              disabled={update.isPending}
            >
              Cancel
            </Button>
            <Button onClick={save} disabled={!valid || update.isPending}>
              <Save />
              {update.isPending ? "Saving…" : "Save new fee"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
