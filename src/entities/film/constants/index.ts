import type { SortingState } from "@tanstack/react-table";

export const FILM_SORT_OPTIONS: { label: string; value: SortingState }[] = [
  { label: "По рейтингу", value: [{ id: "rating", desc: true }] },
  { label: "По названию", value: [{ id: "name", desc: false }] },
  { label: "По дате выхода", value: [{ id: "releaseDate", desc: true }] },
  { label: "По дате добавления", value: [{ id: "createdAt", desc: true }] },
  {
    label: "По количеству оценок",
    value: [{ id: "reviewCount", desc: true }],
  },
];
