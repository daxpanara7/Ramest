"use client";

import { AlertCircle, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared chrome for every /admin/settings/* page: the left-hand title column,
 * the card, and the load/error/save states. Each page supplies only its own
 * fields, so the pages stay declarative and behave identically.
 */

export function SettingsSection({
  title, description, loading, error, saveError, dirty, saving, justSaved,
  onSave, onReset, onRetry, children,
}: {
  title: string;
  description: string;
  loading: boolean;
  error: string | null;
  saveError: string | null;
  dirty: boolean;
  saving: boolean;
  justSaved: boolean;
  onSave: () => void;
  onReset: () => void;
  onRetry: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="font-display text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="lg:col-span-2">
        <CardContent className="grid gap-5 p-6 md:grid-cols-2">
          {error && (
            <div role="alert" className="md:col-span-2 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
              <Button variant="ghost" size="sm" className="ml-auto h-7" onClick={onRetry}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
              </Button>
            </div>
          )}

          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))
          ) : (
            children
          )}

          {saveError && (
            <p role="alert" className="md:col-span-2 text-sm text-destructive">{saveError}</p>
          )}

          <div className="md:col-span-2 flex items-center justify-end gap-2">
            {justSaved && !dirty && (
              <span className="mr-auto flex items-center gap-1.5 text-sm text-emerald-600">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
            <Button variant="outline" size="sm" onClick={onReset} disabled={!dirty || saving}>
              Cancel
            </Button>
            {/* Disabled until something actually changed — a Save that does
                nothing teaches people to distrust the button. */}
            <Button size="sm" onClick={onSave} disabled={!dirty || saving}>
              {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Field({
  label, children, full = false,
}: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`space-y-1.5${full ? " md:col-span-2" : ""}`}>
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
