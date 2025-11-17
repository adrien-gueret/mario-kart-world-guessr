import type { ReactNode } from "react";

import type { Locale } from "@/i18n/types";

export type Version = `v${number}.${number}.${number}`;

export type ReleaseNotes = Array<{
  version: Version;
  publishedAt: Date;
  notes: Record<Locale, ReactNode>;
}>;
