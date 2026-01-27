import { ThingsTaskParams } from "./types";

export function buildThingsUrl(params: ThingsTaskParams): string {
  const q = new URLSearchParams();
  q.set("title", params.title);
  if (params.notes) q.set("notes", params.notes);
  if (params.when) q.set("when", params.when);
  if (params.tags?.length) q.set("tags", params.tags.join(","));
  if (params.list) q.set("list", params.list);
  if (params.showQuickEntry) q.set("show-quick-entry", "true");
  return `things:///add?${q.toString()}`;
}

export function parseThingsUrl(url: string): Partial<ThingsTaskParams> {
  const p = new URL(url).searchParams;
  return {
    title: p.get("title") || undefined,
    notes: p.get("notes") || undefined,
    when: (p.get("when") as ThingsTaskParams["when"]) || undefined,
    tags: p.get("tags")?.split(","),
    showQuickEntry: p.get("show-quick-entry") === "true" || undefined,
  };
}
