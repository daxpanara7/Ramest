import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function PageHeader({
  title, description, actions, className,
}: { title: string; description?: string; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="font-display text-[26px] leading-tight tracking-tight md:text-[30px]">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("space-y-6", className)}>{children}</section>;
}

export function Stat({
  label, value, delta, icon,
}: { label: string; value: string | number; delta?: string; icon?: ReactNode }) {
  const positive = delta?.startsWith("+");
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border">
      <div className="flex items-start justify-between">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground/70">{icon}</div>}
      </div>
      <p className="mt-2 font-display text-[28px] leading-none tracking-tight">{value}</p>
      {delta && (
        <p className={cn(
          "mt-2 text-[11px] font-medium",
          positive ? "text-emerald-400" : delta.startsWith("-") ? "text-destructive" : "text-muted-foreground"
        )}>
          {delta} <span className="text-muted-foreground/70">vs last month</span>
        </p>
      )}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
    </div>
  );
}
