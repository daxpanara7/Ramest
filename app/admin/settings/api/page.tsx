"use client";

import { KeyRound, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * API keys are NOT implemented.
 *
 * This page previously listed three keys ("sk_live_9f3a…8b21" and friends).
 * They were invented — there is no ApiKey model in the schema, nothing
 * issues them, and no guard would accept one. Showing them implied a
 * working credential system and invited someone to go looking for a key
 * that does not exist.
 *
 * Making it real needs, in order: an ApiKey model (hashed secret, scopes,
 * lastUsedAt, revokedAt), a migration, an issue/revoke service, and an
 * auth guard that accepts a key alongside the JWT. Until that exists this
 * page states the truth.
 */
export default function ApiSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="font-display text-lg">API keys</h3>
        <p className="text-sm text-muted-foreground">
          Tokens for programmatic access to the admin API.
        </p>
      </div>

      <div className="space-y-3 lg:col-span-2">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-medium">No API keys</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Programmatic access is not enabled yet. The admin API currently
              authenticates with short-lived JWTs issued at sign-in, so there
              is nothing to manage here.
            </p>
            <Button size="sm" disabled className="mt-1">
              Issue a key
            </Button>
          </CardContent>
        </Card>

        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex gap-3 p-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="text-sm">
              <p className="font-medium">Why this is empty</p>
              <p className="mt-1 text-muted-foreground">
                Enabling API keys needs a stored credential (hashed, scoped,
                revocable) and a guard that accepts it alongside the JWT.
                Listing keys before that exists would advertise access the
                API cannot actually grant.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
