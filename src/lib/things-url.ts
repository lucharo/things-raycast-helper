import { ThingsTaskParams } from "./types";

const THINGS_URL_BASE = "things:///add";

export function buildThingsUrl(params: ThingsTaskParams): string {
  const queryParams = new URLSearchParams();

  // Required
  queryParams.set("title", params.title);

  // Optional
  if (params.notes) queryParams.set("notes", params.notes);
  if (params.when) queryParams.set("when", params.when);
  if (params.deadline) queryParams.set("deadline", params.deadline);
  if (params.tags && params.tags.length > 0) {
    queryParams.set("tags", params.tags.join(","));
  }
  if (params.listId) queryParams.set("list-id", params.listId);
  if (params.list) queryParams.set("list", params.list);
  if (params.heading) queryParams.set("heading", params.heading);
  if (params.completed) queryParams.set("completed", "true");
  if (params.canceled) queryParams.set("canceled", "true");
  if (params.showQuickEntry) queryParams.set("show-quick-entry", "true");
  if (params.revealInList) queryParams.set("reveal", "true");

  return `${THINGS_URL_BASE}?${queryParams.toString()}`;
}

// For testing: parse a Things URL back into params
export function parseThingsUrl(url: string): Partial<ThingsTaskParams> {
  const urlObj = new URL(url);
  const params: Partial<ThingsTaskParams> = {};

  const title = urlObj.searchParams.get("title");
  if (title) params.title = title;

  const notes = urlObj.searchParams.get("notes");
  if (notes) params.notes = notes;

  const when = urlObj.searchParams.get("when");
  if (when) params.when = when;

  const tags = urlObj.searchParams.get("tags");
  if (tags) params.tags = tags.split(",");

  const showQuickEntry = urlObj.searchParams.get("show-quick-entry");
  if (showQuickEntry === "true") params.showQuickEntry = true;

  return params;
}
